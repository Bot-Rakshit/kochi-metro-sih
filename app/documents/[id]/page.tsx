import { prisma } from "@/lib/prisma"
import { DocumentPageComponent } from "./page-client"

export default async function DocumentPage({ params }: { params: { id: string } }) {
  const doc = await prisma.document.findUnique({
    where: { id: params.id },
    include: { summary: true },
  })

  return <DocumentPageComponent doc={doc} />
}


