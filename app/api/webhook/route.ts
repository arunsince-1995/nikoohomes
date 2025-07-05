import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formType, name, email, phone, additionalNotes } = body;

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      );
    }

    // Your Google Apps Script URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxYByg-qtYPwePDvCbQ89BnznUT09gXaP1WQjwd9mT8KIWCHnjW6WezpDJNMu7Q0P4g0w/exec';

    // Forward the data to Google Sheets
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formType: formType || 'webhook',
        name,
        email: email || '',
        phone,
        additionalNotes: additionalNotes || '',
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Script error: ${response.status}`);
    }

    const result = await response.json();

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      data: result
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 