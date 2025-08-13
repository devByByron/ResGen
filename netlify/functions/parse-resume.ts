// netlify/functions/parse-resume.ts
import fs from "fs";
import path from "path";
import os from "os";
import Busboy from "busboy";
import pdfParse from "pdf-parse";

export const handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const busboy = Busboy({ headers: event.headers });
    const tmpdir = os.tmpdir();

    const fileWrites: Promise<string>[] = [];
    let uploadPath = "";

    const parsePromise = new Promise((resolve, reject) => {
      busboy.on("file", (fieldname, file, filename) => {
        uploadPath = path.join(tmpdir, filename);
        const writeStream = fs.createWriteStream(uploadPath);
        file.pipe(writeStream);
        fileWrites.push(
          new Promise((res, rej) => {
            file.on("end", () => writeStream.end());
            writeStream.on("finish", res);
            writeStream.on("error", rej);
          })
        );
      });

      busboy.on("finish", async () => {
        await Promise.all(fileWrites);

        let extractedText = "";
        if (uploadPath.endsWith(".pdf")) {
          const pdfBuffer = fs.readFileSync(uploadPath);
          const pdfData = await pdfParse(pdfBuffer);
          extractedText = pdfData.text;
        } else {
          extractedText = fs.readFileSync(uploadPath, "utf8");
        }

        resolve({
          statusCode: 200,
          body: JSON.stringify({ extractedText }),
        });
      });

      busboy.on("error", reject);
    });

    busboy.end(Buffer.from(event.body, "base64"));
    return parsePromise;
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
