import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Clock, Users, AlertTriangle, TrendingUp, Upload } from "lucide-react"
import { DocumentUpload } from "@/components/document-upload"

export function DocumentDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-balance">AI-Powered Document Management for KMRL</h2>
        <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
          Streamline your document workflow with intelligent summarization, multilingual support, and automated routing
          for all KMRL departments.
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
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Summaries</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">Generated today</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Quick Upload
            </CardTitle>
            <CardDescription>Upload documents for AI processing and automatic routing</CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentUpload />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Priority Alerts
            </CardTitle>
            <CardDescription>Critical documents requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
              <div>
                <p className="font-medium text-sm">Safety Bulletin Update</p>
                <p className="text-xs text-muted-foreground">Ministry of Housing & Urban Affairs</p>
              </div>
              <Badge variant="destructive">Urgent</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
              <div>
                <p className="font-medium text-sm">Maintenance Schedule Change</p>
                <p className="text-xs text-muted-foreground">Rolling Stock Department</p>
              </div>
              <Badge variant="secondary">High</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Vendor Invoice Approval</p>
                <p className="text-xs text-muted-foreground">Procurement Department</p>
              </div>
              <Badge variant="outline">Medium</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
          <CardDescription>Latest documents processed by the AI system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                title: "Track Maintenance Report - Section A12",
                department: "Engineering",
                time: "2 minutes ago",
                summary:
                  "Routine inspection completed. Minor wear detected on rail joints requiring scheduled maintenance.",
                language: "English",
              },
              {
                title: "സുരക്ഷാ നിർദ്ദേശങ്ങൾ - സ്റ്റേഷൻ കൺട്രോൾ",
                department: "Safety",
                time: "15 minutes ago",
                summary: "New safety protocols for station crowd management during peak hours.",
                language: "Malayalam",
              },
              {
                title: "Quarterly Financial Review Q4 2024",
                department: "Finance",
                time: "1 hour ago",
                summary: "Revenue targets exceeded by 8%. Operational costs reduced through efficiency improvements.",
                language: "English",
              },
            ].map((doc, index) => (
              <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{doc.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {doc.language}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{doc.summary}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{doc.department}</span>
                    <span>•</span>
                    <span>{doc.time}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
