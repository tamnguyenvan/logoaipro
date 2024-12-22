'use server'

import axios from "axios";
import { actionClient } from '@/lib/safe-action'
import { promptSchema } from "@/lib/validations/generation";
import { createClient } from "@/lib/supabase/server";
import { unstable_noStore as noStore } from 'next/cache';
import { putObject, objectExists, getObjectPresignedUrl } from "@/lib/cloudflare/r2";

export const generateLogoAction = actionClient
  .schema(promptSchema)
  .action(async ({ parsedInput: { prompt } }) => {

    noStore();
    try {
      // Validate auth
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return {
          error: "Unauthorized",
          code: 10000
        };
      }

      // Validate prompt
      // Get current generations left
      const { data: userData1, error } = await supabase
        .from("users")
        .select("free_generations_left,purchased_generations_left")
        .eq("id", user.id)
        .single();

      if (error || !userData1) {
        throw error;
      }

      let freeGenerationsLeft = userData1.free_generations_left;
      let purchasedGenerationsLeft = userData1.purchased_generations_left;
      const totalGenerations = Math.max(0, freeGenerationsLeft + purchasedGenerationsLeft);

      if (totalGenerations <= 0) {
        return {
          error: "You've run out of generations. Purchase more to continue.",
          code: 10001
        };
      }


      // Call the AI generation endpoint
      const response = await axios.post(`${process.env.AI_SERVER_URL}`, {
        prompt
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.AI_API_KEY}`
        }
      });

      if (!response.data) {
        return {
          error: "Internal server error",
          code: 10000
        };
      }

      // Update the free generations left for the user
      let isFreeGeneration = true;
      if (freeGenerationsLeft > 0) {
        freeGenerationsLeft -= 1;
      }
      const { data: userData, error: updateError } = await supabase
        .from("users")
        .update({ free_generations_left: Math.max(0, freeGenerationsLeft) })
        .eq("id", user.id)
        .select()
        .single();

      if (updateError) {
        return {
          error: "Error updating generations left",
          code: 10000
        };
      }

      if (freeGenerationsLeft === 0 && purchasedGenerationsLeft > 0) {
        isFreeGeneration = false;
        purchasedGenerationsLeft -= 1;
        const { data, error: updateError } = await supabase
          .from("users")
          .update({ purchased_generations_left: Math.max(0, purchasedGenerationsLeft) })
          .eq("id", user.id)
          .select()
          .single();

        if (updateError) {
          return {
            error: "Error updating generations left",
            code: 10000
          }
        }
      }

      const { preview, hires } = response.data;

      if (!preview || !hires) {
        return { error: "Invalid response from AI server", code: 10000 };
      }

      // Decode base64 images
      const previewImageData = Buffer.from(preview, 'base64');
      const highResImageData = Buffer.from(hires, 'base64');

      // Create image id by generating uuid v4
      const previewImageId = Math.random().toString(36).substring(2, 9);
      const highResImageId = Math.random().toString(36).substring(2, 9);

      // Put the images in R2
      const previewObjectKey = `generations/${user.id}/${previewImageId}.png`;
      const highResObjectKey = `generations/${user.id}/${highResImageId}.png`;

      // Put the images in R2
      await putObject(previewObjectKey, previewImageData);
      await putObject(highResObjectKey, highResImageData);

      // Check if the images already exist in R2
      const previewObjectExists = await objectExists(previewObjectKey);
      const highResObjectExists = await objectExists(highResObjectKey);

      if (!previewObjectExists || !highResObjectExists) {
        return {
          error: "Internal server error",
          code: 10000
        };
      }

      // Now generate the presigned URL
      const previewPresignedUrl = await getObjectPresignedUrl(previewObjectKey, 3600);

      console.log('Objects uploaded successfully');
      console.log('Presigned URL:', previewPresignedUrl);


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
        return {
          error: "Error inserting generation",
          code: 10000
        }
      }

      // Access the generation ID
      const generationId = data?.id;

      return { generationId };

    } catch (error) {
      console.error('Logo generation error:', error);
      return {
        error: "Internal server error",
        code: 10000
      };
    }
  })

export const fetchGenerationsLeftAction = actionClient
  .action(async () => {

    try {
      // Check if user is authenticated
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { generationsLeft: 0 };
      }

      // Fetch generation count from database
      const { data, error } = await supabase
        .from('users')
        .select('free_generations_left,purchased_generations_left')
        .eq('id', user.id)
        .single();

      if (error) {
        return { generationsLeft: 0, freeGenerationsLeft: 0, purchasedGenerationsLeft: 0 };
      }

      const totalGenerations = data.free_generations_left + data.purchased_generations_left;
      if (!totalGenerations) {
        return { generationsLeft: 0, freeGenerationsLeft: 0, purchasedGenerationsLeft: 0 };
      }

      return {
        generationsLeft: totalGenerations,
        freeGenerationsLeft: data.free_generations_left,
        purchasedGenerationsLeft: data.purchased_generations_left
      };
    } catch (error) {
      console.error('Logo generation error:', error);
      return { generationsLeft: 0, freeGenerationsLeft: 0, purchasedGenerationsLeft: 0 };
    }
  })

export const fetchGenerationsAction = actionClient
  .action(async () => {
    try {
      const supabase = await createClient()

      // Get authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('Unauthorized')
      }

      // Fetch only user's own generations with proper type validation
      const { data, error } = await supabase
        .from('user_generations')
        .select('id,is_free_generation,is_high_res_purchased,generation_timestamp,generation_details')
        .eq('user_id', user.id)
        .order('generation_timestamp', { ascending: false })

      if (error) throw error

      // Validate response data

      return { generations: data }
    } catch (error) {
      return { error: 'Failed to fetch generations' }
    }
  })