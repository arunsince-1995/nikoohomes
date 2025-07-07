export interface FormData {
  event: string;
  fullName: string;
  phone: string;
  email: string;
  numSpots: string;
}

const PROXY_API_URL = '/api/proxy';

export async function submitToGoogleSheets(data: FormData): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(PROXY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (result.success || (typeof result === 'string' && result.toLowerCase().includes('success'))) {
      return { success: true, message: 'Form submitted and saved to Google Sheet.' };
    } else {
      return { success: false, message: result.message || JSON.stringify(result) };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to submit form: ' + error,
    };
  }
}
