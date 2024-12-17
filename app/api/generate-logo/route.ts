import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand, HeadObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
export const runtime = "edge";

const ERROR_CODES = {
  10001: "Prompt invalid",
  10010: "Unauthorized",
  10050: "Unknown error",
};

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
});

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
    return NextResponse.json({ error: validationResult.message, code: 10001 }, { status: 400 });
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
    return NextResponse.json({ error: "User not found or error fetching data", code: 1050 }, { status: 500 });
  }

  let freeGenerationsRemaining = data.free_generations_remaining;
  let purchasedGenerationsRemaining = data.purchased_generations_remaining;
  const totalGenerations = Math.max(0, freeGenerationsRemaining + purchasedGenerationsRemaining);
  console.log('Current generations remaining:', totalGenerations);

  if (totalGenerations === 0) {
    return NextResponse.json({ error: "No generations remaining", code: 1050 }, { status: 500 });
  }

  // Call the Beam API to generate the logo
  try {
    const beamServerUrl = process.env.BEAM_SERVER_URL;
    const beamApiKey = process.env.BEAM_API_KEY;
    const response = await fetch(`${beamServerUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${beamApiKey}`,
      },
      body: JSON.stringify({
        prompt: prompt,
      }),
    });

    const beamResponse = await response.json();
    console.log('Beam API response:', beamResponse);

    // beamResponse.image is a image url, download the image and store it in R2
    if (!beamResponse.image) {
      return NextResponse.json({ error: "Image not generated", code: 1050 }, { status: 500 });
    }

    // Fetch the image data
    const imageResponse = await fetch(beamResponse.image);
    const blob = await imageResponse.blob();
    console.log('Image blob:', blob);

    // Create image id by generating uuid v4
    const imageId = Math.random().toString(36).substring(2, 9);

    // Put the image in R2
    const objectKey = `${imageId}.png`;
    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: objectKey,
      Body: blob,
      ContentType: "image/png",
    });

    // First, actually send the PUT command to upload the object
    await s3Client.send(command);

    // Then, create a HeadObjectCommand to verify the object exists
    const headCommand = new HeadObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: objectKey,
    });

    // Verify the object exists
    await s3Client.send(headCommand);

    // Now generate the presigned URL
    const getCommand = new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME!,
      Key: objectKey,
    });
    const presignedUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 3600 });

    console.log('Object uploaded successfully');
    console.log('Presigned URL:', presignedUrl);

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
      return NextResponse.json({ error: "Error updating generations remaining", code: 1050 }, { status: 500 });
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
        return NextResponse.json({ error: "Error updating generations remaining", code: 1050 }, { status: 500 });
      }
    }

    // Update user generations history
    const { error: insertError } = await supabase.from("user_generations").insert({
      user_id: user.id,
      is_free_generation: isFreeGeneration,
      preview_image_url: presignedUrl,
      high_res_image_url: presignedUrl,
      is_high_res_purchased: false,
      generation_timestamp: new Date().toISOString(),
      generation_details: JSON.stringify({ prompt }),
    });

    if (insertError) {
      return NextResponse.json({ error: "Error updating user generations history", code: 1050 }, { status: 500 });
    }

    console.log('Updated generations remaining:', userData.generations_remaining);

    return NextResponse.json({image: presignedUrl, generationDetails: JSON.stringify({ prompt })});
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ error: "Internal Server Error", code: 1050 }, { status: 500 });
  }
}

const validatePrompt = (prompt: string) => {
  // Regex pattern to match only letters, numbers, and spaces
  const regex = /^[a-zA-Z0-9,;!\s]+$/;

  // Check if the prompt matches the pattern
  const isValidPattern = regex.test(prompt);
  if (!isValidPattern) {
    return { isValid: isValidPattern, message: "Only letters, numbers, and spaces are allowed." };
  }

  // Check length
  const isValidLength = prompt.length <= 100 && prompt.length > 0;
  if (isValidLength) {
    return { isValid: isValidLength, message: "Prompt must be at least 1 character and no more than 100 characters." };
  }

  // If all checks pass, return true
  return { isValid: true, message: "" };
};