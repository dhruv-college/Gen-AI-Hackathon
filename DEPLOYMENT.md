# Artisan Hub - Comprehensive Deployment Guide

## 🎯 Overview

Artisan Hub is a professional networking platform for artisans (like LinkedIn for craftspeople) with AI-powered features:

- **AI Image Analysis**: Cloud Vision AI analyzes product photos
- **AI Content Generation**: Gemini AI creates product titles, descriptions, and hashtags
- **Multi-language Support**: Google Cloud Translation API for global reach
- **User Profiles**: Detailed artisan profiles with portfolio, skills, and location
- **Marketplace**: Public showcase of artisan products

## 💰 Budget Information

This project uses **$500 in Google Cloud Platform credits**. Monitor usage regularly to stay within budget.

**Estimated Monthly Costs** (with moderate usage):
- Cloud Vision API: ~$10/month (1,000 images)
- Vertex AI (Gemini): ~$20/month (moderate usage)
- Cloud Translation API: ~$15/month (100K characters)
- Cloud Functions: ~$5/month (within free tier)
- Firebase Storage: ~$5/month
- Firestore: ~$5/month
- **Total**: ~$60/month (well within $500 budget)

## 📋 Prerequisites

### Required Accounts & Tools
1. **Google Cloud Platform account** with $500 credits activated
2. **Firebase project** created (can be created via GCP Console)
3. **gcloud CLI** installed and authenticated
4. **Firebase CLI** installed (`npm install -g firebase-tools`)
5. **Node.js 20+** installed

---

## 🚀 Quick Start Configuration

Follow these steps in order to deploy your application:

### Step 1: Firebase Project Setup
```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project root
firebase init

# Select these features:
# ✅ Firestore (Database)
# ✅ Storage (File storage)
# ✅ Functions (Cloud Functions)
# ✅ Authentication (User auth)

# Use these settings when prompted:
# - Firestore rules: firestore.rules (default)
# - Storage rules: storage.rules (default)
# - Functions language: JavaScript
# - Install dependencies: Yes
```

### Step 2: Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click the gear icon ⚙️ > **Project Settings**
4. Scroll to "Your apps" section
5. Click the **</>** (Web) icon to add a web app
6. Copy the `firebaseConfig` object

### Step 3: Update Configuration Files

#### **File: `src/config/firebaseConfig.ts`**

Replace the placeholder values with your actual Firebase config:

```typescript
export const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",           // Your actual API key
  authDomain: "your-project.firebaseapp.com",            // Your project domain
  projectId: "your-project-id",                          // Your project ID
  storageBucket: "your-project.appspot.com",             // Your storage bucket
  messagingSenderId: "123456789012",                     // Your sender ID
  appId: "1:123456789012:web:abcdef123456789012"        // Your app ID
};
```

**Where to find each value:**
- All values are in Firebase Console > Project Settings > General > Your apps

#### **File: `src/config/firebaseConfig.ts` (Google Cloud Config)**

```typescript
export const googleCloudConfig = {
  projectId: "your-project-id",                          // Same as Firebase projectId
  cloudFunctionUrl: "https://us-central1-your-project-id.cloudfunctions.net/processArtisanImage",
  
  // 🌍 Translation API Key (get this in Step 4)
  translationApiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  translationApiUrl: "https://translation.googleapis.com/language/translate/v2",
  
  visionApiEnabled: true,
  vertexAiEnabled: true,
  vertexAiRegion: "us-central1"                          // Choose your region
};
```

**How to determine your region:**
- Use `us-central1` for USA (recommended for free tier)
- Use `europe-west1` for Europe
- Use `asia-northeast1` for Asia
- See all regions: https://cloud.google.com/compute/docs/regions-zones

#### **File: `functions/index.js`**

Update these lines:

