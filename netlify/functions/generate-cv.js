const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    // Handle CORS preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    // --- START DEBUGGING LOGS ---
    console.log("--- Netlify Function /generate-cv was triggered ---");
    
    const { RELEVANCE_API_URL } = process.env;
    
    if (!RELEVANCE_API_URL) {
        console.error("FATAL: RELEVANCE_API_URL environment variable is not set.");
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Server configuration error: RELEVANCE_API_URL is missing.' })
        };
    }
    console.log("RELEVANCE_API_URL is present. Attempting to fetch...");
    // --- END DEBUGGING LOGS ---

    try {
        const userData = JSON.parse(event.body);
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
        
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

    } catch (error) {
        // --- DETAILED CATCH LOG ---
        console.error("!!! AN ERROR OCCURRED IN THE CATCH BLOCK !!!");
        console.error("Error Message:", error.message);
        console.error("Error Stack:", error.stack);
        // --- END DETAILED CATCH LOG ---
        
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: error.message })
        };
    }
};