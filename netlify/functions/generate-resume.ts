// netlify/functions/generate-resume.ts
import fetch from "node-fetch";

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const apiKey = process.env.GOOGLE_API_KEY;

    console.log("Incoming event body:", body);
    console.log("API key exists?", !!apiKey);

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "GOOGLE_API_KEY not set in Netlify" }),
      };
    }

    const prompt = `
      Create a professional resume based on:
      Job Title: ${body.jobTitle}
      Industry: ${body.industry}
      Experience Level: ${body.experienceLevel}
      Skills: ${body.skills}
      Full Name: ${body.personalInfo?.fullName}
      Email: ${body.personalInfo?.email}
      Phone: ${body.personalInfo?.phone}
      Location: ${body.personalInfo?.location}
      Additional Info: ${body.additionalInfo}
      Format the response as structured JSON with fields:
      fullName, email, phone, location, summary, experience, education, skills.
    `;

    console.log("Prompt sent to Google API:", prompt);

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/text-bison-001:generateText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          prompt: { text: prompt },
          temperature: 0.7,
        }),
      }
    );

    // Check for non-OK responses
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google API error:", response.status, errorText);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: errorText || "Google API request failed" }),
      };
    }

    const data = await response.json();
    console.log("Google API response data:", data);

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
