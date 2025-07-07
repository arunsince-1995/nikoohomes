export interface FormData {
  event: string;
  fullName: string;
  phone: string;
  email: string;
  numSpots: string;
}

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw7cJeg0tKK7YLBOb5c-CGOPX6BFsIGK8MLV1LwyetB-Nnl6-IMJN6SX4QPHTso8FK-/exec';

export async function submitToGoogleSheets(data: FormData): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const text = await response.text();
    if (text.trim().toLowerCase().includes('success')) {
      return { success: true, message: 'Form submitted and saved to Google Sheet.' };
    } else {
      return { success: false, message: text };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to submit form: ' + error,
    };
  }
}
