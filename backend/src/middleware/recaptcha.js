import config from '../config/index.js';

const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

export function verifyRecaptcha(scoreThreshold = 0.5) {
  return async (req, res, next) => {
    const token = req.body?.recaptchaToken;

    if (!token) {
      console.warn(`[RECAPTCHA] Missing token from ${req.ip} for ${req.method} ${req.originalUrl}`);
      return res.status(400).json({
        success: false,
        message: 'reCAPTCHA verification required. Please refresh the page and try again.',
      });
    }

    // Strip token from body so downstream validation doesn't reject it
    delete req.body.recaptchaToken;

    try {
      const params = new URLSearchParams();
      params.append('secret', config.recaptcha.secretKey);
      params.append('response', token);
      if (req.ip) {
        params.append('remoteip', req.ip);
      }

      const response = await fetch(VERIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });

      const result = await response.json();

      if (!result.success) {
        console.warn(
          `[RECAPTCHA] Verification failed for ${req.ip}: ` +
          `success=${result.success}, ` +
          `error-codes=${JSON.stringify(result['error-codes'] || [])}`
        );
        return res.status(403).json({
          success: false,
          message: 'reCAPTCHA verification failed. Please try again.',
        });
      }

      if (typeof result.score === 'number' && result.score < scoreThreshold) {
        console.warn(
          `[RECAPTCHA] Low score from ${req.ip}: score=${result.score}, ` +
          `action=${result.action}, threshold=${scoreThreshold}`
        );
        return res.status(403).json({
          success: false,
          message: 'Suspicious activity detected. Please try again later.',
        });
      }

      console.log(
        `[RECAPTCHA] Passed: score=${result.score ?? 'N/A'}, ` +
        `action=${result.action}, ip=${req.ip}`
      );

      next();
    } catch (error) {
      console.error(`[RECAPTCHA] Service error: ${error.message}`);
      return res.status(502).json({
        success: false,
        message: 'reCAPTCHA service temporarily unavailable. Please try again later.',
      });
    }
  };
}
