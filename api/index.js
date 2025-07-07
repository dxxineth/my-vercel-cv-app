const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // --- START DEBUGGING LOGS ---
    console.log("--- Vercel Function /api/generate-cv was triggered ---");
    
    const { RELEVANCE_API_URL } = process.env;
    
    if (!RELEVANCE_API_URL) {
        console.error("FATAL: RELEVANCE_API_URL environment variable is not set.");
        return res.status(500).json({ error: 'Server configuration error: RELEVANCE_API_URL is missing.' });
    }
    console.log("RELEVANCE_API_URL is present. Attempting to fetch...");
    // --- END DEBUGGING LOGS ---

    try {
        const userData = req.body;
        const dataToSend = {
            project: "a7a4a343-9152-427d-85dd-46a663e653b6",
            params: userData
        };

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
};