const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

// import ton module ask-pair-fire
const startpairing = require("./base-bot/ask-pair-fire.js");

// Page d’accueil
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/store", (req, res) => {
  res.sendFile(path.join(__dirname, "store.html"));
});

app.get("/error", (req, res) => {
  res.sendFile(path.join(__dirname, "error.html"));
});

app.get("/connect", (req, res) => {
  res.sendFile(path.join(__dirname, "connect.html"));
});

// Route pour connexion (depuis connect.html, bot.html, boy2.html)
app.post("/connect", async (req, res) => {
  try {
    const number = req.body.number;
    if (!number) {
      return res.status(400).send("Numéro requis");
    }

    const Xreturn = number.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    // Lancer pairing
    await startpairing(Xreturn);

    // Lire le code depuis pairing.json
    const cu = fs.readFileSync("./system/database/pairing.json", "utf-8");
    const cuObj = JSON.parse(cu);

    res.json({
      success: true,
      message: "Connexion réussie",
      code: cuObj.code
    });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Erreur lors de la connexion" });
  }
});

app.listen(3000, () => {
  console.log("✅ Serveur démarré sur http://localhost:3000");
});