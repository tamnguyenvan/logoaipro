import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    // Check if the user is authenticated
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract variant ID from the request body
    const { checkout: { generationId, variantId } } = await request.json();

    const redirectUrl = process.env.LEMONSQUEEZY_REDIRECT_URL;
    const response = await fetch(
      'https://api.lemonsqueezy.com/v1/checkouts',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`
        },
        body: JSON.stringify(
          {
            data: {
              type: "checkouts",
              attributes: {
                checkout_data: {
                  email: user.email,
                  custom: { user_id: user.id, generation_id: generationId }
                },
                product_options: {
                  redirect_url: redirectUrl,
                }
              },
              relationships: {
                store: { data: { type: "stores", id: process.env.LEMONSQUEEZY_STORE_ID } },
                variant: { data: { type: "variants", id: variantId } },
              },
            },
          },
        ),
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to create checkout session: ${response.statusText}`);
    }

    const jsonData = await response.json();
    const checkoutUrl = jsonData.data.attributes.url;
    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}