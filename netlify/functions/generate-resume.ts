export const handler = async (event) => {
  console.log('🚀 Handler started');
  console.log('📥 Event body:', event.body);
  
  try {
    const requestData = JSON.parse(event.body || "{}");
    console.log('📋 Parsed request data:', requestData);
    
    const apiKey = process.env.GOOGLE_API_KEY;
    console.log('🔑 API Key exists:', !!apiKey);

    if (!apiKey) {
      console.log('❌ Missing API key');
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ error: "Missing GOOGLE_API_KEY" })
      };
    }

    // Build the prompt based on the request structure
    const prompt = buildPrompt(requestData);
    console.log('📨 Built prompt:', prompt);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048
          }
        })
      }
    );

    console.log('🌐 API Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ 
          error: `API request failed: ${response.status}`,
          details: errorText
        })
      };
    }

    const data = await response.json();
    console.log('✅ API Response data:', JSON.stringify(data, null, 2));
    
    // Extract the generated text from the response
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      let generatedText = data.candidates[0].content.parts[0].text;
      console.log('📄 Raw generated text:', generatedText);
      
      // Remove markdown code fences if present
      generatedText = generatedText.replace(/```json\s*/, '').replace(/```\s*$/, '').trim();
      console.log('🧹 Cleaned text:', generatedText);
      
      try {
        // Parse the JSON to validate it
        const resumeData = JSON.parse(generatedText);
        console.log('✅ Successfully parsed resume data');
        
        return {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          },
          body: JSON.stringify(resumeData)
        };
      } catch (parseError) {
        console.error('❌ Failed to parse generated JSON:', parseError);
        return {
          statusCode: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          },
          body: JSON.stringify({ 
            error: "Failed to parse generated resume data",
            details: parseError.message,
            rawResponse: generatedText
          })
        };
      }
    } else {
      console.error('❌ No content in API response');
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ 
          error: "No content generated",
          details: "API response did not contain expected content structure",
          fullResponse: data
        })
      };
    }
    
  } catch (err) {
    console.error('💥 Handler error:', err);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ 
        error: "Internal server error",
        details: err.message,
        stack: err.stack
      })
    };
  }
};

// Helper function to build the prompt
function buildPrompt(requestData) {
  const { jobTitle, industry, experienceLevel, skills, personalInfo, additionalInfo } = requestData;
  
  return `Create a professional resume in pure JSON format. Return ONLY valid JSON without any markdown code fences or extra text.

Required JSON structure:
{
  "fullName": "string",
  "email": "string", 
  "phone": "string or null",
  "location": "string or null",
  "summary": "string - 2-3 sentence professional summary",
  "experience": [
    {
      "title": "string",
      "company": "string", 
      "years": "string",
      "description": "string"
    }
  ],
  "education": [
    {
      "degree": "string",
      "university": "string",
      "years": "string"
    }
  ],
  "skills": ["array", "of", "skill", "strings"]
}

Generate content for:
- Job Title: ${jobTitle}
- Industry: ${industry}
- Experience Level: ${experienceLevel}
- Skills: ${skills}
- Full Name: ${personalInfo?.fullName || 'John Doe'}
- Email: ${personalInfo?.email || 'john@example.com'}
- Phone: ${personalInfo?.phone || ''}
- Location: ${personalInfo?.location || ''}
- Additional Info: ${additionalInfo}

Return only the JSON object, no other text.`;
