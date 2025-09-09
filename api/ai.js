import fetch from "node-fetch";

const API_KEYS = [
  process.env.GEMINI_KEY_1,
  process.env.GEMINI_KEY_2,
  process.env.GEMINI_KEY_3
];

let keyIndex = 0;

export default async function handler(req, res) {
  if(req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { prompt } = req.body;
  if(!prompt) return res.status(400).json({ error: "Prompt diperlukan" });

  let attempts = 0;
  let result = null;

  while(attempts < API_KEYS.length){
    const key = API_KEYS[keyIndex];

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
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      const data = await r.json();

      if(data.candidates && data.candidates[0]?.content?.parts[0]?.text){
        result = data.candidates[0].content.parts[0].text;
        break;
      }
    } catch(err){
      console.error("Error key:", key, err.message);
    }

    // rotate key
    keyIndex = (keyIndex + 1) % API_KEYS.length;
    attempts++;
  }

  if(result) res.status(200).json({ text: result });
  else res.status(500).json({ error: "Semua API key gagal" });
}
