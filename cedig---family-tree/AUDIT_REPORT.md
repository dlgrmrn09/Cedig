# Code Audit Report: Shared Components, Forms & Utilities

## 1. `src/components/shared/UploadDialog.tsx` — Line 1
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **HIGH** | Missing `"use client"` directive. Component uses `useState`, `useRef`, DOM event handlers, browser APIs (`URL.createObjectURL`). Will fail in Next.js Server Components. | Add `"use client";` at top of file. |

## 2. `src/components/shared/UploadDialog.tsx` — Lines 65–69
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **MEDIUM** | Console.log of user upload data in production. Logs `title`, `description`, `fileName`. | Remove or wrap in `if (process.env.NODE_ENV === 'development')`. |

## 3. `src/components/shared/UploadDialog.tsx` — Line 70
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **MEDIUM** | `onUpload` is called with `url: ""` and `file: selectedFile` — the upload logic is delegated to parent. The empty `url` is misleading; it implies the function will be called with a real URL but it never is. | Clarify the callback signature: either remove `url` param or actually upload and pass the URL. |

## 4. `src/components/shared/index.ts` — Lines 1–5
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **MEDIUM** | Barrel export missing `Avatar`. The `Avatar` component uses `export default`, so barrel export needs `export { default as Avatar } from './Avatar';` or similar. | Add: `export { default as Avatar } from './Avatar';` |

## 5. `src/components/Logo.tsx` — Line 11
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **MEDIUM** | Uses bare `<img>` with eslint-disable instead of Next.js `<Image>` component. Missing image optimization, lazy loading, and proper width/height attributes. | Replace with `<Image>` from `next/image` with explicit `width`/`height` and `alt`. |

## 6. `src/components/SealStamp.tsx` — Lines 14–28
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **LOW** | `useEffect` has `onComplete` in its dependency array but the internal timeout captures it at render time. If `onComplete` changes between renders, the timeout may call a stale version. | Use a ref for `onComplete` or ensure it's memoized by the parent. |

## 7. `src/components/SkeletonLoader.tsx` — Lines 334, 476, 606, etc.
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **LOW** | Uses non-standard Tailwind shades: `bg-stone-250`, `bg-stone-350`, `bg-stone-550`, `border-stone-250`, `border-stone-350`, `text-stone-350`. Tailwind only ships `50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950`. These will not render unless custom colors are defined in `tailwind.config`. | Replace with standard shades (e.g., `bg-stone-300`, `bg-stone-400`, `bg-stone-500`) or add custom steps to config. |

## 8. `src/components/SkeletonLoader.tsx` — Line 334
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **LOW** | Skeleton tab has `text-red-500` (a danger tab color), which doesn't match the actual tab style. | Use a neutral color like `text-stone-500` for consistency. |

## 9. `src/components/ToastToaster.tsx` — Line 5
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **LOW** | Imports `AppNotification` from `@/lib/store` (a re-export barrel) — other components import types from `@/src/types/notification`. Inconsistent import path. | Import from `@/src/types/notification` for consistency. |

## 10. `src/components/SocketProvider.tsx` — Lines 8–11
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **MEDIUM** | `getSocketUrl` strips `/api/v1` suffix and trailing slashes from `NEXT_PUBLIC_API_URL`. If the env variable format changes (e.g., `/api/v2`, no trailing path, or includes port differently), this breaks silently. Socket URL construction is fragile. | Add a separate env var `NEXT_PUBLIC_SOCKET_URL` for the WebSocket endpoint. |

## 11. `src/components/SocketProvider.tsx` — Line 58
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **MEDIUM** | `notification:new` handler uses `any` type for the notification payload (line 58: `notification: any`). No runtime validation of incoming socket data shape. | Define and validate the socket notification schema with zod or a type guard. |

## 12. `src/components/VoiceRecorder.tsx` — Lines 21–26
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **MEDIUM** | No cleanup on unmount. If the component unmounts while recording, the `MediaStream` and `MediaRecorder` are never stopped, leaking the microphone stream. | Add a `useEffect` cleanup: `return () => { cleanup(); if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop(); }`. |

## 13. `src/components/VoiceHoldButton.tsx` — Same issue
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **MEDIUM** | Same unmount cleanup issue as VoiceRecorder. The existing cleanup (lines 231–237) only handles `streamRef`, not `mediaRecorderRef`. | Add full cleanup in the unmount effect. |

