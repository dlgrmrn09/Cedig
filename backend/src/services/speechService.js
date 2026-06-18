import config from "../config/index.js";
import { AppError } from "../utils/errors.js";

export async function transcribeAudio(audioBuffer) {
  if (!config.chimege?.apiToken) {
    throw new AppError("Chimege API token is not configured", 500);
  }

  const apiUrl = config.chimege.apiUrl;
  console.log(config.chimege.apiUrl);
  let response;
  try {
    response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Token: config.chimege.apiToken,
        "Content-Type": "application/octet-stream",
        Punctuate: "true",
      },
      body: Buffer.from(audioBuffer),
    });
  } catch (err) {
    throw new AppError(`Failed to connect to Chimege API: ${err.message}`, 502);
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new AppError(
      `Chimege API error (${response.status}): ${errorText}`,
      502,
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new AppError("Invalid response from Chimege API", 502);
  }

  const text = data?.text || data?.data?.text || data?.result || "";

  if (!text) {
    throw new AppError("No transcription text returned from Chimege API", 502);
  }

  return { text };
}
