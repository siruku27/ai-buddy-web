const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

// 単一プロセスでの簡易レート制限。複数インスタンスで動かす場合は
// Redis等の共有ストアに置き換えること。
const hits = new Map();

export function isRateLimited(key) {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > MAX_REQUESTS;
}

export function getClientIp(req) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}
