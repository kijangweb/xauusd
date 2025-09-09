export default async function handler(req, res) {
  if(req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const API_KEYS = [
    process.env.GEMINI_KEY_1,
    process.env.GEMINI_KEY_2,
    process.env.GEMINI_KEY_3
  ];

  let results = [];

  for (const key of API_KEYS) {
    if (!key) {
      results.push({ key: "undefined", status: "missing" });
      continue;
    }

    try {
      const r = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${key}`
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Test API key" }] }]
          })
        }
      );
      const data = await r.json();
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        results.push({ key: key.slice(-4), status: "valid" });
      } else {
        results.push({ key: key.slice(-4), status: "invalid", response: data });
      }
    } catch (err) {
      results.push({ key: key.slice(-4), status: "error", message: err.message });
    }
  }

  res.status(200).json({ results });
}
