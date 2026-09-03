// Relais Groq — garde la clé côté serveur, jamais dans le navigateur.
// La clé se met dans Netlify : Site configuration > Environment variables.
// Nom recommandé : GROQ_API_KEY (l'ancien nom XAI_API_KEY est aussi accepté).
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: { message: "Method Not Allowed" } }) };
  }
  const key = process.env.GROQ_API_KEY || process.env.XAI_API_KEY;
  if (!key) {
    return { statusCode: 500, body: JSON.stringify({ error: { message: "GROQ_API_KEY manquante côté serveur." } }) };
  }
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", "authorization": "Bearer " + key },
      body: event.body
    });
    const text = await res.text();
    return { statusCode: res.status, headers: { "content-type": "application/json" }, body: text };
  } catch (e) {
    return { statusCode: 502, body: JSON.stringify({ error: { message: String(e) } }) };
  }
};
