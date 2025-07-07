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

    // Convert data to URL-encoded format for Google Apps Script
    const formData = new URLSearchParams();
    formData.append('formType', data.formType);
    formData.append('name', data.name);
    if (data.email) formData.append('email', data.email);
    formData.append('phone', data.phone);
    if (data.additionalNotes) formData.append('additionalNotes', data.additionalNotes);

    // Send data to Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error(`Google Script error: ${response.status}`);
    }

    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      timestamp: new Date().toISOString()
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