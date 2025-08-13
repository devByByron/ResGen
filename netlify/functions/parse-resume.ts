// netlify/functions/parse-resume.ts
import formidable from "formidable";
import fs from "fs";

export const handler = async (event) => {
  try {
    // Netlify Functions don't parse multipart forms automatically
    const form = new formidable.IncomingForm();
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(event, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const filePath = files.resume.filepath;
    const fileContent = fs.readFileSync(filePath, "utf8");

    // Here you’d send the text to AI for parsing
    return {
      statusCode: 200,
      body: JSON.stringify({ parsedText: fileContent }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
