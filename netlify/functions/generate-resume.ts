// netlify/functions/generate-resume.ts


export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
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
      Format the response as structured JSON with fields:
      fullName, email, phone, location, summary, experience, education, skills.
    `;

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
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
