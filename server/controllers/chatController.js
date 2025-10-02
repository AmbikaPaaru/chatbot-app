import { getChatCompletion } from "../services/openaiService.js";

export const chatHandler = async (req, res) => {
  try {
    const { message } = req.body;
    const response = await getChatCompletion(message);
    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
