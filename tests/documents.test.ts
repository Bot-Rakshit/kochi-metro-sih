import { describe, it, expect, vi, beforeEach } from "vitest"
import * as prismaModule from "@/lib/prisma"

const mockPrisma = {
  document: {
    create: vi.fn(),
    findMany: vi.fn(),
  },
}

vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }))

describe("documents service", () => {
  beforeEach(() => {
    mockPrisma.document.create.mockReset()
    mockPrisma.document.findMany.mockReset()
  })

  it("creates a document", async () => {
    mockPrisma.document.create.mockResolvedValue({ id: "doc_1" })
    const { prisma } = (await import("@/lib/prisma")) as typeof prismaModule
    const created = await prisma.document.create({
      data: { filename: "a.txt", mimeType: "text/plain", sizeBytes: 3, content: "abc", language: "english" },
    })
    expect(created.id).toBe("doc_1")
    expect(mockPrisma.document.create).toHaveBeenCalled()
  })

  it("lists documents", async () => {
    mockPrisma.document.findMany.mockResolvedValue([{ id: "doc_1" }])
    const { prisma } = (await import("@/lib/prisma")) as typeof prismaModule
    const list = await prisma.document.findMany({})
    expect(Array.isArray(list)).toBe(true)
    expect(list[0].id).toBe("doc_1")
  })
})