```javascript
// Line 14: Update region for Vertex AI
const aiplatformClient = new PredictionServiceClient({
  apiEndpoint: 'us-central1-aiplatform.googleapis.com'  // Replace 'us-central1' with your region
});

// Lines 71-72: Update project ID and region
const projectId = 'your-project-id';                     // Your actual project ID
const location = 'us-central1';                          // Your chosen region
```

#### **File: `functions/package.json`**

Update line 7:

```json
"deploy": "gcloud functions deploy processArtisanImage --runtime nodejs20 --trigger-resource your-project-id.appspot.com --trigger-event google.storage.object.finalize"
```

Replace `your-project-id.appspot.com` with your actual storage bucket name.

### Step 4: Get Google Cloud Translation & Text-to-Speech API Keys

#### Enable the APIs

```bash
# Enable Cloud Translation API
gcloud services enable translate.googleapis.com

# Enable Cloud Text-to-Speech API
gcloud services enable texttospeech.googleapis.com
```

#### Create an API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Navigate to **APIs & Services** > **Credentials**
4. Click **+ CREATE CREDENTIALS** > **API Key**
5. Copy the generated API key
6. (Optional but Recommended) Click **RESTRICT KEY** to add restrictions:
   - **API restrictions**: Select both "Cloud Translation API" and "Cloud Text-to-Speech API"
   - **Application restrictions**: Set to "HTTP referrers" and add your domain

⚠️ **Important**: Store this API key in `src/config/firebaseConfig.ts`:
```typescript
translationApiKey: "your-actual-api-key-here",
ttsApiKey: "your-actual-api-key-here", // Can use same key as translation
```

**Voice Features:**
- The app uses Google Cloud Text-to-Speech to provide voice guidance
- Supports 17+ major Indian languages (Hindi, Bengali, Telugu, Tamil, etc.)
- Users can hear instructions at each step
- Voice preview available for language selection
- Automatic language selection on first visit

### Step 5: Enable All Required Google Cloud APIs

Enable all necessary APIs for the project:

```bash
# Set your project (replace with your project ID)
gcloud config set project your-project-id

# Enable Cloud Vision API (for image analysis)
gcloud services enable vision.googleapis.com

# Enable Vertex AI API (for Gemini AI)
gcloud services enable aiplatform.googleapis.com

# Enable Cloud Functions (for serverless backend)
gcloud services enable cloudfunctions.googleapis.com

# Enable Cloud Translation API (for multi-language support)
gcloud services enable translate.googleapis.com

# Enable Cloud Text-to-Speech API (for voice guidance)
gcloud services enable texttospeech.googleapis.com

# Enable Cloud Build (required for Cloud Functions deployment)
gcloud services enable cloudbuild.googleapis.com

# Verify all APIs are enabled
gcloud services list --enabled
```

**Expected output should include:**
- `vision.googleapis.com`
- `aiplatform.googleapis.com`
- `cloudfunctions.googleapis.com`
- `translate.googleapis.com`
- `texttospeech.googleapis.com`
- `cloudbuild.googleapis.com`

### Step 6: Deploy Firestore Security Rules

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Expected output:
# ✔ Deploy complete!
```

**What these rules do:**
- Allow public read access to `products` collection
- Allow authenticated users to create products
- Allow users to edit only their own products

### Step 7: Deploy Storage Security Rules

```bash
# Deploy Storage rules
firebase deploy --only storage:rules

# Expected output:
# ✔ Deploy complete!
```

**What these rules do:**
- Allow authenticated users to upload images
- Allow public read access to uploaded images
- Restrict uploads to `products/` folder

### Step 8: Deploy Cloud Function (AI Pipeline)

This Cloud Function automatically triggers when images are uploaded:

#### Using Firebase CLI (Recommended)

```bash
# Navigate to functions directory
cd functions

# Install dependencies
npm install

# Deploy the function
firebase deploy --only functions:processArtisanImage

