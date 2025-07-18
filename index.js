const express   = require('express');
const dotenv    = require('dotenv');
const cors      = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });

app.listen(PORT, () => {
    console.log(`Gemini Chatbot AI server is running at http://localhost:${PORT}`);
})
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({
            reply: "Message is required."
        });
    }

    try {
        const result = await model.generateContent(message);
        const response = result.response;
        res.json({ reply: response.text() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})