/**
 * Google Apps Script to handle Website Form Submissions
 * This script captures form submissions from the website and stores them in a Google Sheet.
 */

// Enable or disable email notifications
var emailNotification = false;
var emailAddress = "sherwoodhighblr@gmail.com";

/**
 * Handles GET requests (for testing)
 */
function doGet(e) {
    return ContentService
        .createTextOutput(JSON.stringify({ status: 'ok', message: 'Script is working' }))
        .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handles POST requests from the website forms
 */
function doPost(e) {
    try {
        // Parse the JSON data from the website
        var data = JSON.parse(e.postData.contents);
        
        // Insert the data into the sheet
        insertToSheet(data);
        
        // Return success response
        return ContentService
            .createTextOutput(JSON.stringify({ success: true, message: 'Data saved successfully' }))
            .setMimeType(ContentService.MimeType.JSON);
            
    } catch (error) {
        // Return error response
        return ContentService
            .createTextOutput(JSON.stringify({ 
                success: false, 
                message: 'Error saving data: ' + error.toString() 
            }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

/**
 * Flattens nested objects for easier handling in a spreadsheet
 */
function flattenObject(ob) {
    var toReturn = {};
    for (var i in ob) {
        if (!ob.hasOwnProperty(i)) continue;
        if (typeof ob[i] === 'object') {
            var flatObject = flattenObject(ob[i]);
            for (var x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;
                toReturn[i + '.' + x] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
}

/**
 * Ensures headers are properly set in the sheet, adding new ones if necessary
 */
function getHeaders(formSheet, keys) {
    var headers = [];
    var lastColumn = formSheet.getLastColumn();
    
    if (lastColumn > 0) {
        headers = formSheet.getRange(1, 1, 1, lastColumn).getValues()[0];
    }
    
    // Always ensure we have these basic headers
    var requiredHeaders = ["Timestamp", "Form Type", "Name", "Email", "Phone"];
    requiredHeaders.forEach(function(header) {
        if (headers.indexOf(header) === -1) {
            headers.push(header);
        }
    });
    
    // Add any additional headers from the data
    keys.forEach(function(key) {
        if (headers.indexOf(key) === -1) {
            headers.push(key);
        }
    });
    
    return headers;
}

/**
 * Retrieves values for insertion into the sheet, including a timestamp
 */
function getValues(headers, flat) {
    var values = [];
    var timestamp = new Date().toLocaleString();
    
    headers.forEach(function(header) {
        if (header === "Timestamp") {
            values.push(timestamp);
        } else if (header === "Form Type") {
            values.push(flat["formType"] || "");
        } else if (header === "Name") {
            values.push(flat["name"] || "");
        } else if (header === "Email") {
            values.push(flat["email"] || "");
        } else if (header === "Phone") {
            values.push(flat["phone"] || "");
        } else {
            values.push(flat[header] || "");
        }
    });
    
    return values;
}

/**
 * Sets the header row in the sheet
 */
function setHeaders(sheet, values) {
    var headerRow = sheet.getRange(1, 1, 1, values.length);
    headerRow.setValues([values]);
    headerRow.setFontWeight("bold").setHorizontalAlignment("center");
}

/**
 * Inserts new row data into the sheet
 */
function setValues(sheet, values) {
    var lastRow = Math.max(sheet.getLastRow(), 1);
    sheet.insertRowAfter(lastRow);
    sheet.getRange(lastRow + 1, 1, 1, values.length).setValues([values])
        .setFontWeight("normal").setHorizontalAlignment("center");
}

/**
 * Retrieves or creates a sheet for storing form submissions
 */
function getFormSheet(formName) {
    var activeSheet = SpreadsheetApp.getActiveSpreadsheet();
    var formSheet = activeSheet.getSheetByName(formName);
    if (!formSheet) {
        formSheet = activeSheet.insertSheet(formName);
    }
    return formSheet;
}

/**
 * Inserts form data into the sheet
 */
function insertToSheet(data) {
    var flat = flattenObject(data);
    var keys = Object.keys(flat);
    var formName = data["formType"] || "Website_Forms";
    var formSheet = getFormSheet(formName);
    var headers = getHeaders(formSheet, keys);
    var values = getValues(headers, flat);
    
    setHeaders(formSheet, headers);
    setValues(formSheet, values);
    
    if (emailNotification) {
        sendNotification(data, getSheetURL());
    }
}

/**
 * Retrieves the Google Sheet URL
 */
function getSheetURL() {
    return SpreadsheetApp.getActiveSpreadsheet().getUrl();
}

/**
 * Sends an email notification when a new submission is recorded
 */
function sendNotification(data, url) {
    var subject = "New Website Form Submission Logged";
    var message = "A new submission has been recorded from the " + (data['formType'] || 'website') + " form.\n\n"
                + "Name: " + (data['name'] || 'N/A') + "\n"
                + "Email: " + (data['email'] || 'N/A') + "\n"
                + "Phone: " + (data['phone'] || 'N/A') + "\n\n"
                + "View the Google Sheet: " + url;
    
    MailApp.sendEmail(emailAddress, subject, message, {
        name: 'Website Form Handler'
    });
} 