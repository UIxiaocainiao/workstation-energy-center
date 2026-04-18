export function getApiErrorMessage(error: unknown, fallback = "请求失败，请稍后重试") {
  if (!(error instanceof Error)) return fallback;

  try {
    const parsed = JSON.parse(error.message) as { message?: string };
    if (parsed?.message) return parsed.message;
  } catch {
    // no-op
  }

  return error.message || fallback;
}
