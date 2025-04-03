import { GoogleGenerativeAI } from "@google/generative-ai";
import { initialMessage } from "./context.js";

const generateId = () => Math.random().toString(36).slice(2, 15);

const buildGoogleGenAIPrompt = (messages) => [
    { id: generateId(), role: initialMessage.role, content: initialMessage.content },
    ...messages.map((message) => ({
        id: message.id || generateId(),
        role: message.role,
        content: message.content,
    })),
];

const getResponse = async (req, res) => {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method Not Allowed" });
        }

        const { messages } = req.body;
        console.log("Google API Key:", process.env.GOOGLE_API_KEY);

        const apiKey = process.env.GOOGLE_API_KEY;

        if (!apiKey) {
            console.error(" Missing Google API Key");
            return res.status(500).json({ error: "Server Misconfiguration: Missing API Key" });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Build conversation history
        const conversation = buildGoogleGenAIPrompt(messages);

        const result = await model.generateContent({
            contents: conversation.map(({ role, content }) => ({
                role,
                parts: [{ text: content }],
            })),
        });

        const responseText = result?.response?.text?.() || "No response available";

        console.log("Gemini AI Response:", responseText);
        res.json({ response: responseText });

    } catch (error) {
        console.error("Error in chatbot API:", error.message);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

export default getResponse;
