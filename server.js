
import express from "express";
import cors from "cors";
import multer from "multer";
import nodemailer from "nodemailer";

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.get("/", (req, res) => {
  res.send("My Website Backend is Running!");
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Backend is working" });
});

app.post(
  "/api/promotion-claims",
  upload.none(),
  async (req, res) => {
    try {
      const { name, phone } = req.body;

      if (!name || !phone) {
        return res.status(400).json({
          success: false,
          message: "Name and phone are required"
        });
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: "riseeveryday59@gmail.com",
        subject: "New App Form Submission",
        text: `Name: ${name}\nPhone: ${phone}`
      });

      res.json({
        success: true,
        message: "Form received successfully"
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Email could not be sent"
      });
    }
  }
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