# Expected output:
# ✔ functions[processArtisanImage]: Successful create operation.
# Function URL: https://us-central1-your-project.cloudfunctions.net/processArtisanImage
```

#### Using gcloud CLI (Alternative)

```bash
gcloud functions deploy processArtisanImage \
  --runtime nodejs20 \
  --trigger-resource your-project-id.appspot.com \
  --trigger-event google.storage.object.finalize \
  --region us-central1 \
  --memory 512MB \
  --timeout 540s

# Note: Replace 'your-project-id.appspot.com' with your storage bucket
# Note: Replace 'us-central1' with your chosen region
```

**What this function does:**
1. Triggers automatically when an image is uploaded to Firebase Storage
2. Downloads and analyzes the image with Cloud Vision AI
3. Generates product details (title, description, hashtags) using Gemini AI
4. Saves everything to Firestore `products` collection

### Step 9: Enable Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click **Authentication** in the left sidebar
4. Click **Get Started**
5. Go to **Sign-in method** tab
6. Enable **Email/Password**
   - Toggle "Email/Password" to **Enabled**
   - (Optional) Enable "Email link (passwordless sign-in)"
7. Click **Save**

### Step 10: Verify Storage Bucket

Your storage bucket should be automatically created. Verify it:

```bash
# List your storage buckets
gsutil ls

# Expected output:
# gs://your-project-id.appspot.com/

# Create products folder structure (optional)
gsutil ls gs://your-project-id.appspot.com/products/
```

**Or verify in Firebase Console:**
1. Go to **Storage** in Firebase Console
2. You should see your bucket: `your-project-id.appspot.com`
3. The structure will be: `products/{userId}/{filename}.jpg`

---

## ✅ Configuration Checklist

Before testing, verify you've completed all these steps:

- [ ] Firebase project created and configured
- [ ] `src/config/firebaseConfig.ts` updated with Firebase credentials
- [ ] `src/config/firebaseConfig.ts` updated with Translation API key
- [ ] `src/config/firebaseConfig.ts` updated with Text-to-Speech API key
- [ ] `functions/index.js` updated with project ID and region
- [ ] `functions/package.json` updated with storage bucket name
- [ ] All Google Cloud APIs enabled (Vision, Vertex AI, Translation, Text-to-Speech, Functions)
- [ ] Firestore security rules deployed
- [ ] Storage security rules deployed
- [ ] Cloud Function deployed successfully
- [ ] Firebase Authentication enabled (Email/Password)
- [ ] Storage bucket verified

---

## 🧪 Testing the Application

### 1. Run Frontend Locally
```bash
npm install
npm run dev
```

### 2. Test Language Selection & Voice Features
- Navigate to `/auth`
- **First Visit**: You'll see a language selector
  - Select your preferred Indian language (Hindi, Bengali, Tamil, etc.)
  - Click the speaker icon to hear a preview in that language
  - Click "Continue" to proceed
- **Voice Instructions**: 
  - Click "Hear instructions" button to get voice guidance
  - The app will speak instructions in your selected language
- Create an account or sign in
- Voice confirmation will play on successful login

### 3. Test Authentication
- Complete sign-up or sign-in after language selection
- Your language preference is saved for future visits

### 3. Test Profile Creation
- Go to `/profile`
- View your artisan profile
- Test the translation feature:
  - Select a language from the dropdown
  - Click "Translate"
  - Profile content should translate

### 4. Test Image Upload & AI Processing
- Go to `/dashboard`
- Upload a product image
- Watch the AI pipeline:
  - ✅ Cloud Vision AI analyzes image
  - ✅ Gemini AI generates title, description, hashtags
  - ✅ Product saved to Firestore

### 5. View in Marketplace
- Navigate to `/marketplace`
- Your product should appear with AI-generated content
- Click on products to view details

### 6. Test Multi-language Support
- Navigate to any profile page
- Select different languages from the translation dropdown
- Verify content translates correctly

---

## 📊 Monitoring & Debugging

### View Cloud Function Logs

```bash
# View recent logs (Firebase CLI)
firebase functions:log

