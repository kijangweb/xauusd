export default async function handler(req, res) {
  if(req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const OPENAI_KEY = process.env.OPENAI_KEY;
  if(!OPENAI_KEY) return res.status(500).json({ error: "OPENAI_KEY not set" });

  const { prompt } = req.body;
  if(!prompt) return res.status(400).json({ error: "No prompt provided" });

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200
      })
    });
    const data = await r.json();
    res.status(200).json(data);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
}
