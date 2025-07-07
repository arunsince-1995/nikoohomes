export default async function handler(req, res) {
  const url = 'https://script.google.com/macros/s/AKfycbxZ7_zNce1Vw1ctnJI2DikbWU-oPvFxlzrYhrTFpf9pEtdMZxw3opoO_vp61ByOytdu/exec';
  
  try {
    const response = await fetch(url, {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });
    
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 