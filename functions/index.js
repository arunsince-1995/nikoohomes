import functions from "firebase-functions";
import fetch from "node-fetch";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxOsEsiYayGfne0E4Fs5nOncNFvHi2yy9jeZHl-KIFjT0Mk6u9SFp7WOEe08_7oqXWfEw/exec";

export const submitForm = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Proxy error",
      error: error.toString(),
    });
  }
});
