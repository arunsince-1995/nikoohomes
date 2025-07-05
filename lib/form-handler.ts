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
    // Use the webhook endpoint (Next.js API route)
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