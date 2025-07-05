// Form submission handler for Google Sheets integration

export interface FormData {
  formType: 'download' | 'explore' | 'sitevisit' | 'whatsapp' | 'enquiry';
  name: string;
  email?: string;
  phone: string;
  additionalNotes?: string;
}

export async function submitToGoogleSheets(data: FormData): Promise<{ success: boolean; message: string }> {
  try {
    // Check if we're in development or production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
      // Use the webhook endpoint (Next.js API route) in development
      const WEBHOOK_URL = '/api/webhook';
      
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } else {
      // Use Google Script directly in production (for Firebase)
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxOsEsiYayGfne0E4Fs5nOncNFvHi2yy9jeZHl-KIFjT0Mk6u9SFp7WOEe08_7oqXWfEw/exec';
      
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    return {
      success: false,
      message: 'Failed to submit form. Please try again.',
    };
  }
}

// Fallback function for development/testing
export async function submitToConsole(data: FormData): Promise<{ success: boolean; message: string }> {
  console.log('Form submission (development mode):', data);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    message: 'Form submitted successfully (development mode)',
  };
} 