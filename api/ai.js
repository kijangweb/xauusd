<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>XAUUSD Probabilitas AI</title>
<style>
body { font-family: Arial; padding: 20px; background:#f0f2f5; }
textarea, input { width: 100%; padding: 8px; margin-top: 5px; }
button { margin-top: 10px; padding: 10px; width: 100%; cursor: pointer; }
pre { background: #fff; padding: 10px; border-radius: 6px; white-space: pre-wrap; border:1px solid #ccc; }
</style>
</head>
<body>
<h2>XAUUSD Probabilitas AI (Vercel)</h2>

<label>Prompt</label>
<input id="prompt" value="Analisa XAUUSD hari ini.">

<button id="btnGen">🚀 Generate Probabilitas</button>

<h3>Hasil</h3>
<div id="output"><i>Belum ada hasil...</i></div>

<script>
document.getElementById("btnGen").addEventListener("click", async () => {
  const prompt = document.getElementById("prompt").value.trim();
  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = "<p>⏳ Memproses...</p>";

  try {
    const res = await fetch("/api/ai", {
      method: "POST",                   // 🔹 Pastikan POST
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    if(!res.ok){
      const err = await res.json();
      outputDiv.innerHTML = `<p style="color:red;">Error: ${err.error || res.statusText}</p>`;
      return;
    }

    const data = await res.json();
    outputDiv.innerHTML = data.text ? `<pre>${data.text}</pre>` : `<p style="color:red;">No result</p>`;
  } catch(err) {
    outputDiv.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
  }
});
</script>
</body>
</html>
