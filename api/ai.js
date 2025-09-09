export default async function handler(req, res) {
  if(req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const OPENAI_KEY = process.env.OPENAI_KEY;
  if(!OPENAI_KEY) return res.status(500).json({ error: "OPENAI_KEY not set" });

  const { price, volatility, rrStrategy, mode } = req.body;
  if(!price) return res.status(400).json({ error: "Price required" });

  const prompt = `
  Analisa XAUUSD:
  Harga Spot: ${price} USD/oz
  Volatilitas: ${volatility}
  Risk/Reward: ${rrStrategy}
  Mode: ${mode}
  Berikan probabilitas Buy/Sell (%) dan saran zona entry/stop/target dalam format JSON.
  `;

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
        max_tokens: 300
      })
    });

    const data = await r.json();
    // Ambil konten AI
    const text = data.choices?.[0]?.message?.content || "No data";
    let parsed;
    try { parsed = JSON.parse(text); } catch { parsed = { ai_output: text }; }

    res.status(200).json({ generated_at: new Date().toISOString(), input: req.body, result: parsed });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
}
