import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = (searchParams.get("q") || "").trim()
    if (!q) return NextResponse.json({ results: [] })

    const results = await prisma.document.findMany({
      where: {
        OR: [
          { filename: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
          { summary: { is: { summary: { contains: q, mode: "insensitive" } } } },
          { summary: { is: { tags: { has: q } } } },
          { summary: { is: { category: { contains: q, mode: "insensitive" } } } },
        ],
      },
      select: {
        id: true,
        filename: true,
        createdAt: true,
        summary: { select: { summary: true, department: true, priority: true, category: true, tags: true } },
      },
      take: 25,
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ results })
  } catch (error) {
    console.error("/api/search GET error", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
