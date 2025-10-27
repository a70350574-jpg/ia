// server.js
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Utilisation de la variable d'environnement pour sécuriser le token
const HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_TOKEN;

app.use(cors());
app.use(express.json());

// Route POST /api
app.post("/api", async (req, res) => {
  const { message } = req.body;

  // Vérifie si la question concerne le créateur
  const creatorRegex = /(qui\s*(t|est)\s*(ton|votre)?\s*créateur|qui\s*t'a\s*fait|qui\s*t'as\s*créé)/i;
  if (creatorRegex.test(message)) {
    return res.json({ reply: "Mon créateur c'est Aminox, propriétaire de AM Company." });
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/nomic-ai/gpt4all-j",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGINGFACE_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: message })
      }
    );

    const data = await response.json();
    const reply = data[0]?.generated_text || "Je n'ai pas de réponse.";
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.json({ reply: "Erreur réseau." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
