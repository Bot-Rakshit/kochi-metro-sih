"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, FileText, Clock, Users, AlertTriangle, TrendingUp, Upload, ListTodo } from "lucide-react"
import { useEffect, useState } from "react"
import { Spinner } from "@/components/ui/spinner"
import Link from "next/link"
import { ActionItemsDashboard } from "./action-items-dashboard"
import { DocumentUpload } from "./document-upload"
import { Button } from "./ui/button"

export function ComprehensiveDashboard() {
  const [stats, setStats] = useState<{ documentsToday: number; pendingReview: number; activeUsers: number; summariesToday: number } | null>(null)
  const [recent, setRecent] = useState<Array<{ id: string; title?: string; filename: string; summary?: { summary: string; department: string; category: string } }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const s = await fetch("/api/stats").then((r) => r.json())
        setStats(s)
        const rdocs = await fetch("/api/documents").then((r) => r.json())
        setRecent((rdocs.documents || []).slice(0, 5))
      } catch (e) {
        console.error("dashboard load error", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-balance">Comprehensive Dashboard</h2>
        <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
          A high-level overview of all document activity and key metrics.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents Today</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {loading ? <Spinner /> : stats?.documentsToday ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">Uploaded today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">{loading ? <Spinner /> : stats?.pendingReview ?? 0}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">{loading ? <Spinner /> : stats?.activeUsers ?? 0}</div>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Summaries</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">{loading ? <Spinner /> : stats?.summariesToday ?? 0}</div>
            <p className="text-xs text-muted-foreground">Generated today</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Documents */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Documents</CardTitle>
              <CardDescription>Latest documents processed by the AI system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <Spinner className="h-6 w-6" />
                  </div>
                )}
                {!loading &&
                  recent.map((doc) => (
                    <div key={doc.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium truncate max-w-[60ch]">{doc.title || doc.filename}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{doc.summary?.summary}</p>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/documents/${doc.id}`}>View</Link>
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Items */}
        <div className="lg:col-span-1">
          <ActionItemsDashboard />
        </div>
      </div>
    </div>
  )
}
