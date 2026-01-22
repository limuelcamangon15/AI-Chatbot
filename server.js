import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prompt } from "./prompt";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

//middlewares
app.use(cors());
app.use(express.json());

if (!process.env.GEMINI_API_KEY) {
  console.error("Missing API KEY!!!!!!");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

app.get("/ai-health", (req, res) => {
  res.status(200).json({ message: "AI still active" });
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ message: "message is required" });
    }

    const systemPrompt = prompt;

    const result = await model.generateContent([systemPrompt, message]);

    const aiReply =
      result?.response?.text?.() ??
      "Sorry, I couldn't generate a response. Please try again.";

    res.status(200).json({ reply: aiReply });
  } catch (error) {
    console.error("ERRRRRORRR: ", error);
    res.status(500).json({ message: "Cannot get AI response" });
  }
});

app.listen(PORT, () => {
  console.log("SERVER IS RUNNING!");
});
