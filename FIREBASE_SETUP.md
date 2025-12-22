# Firebase Setup Instructions

## Quick Fix for "Create Session" Button

If the "Create Session" button doesn't work, you need to update your Firestore security rules.

### Step-by-Step Instructions:

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com
   - Sign in with your Google account

2. **Select Your Project**
   - Click on: `you-just-lost-the-game-5d1d4`

3. **Navigate to Firestore Database**
   - In the left sidebar, click **"Firestore Database"**
   - If you haven't created a database yet:
     - Click **"Create database"**
     - Choose **"Start in test mode"** (for development)
     - Select a region close to you
     - Click **"Enable"**

4. **Update Security Rules**
   - Click on the **"Rules"** tab (at the top)
   - You'll see existing rules

5. **Replace with These Rules**
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /sessions/{sessionId} {
         allow read, write: if true;
       }
     }
   }
   ```

6. **Publish the Rules**
   - Click the **"Publish"** button
   - Wait for confirmation

7. **Test Your App**
   - Refresh your game app
   - Try clicking **"Create Session"** again
   - It should now work!

## What These Rules Do

- **Allow read/write to sessions collection**: Anyone can create and join game sessions
- **No authentication required**: Perfect for a party game where you just want to share a code
- **Limited to sessions only**: Only the `/sessions` collection is accessible

## Security Note

⚠️ **These rules allow anyone to read/write to your sessions collection.**

This is fine for:
- Local development
- Private party games
- Small groups

For production apps with sensitive data, you should:
- Add user authentication
- Restrict access with proper rules
- Add rate limiting

## Testing the Connection

Once the rules are updated, check your browser console (F12) for logs:
- `Creating session: XXXXXX` - Session code being created
- `Attempting to write to Firestore...` - Trying to save
- `Session created successfully!` - It worked! ✅

If you see errors, check:
1. Internet connection
2. Firestore rules are published
3. Database is enabled
4. API key is correct in `src/firebase.js`

## Troubleshooting

### "permission-denied" Error
- **Cause**: Firestore security rules are blocking access
- **Fix**: Follow steps above to update rules

### "Firestore has not been initialized"
- **Cause**: Database not created in Firebase Console
- **Fix**: Create a Firestore database (Step 3)

### "Network error" or "Failed to fetch"
- **Cause**: Internet connection or Firebase outage
- **Fix**: Check internet connection, try again later

### Session code shows but doesn't sync
- **Cause**: Rules allow write but not read, or listener error
- **Fix**: Ensure rules allow both `read` and `write`

## Production Recommendations

When deploying to production:

1. **Add Session Expiration**
   ```
   match /sessions/{sessionId} {
     allow read, write: if true;
     allow delete: if request.time > resource.data.createdAt + duration.value(24, 'h');
   }
   ```

2. **Add Rate Limiting**
   - Use Firebase App Check
   - Add reCAPTCHA

3. **Monitor Usage**
   - Check Firebase Console for usage
   - Set up billing alerts

4. **Consider Authentication** (optional)
   - Add Firebase Auth
   - Restrict sessions to authenticated users
