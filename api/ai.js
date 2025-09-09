export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const OPENAI_KEY = process.env.OPENAI_KEY;
  if (!OPENAI_KEY) return res.status(500).json({ error: "OPENAI_KEY not set" });

  const { price, volatility, rrStrategy, mode } = req.body;
  if (!price) return res.status(400).json({ error: "Price required" });

  const prompt = `
Analisa XAUUSD:
- Harga Spot: ${price} USD/oz
- Volatilitas: ${volatility}
- Risk/Reward: ${rrStrategy}
- Mode: ${mode}

Buat output **valid JSON**:
{
  "buy_probability": 0-100,
  "sell_probability": 0-100,
  "buy_zone": {"entry": 0, "stop": 0, "target": 0},
  "sell_zone": {"entry": 0, "stop": 0, "target": 0},
  "note": "string"
}

Jawaban harus **hanya JSON**, jangan sertakan teks lain.
`;

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",  // ✅ free model
        messages: [{ role: "user", content: prompt }],
        max_tokens: 250
      })
    });

    const data = await r.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return res.status(500).json({ error: "Invalid AI response", raw: data });
    }

    const text = data.choices[0].message.content || "{}";
    let parsed;

    try { 
      parsed = JSON.parse(text); 
    } catch(e) { 
      parsed = { ai_output: text, error: "JSON parse failed" };
    }

    res.status(200).json({
      generated_at: new Date().toISOString(),
      input: req.body,
      result: parsed
    });

  } catch(err) {
    res.status(500).json({ error: err.message });
  }
}
