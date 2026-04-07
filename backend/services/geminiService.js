const fs = require("fs");
const fetch = require("node-fetch");

// ================= GEMINI CONFIG =================
const GEMINI_API_KEY = "AIzaSyD3i1mdzyY6_cLkQ4v9bD1Ddh-gR3SkVNU";
const GEMINI_MODEL = "gemini-2.5-flash";

// ================= NORMALIZE PLATE =================
const normalizePlate = (value = "") =>
  value.toUpperCase().replace(/[^A-Z0-9]/g, "");

// ================= EXTRACT PLATE =================
const extractPlateFromImage = async (filePath, mimeType = "image/jpeg") => {
  const imageBuffer = fs.readFileSync(filePath);
  const base64Image = imageBuffer.toString("base64");

  const prompt = `
You are reading a vehicle license plate from an image.

Extract ONLY the core plate number.

STRICT RULES:
- Ignore province, zone, district, city, municipality, and region names
- Ignore Nepali script completely
- Ignore flags, stickers, logos, and symbols
- Ignore words like Bagmati, Province, State, Nepal, etc.
- Only return the actual vehicle plate number
- Do not add explanation
- Do not add labels
- Do not add quotes

If the plate is not readable, return exactly:
NOT_FOUND
  `.trim();

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Image,
                },
              },
            ],
          },
        ],
      }),
    },
  );

  if (response.status === 429) {
    console.log("Gemini quota limit reached.");
    throw new Error("Gemini quota limit reached.");
  }

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.error?.message || "Gemini request failed.");
  }

  console.log("Gemini connected successfully.");

  const extractedText =
    result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "NOT_FOUND";

  if (extractedText === "NOT_FOUND") {
    return "";
  }

  return normalizePlate(extractedText);
};

// ================= VERIFY PLATE WITH IMAGE =================
const verifyPlateWithImage = async (
  enteredPlate,
  filePath,
  mimeType = "image/jpeg",
) => {
  const normalizedEntered = normalizePlate(enteredPlate);
  const extractedPlate = await extractPlateFromImage(filePath, mimeType);

  return {
    matched:
      !!normalizedEntered &&
      !!extractedPlate &&
      normalizedEntered === extractedPlate,
    extractedPlate,
  };
};

module.exports = {
  verifyPlateWithImage,
  extractPlateFromImage,
};
