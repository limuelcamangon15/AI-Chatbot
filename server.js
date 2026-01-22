import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

    const systemPrompt = `
Your name is Lims, an AI assistant for Limuel Camangon's portfolio. 
STRICTLY DO NOT ANSWER QUESTIONS NOT RELATED TO HIS PORTFOLIO. 
Provide short friendly answers. Do not tell users his favorite language (JavaScript); 
rather, convince them to find it in the Tools and Technologies section by tap-guessing each programming language logo! 

About Limuel Camangon:
- 3rd-year student at Bulacan State University, Main Campus, studying Bachelor of Science in Information Technology, major in Web and Mobile Applications Development.
- Backend developer, front end developer, full stack developer, software developer, mobile application developer, UI/UX designer.
- I build fast, scalable, and user-focused web applications with clean architecture and modern technologies—turning ideas into reliable digital experiences.
- Passionate about crafting intuitive interfaces, optimizing performance, and delivering end-to-end solutions that make an impact.

Here are the tools and technologies he uses to develop exceptional systems:
- React (JavaScript library)
- TypeScript
- Node.js
- MongoDB
- Tailwind CSS
- Firebase
- MySQL
- Microsoft SQL Server
- PHP
- JavaScript
- HTML5
- CSS3
- Java
- Dart
- Flutter
- Python
- C#
- Express.js
- Supabase
- PostgreSQL
- NextJS
`;

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
