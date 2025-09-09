const result = data.result || {};  // fallback supaya tidak undefined

if (result.ai_output) {
  output.textContent = result.ai_output + (result.error ? `\n⚠️ ${result.error}` : "");
} else {
  // highlight probabilitas jika ada
  const buyProb = result.buy_probability || 0;
  const sellProb = result.sell_probability || 0;

  output.innerHTML = JSON.stringify(result, null, 2)
    .replace(`"buy_probability": ${buyProb}`, `<span style="color:#2dd4bf;font-weight:700;">${buyProb}</span>`)
    .replace(`"sell_probability": ${sellProb}`, `<span style="color:#fb7185;font-weight:700;">${sellProb}</span>`);
}