# View logs with filtering (gcloud)
gcloud functions logs read processArtisanImage \
  --limit 50 \
  --region us-central1

# View real-time logs
gcloud functions logs read processArtisanImage --region us-central1 --tail
```

**Or view in Cloud Console:**
1. Go to [Cloud Console](https://console.cloud.google.com)
2. Navigate to **Cloud Functions**
3. Click on `processArtisanImage`
4. Click **LOGS** tab

### Monitor API Usage & Costs

```bash
# View API usage
gcloud services list --enabled

# Check billing
gcloud beta billing accounts list
gcloud beta billing projects describe your-project-id
```

**Or in Cloud Console:**
1. Go to **APIs & Services** > **Dashboard**
2. View API usage graphs for:
   - Cloud Vision API
   - Vertex AI (Gemini)
   - Cloud Translation API
3. Go to **Billing** > **Reports** to track costs

### View Firestore Data

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Firestore Database**
3. Browse the `products` collection
4. Verify product documents contain:
   - `title`, `description`, `hashtags`
   - `imageUrl`, `artisanId`
   - `visionLabels`, `createdAt`

### Check Storage Uploads

1. Go to **Firebase Console** > **Storage**
2. Browse folder structure:
   ```
   products/
     {userId}/
       {filename}.jpg
   ```
3. Verify images are publicly accessible

### Translation API Testing

Test the Translation API directly:

```bash
curl "https://translation.googleapis.com/language/translate/v2?key=YOUR_API_KEY&q=Hello%20World&target=es"

# Expected response:
# {
#   "data": {
#     "translations": [
#       {
#         "translatedText": "Hola Mundo",
#         "detectedSourceLanguage": "en"
#       }
#     ]
#   }
# }
```

---

## 💰 Cost Management & Budget Alerts

### Free Tier Limits

**Google Cloud Free Tier includes:**
- **Cloud Vision API**: 1,000 units/month free
- **Vertex AI (Gemini)**: Limited free usage
- **Cloud Translation API**: 500,000 characters/month free
- **Cloud Functions**: 2M invocations/month, 400K GB-seconds compute
- **Firebase Storage**: 5GB storage, 1GB/day download
- **Firestore**: 1GB storage, 50K reads/day, 20K writes/day

### Set Up Budget Alerts

1. Go to [Cloud Console](https://console.cloud.google.com)
2. Navigate to **Billing** > **Budgets & alerts**
3. Click **CREATE BUDGET**
4. Configure:
   - **Name**: "Artisan Hub Monthly Budget"
   - **Budget amount**: $50 (or your preferred limit)
   - **Threshold rules**: 
     - Alert at 50% ($25)
     - Alert at 90% ($45)
     - Alert at 100% ($50)
5. Add email notification
6. Click **FINISH**

### Monitor Your $500 Credit

```bash
# Check remaining credits
gcloud beta billing accounts list

