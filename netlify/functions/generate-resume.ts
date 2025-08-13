// netlify/functions/generate-resume.ts
// import fetch from "node-fetch";

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      console.error("❌ GOOGLE_API_KEY is missing in Netlify environment variables");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "GOOGLE_API_KEY not set in Netlify" }),
      };
    }

    // Construct AI prompt
    const prompt = `
      Create a professional resume based on the following:
      Job Title: ${body.jobTitle}
      Industry: ${body.industry}
      Experience Level: ${body.experienceLevel}
      Skills: ${body.skills}
      Full Name: ${body.personalInfo?.fullName}
      Email: ${body.personalInfo?.email}
      Phone: ${body.personalInfo?.phone}
      Location: ${body.personalInfo?.location}
      Additional Info: ${body.additionalInfo}

      Format the response as structured JSON with these fields:
      fullName, email, phone, location, summary, experience, education, skills.
    `;

    console.log("📨 Prompt sent to Gemini:", prompt);

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Google API error:", data);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.error?.message || "Google API request failed" }),
      };
    }

    // Extract text output from Gemini
    const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    let resumeJson;
    try {
      resumeJson = JSON.parse(textOutput);
    } catch (err) {
      console.warn("⚠️ Gemini did not return valid JSON, sending raw text instead.");
      resumeJson = { rawText: textOutput };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(resumeJson),
    };

  } catch (err) {
    console.error("❌ Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
