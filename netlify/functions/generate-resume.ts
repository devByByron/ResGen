export const handler = async (event) => {
  try {
    const { prompt } = JSON.parse(event.body || "{}");
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing GOOGLE_API_KEY" })
      };
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: { text: prompt },
          temperature: 0.7
        })
      }
    );

    const data = await response.json();
    
    // Extract the generated text from the response
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      let generatedText = data.candidates[0].content.parts[0].text;
      
      // Remove markdown code fences if present
      generatedText = generatedText.replace(/```json\s*/, '').replace(/```\s*$/, '').trim();
      
      try {
        // Parse the JSON to validate it
        const resumeData = JSON.parse(generatedText);
        
        return {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(resumeData)
        };
      } catch (parseError) {
        console.error('Failed to parse generated JSON:', parseError);
        return {
          statusCode: 500,
          body: JSON.stringify({ 
            error: "Failed to parse generated resume data",
            details: parseError.message,
            rawResponse: generatedText
          })
        };
      }
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: "No content generated",
          details: "API response did not contain expected content structure"
        })
      };
    }
    
  } catch (err) {
    console.error('Handler error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