# View detailed billing
gcloud beta billing projects describe your-project-id
```

**Or in Cloud Console:**
- Go to **Billing** > **Credits**
- View remaining balance from your $500 credit

---

## 🔧 Troubleshooting Guide

### Issue: Cloud Function Not Triggering

**Symptoms:**
- Image uploads but no product appears in Firestore
- No function logs appear

**Solutions:**
1. Verify storage bucket name matches:
   ```bash
   # Check deployed function trigger
   gcloud functions describe processArtisanImage --region us-central1
   ```
2. Ensure file is uploaded to `products/{userId}/` folder structure
3. Check function logs:
   ```bash
   firebase functions:log --only processArtisanImage
   ```
4. Verify IAM permissions:
   ```bash
   gcloud projects get-iam-policy your-project-id
   ```

### Issue: Cloud Vision API Errors

**Error message:** `"PERMISSION_DENIED" or "API not enabled"`

**Solutions:**
1. Verify API is enabled:
   ```bash
   gcloud services list --enabled | grep vision
   ```
2. Enable if missing:
   ```bash
   gcloud services enable vision.googleapis.com
   ```
3. Check service account permissions:
   - Go to **IAM & Admin** > **Service Accounts**
   - Ensure Cloud Functions service account has "Cloud Vision API User" role

### Issue: Vertex AI (Gemini) Errors

**Error message:** `"Model not found" or "Region not supported"`

**Solutions:**
1. Verify region supports Vertex AI:
   - Supported regions: `us-central1`, `us-west1`, `europe-west1`, `asia-northeast1`
   - Update `functions/index.js` line 72 with correct region
   
2. Check model name:
   ```javascript
   // Use one of these:
   const model = 'gemini-2.5-flash';  // Recommended
   const model = 'gemini-pro';         // Alternative
   ```

3. Verify Vertex AI is enabled:
   ```bash
   gcloud services enable aiplatform.googleapis.com
   ```

### Issue: Translation API Errors

**Error message:** `"API key not valid" or "PERMISSION_DENIED"`

**Solutions:**
1. Verify API key is correct in `src/config/firebaseConfig.ts`
2. Check API key restrictions:
   - Go to **APIs & Services** > **Credentials**
   - Edit your API key
   - Ensure "Cloud Translation API" is in allowed APIs
3. Enable Translation API:
   ```bash
   gcloud services enable translate.googleapis.com
   ```
4. Test API key directly:
   ```bash
   curl "https://translation.googleapis.com/language/translate/v2?key=YOUR_KEY&q=test&target=es"
   ```

### Issue: Firestore Permission Denied

**Error message:** `"Missing or insufficient permissions"`

**Solutions:**
1. Verify Firestore rules are deployed:
   ```bash
   firebase deploy --only firestore:rules
   ```
2. Check user authentication:
   - User must be logged in
   - Check localStorage for user session
3. Verify `artisanId` matches authenticated user:
   ```javascript
   // In production, ensure:
   artisanId === auth.currentUser.uid
   ```

### Issue: Storage Upload Fails

**Error message:** `"Unauthorized" or "Storage bucket not found"`

**Solutions:**
1. Deploy storage rules:
   ```bash
   firebase deploy --only storage:rules
   ```
2. Verify bucket exists:
   ```bash
   gsutil ls
   ```
3. Check authentication state before upload

### Issue: Function Timeout

**Error message:** `"Function execution took too long"`

**Solutions:**
1. Increase timeout (default is 60s):
   ```bash
   gcloud functions deploy processArtisanImage \
     --timeout 540s \
     --memory 512MB
   ```
2. Optimize image size before upload (frontend)
3. Consider async processing for very large images

### Issue: High API Costs

**Symptoms:**
- Unexpected charges
- Budget alerts triggering

**Solutions:**
1. Check API usage:
   - Go to **APIs & Services** > **Dashboard**
   - Identify which API is consuming most quota
2. Implement rate limiting in frontend:
   ```javascript
   // Debounce translation requests
   const translateDebounced = debounce(translateText, 1000);
   ```
3. Cache translations in browser:
   ```javascript
   localStorage.setItem(`translation_${text}_${lang}`, translatedText);
   ```
4. Set quota limits:
   - Go to **APIs & Services** > **API Library**
   - Click on API > **Quotas**
   - Set daily request limits

---

## 🔒 Security Best Practices

### API Key Security

⚠️ **CRITICAL**: Never commit API keys or credentials to version control

1. **Use `.gitignore`**: Ensure `src/config/firebaseConfig.ts` is in `.gitignore`
2. **Environment Variables**: For production, use environment variables:
   ```bash
   # .env.production
   VITE_TRANSLATION_API_KEY=your-key-here
   ```
3. **Rotate Keys Regularly**:
   - Go to **APIs & Services** > **Credentials**
   - Delete old keys
   - Create new keys quarterly

### API Key Restrictions

Restrict API keys to specific services and domains:

1. Go to **APIs & Services** > **Credentials**
2. Click on your API key
3. Under **API restrictions**:
   - Select "Restrict key"
   - Choose only: "Cloud Translation API"
4. Under **Application restrictions**:
   - Select "HTTP referrers"
   - Add your domains:
     - `your-domain.com/*`
     - `localhost:*` (for development)

### Firestore Security Rules

Review and test your security rules:

```bash
# Test security rules locally
firebase emulators:start --only firestore

# Run security rules tests
npm test
```

**Key rules to verify:**
- Users can only edit their own products
- Artisan profiles are public (read) but private (write)
- Sensitive user data is protected

### Cloud Function Security

1. **Authentication**:
   - Verify user authentication in functions
   - Use Firebase Admin SDK to verify tokens
   
2. **Input Validation**:
   - Sanitize all user inputs
   - Validate file types and sizes
   
3. **Rate Limiting**:
   ```javascript
   // In Cloud Function
   const rateLimiter = require('express-rate-limit');
   app.use(rateLimiter({ max: 100, windowMs: 60000 }));
   ```

### Monitor for Suspicious Activity

Set up monitoring:

```bash
# Enable Cloud Audit Logs
gcloud projects add-iam-policy-binding your-project-id \
  --member user:your-email@example.com \
  --role roles/logging.admin
```

**Watch for:**
- Unusual API call volumes
- Failed authentication attempts
- Large file uploads
- Unexpected cost spikes

---

## ✅ Production Deployment Checklist

### Configuration & Setup
- [ ] Firebase project created and configured
- [ ] All placeholder values updated in code
- [ ] Google Cloud Translation API key obtained and configured
- [ ] All required Google Cloud APIs enabled
- [ ] Service account permissions configured correctly

### Security
- [ ] Firestore security rules deployed and tested
- [ ] Storage security rules deployed and tested
- [ ] API key restrictions configured
- [ ] Sensitive data not committed to version control
- [ ] Budget alerts configured ($50 threshold recommended)

### Backend
- [ ] Cloud Function deployed successfully (`processArtisanImage`)
- [ ] Cloud Function logs show no errors
- [ ] Firebase Authentication enabled (Email/Password)
- [ ] Storage bucket structure verified (`products/{userId}/`)

### Testing
- [ ] User signup/login tested
- [ ] Image upload triggers Cloud Function
- [ ] Cloud Vision AI analyzes images correctly
- [ ] Gemini AI generates product details
- [ ] Products appear in Firestore
- [ ] Products display in Marketplace
- [ ] Translation feature works across all languages
- [ ] Profile pages load correctly

### Monitoring
- [ ] Cloud Function logs accessible
- [ ] API usage monitored in Cloud Console
- [ ] Firestore data structure verified
- [ ] Storage uploads confirmed
- [ ] Cost tracking dashboard configured

### Optional (Production Enhancements)
- [ ] Custom domain configured
- [ ] SSL certificate installed
- [ ] CDN enabled for images
- [ ] Error monitoring set up (e.g., Sentry, Rollbar)
- [ ] Analytics added (Google Analytics)
- [ ] CI/CD pipeline configured (GitHub Actions)
- [ ] Backup strategy implemented
- [ ] Performance monitoring enabled

---

## 📚 Additional Resources & Documentation

### Official Documentation

- **Firebase**: https://firebase.google.com/docs
- **Cloud Vision AI**: https://cloud.google.com/vision/docs
- **Vertex AI (Gemini)**: https://cloud.google.com/vertex-ai/docs
- **Cloud Translation API**: https://cloud.google.com/translate/docs
- **Cloud Functions**: https://cloud.google.com/functions/docs
- **Firestore**: https://firebase.google.com/docs/firestore
- **Firebase Storage**: https://firebase.google.com/docs/storage
- **Firebase Authentication**: https://firebase.google.com/docs/auth

### Tutorials & Guides

- **Getting Started with Firebase**: https://firebase.google.com/docs/web/setup
- **Cloud Vision AI Quickstart**: https://cloud.google.com/vision/docs/quickstart
- **Vertex AI Quickstart**: https://cloud.google.com/vertex-ai/docs/start/introduction-unified-platform
- **Translation API Quickstart**: https://cloud.google.com/translate/docs/basic/quickstart

### Sample Code & Examples

- **Firebase Samples**: https://github.com/firebase/snippets-web
- **Cloud Functions Samples**: https://github.com/firebase/functions-samples
- **Vision AI Samples**: https://github.com/googleapis/nodejs-vision
- **Translation API Samples**: https://github.com/googleapis/nodejs-translate

### Pricing & Billing

- **Firebase Pricing**: https://firebase.google.com/pricing
- **Cloud Vision AI Pricing**: https://cloud.google.com/vision/pricing
- **Vertex AI Pricing**: https://cloud.google.com/vertex-ai/pricing
- **Cloud Translation Pricing**: https://cloud.google.com/translate/pricing
- **Pricing Calculator**: https://cloud.google.com/products/calculator

### Community & Support

- **Firebase Community**: https://firebase.google.com/community
- **Stack Overflow**: https://stackoverflow.com/questions/tagged/firebase
- **Google Cloud Support**: https://cloud.google.com/support
- **Discord/Slack**: Join Firebase or Google Cloud communities

---

## 🎓 Learning Path

### For Beginners

1. **Week 1**: Learn Firebase basics
   - Set up Firebase project
   - Implement Authentication
   - Store data in Firestore

2. **Week 2**: Cloud Functions & Storage
   - Create your first Cloud Function
   - Upload files to Storage
   - Trigger functions from uploads

3. **Week 3**: AI Integration
   - Enable Vision API
   - Test image analysis
   - Integrate Gemini AI

4. **Week 4**: Translation & Deployment
   - Add translation support
   - Deploy to production
   - Monitor and optimize

### For Advanced Users

- Implement image optimization before upload
- Add caching layer for translations
- Set up CI/CD with GitHub Actions
- Implement advanced Firestore queries
- Add payment processing with Stripe
- Scale functions with Cloud Run

---

## 📝 Quick Reference

### Essential Commands

```bash
# Firebase
firebase login
firebase init
firebase deploy --only functions
firebase functions:log

# Google Cloud
gcloud auth login
gcloud config set project PROJECT_ID
gcloud services enable SERVICE_NAME
gcloud functions deploy FUNCTION_NAME

# Testing
npm run dev                    # Run frontend locally
firebase emulators:start       # Run Firebase emulators locally
```

### Important File Paths

```
artisan-hub/
├── src/
│   ├── config/
│   │   └── firebaseConfig.ts          ← Update Firebase & GCP config here
│   ├── services/
│   │   └── translationService.ts      ← Translation API logic
│   └── pages/
│       ├── Profile.tsx                ← Artisan profile page
│       ├── Dashboard.tsx              ← Upload & manage products
│       └── Marketplace.tsx            ← Public marketplace
├── functions/
│   ├── index.js                       ← Update project ID and region
│   └── package.json                   ← Update storage bucket
├── firestore.rules                    ← Database security rules
└── storage.rules                      ← File storage security rules
```

---

## 🆘 Need Help?

If you encounter issues not covered in this guide:

1. **Check the logs**: Most issues can be diagnosed through logs
   ```bash
   firebase functions:log
   gcloud functions logs read processArtisanImage
   ```

2. **Search Stack Overflow**: Use tags like `[firebase]`, `[google-cloud-platform]`, `[cloud-vision]`

3. **Firebase Support**: https://firebase.google.com/support

4. **Google Cloud Support**: https://cloud.google.com/support

5. **File an issue**: If you believe there's a bug in the code, create an issue in the project repository

---

## 📄 License & Credits

This project uses:
- **Firebase** by Google
- **Google Cloud Platform** services
- **React** by Meta
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components

---

**Happy Building! 🎨✨**
