// AI Test Script — XAUUSD Analyzer
const priceInput = document.querySelector("#price");
const volInput = document.querySelector("#vol");
const rrInput = document.querySelector("#rrStrategy");
const modeInput = document.querySelector("#mode");
const output = document.querySelector("#output"); // pastikan ada elemen <pre id="output"></pre>
const genBtn = document.querySelector("#gen");

genBtn.addEventListener("click", async () => {
  const price = parseFloat(priceInput.value) || 0;
  const volatility = parseFloat(volInput.value) || 30;
  const rrStrategy = rrInput.value || "default";
  const mode = modeInput.value || "limit";

  output.textContent = "⏳ Memproses AI...";

  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price, volatility, rrStrategy, mode })
    });

    const data = await res.json();
    const result = data.result;

    if(result.ai_output) {
      // fallback kalau JSON parse gagal
      output.textContent = result.ai_output + (result.error ? `\n⚠️ ${result.error}` : "");
      return;
    }

    // highlight probabilitas tinggi >55%
    const buyProb = result.buy_probability || 0;
    const sellProb = result.sell_probability || 0;

    let html = JSON.stringify(result, null, 2)
      .replace(`"buy_probability": ${buyProb}`, `"buy_probability": <span style="color:#2dd4bf;font-weight:700;">${buyProb}</span>`)
      .replace(`"sell_probability": ${sellProb}`, `"sell_probability": <span style="color:#fb7185;font-weight:700;">${sellProb}</span>`);

    output.innerHTML = html;

  } catch(err) {
    output.textContent = `Error: ${err.message}`;
  }
});
