import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const doc = await prisma.document.findUnique({
      where: { id: params.id },
      include: { summary: true },
    })
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(doc)
  } catch (error) {
    console.error("/api/documents/[id] GET error", error)
    return NextResponse.json({ error: "Failed to fetch document" }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.summary.deleteMany({ where: { documentId: params.id } })
    await prisma.document.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("/api/documents/[id] DELETE error", error)
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { title, summary, actionItems, tags, priority, department, category, deadline, stakeholders } = body

    // Update document title if provided
    if (typeof title === "string") {
      await prisma.document.update({ where: { id: params.id }, data: { title } })
    }

    const existing = await prisma.summary.findUnique({ where: { documentId: params.id } })
    if (existing) {
      await prisma.summary.update({
        where: { documentId: params.id },
        data: {
          summary: typeof summary === "string" ? summary : existing.summary,
          actionItems: Array.isArray(actionItems) ? actionItems : existing.actionItems,
          tags: Array.isArray(tags) ? tags : existing.tags,
          priority: typeof priority === "string" ? priority : existing.priority,
          department: typeof department === "string" ? department : existing.department,
          category: typeof category === "string" ? category : existing.category,
          deadline: typeof deadline === "string" || deadline === null ? deadline : existing.deadline,
          stakeholders: Array.isArray(stakeholders) ? stakeholders : existing.stakeholders,
        },
      })
    }

    const updated = await prisma.document.findUnique({ where: { id: params.id }, include: { summary: true } })
    return NextResponse.json(updated)
  } catch (error) {
    console.error("/api/documents/[id] PATCH error", error)
    return NextResponse.json({ error: "Failed to update document" }, { status: 500 })
  }
}
