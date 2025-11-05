// NEW: Load environment variables from .env file

const functions = require("firebase-functions");
const { onObjectFinalized } = require("firebase-functions/v2/storage");
const admin = require("firebase-admin");

// NEW: Import the Translation and Text-to-Speech clients
const { Translate } = require("@google-cloud/translate").v2;
// NEW: Import the Firestore trigger
const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();
/*
 * Creates an audio file from text and uploads it to a public GCS bucket.
 * @param {string} text The text to synthesize.
 * @param {string} languageCode The BCP-47 language code (e.g., 'en-US').
 * @param {string} userId The artisan's user ID.
 * @param {string} productId The ID of the product document.
 * @param {object} bucket The Firebase Storage bucket.
 * @returns {Promise<string>} The public URL of the uploaded audio file.
 */
// This is your main function, now with added steps
exports.processArtisanImage = onObjectFinalized(
  { region: "africa-south1" ,memory:"1GiB"}, // <-- ADD THIS LINE
  async (event) => {
  const object = event.data; // <-- ADD THIS LINE
  const filePath = object.name;
  const bucket = admin.storage().bucket(object.bucket);
  const file = bucket.file(filePath);

  if (!filePath.startsWith("products/")) {
    console.log("Not a product image, skipping...");
    return null;
  }

  try {
    console.log(`Processing image: ${filePath}`);
    // --- NEW: Initialize clients *inside* the function ---
    const vision = require("@google-cloud/vision");
    const { PredictionServiceClient } = require("@google-cloud/aiplatform");
    const { Translate } = require("@google-cloud/translate").v2;

    const visionClient = new vision.ImageAnnotatorClient();
    const translate = new Translate();
    const aiplatformClient = new PredictionServiceClient({
      apiEndpoint: "us-central1-aiplatform.googleapis.com",
    });
    // ----------------------------------------------------

    // --- Step 1 & 2: Vision AI ---
    const [fileBuffer] = await file.download();
    const [visionResult] = await visionClient.labelDetection({
      image: { content: fileBuffer },
    });
    const labels = visionResult.labelAnnotations
      .map((label) => label.description)
      .slice(0, 10);
    console.log("Vision AI Labels:", labels);
    // --- Step 3: Simple product data (NO GEMINI) ---
const mainLabel = labels[0] || "handmade product";
const productData = {
  title: `Beautiful ${mainLabel}`,
  description: `This exquisite ${mainLabel} is handcrafted by local artisans using traditional techniques. Each piece tells a unique story of cultural heritage and skilled craftsmanship.`,
  hashtags: [`#${mainLabel.replace(/\s+/g, '')}`, "#handmade", "#artisan", "#local"]
};
const description_en = productData.description;
console.log("Product data:", productData);
    // --- NEW: Step 4: Translation ---
    console.log("Translating text...");
    const [description_hi] = await translate.translate(description_en, "hi"); // Hindi
    const [description_ta] = await translate.translate(description_en, "ta"); // Tamil
    console.log("Translations complete.");

    // We need a unique ID for our product *before* we save the audio
    const productRef = db.collection("products").doc();
    const productId = productRef.id;
    const pathParts = filePath.split("/");
    const userId = pathParts[1];

    // --- Step 6: Get Image URL ---
    // We make the image public so the app can display it
    await file.makePublic();
    const publicUrl = `https://storage.googleapis.com/${object.bucket}/${filePath}`;

    // --- Step 7: Save EVERYTHING to Firestore ---
    const finalProductData = {
      title: productData.title,
      description: description_en,
      hashtags: productData.hashtags,
      imageUrl: publicUrl,
      artisanId: userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      visionLabels: labels,

      // NEW: Add the translation and audio data
      translations: {
        hi: description_hi,
        ta: description_ta,
      },
      audio: { },
    };
    
    // Save the product data using the reference we created earlier
    await productRef.set(finalProductData);

    console.log("✅ Product created successfully with AI-generated content, translations, and audio.");
    return null;

  } catch (error) {
    console.error("❌ Error processing image:", error);
    throw error;
  }
});
// NEW FUNCTION: Triggers when a 'users' document is updated
exports.translateProfile = onDocumentUpdated(
  { document: "users/{userId}", region: "asia-south1" }, // <-- Function 2 MUST be here
  async (event) => {
  // Get the data *after* the change
  const data = event.data.after.data();
  // Get the data *before* the change
  const beforeData = event.data.before.data();

  // Check if the bio or headline actually changed, to prevent infinite loops
  if (data.bio === beforeData.bio && data.headline === beforeData.headline) {
    console.log("No changes to bio or headline, skipping translation.");
    return null;
  }

  // --- Initialize clients *inside* the function for security ---
  const { Translate } = require("@google-cloud/translate").v2;
  const translate = new Translate();

  try {
    const bio_en = data.bio || "";
    const headline_en = data.headline || "";

    // Translate to Hindi and Tamil
    const [bio_hi] = await translate.translate(bio_en, "hi");
    const [headline_hi] = await translate.translate(headline_en, "hi");

    const [bio_ta] = await translate.translate(bio_en, "ta");
    const [headline_ta] = await translate.translate(headline_en, "ta");

    // Save the translations back to the *same document*
    return event.data.after.ref.set({
      translations: {
        hi: {
          bio: bio_hi,
          headline: headline_hi,
        },
        ta: {
          bio: bio_ta,
          headline: headline_ta,
        },
      }
    }, { merge: true }); // 'merge: true' is crucial to avoid overwriting the whole doc

  } catch (error) {
    console.error("Error translating profile:", error);
    return null;
  }
});
// NEW: Dynamic Website Translation Function
exports.translateWebsite = functions.https.onCall(async (data, context) => {

  // ✅ ADD VALIDATION
  if (!data || !data.texts || !Array.isArray(data.texts)) {
    console.error('Invalid data received - missing texts array');
    throw new functions.https.HttpsError('invalid-argument', 'Texts must be a non-empty array');
  }
  
  if (!data.targetLanguage) {
    console.error('Missing targetLanguage');
    throw new functions.https.HttpsError('invalid-argument', 'Target language is required');
  }

  const { texts, targetLanguage } = data;
  
  const { Translate } = require("@google-cloud/translate").v2;
  const translate = new Translate();

  try {
    console.log(`🌐 Translating ${texts.length} texts to ${targetLanguage}`);
    
    const translations = [];
    
    // Translate all texts in batches to avoid rate limits
    for (let i = 0; i < texts.length; i += 10) {
      const batch = texts.slice(i, i + 10);
      const [batchTranslations] = await translate.translate(batch, targetLanguage);
      
      // Handle both single string and array responses
      const translatedBatch = Array.isArray(batchTranslations) 
        ? batchTranslations 
        : [batchTranslations];
      
      translations.push(...translatedBatch);
    }

    console.log(`✅ Translated ${translations.length} texts`);
    
    return {
      success: true,
      translations: translations,
      targetLanguage: targetLanguage
    };

  } catch (error) {
    console.error("❌ Website translation failed:", error);
    throw new functions.https.HttpsError('internal', 'Translation failed');
  }
});