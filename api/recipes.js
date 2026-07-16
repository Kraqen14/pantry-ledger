// Vercel serverless function: POST /api/recipes
// Keeps the Anthropic API key on the server. Never expose it in client code.

function parseRecipesSafely(text) {
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
    // fall through to recovery below
  }
  // Response may have been cut off mid-object. Recover whichever top-level
  // {...} objects in the array are complete and valid, and drop the rest.
  const recovered = [];
  let depth = 0;
  let start = -1;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && start !== -1) {
        const chunk = text.slice(start, i + 1);
        try {
          recovered.push(JSON.parse(chunk));
        } catch (e) {
          // skip malformed chunk
        }
        start = -1;
      }
    }
  }
  return recovered;
}

export default async function handler(req, res) {
  // CORS: the native mobile app (Capacitor) calls this API from a different
  // origin than the website, so we must explicitly allow cross-origin requests.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server is missing ANTHROPIC_API_KEY" });
    return;
  }

  const { ingredientList, dietLabelEn, languageName, avoidTitles } = req.body || {};
  if (!ingredientList || !dietLabelEn || !languageName) {
    res.status(400).json({ error: "Missing ingredientList, dietLabelEn, or languageName" });
    return;
  }

  const avoidBlock =
    Array.isArray(avoidTitles) && avoidTitles.length > 0
      ? `\nDo not repeat these already-suggested recipes, suggest different ones: ${avoidTitles.join("; ")}.\n`
      : "";

  const prompt = `You are a recipe assistant. The user has these ingredients on hand: ${ingredientList}.
Their dietary preference is: ${dietLabelEn} (carnivorous means any meat/fish is fine; vegetarian excludes meat and fish but allows dairy/eggs; vegan excludes all animal products).

Suggest 3 recipes that make good use of as many of the pantry ingredients as possible, respecting the dietary preference strictly. It's fine to include a few common pantry staples (salt, pepper, oil, garlic, water) as extra ingredients, but keep other additional ingredients minimal.
${avoidBlock}
Write the entire response — every title, description, ingredient name, and step — in ${languageName}.

Each recipe must be a real, coherent dish. The title must accurately name what's actually in it — never reference a different protein or ingredient than the ones used (e.g. do not call a pork dish "chicken" anything). Before finalizing, check that the title, description, and used_ingredients are all consistent with each other.

Respond with ONLY a raw JSON array (no markdown fences, no preamble, no commentary) of exactly 3 objects, each with this shape:
{
  "title": string,
  "description": string (one short sentence, appetizing, plain language),
  "time_minutes": number,
  "servings": number,
  "used_ingredients": array of objects, each { "name": string (EXACT pantry ingredient name as given in the list above), "qty": number (amount of it this recipe uses), "unit": string (the same unit that ingredient was given in) },
  "extra_ingredients": string[] (additional ingredients needed, short list),
  "steps": string[] (4-6 concise steps),
  "macros": { "calories": number, "protein_g": number, "carbs_g": number, "fat_g": number } (best-effort estimate per serving)
}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      res.status(502).json({ error: "Anthropic API error", detail: errText });
      return;
    }

    const data = await response.json();
    const text = (data.content || []).map((b) => b.text || "").join("\n");
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = parseRecipesSafely(cleaned);
    res.status(200).json(parsed);
  } catch (err) {
    res.status(500).json({ error: "Failed to generate recipes", detail: String(err) });
  }
}
