import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxOsEsiYayGfne0E4Fs5nOncNFvHi2yy9jeZHl-KIFjT0Mk6u9SFp7WOEe08_7oqXWfEw/exec';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.phone || !data.formType) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('Sending JSON data to Google Script:', data);
    
    // Send data to Google Apps Script as JSON
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('Google Script response status:', response.status);
    console.log('Google Script response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Script error response:', errorText);
      throw new Error(`Google Script error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Google Script result:', result);
    
    // Check if Google Script actually succeeded
    if (!result.success) {
      throw new Error(`Google Script failed: ${result.message || 'Unknown error'}`);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      timestamp: new Date().toISOString(),
      googleScriptResult: result
    });

  } catch (error) {
    console.error('Error submitting form:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to submit form. Please try again.' 
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS preflight
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