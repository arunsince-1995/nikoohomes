export interface FormData {
  event: string;
  fullName: string;
  phone: string;
  email: string;
  numSpots: string;
}

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxZ7_zNce1Vw1ctnJI2DikbWU-oPvFxlzrYhrTFpf9pEtdMZxw3opoO_vp61ByOytdu/exec';

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
