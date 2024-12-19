import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { putObject, objectExists, getObjectPresignedUrl } from "@/lib/cloudflare";

export const runtime = "edge";

const ERROR_CODES = {
  promptInvalid: 10001,
  noGenerationsRemaining: 10002,
  generationFailed: 10003,
  imageNotGenerated: 10004,
  unauthorized: 10010,
  unknownError: 10050,
};

export async function POST(request: Request) {
  // Check authenticated user
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized", code: 10010 }, { status: 401 });
  }

  console.log('User authenticated:', user.id);

  // Get the prompt from the request body
  const { prompt } = await request.json();

  // Validate the prompt
  const validationResult = validatePrompt(prompt);
  if (!validationResult.isValid) {
    return NextResponse.json({ error: validationResult.message, code: ERROR_CODES.promptInvalid }, { status: 400 });
  }

  // Log the prompt
  console.log('Received prompt:', prompt);

  // Get current generations remaining
  const { data, error } = await supabase
    .from("users")
    .select("free_generations_remaining,purchased_generations_remaining")
    .eq("id", user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "User not found or error fetching data", code: ERROR_CODES.unknownError }, { status: 500 });
  }

  let freeGenerationsRemaining = data.free_generations_remaining;
  let purchasedGenerationsRemaining = data.purchased_generations_remaining;
  const totalGenerations = Math.max(0, freeGenerationsRemaining + purchasedGenerationsRemaining);
  console.log('Current generations remaining:', totalGenerations);

  if (totalGenerations === 0) {
    return NextResponse.json({ error: "No generations remaining", code: ERROR_CODES.noGenerationsRemaining }, { status: 500 });
  }

  // Call the AI API to generate the logo
  try {
    const aiServerUrl = process.env.AI_SERVER_URL;
    const aiApiKey = process.env.AI_API_KEY;
    const response = await fetch(`${aiServerUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aiApiKey}`,
      },
      body: JSON.stringify({
        prompt: prompt,
      }),
    });

    const aiResponse = await response.json();
    console.log('AI API response:', aiResponse);

    if (!aiResponse.preview || !aiResponse.hires) {
      return NextResponse.json({ error: "AI API response missing image data", code: ERROR_CODES.generationFailed }, { status: 500 });
    }

    // Decode the base64 image data
    const previewImageData = Buffer.from(aiResponse.preview, 'base64');
    const highResImageData = Buffer.from(aiResponse.hires, 'base64');

    // Create image id by generating uuid v4
    const previewImageId = Math.random().toString(36).substring(2, 9);
    const highResImageId = Math.random().toString(36).substring(2, 9);

    // Put the images in R2
    const previewObjectKey = `generations/${user.id}/${previewImageId}.png`;
    const highResObjectKey = `generations/${user.id}/${highResImageId}.png`;

    // Put the images in R2
    await putObject(previewObjectKey, new Blob([previewImageData], { type: 'image/png' }));
    await putObject(highResObjectKey, new Blob([highResImageData], { type: 'image/png' }));

    // Check if the images already exist in R2
    const previewObjectExists = await objectExists(previewObjectKey);
    const highResObjectExists = await objectExists(highResObjectKey);

    if (!previewObjectExists || !highResObjectExists) {
      return NextResponse.json({ error: "Image not generated", code: ERROR_CODES.imageNotGenerated }, { status: 500 });
    }

    // Now generate the presigned URL
    const previewPresignedUrl = await getObjectPresignedUrl(previewObjectKey, 3600);

    console.log('Objects uploaded successfully');
    console.log('Presigned URL:', previewPresignedUrl);

    // Update the free generations remaining for the user
    let isFreeGeneration = true;
    if (freeGenerationsRemaining > 0) {
      freeGenerationsRemaining -= 1;
    }
    const { data: userData, error: updateError } = await supabase
      .from("users")
      .update({ free_generations_remaining: Math.max(0, freeGenerationsRemaining) })
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: "Error updating generations remaining", code: ERROR_CODES.unknownError }, { status: 500 });
    }

    if (freeGenerationsRemaining === 0 && purchasedGenerationsRemaining > 0) {
      isFreeGeneration = false;
      purchasedGenerationsRemaining -= 1;
      const { data: userData, error: updateError } = await supabase
        .from("users")
        .update({ purchased_generations_remaining: Math.max(0, purchasedGenerationsRemaining) })
        .eq("id", user.id)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json({ error: "Error updating generations remaining", code: ERROR_CODES.unknownError }, { status: 500 });
      }
    }

    // Insert record and get the generation ID
    const { data, error: insertError } = await supabase
      .from("user_generations")
      .insert({
        user_id: user.id,
        is_free_generation: isFreeGeneration,
        preview_image_id: previewImageId,
        high_res_image_id: highResImageId,
        is_high_res_purchased: false,
        generation_timestamp: new Date().toISOString(),
        generation_details: JSON.stringify({ prompt }),
      })
      .select('id')  // Explicitly select the ID
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({
        error: "Error updating user generations history",
        code: ERROR_CODES.unknownError
      }, { status: 500 });
    }

    // Access the generation ID
    const generationId = data?.id;

    console.log('Updated generations remaining:', userData.generations_remaining);

    return NextResponse.json({
      generationId: generationId,
      generationDetails: JSON.stringify({ prompt })
    }
    );
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ error: "Internal Server Error", code: ERROR_CODES.unknownError }, { status: 500 });
  }
}

const validatePrompt = (prompt: string) => {
  // Regex pattern to match only letters, numbers, and spaces
  const regex = /^[a-zA-Z0-9,;.!\s]+$/;

  // Check if the prompt matches the pattern
  const isValidPattern = regex.test(prompt);
  if (!isValidPattern) {
    return { isValid: isValidPattern, message: "Only letters, numbers, and spaces are allowed." };
  }

  // Check length
  const isValidLength = prompt.length <= 256 && prompt.length > 0;
  if (isValidLength) {
    return { isValid: isValidLength, message: "Prompt must be at least 1 character and no more than 100 characters." };
  }

  // If all checks pass, return true
  return { isValid: true, message: "" };
};