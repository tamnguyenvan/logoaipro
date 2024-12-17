import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    // Fetch the image from the original URL
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch image' }, { 
        status: imageResponse.status 
      });
    }

    // Get content type and convert response to blob
    const contentType = imageResponse.headers.get('content-type') || 'application/octet-stream';
    const imageBlob = await imageResponse.blob();

    // Return the image blob with appropriate headers
    return new NextResponse(imageBlob, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'attachment; filename=generated-logo-LogoAIPro.png',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}