const express = require("express");
const fs = require("fs");
const cors = require("cors");
const crypto = require("crypto");
const mongoose = require("mongoose");
const { PDFDocument, StandardFonts } = require("pdf-lib");

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

/* ================================
   🔹 MONGODB CONNECTION
================================ */
mongoose
  .connect("mongodb+srv://admin:bolo_user@cluster0.vevey1t.mongodb.net/signatureDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));



/* ================================
   🔹 AUDIT SCHEMA (REQUIREMENT)
================================ */

const AuditSchema = new mongoose.Schema({
  pdfName: String,
  beforeHash: String,
  afterHash: String,
  signedAt: {
    type: Date,
    default: Date.now,
  },
});

const Audit = mongoose.model("Audit", AuditSchema);

/* ================================
   🔹 SIGN PDF ENDPOINT
================================ */

app.post("/sign-pdf", async (req, res) => {
  try {
    const { fields } = req.body;

    if (!Array.isArray(fields)) {
      return res.status(400).send("Invalid fields");
    }

    /* ---------- READ ORIGINAL PDF ---------- */
    const originalPdf = fs.readFileSync("sample.pdf");

    /* ---------- HASH BEFORE SIGN ---------- */
    const beforeHash = crypto
      .createHash("sha256")
      .update(originalPdf)
      .digest("hex");

    const pdfDoc = await PDFDocument.load(originalPdf);
    const page = pdfDoc.getPages()[0];
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pageWidth = page.getWidth();
    const pageHeight = page.getHeight();

    /* ---------- DRAW FIELDS ---------- */
    for (const field of fields) {
      const x = field.xPercent * pageWidth;
      const y =
        pageHeight - (field.yPercent + field.hPercent) * pageHeight;

      const w = field.wPercent * pageWidth;
      const h = field.hPercent * pageHeight;

      // SIGNATURE / IMAGE
      if (
        (field.type === "signature" || field.type === "image") &&
        field.image
      ) {
        const base64 = field.image.split(",")[1];
        if (!base64) continue;

        const imgBytes = Buffer.from(base64, "base64");

        const img = field.image.includes("png")
          ? await pdfDoc.embedPng(imgBytes)
          : await pdfDoc.embedJpg(imgBytes);

        const scale = Math.min(w / img.width, h / img.height);

        page.drawImage(img, {
          x,
          y,
          width: img.width * scale,
          height: img.height * scale,
        });
      }

      // TEXT
      if (field.type === "text" && field.value?.trim()) {
        page.drawText(field.value, {
          x: x + 4,
          y: y + h / 2,
          size: 12,
          font,
        });
      }

      // DATE
      if (field.type === "date" && field.value) {
        page.drawText(field.value, {
          x: x + 4,
          y: y + h / 2,
          size: 12,
          font,
        });
      }

      // RADIO
      if (field.type === "radio" && field.checked) {
        page.drawText("✔", {
          x: x + w / 2,
          y: y + h / 2,
          size: 14,
          font,
        });
      }
    }

    /* ---------- SAVE SIGNED PDF ---------- */
    const signedPdf = await pdfDoc.save();
    fs.writeFileSync("signed.pdf", signedPdf);

    /* ---------- HASH AFTER SIGN ---------- */
    const afterHash = crypto
      .createHash("sha256")
      .update(signedPdf)
      .digest("hex");

    /* ---------- SAVE AUDIT TO DB ---------- */
    await Audit.create({
      pdfName: "sample.pdf",
      beforeHash,
      afterHash,
    });

    res.send({
      success: true,
      beforeHash,
      afterHash,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Signing failed");
  }
});

/* ================================
   🔹 START SERVER
================================ */

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
