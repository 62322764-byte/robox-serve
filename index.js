const express = require('express');
const app = express();
app.use(express.json());

const API_KEY = 'AQ.Ab8RN6K1BLQ9NevWlnTuW-Dlh0lJE8nx17ld2dqqu5SCv8BCxQ';

app.get('/', (req, res) => {
    res.json({ status: 'ROBO-X Server activo' });
});

app.post('/preguntar', async (req, res) => {
    try {
        const { pregunta } = req.body;
        if (!pregunta) return res.status(400).json({ error: 'Falta pregunta' });

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        
        const body = {
            contents: [{
                parts: [{ 
                    text: `Eres ROBO-X, asistente personal. Responde en español, máximo 1 oración corta, sin asteriscos ni símbolos. Pregunta: ${pregunta}` 
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 80
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const err = await response.text();
            console.error('Gemini error:', err);
            return res.status(500).json({ error: 'Error Gemini: ' + response.status });
        }

        const data = await response.json();
        
        if (!data.candidates || !data.candidates[0]) {
            return res.status(500).json({ error: 'Sin respuesta de Gemini' });
        }

        const texto = data.candidates[0].content.parts[0].text
            .replace(/\*/g, '')
            .replace(/#/g, '')
            .replace(/\n/g, ' ')
            .trim();

        console.log('Pregunta:', pregunta);
        console.log('Respuesta:', texto);
        
        res.json({ respuesta: texto });
        
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ROBO-X Server en puerto ${PORT}`));
