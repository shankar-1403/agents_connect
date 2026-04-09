# Agents Connect Website

## Contact Form Data Flow

The contact form:

1. Saves each submission to Firebase **Realtime Database** at `agentLeads/<autoId>`.
2. Does **not** send data to Google Sheets from the browser. Use a **scheduled Google Apps Script** (below) to pull from Realtime Database into your Sheet.

## Environment Variables

Set these values in your `.env` file:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Your Realtime Database URL might end in **`firebasedatabase.app`** with a **region** (for example `europe-west1`) instead of **`firebaseio.com`**. Copy it exactly from the Firebase Console.

## Google Sheet: sync from Realtime Database

Copy the script from **`google-apps-script/syncRealtimeDbToSheet.gs`** into your Apps Script project.

### Script properties (required)

In Apps Script: **Project Settings** (gear) → **Script properties**:

| Property | Where to get it |
|----------|-----------------|
| `FIREBASE_DATABASE_URL` | Firebase Console → **Realtime Database** → top of the Data tab, or the same value as **`VITE_FIREBASE_DATABASE_URL`** in your `.env`. Must match exactly (including `https://` and region host if shown). |
| `FIREBASE_DB_SECRET` | Firebase Console → **Project settings** → **Service accounts** → **Database secrets** (legacy). If this section is missing, legacy REST auth may not be available for your project (see troubleshooting below). |

You can remove `FIREBASE_PROJECT_ID` from older instructions; the script uses the full database URL instead.

### Debug first

1. In Apps Script, open **`syncRealtimeDbToSheet.gs`**.
2. Select function **`debugSyncRealtimeDbToSheet`** → **Run**.
3. Open **Executions** (clock icon) → open the run → **Logs**.

- **HTTP 200** and JSON in the log → database is reachable; then run **`syncRealtimeDbToSheet`** or set a time trigger.
- **HTTP 401 / Permission denied** → wrong secret, or secret not allowed for this database.
- **HTTP 404** → wrong `FIREBASE_DATABASE_URL` (typo or wrong region).
- **Empty `{}` or `null`** → no rows under `agentLeads` yet; submit the form once and confirm data in the Realtime Database console.

### Trigger

**Triggers** → **Add trigger** → `syncRealtimeDbToSheet` → **Time-driven** (e.g. every 10 minutes).

### Troubleshooting

1. **Wrong URL** — Most common. Do not guess `https://PROJECT-default-rtdb.firebaseio.com` if your console shows a **`firebasedatabase.app`** URL. Paste the exact URL from Firebase.
2. **No legacy database secret** — Firebase may not offer **Database secrets** for new projects. Options: use **Firebase Cloud Functions** + Admin SDK to read RTDB and write to Sheets, or temporarily sync from the client (not ideal for secrets).
3. **Data in Firebase but not in Sheet** — Run **`debugSyncRealtimeDbToSheet`** and confirm HTTP 200 and non-empty JSON. Check **`SHEET_ID`** / **`SHEET_NAME`** and that the trigger is running (Executions).
4. **Same rows added every run** — Two common causes: (a) **LeadId was not in column A** — if your sheet uses **Name, Phone, …, LeadId in column F**, the old script deduped by column A (names), so it never matched Firebase keys. The script now expects **A–G = Name, Phone, City, Message, Source, LeadId, CreatedAt** and dedupes by **column F**. (b) **IDs coerced to numbers** — column F is forced to Plain Text. Replace your Apps Script with **`google-apps-script/syncRealtimeDbToSheet.gs`**, delete duplicate data rows once, then run again.

### Security note

- `FIREBASE_DB_SECRET` is powerful; keep it only in Script properties, never in the website or public repos.
- Restrict who can edit the Apps Script project.

## Run Project

```bash
npm install
npm run dev
```
