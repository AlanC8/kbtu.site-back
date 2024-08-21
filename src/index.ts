import "dotenv/config";
import express from "express";
import globalRouter from "./global-router";
import { logger } from "./logger";
import connectDB from "./db";
import cors from "cors";
import openai from "./openai";
import Motivation from "./orientation/model";
const app = express();
const PORT = process.env.PORT || 3000;
connectDB();
app.use(cors());
app.use(logger);
app.use(express.json());
app.use("/api/v1/", globalRouter);

app.get("/api/predict", async (req, res) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Создай уникальное, вдохновляющее и забавное предсказание для первокурсника Казахстанско-Британского Технического Университета (КБТУ), обучающегося по специальности IT. Главный фокус предсказания должен быть на то что нужно дать мотивацию (80%), с небольшими отсылками к программированию или технологиям (20%). Предсказание должно быть на русском языке, текст не должен превышать 60 слов, и обязательно должен подчеркивать важность уникальности каждого студента. Избегай стереотипов и негативных формулировок. Главное — давай мощную мотивацию! ОЧЕНЬ СТРОГО: Отправляй просто текст, без форматирования.`,
        },
      ],
    });
    await Motivation.create({ motivation: response.choices[0].message.content });
    res.json(response.choices[0].message.content);
  } catch (error: any) {
    res.status(500).json({ error: error.message  });
  }
});

app.listen(PORT, () => {
  console.log(`Server runs at http://localhost:${PORT}`);
});
