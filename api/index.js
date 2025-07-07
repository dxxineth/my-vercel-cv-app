const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

const { RELEVANCE_API_URL } = process.env;

app.post('/api/generate-cv', async (req, res) => {
    if (!RELEVANCE_API_URL) {
        return res.status(500).json({ error: 'Server configuration error: RELEVANCE_API_URL is not set.' });
    }

    const userData = req.body;
    const dataToSend = {
        project: "a7a4a343-9152-427d-85dd-46a663e653b6",
        params: userData
    };

    try {
        const apiResponse = await fetch(RELEVANCE_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        });
        const data = await apiResponse.json();
        if (!apiResponse.ok) throw new Error(data.message || 'Error from Relevance AI service');
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;
