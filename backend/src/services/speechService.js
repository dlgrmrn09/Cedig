import config from "../config/index.js";
import { AppError } from "../utils/errors.js";

const CHIMEGE_TIMEOUT_MS = 30000;

export async function transcribeAudio(audioBuffer) {
  if (!config.chimege?.apiUrl) {
    throw new AppError("Chimege API URL is not configured", 500);
  }

  if (!config.chimege?.apiToken) {
    throw new AppError("Chimege API token is not configured", 500);
  }

  if (!audioBuffer || audioBuffer.length === 0) {
    throw new AppError("Audio buffer is empty or missing", 400);
  }

  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CHIMEGE_TIMEOUT_MS);

  let response;

  try {
    response = await fetch(config.chimege.apiUrl, {
      method: "POST",
      headers: {
        Token: config.chimege.apiToken,
        "Content-Type": "application/octet-stream",
        Punctuate: "true",
        Accept: "text/plain", // ✅ important fix
      },
      body: Buffer.from(audioBuffer), // ✅ ensure raw bytes
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === "AbortError") {
      throw new AppError("Chimege API request timed out", 502);
    }

    throw new AppError(`Failed to connect to Chimege API: ${err.message}`, 502);
  }

  clearTimeout(timeoutId);

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "unknown error");

    console.error("[Chimege ERROR]", response.status, errorBody);

    if (response.status === 401 || response.status === 403) {
      throw new AppError(
        "Chimege API authentication failed — check CHIMEGE_API_TOKEN",
        500,
      );
    }

    if (response.status === 413) {
      throw new AppError("Audio file too large", 400);
    }

    if (response.status === 415) {
      throw new AppError("Unsupported audio format. Use WAV recommended.", 400);
    }

    throw new AppError(
      `Chimege API error ${response.status}: ${errorBody}`,
      502,
    );
  }

  // =========================
  // ✅ FIX: Chimege returns PLAIN TEXT (not JSON)
  // =========================

  let text;

  try {
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      const data = await response.json();
      text = data?.text || data?.result || data?.data?.text;
    } else {
      text = await response.text(); // ✅ correct default behavior
    }
  } catch (err) {
    throw new AppError("Failed to parse Chimege response", 502);
  }

  text = (text || "").trim();

  if (!text) {
    throw new AppError("No transcription returned from Chimege API", 502);
  }

  return { text };
}
