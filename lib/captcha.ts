import crypto from "crypto"

const SECRET = process.env.JWT_SECRET || "fallback-secret-for-dev"
const TTL_MS = 5 * 60 * 1000

export function createCaptcha(): { id: string; question: string } {
  const a = crypto.randomInt(2, 10)
  const b = crypto.randomInt(2, 10)
  const answer = String(a + b)
  const expires = Date.now() + TTL_MS
  
  const data = `${answer}:${expires}`
  const signature = crypto.createHmac("sha256", SECRET).update(data).digest("hex")
  
  const id = Buffer.from(`${data}:${signature}`).toString("base64")

  return { id, question: `${a} + ${b} = ?` }
}

export function verifyCaptcha(id: string, answer: string): boolean {
  if (!id || !answer) return false
  
  try {
    const decoded = Buffer.from(id, "base64").toString("utf-8")
    const [expectedAnswer, expiresStr, signature] = decoded.split(":")
    
    if (!expectedAnswer || !expiresStr || !signature) return false
    
    // Check expiry
    if (Date.now() > parseInt(expiresStr, 10)) return false
    
    // Check signature
    const data = `${expectedAnswer}:${expiresStr}`
    const expectedSignature = crypto.createHmac("sha256", SECRET).update(data).digest("hex")
    
    if (signature !== expectedSignature) return false
    
    return expectedAnswer === String(answer).trim()
  } catch (e) {
    return false
  }
}
