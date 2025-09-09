import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const [documentsToday, totalSummaries, pendingReview, actionItems] = await Promise.all([
      prisma.document.count({ where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
      prisma.summary.count(),
      prisma.document.count({ where: { reviewStatus: "PENDING" } }),
      prisma.summary.findMany({
        where: { actionItems: { isEmpty: false } },
        select: { documentId: true, actionItems: true, Document: { select: { title: true, filename: true } } },
      }),
    ])

    return NextResponse.json({
      documentsToday,
      pendingReview,
      activeUsers: 0,
      summariesToday: documentsToday,
      actionItems,
    })
  } catch (error) {
    console.error("/api/stats GET error", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