## 14. `src/components/AddPersonModal.tsx` — Lines 335–346
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **HIGH** | `console.log` of full person payload including `phone`, `email`, and relationship data in production. This is a data leak. | Remove before production or guard with `process.env.NODE_ENV !== 'production'`. |

## 15. `src/components/AddPersonModal.tsx` — Lines 342, 374
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **MEDIUM** | Multiple `console.error` calls for error details. While less sensitive than person data, these can expose backend error messages in production. | Use a proper logging service or remove in production. |

## 16. `src/components/AddPersonModal.tsx` — Line 479
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **MEDIUM** | `<Image>` component used without explicit `width`/`height` or `fill` prop. Uses `className="w-16 h-16"` for sizing. Next.js 13+ requires explicit dimensions. | Add `width={64} height={64}` props. |

## 17. `src/components/AddPersonModal.tsx` — Lines 387–390
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **LOW** | `setTimeout` to dismiss modal after seal animation — no cleanup if component unmounts before 900ms. | Store timeout ID in ref and clear in a `useEffect` cleanup. |

## 18. `src/components/AddPersonModal.tsx` — Line 121
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **MEDIUM** | `onChange(parseInt(e.target.value) \|\| 0)` — for number fields, `parseInt('')` is `NaN`, which coerces to `0`. This means clearing a number field sets it to `0` instead of `undefined`. The initial value for `birthYear` is `1980` — clearing it sets it to `0`, which passes validation but is wrong data. | Use `undefined` for empty values: `onChange(e.target.value ? parseInt(e.target.value) : undefined)`. |

## 19. `src/components/forms/ResetForm.tsx` — Lines 59–63
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **HIGH** | Artificial `setTimeout` delay of 1200ms before calling `onSubmit`. This simulates network latency for no functional reason. | Remove the `setTimeout` wrapper. Call `onSubmit(data.password)` directly. |

## 20. `src/components/forms/OTPForm.tsx` — Lines 92–95
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **HIGH** | Same artificial 1200ms `setTimeout` delay before calling `onSubmit`. | Remove the `setTimeout` wrapper. |

## 21. `src/components/forms/ForgotForm.tsx` — Lines 47–51, 55–62
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **MEDIUM** | Empty `try` blocks in `handleEmailSubmit` and `handlePhoneSubmit` — errors from `onSubmit` are silently swallowed. The parent component's `isSubmitting` and `error` props suggest the parent should handle errors, but the try/finally without catch means loading state is set/unset but errors pass silently. | Add `catch` blocks to handle errors locally and call `onError` callback, or let the parent manage error state entirely. |

## 22. `src/components/forms/ForgotForm.tsx` — Lines 14–16
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **MEDIUM** | Phone validation is only `min(8)` with no regex pattern. Accepts any string of 8+ characters. Does not validate actual phone number format. | Add a regex pattern for phone validation. |

## 23. `src/components/forms/ForgotForm.tsx` — Security
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **HIGH** | No reCAPTCHA check before sending OTP for password reset. The `useRecaptcha` hook exists but is not called in this form. Without it, attackers can spam password reset requests. | Integrate `useRecaptcha` and call its `executeRecaptcha` method before `onSubmit`. |

## 24. `src/lib/api.ts` — Line 1
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **MEDIUM** | Defaults to `http://localhost:4000/api/v1` if `NEXT_PUBLIC_API_URL` is not set. In production, this means all API calls go to localhost and fail silently. | Either make the env var required (throw early if missing) or use an empty string and let calls fail with a clear error. |

## 25. `src/lib/api.ts` — Lines 52–60
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **HIGH** | Auth tokens stored in `localStorage` with hardcoded keys (`cedig_token`, `cedig_refresh_token`). localStorage is vulnerable to XSS attacks — any injected script can steal tokens. | Use httpOnly cookies for token storage. At minimum, consider `sessionStorage` with shorter-lived tokens. |

## 26. `src/lib/api.ts` — Line 163
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **MEDIUM** | `refreshToken` function has no timeout/abort controller. If the refresh endpoint hangs, it blocks indefinitely. | Add an AbortController with timeout (e.g., 15s). |

## 27. `src/lib/api.ts` — Lines 106–124
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **MEDIUM** | Token refresh on 401 tries Firebase `ensureFreshToken()` first, then custom `refreshToken()`. If Firebase returns a stale token, the second attempt is never reached because `retryCount` is already consumed. | Separate retry count for Firebase vs API refresh, or always prefer custom refresh. |

