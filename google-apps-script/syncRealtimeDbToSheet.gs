/**
 * Firebase Realtime Database → Google Sheet
 *
 * Script properties (Project Settings → Script properties):
 *   FIREBASE_DATABASE_URL — full URL from Firebase Console → Realtime Database (same as VITE_FIREBASE_DATABASE_URL).
 *     Examples:
 *       https://YOUR_PROJECT-default-rtdb.firebaseio.com
 *       https://YOUR_PROJECT-default-rtdb.europe-west1.firebasedatabase.app
 *   FIREBASE_DB_SECRET — legacy database secret (Project settings → Service accounts → Database secrets)
 *
 * If the script is bound to your spreadsheet, set USE_ACTIVE_SPREADSHEET = true and leave SHEET_ID empty.
 */
var USE_ACTIVE_SPREADSHEET = false;
var SHEET_ID = '';
var SHEET_NAME = 'Sheet1';

/**
 * Column layout (must match your sheet):
 * A Name | B Phone | C City | D Message | E Source | F LeadId | G CreatedAt
 * Dedupe uses Firebase push id in column F (index 5 in 0-based row arrays).
 */
var COL_LEAD_ID = 6;

function syncRealtimeDbToSheet() {
  var sheet = getTargetSheet_();
  var data = fetchAgentLeadsJson_();
  if (!data || Object.keys(data).length === 0) {
    return;
  }
  ensureHeaderRow_(sheet);
  appendNewLeads_(sheet, data);
}

/**
 * Run this once from the Apps Script editor (Run → debugSyncRealtimeDbToSheet).
 * Check View → Executions → select run → Logs for HTTP code and response body.
 */
function debugSyncRealtimeDbToSheet() {
  var props = PropertiesService.getScriptProperties();
  var base = normalizeDatabaseUrl_(props.getProperty('FIREBASE_DATABASE_URL'));
  var secret = props.getProperty('FIREBASE_DB_SECRET');
  if (!base) {
    throw new Error('Set Script property FIREBASE_DATABASE_URL (copy from Firebase Console → Realtime Database).');
  }
  if (!secret) {
    throw new Error('Set Script property FIREBASE_DB_SECRET.');
  }
  var url = base + '/agentLeads.json?auth=' + encodeURIComponent(secret);
  var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  var code = response.getResponseCode();
  var body = response.getContentText();
  Logger.log('HTTP ' + code);
  Logger.log(body.length > 2000 ? body.substring(0, 2000) + '…' : body);
  if (code !== 200) {
    throw new Error('RTDB request failed. HTTP ' + code + '. See logs above.');
  }
}

function getTargetSheet_() {
  if (USE_ACTIVE_SPREADSHEET) {
    return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  }
  if (!SHEET_ID) {
    throw new Error('Set SHEET_ID or set USE_ACTIVE_SPREADSHEET = true for a sheet-bound script.');
  }
  return SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
}

function fetchAgentLeadsJson_() {
  var props = PropertiesService.getScriptProperties();
  var base = normalizeDatabaseUrl_(props.getProperty('FIREBASE_DATABASE_URL'));
  var secret = props.getProperty('FIREBASE_DB_SECRET');
  if (!base || !secret) {
    throw new Error('Set FIREBASE_DATABASE_URL and FIREBASE_DB_SECRET in Script properties.');
  }
  var url = base + '/agentLeads.json?auth=' + encodeURIComponent(secret);
  var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  var code = response.getResponseCode();
  var text = response.getContentText();
  if (code !== 200) {
    throw new Error('RTDB HTTP ' + code + ': ' + text);
  }
  if (!text || text === 'null') {
    return null;
  }
  return JSON.parse(text);
}

function normalizeDatabaseUrl_(url) {
  if (!url) {
    return '';
  }
  return String(url).replace(/\/$/, '');
}

function ensureHeaderRow_(sheet) {
  if (sheet.getLastRow() === 0 || !sheet.getRange('A1').getValue()) {
    sheet.getRange(1, 1, 1, 7).setValues([
      ['Name', 'Phone', 'City', 'Message', 'Source', 'LeadId', 'CreatedAt'],
    ]);
  }
  var last = Math.max(2, sheet.getLastRow());
  sheet.getRange(2, COL_LEAD_ID, last, COL_LEAD_ID).setNumberFormat('@');
}

/**
 * Match what the user sees in the cell; strip Sheets' leading apostrophe for text.
 */
function normalizeLeadId_(cell) {
  if (cell === null || cell === undefined) {
    return '';
  }
  var s = String(cell).trim();
  if (s.charAt(0) === "'") {
    s = s.slice(1);
  }
  return s;
}

function appendNewLeads_(sheet, data) {
  var existing = {};
  var display = sheet.getDataRange().getDisplayValues();
  var idCol = COL_LEAD_ID - 1;
  for (var i = 1; i < display.length; i++) {
    var id = normalizeLeadId_(display[i][idCol]);
    if (id) {
      existing[id] = true;
    }
  }
  for (var key in data) {
    if (!Object.prototype.hasOwnProperty.call(data, key)) {
      continue;
    }
    if (existing[key]) {
      continue;
    }
    var row = data[key];
    var rowNum = sheet.getLastRow() + 1;
    sheet.getRange(rowNum, COL_LEAD_ID).setNumberFormat('@');
    sheet.getRange(rowNum, 1, rowNum, 7).setValues([
      [
        row.name || '',
        row.phone || '',
        row.city || '',
        row.message || '',
        row.source || '',
        key,
        row.createdAt || '',
      ],
    ]);
  }
}
