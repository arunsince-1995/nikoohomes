export interface FormData {
  formType: 'download' | 'explore' | 'sitevisit' | 'whatsapp' | 'enquiry';
  name: string;
  email?: string;
  phone: string;
  additionalNotes?: string;
}

export async function submitToGoogleSheets(data: FormData): Promise<{ success: boolean; message: string }> {
  try {
    // Send data to Vercel API route which proxies to Google Script
    const response = await fetch('/api/submit-form', {
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