## 28. `src/lib/api.ts` — Line 125–131
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **LOW** | `ApiRequestError.code` uses `errorData.errors?.[0]?.message` as fallback. If the server returns a top-level error code field (e.g., `{ code: "VALIDATION_ERROR" }`), this defaults to the first field-level error message instead. | Read `errorData.code` property if it exists, otherwise fall back to field errors. |

## 29. `src/lib/api.ts` — Lines 30–33, 36–49
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **LOW** | `ApiResponse<T>` type is defined but other methods like `api.get` unwrap `.data` — but the `getPaginated` method does NOT unwrap `.data` and returns the raw shape. Inconsistent return shapes across API methods. | Either unwrap all methods consistently, or document the shape differences clearly. |

## 30. `src/lib/firebase.ts` — Lines 40–42
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **MEDIUM** | `setPersistence(auth, browserLocalPersistence)` is called at module top level, before any user interaction. This async operation may not complete before first `signIn` call, potentially causing sign-in to use default (session-only) persistence. | Move persistence setup inside an initialization function called after app mount, or await it in a higher-order wrapper. |

## 31. `src/lib/firebase.ts` — Lines 108–110
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **MEDIUM** | `logout()` only calls `signOut(auth)` but does NOT clear `localStorage` tokens (`cedig_token`, `cedig_refresh_token`). This means after logout, the API module still has stale tokens in localStorage. | Call `api.clearToken()` from `@/src/lib/api` inside the logout function, or export a combined logout that clears both. |

## 32. `src/lib/firebase.ts` — Lines 167–174
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **MEDIUM** | `waitForAuthReady()` has no timeout. If Firebase Auth never resolves (e.g., network failure), the promise hangs forever, blocking any code that awaits it. | Add a timeout (e.g., 10 seconds) that rejects or resolves with null. |

## 33. `src/lib/firebase.ts` — Line 118
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **LOW** | `onAuthChange` mutates the user object with `(user as FirebaseUser & { token: string }).token = token`. This type assertion hides the fact that `token` is not a real Firebase User property. | Store the token separately (e.g., in a WeakMap or closure), don't mutate the user object. |

## 34. `src/lib/recaptcha.ts` — Lines 80–83
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **HIGH** | When `RECAPTCHA_SITE_KEY` is empty, `executeRecaptcha` returns empty string `''` without error. This means if reCAPTCHA is not configured, ALL reCAPTCHA-protected actions will silently pass with an empty token. The backend will receive `""` which it might accept as valid. | The backend MUST reject empty reCAPTCHA tokens. The frontend should either throw if `RECAPTCHA_SITE_KEY` is missing in production, or the backend must enforce token presence. |

## 35. `src/hooks/useSearch.ts` — Line 2
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **LOW** | Uses relative import `../../hooks/use-debounce` instead of path alias `@/hooks/use-debounce`. Inconsistent with other files using `@/` prefix. | Use `@/hooks/use-debounce` for consistency. |

## 36. `src/hooks/useNotifications.ts` — Line 2
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **LOW** | Uses relative import `../../lib/store` instead of `@/lib/store`. | Use `@/lib/store` for consistency. |

## 37. `src/hooks/useApiErrorHandler.ts` — Line 12
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **MEDIUM** | Silently swallows all 401 errors. While the API layer handles token refresh on 401, a persistent 401 (e.g., refresh token expired) will never be shown to the user — they won't know they need to re-login. | Show a toast for persistent 401s after retry fails, and trigger a logout or redirect to login page. |

## 38. `src/hooks/index.ts` — Lines 1–3
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **MEDIUM** | Missing exports for `useUrlSearch`, `useTabUrlState`, `useRecaptcha`, `useApiErrorHandler`, `useIsMobile`, `useDebounce`. Only 3 of the 7+ hooks are exported from the barrel. | Add missing exports for all hooks in `src/hooks/` and `hooks/`. |

## 39. `src/hooks/useUrlSearch.ts` — No popstate listener
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **MEDIUM** | URL state is only synced via `useEffect` on state changes, but browser back/forward navigation (`popstate` event) is not listened to. If the user presses back, the URL changes but the hook state stays stale. | Add a `popstate` event listener to re-sync state from URL. |

## 40. `src/hooks/useTabUrlState.ts` — Same issue
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **MEDIUM** | Same missing `popstate` listener as `useUrlSearch`. | Add `popstate` event listener. |

