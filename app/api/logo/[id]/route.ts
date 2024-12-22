import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getObjectPresignedUrl } from "@/lib/cloudflare/r2";

export const runtime = "edge";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // id is the generation id

  // Check authenticated user
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized", code: 10010 }, { status: 401 });
  }

  console.log('User authenticated:', user.id);
  console.log('Generation ID:', params.id);

  // Check if the image id is preview or high res
  const { data, error } = await supabase
    .from("user_generations")
    .select("preview_image_id,high_res_image_id,is_high_res_purchased")
    .eq("id", params.id)
    .single();

  // Get the presigned URL from Cloudflare
  const { preview_image_id, high_res_image_id, is_high_res_purchased } = data || {};
  let imagePath = `generations/${user.id}/${preview_image_id}.png`;
  if (is_high_res_purchased) {
    imagePath = `generations/${user.id}/${high_res_image_id}.png`;
  }
  const imageUrl = await getObjectPresignedUrl(imagePath, 3600);

  // Fetch the image from the presigned URL
  const imageResponse = await fetch(imageUrl);

  // Return the image blob with appropriate headers
  return new NextResponse(imageResponse.body, {
    status: imageResponse.status,
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': 'attachment; filename=generated-logo.png',
      'Cache-Control': 'no-cache',
    },
  });
}