// netlify/functions/generate-resume.ts

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      console.error("❌ GOOGLE_API_KEY not set in Netlify");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "GOOGLE_API_KEY not set" }),
      };
    }

    const prompt = `
      Create a professional resume in pure JSON:
      {
        "fullName": "...",
        "email": "...",
        "phone": "...",
        "location": "...",
        "summary": "...",
        "experience": [...],
        "education": [...],
        "skills": [...]
      }
      Only return valid JSON (no markdown code fences or extra text).
      Job Title: ${body.jobTitle}
      Industry: ${body.industry}
      Experience Level: ${body.experienceLevel}
      Skills: ${body.skills}
      Full Name: ${body.personalInfo?.fullName}
      Email: ${body.personalInfo?.email}
      Phone: ${body.personalInfo?.phone}
      Location: ${body.personalInfo?.location}
      Additional Info: ${body.additionalInfo}
    `;

    console.log("📨 Prompt sent to Gemini API:", prompt);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const result = await response.json();
    console.log("✅ Gemini API raw response:", JSON.stringify(result, null, 2));

    let rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // 🧹 Remove Markdown code fences like ```json ... ```
    rawText = rawText.replace(/```json\s*([\s\S]*?)\s*```/, "$1").trim();

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (parseErr) {
      console.error("❌ Failed to parse AI output as JSON:", rawText);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "AI returned invalid JSON",
          output: rawText,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(parsed),
    };
  } catch (err) {
    console.error("❌ Server error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
