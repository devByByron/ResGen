export const handler = async (event) => {
  console.log("Incoming event body:", event.body);

  try {
    const body = JSON.parse(event.body || "{}");
    const apiKey = process.env.GOOGLE_API_KEY;
    console.log("API key exists?", !!apiKey);

    if (!apiKey) {
      throw new Error("GOOGLE_API_KEY not set in Netlify");
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

    const data = await response.json();
    console.log("Google API response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new Error(data.error?.message || "Google API request failed");
    }

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
