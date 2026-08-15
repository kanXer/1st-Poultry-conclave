interface Window {
  count: number
  resetAt: number
}

const buckets = new Map<string, Window>()

function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  )
}

/**
 * Simple in-memory rate limiter keyed by client IP.
 * Returns { allowed, retryAfterSeconds }.
 */
export function rateLimit(headers: Headers, max = 5, windowMs = 15 * 60 * 1000): {
  allowed: boolean
  retryAfterSeconds: number
} {
  const ip = getClientIp(headers)
  const now = Date.now()

  const bucket = buckets.get(ip)
  if (!bucket || now > bucket.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfterSeconds: 0 }
  }

  if (bucket.count >= max) {
    const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))
    return { allowed: false, retryAfterSeconds }
  }

  bucket.count += 1
  return { allowed: true, retryAfterSeconds: 0 }
}
