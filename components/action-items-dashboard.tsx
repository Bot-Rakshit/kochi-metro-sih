"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ListTodo, Loader2 } from "lucide-react"
import Link from "next/link"

interface ActionItem {
  documentId: string
  actionItems: string[]
  Document: {
    title: string | null
    filename: string
  }
}

export function ActionItemsDashboard() {
  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchActionItems() {
      try {
        const response = await fetch("/api/stats")
        if (!response.ok) throw new Error("Failed to fetch stats")
        const data = await response.json()
        setActionItems(data.actionItems || [])
      } catch (error) {
        console.error("Error fetching action items:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchActionItems()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListTodo />
          All Action Items
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : actionItems.length === 0 ? (
          <p className="text-muted-foreground">No action items found.</p>
        ) : (
          <ul className="space-y-4">
            {actionItems.map(({ documentId, actionItems: items, Document }) => (
              <li key={documentId}>
                <h4 className="font-semibold mb-1">
                  <Link href={`/documents/${documentId}`} className="hover:underline">
                    {Document.title || Document.filename}
                  </Link>
                </h4>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  {items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
