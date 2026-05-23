import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = {
  api: { bodyParser: { sizeLimit: "10mb" } },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  const { imageBase64, mimeType } = req.body;
  if (!imageBase64 || !mimeType) {
    return res.status(400).json({ error: "Missing image data" });
  }

  // Ensure the base64 string doesn't have the data URI prefix
  const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    // Force the model to return valid JSON using the updated model name
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    // Clarified prompt to match the frontend expectations and receipt columns
    const prompt = `Analyze this restaurant bill image and extract every line item.
Return a JSON object containing an "items" array with the exact keys shown below.

Rules:
- isCharge = true for: GST, SGST, CGST, VAT, service charge, packing charge, delivery fee, tips, any tax or surcharge line
- isCharge = false for: all food and drink items (including liquor)
- name = the exact item name as printed on the bill
- qty = the quantity number from the "Qty" column (default to 1 if not shown)
- price = the "Rate" column on the bill (the price for a single unit) as a number
- Include every line item shown, including the Liquor section.
- Do NOT include subtotal, total, or grand total rows.

Expected JSON schema:
{
  "items": [
    {
      "name": "item name",
      "qty": 1,
      "price": 0.00,
      "isCharge": false
    }
  ]
}`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: cleanBase64, mimeType } },
    ]);

    // Because we set responseMimeType to application/json, we can safely parse directly
    const parsed = JSON.parse(result.response.text());

    // parsed already matches the { items: [...] } structure requested in the prompt
    return res.status(200).json(parsed);

  } catch (err) {
    // Log the actual error to your server console so you can debug future issues!
    console.error("Gemini Parsing Error Details:", err.message);
    return res.status(500).json({ error: "Failed to parse bill details. Please try again." });
  }
}
