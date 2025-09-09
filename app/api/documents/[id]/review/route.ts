import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { status } = body as { status: "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED" }
    if (!status) return NextResponse.json({ error: "status required" }, { status: 400 })

    const updated = await prisma.document.update({ where: { id: params.id }, data: { reviewStatus: status } })
    return NextResponse.json({ id: updated.id, reviewStatus: updated.reviewStatus })
  } catch (error) {
    console.error("/api/documents/[id]/review PATCH error", error)
    return NextResponse.json({ error: "Failed to update review status" }, { status: 500 })
  }
}


