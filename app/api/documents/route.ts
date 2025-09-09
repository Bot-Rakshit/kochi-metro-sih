import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const department = searchParams.get("department") || undefined
    const status = (searchParams.get("status") as any) || undefined
    const where = {
      ...(department ? { summary: { is: { department } } } : {}),
      ...(status ? { reviewStatus: status } : {}),
    }
    const documents = await prisma.document.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        filename: true,
        mimeType: true,
        sizeBytes: true,
        language: true,
        createdAt: true,
        summary: {
          select: {
            department: true,
            priority: true,
            category: true,
            tags: true,
            actionItems: true,
            deadline: true,
            stakeholders: true,
            summary: true,
          },
        },
      },
    })
    return NextResponse.json({ documents })
  } catch (error) {
    console.error("/api/documents GET error", error)
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { filename, mimeType, sizeBytes, content, language = "english", summary } = body

    if (!filename || !mimeType || !sizeBytes || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const doc = await prisma.document.create({
      data: { filename, mimeType, sizeBytes: Number(sizeBytes), content, language },
    })

    if (summary) {
      await prisma.summary.create({
        data: {
          documentId: doc.id,
          summary: summary.summary,
          department: summary.department,
          priority: summary.priority,
          category: summary.category,
          tags: summary.tags || [],
          actionItems: summary.actionItems || [],
          deadline: summary.deadline,
          stakeholders: summary.stakeholders || [],
        },
      })
    }

    return NextResponse.json({ id: doc.id })
  } catch (error) {
    console.error("/api/documents POST error", error)
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 })
  }
}
