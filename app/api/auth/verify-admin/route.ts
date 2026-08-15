import { NextRequest, NextResponse } from "next/server"
import { verifyAdminProof } from "@/lib/auth"

/**
 * POST /api/auth/verify-admin
 * Verifies the HMAC admin proof server-side.
 * This prevents response-interception attacks where someone
 * modifies /api/auth/me response to flip isAdmin to true.
 */
export async function POST(req: NextRequest) {
  try {
    const { userId, adminProof } = await req.json()

    if (!userId || !adminProof) {
      return NextResponse.json({ valid: false })
    }

    const valid = verifyAdminProof(userId, adminProof)
    return NextResponse.json({ valid })
  } catch {
    return NextResponse.json({ valid: false })
  }
}
