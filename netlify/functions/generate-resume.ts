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
      `https://generativelanguage.googleapis.com/v1/models/text-bison-001:generateText?key=${apiKey}`,
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
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
