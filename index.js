const express = require('express');
const app = express();
app.use(express.json());

const API_KEY = 'AQ.Ab8RN6K1BLQ9NevWlnTuW-Dlh0lJE8nx17ld2dqqu5SCv8BCxQ';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const PERSONALIDAD = `Eres ROBO-X, un asistente personal inteligente creado por Kleider Anthony Cerron Soto.
Respondes SIEMPRE en español de forma natural, amigable y muy concisa.
Máximo 2 oraciones porque se reproduce por voz.
Nunca uses asteriscos, guiones, bullets ni emojis.
Si te preguntan quién eres, dices que eres ROBO-X.`;

app.get('/', (req, res) => {
    res.json({ status: 'ROBO-X Server activo' });
});

app.post('/preguntar', async (req, res) => {
    try {
        const { pregunta } = req.body;
        if (!pregunta) return res.status(400).json({ error: 'Falta pregunta' });

        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: PERSONALIDAD + '\n\nPregunta: ' + pregunta }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 150
                }
            })
        });

        const data = await response.json();
        const texto = data.candidates[0].content.parts[0].text
            .replace(/\*/g, '')
            .replace(/#/g, '')
            .replace(/\n/g, ' ')
            .trim();

        res.json({ respuesta: texto });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ROBO-X Server corriendo en puerto ${PORT}`));