## 41. `lib/utils.ts` vs `src/lib/cn.ts`
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **HIGH** | Duplicate `cn` utility function. Both files contain identical implementations of `cn()` wrapping `clsx` + `twMerge`. This violates DRY and creates maintenance risk (one may diverge from the other). | Delete one file and redirect all imports to the canonical location. Recommended: keep `src/lib/cn.ts` and have `lib/utils.ts` re-export it. |

## 42. `src/constants/index.ts` — Line 5
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **MEDIUM** | `CURRENT_YEAR = 2026` is hardcoded. On January 1, 2027, this constant will be wrong and any year-range validation using it will be off by one (and worsening annually). | Use `new Date().getFullYear()` or compute at runtime. |

## 43. `src/constants/index.ts` — Line 1
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **MEDIUM** | `CLANS` is hardcoded as `['Sartuul', 'Borgijin']`. Clans should be dynamic data, not compile-time constants. | Move to a server API endpoint or environment config. |

## 44. `src/config/personFields.ts` — Lines 22, 31
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **HIGH** | **Field label/key mismatch.** `firstName` is labeled "Овог" (Mongolian for surname/clan name), and `lastName` is labeled "Нэр" (Mongolian for given name). The fields are swapped relative to their English key names. This will cause data confusion — what users enter as "Овог" gets stored in `firstName`. | Either swap the labels so `firstName` → "Нэр" and `lastName` → "Овог", OR swap the field keys in `PersonFormData` to match Mongolian naming convention. |

## 45. `src/config/personFields.ts` — Line 69
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **MEDIUM** | `zodiacSign` field is labeled "Жил" (which means "Year" in Mongolian). The `zodiacSign` key and the label "Жил" represent different concepts. Mongolian zodiac is by year (12-year animal cycle), but the labeling is ambiguous. | Either rename the label to "Жил / Од" (Year/Zodiac) or rename the key to `yearAnimal` or similar to match. |

## 46. `src/config/personFields.ts` — Lines 55, 62
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **MEDIUM** | `birthDate` and `deathDate` fields are type `"text"` instead of `"date"`. No date picker provided. Users must manually type dates in the correct format. | Change type to `"date"` for native date picker support, or implement a custom date picker component. |

## 47. `src/config/index.ts` — Lines 5–6
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **MEDIUM** | Hardcoded Google Cloud CDN URLs for logos. If the CDN URL changes or the asset is deleted, the logo will break. | Move to environment variables (`NEXT_PUBLIC_LOGO_URL`, `NEXT_PUBLIC_LOGO_GRAY_URL`) or use local paths. |

## 48. `src/config/index.ts` — Lines 9–11
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **MEDIUM** | `remotePatterns` for Next.js image optimization is defined in app config, not in `next.config.js`. This has no effect — Next.js remote patterns MUST be in `next.config.js` under `images.remotePatterns`. | Move to `next.config.js` or ensure this config is consumed by the Next.js config. |

## 49. `src/components/shared/Pagination.tsx` — Lines 39–41, 70–71
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **LOW** | Both mobile and desktop variants show "Next" for the next button — the `<span className="hidden sm:inline">Next</span>` and `<span className="sm:hidden">Next</span>` render identical text. Redundant but not broken. | Remove one of the duplicate spans. |

## 50. `src/components/SocketProvider.tsx` — Line 39
| Severity | Issue | Recommendation |
|----------|-------|----------------|
| **LOW** | `reconnectionAttempts: Infinity` — socket will retry forever. While this is intentional, it may be problematic if the token is permanently invalid (e.g., account deleted). The socket will keep retrying indefinitely with a bad token. | Add a maximum reconnection count (e.g., 10) and/or listen for fatal auth errors to stop reconnection. |

---

## Summary

| Severity | Count |
|----------|-------|
| HIGH | 8 |
| MEDIUM | 30 |
| LOW | 12 |

### Top Critical Issues to Fix First
1. **Missing `"use client"` in UploadDialog** — breaks the component in Next.js 15.
2. **Duplicate `cn()` utility** — `lib/utils.ts` and `src/lib/cn.ts` are identical; pick one.
3. **Token in localStorage** — XSS vulnerability; use httpOnly cookies.
4. **No reCAPTCHA on forgot-password form** — allows unlimited password reset spam.
5. **Artificial delays in ResetForm and OTPForm** — 1200ms setTimeout wastes time.
6. **Field label/key mismatch in personFields** — `firstName` labeled as "Овог" (surname) and `lastName` labeled as "Нэр" (given name) are swapped.
7. **Production console.log with PII** — AddPersonModal logs full person data.
8. **reCAPTCHA silent bypass** — Empty tokens returned when not configured; backend must reject.
