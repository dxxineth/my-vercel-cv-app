const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

const { RELEVANCE_API_URL } = process.env;

app.post('/api/generate-cv', async (req, res) => {
    // --- START DEBUGGING LOGS ---
    console.log("--- Function /api/generate-cv was triggered ---");
    
    if (!RELEVANCE_API_URL) {
        console.error("FATAL: RELEVANCE_API_URL environment variable is not set.");
        return res.status(500).json({ error: 'Server configuration error: RELEVANCE_API_URL is missing.' });
    }
    console.log("RELEVANCE_API_URL is present. Attempting to fetch...");
    // --- END DEBUGGING LOGS ---

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

        // --- MORE DEBUGGING ---
        console.log(`Relevance AI API responded with status: ${apiResponse.status}`);
        const responseText = await apiResponse.text(); // Get response as text first
        console.log(`Relevance AI API response body: ${responseText}`);
        // --- END MORE DEBUGGING ---

        if (!apiResponse.ok) {
            // Throw an error with the response text we got
            throw new Error(`Relevance AI API returned an error: ${responseText}`);
        }
        
        // Now try to parse the text as JSON
        const data = JSON.parse(responseText);
        res.status(200).json(data);

    } catch (error) {
        // --- DETAILED CATCH LOG ---
        console.error("!!! AN ERROR OCCURRED IN THE CATCH BLOCK !!!");
        console.error("Error Message:", error.message);
        console.error("Error Stack:", error.stack);
        // --- END DETAILED CATCH LOG ---
        res.status(500).json({ error: error.message });
    }
});

module.exports = app;