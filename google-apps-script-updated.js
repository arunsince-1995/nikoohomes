function doPost(e) {
  // Set CORS headers to allow requests from multiple domains
  const allowedOrigins = [
    'https://nikoo-test.web.app',
    'https://nikoohomes-nu.vercel.app',
    'http://localhost:3000'
  ];
  
  const origin = e.parameter.origin || 'https://nikoohomes-nu.vercel.app';
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  
  const headers = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json'
  };

  try {
    let data;
    
    // Check if data is JSON or URL-encoded
    if (e.postData.type === 'application/json') {
      data = JSON.parse(e.postData.contents);
    } else {
      // Handle URL-encoded data
      const params = e.parameter;
      data = {
        formType: params.formType || '',
        name: params.name || '',
        email: params.email || '',
        phone: params.phone || '',
        additionalNotes: params.additionalNotes || ''
      };
    }
    
    // Get the active spreadsheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getActiveSheet();
    
    // Get current headers
    const headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Prepare data row
    const timestamp = new Date().toISOString();
    const dataRow = [];
    
    // Map form data to columns based on headers
    const formData = {
      'Timestamp': timestamp,
      'Form Type': data.formType || '',
      'Name': data.name || '',
      'Email': data.email || '',
      'Phone': data.phone || '',
      'Additional Notes': data.additionalNotes || ''
    };
    
    // Create data row matching header order
    headerRow.forEach(header => {
      dataRow.push(formData[header] || '');
    });
    
    // Insert the data row
    sheet.appendRow(dataRow);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Data saved successfully',
        timestamp: timestamp
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
      
  } catch (error) {
    console.error('Error processing request:', error);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Error processing request: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
  }
}

function doGet(e) {
  // Handle preflight OPTIONS requests
  const headers = {
    'Access-Control-Allow-Origin': 'https://nikoohomes-nu.vercel.app',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json'
  };
  
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'OK', message: 'Google Apps Script is running' }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
}

function doOptions(e) {
  // Handle preflight OPTIONS requests for CORS
  const headers = {
    'Access-Control-Allow-Origin': 'https://nikoohomes-nu.vercel.app',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };
  
  return ContentService
    .createTextOutput('')
    .setHeaders(headers);
} 