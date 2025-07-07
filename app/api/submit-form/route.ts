import type { NextApiRequest, NextApiResponse } from 'next';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxOsEsiYayGfne0E4Fs5nOncNFvHi2yy9jeZHl-KIFjT0Mk6u9SFp7WOEe08_7oqXWfEw/exec';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
    return;
  }

  try {
    const data = req.body;
    if (!data || !data.name || !data.phone || !data.formType) {
      res.status(400).json({ success: false, message: 'Missing required fields' });
      return;
    }

    // Forward to Google Apps Script
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      res.status(500).json({ success: false, message: result.message || 'Google Script error' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Form submitted successfully',
      googleScriptResult: result,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to submit form', error: error.toString() });
  }
} 