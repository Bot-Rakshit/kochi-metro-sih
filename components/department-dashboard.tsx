"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  Clock,
  AlertTriangle,
  TrendingUp,
  Wrench,
  Shield,
  Train,
  DollarSign,
  UserCheck,
  ShoppingCart,
  Scale,
  Monitor,
  HeadphonesIcon,
  Building,
  CheckCircle,
  BarChart3,
} from "lucide-react"
import { ActionItemsDashboard } from "./action-items-dashboard"

type Department =
  | "Engineering"
  | "Safety"
  | "Operations"
  | "Finance"
  | "HR"
  | "Procurement"
  | "Legal"
  | "IT"
  | "Customer Service"
  | "All"

const departmentConfig = {
  Engineering: {
    icon: Wrench,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "Track maintenance, infrastructure, and technical operations",
  },
  Safety: {
    icon: Shield,
    color: "text-red-600",
    bgColor: "bg-red-50",
    description: "Safety protocols, incident reports, and compliance",
  },
  Operations: {
    icon: Train,
    color: "text-green-600",
    bgColor: "bg-green-50",
    description: "Daily operations, scheduling, and service management",
  },
  Finance: {
    icon: DollarSign,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    description: "Financial reports, budgets, and revenue analysis",
  },
  HR: {
    icon: UserCheck,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    description: "Human resources, training, and personnel management",
  },
  Procurement: {
    icon: ShoppingCart,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    description: "Vendor management, contracts, and purchasing",
  },
  Legal: {
    icon: Scale,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    description: "Legal compliance, contracts, and regulatory affairs",
  },
  IT: {
    icon: Monitor,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    description: "Technology infrastructure and digital systems",
  },
  "Customer Service": {
    icon: HeadphonesIcon,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    description: "Passenger feedback, complaints, and service quality",
  },
  All: {
    icon: Building,
    color: "text-primary",
    bgColor: "bg-primary/5",
    description: "Organization-wide overview and cross-departmental insights",
  },
}

// mock departmentData removed; live data used instead

export function DepartmentDashboard() {
  const [selectedDepartment, setSelectedDepartment] = useState<Department>("All")
  const [viewMode, setViewMode] = useState<"overview" | "documents" | "analytics">("overview")
  const [deptDocs, setDeptDocs] = useState<any[]>([])
  const [deptLoading, setDeptLoading] = useState(false)
  const departments = (Object.keys(departmentConfig).filter((d) => d !== "All") as Department[])
  const [deptOverview, setDeptOverview] = useState<Record<string, { docs: number; pending: number }>>({})

  const currentDeptConfig = departmentConfig[selectedDepartment]
  const DeptIcon = currentDeptConfig.icon

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  useEffect(() => {
    if (selectedDepartment === "All") {
      setDeptDocs([])
      return
    }
    setDeptLoading(true)
    fetch(`/api/documents?department=${encodeURIComponent(selectedDepartment)}`)
      .then((r) => r.json())
      .then((data) => setDeptDocs(data.documents || []))
      .catch(() => setDeptDocs([]))
      .finally(() => setDeptLoading(false))
  }, [selectedDepartment])

  const totalDocs = deptDocs.length
  const urgentCount = deptDocs.filter((d) => d.summary?.priority === "urgent").length
  const highCount = deptDocs.filter((d) => d.summary?.priority === "high").length
  const pendingReview = urgentCount + highCount
  const alerts = deptDocs
    .filter((d) => ["urgent", "high"].includes(d.summary?.priority || ""))
    .slice(0, 3)

  useEffect(() => {
    const loadAll = async () => {
      try {
        const entries = await Promise.all(
          departments.map(async (dept) => {
            const res = await fetch(`/api/documents?department=${encodeURIComponent(dept)}`)
            const data = await res.json()
            const docs = data.documents || []
            const pending = docs.filter((d: any) => ["urgent", "high"].includes(d.summary?.priority || "")).length
            return [dept, { docs: docs.length, pending }] as const
          }),
        )
        setDeptOverview(Object.fromEntries(entries))
      } catch {
        setDeptOverview({})
      }
    }
    loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-6">
      {/* Department Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DeptIcon className={`h-8 w-8 ${currentDeptConfig.color}`} />
              <div>
                <CardTitle>Department Dashboard</CardTitle>
                <CardDescription>{currentDeptConfig.description}</CardDescription>
              </div>
            </div>
            <Select value={selectedDepartment} onValueChange={(value: Department) => setSelectedDepartment(value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(departmentConfig).map(([dept, config]) => {
                  const Icon = config.icon
                  return (
                    <SelectItem key={dept} value={dept}>
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${config.color}`} />
                        {dept}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Department-specific Content */}
      {selectedDepartment !== "All" && (
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Department Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalDocs.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingReview}</div>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {selectedDepartment === "Engineering"
                      ? "Active Projects"
                      : selectedDepartment === "Safety"
                        ? "Active Incidents"
                        : selectedDepartment === "Operations"
                          ? "Active Routes"
                          : "Budget Utilization"}
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{highCount}</div>
                  <p className="text-xs text-muted-foreground">Current status</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {selectedDepartment === "Engineering"
                      ? "Completion Rate"
                      : selectedDepartment === "Safety"
                        ? "Compliance Rate"
                        : selectedDepartment === "Operations"
                          ? "On-Time Performance"
                          : "Revenue Growth"}
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{urgentCount}</div>
                  <p className="text-xs text-muted-foreground">Performance metric</p>
                </CardContent>
              </Card>
            </div>

            {/* Alerts and Recent Documents */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Department Alerts
                  </CardTitle>
                  <CardDescription>Critical items requiring immediate attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {alerts.map((d) => (
                    <div key={d.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/70">
                      <p className="font-medium text-sm truncate max-w-[60ch]">{d.title || d.filename}</p>
                      <Badge
                        className={
                          d.summary?.priority === "urgent"
                            ? "bg-red-600 text-white"
                            : d.summary?.priority === "high"
                              ? "bg-orange-600 text-white"
                              : "bg-yellow-500 text-white"
                        }
                      >
                        {d.summary?.priority?.toUpperCase()}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Recent Documents
                  </CardTitle>
                  <CardDescription>Latest documents for your department</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {deptDocs.slice(0, 5).map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{doc.title || doc.filename}</h4>
                        <Badge className={getPriorityColor(doc.summary?.priority || "medium")}>
                          {doc.summary?.priority?.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{doc.summary?.summary}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{new Date(doc.createdAt).toLocaleString()}</span>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Department Documents</CardTitle>
                <CardDescription>All documents assigned to {selectedDepartment}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deptDocs.map((doc, index) => (
                    <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{doc.title}</h4>
                          <Badge className={getPriorityColor(doc.summary?.priority || "medium")}>
                            {doc.summary?.priority?.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{doc.summary?.summary}</p>
                        <div className="space-y-1">
                          <p className="text-xs font-medium">Action Items:</p>
                          {(doc.summary?.actionItems || []).map((item: string, itemIndex: number) => (
                            <div key={itemIndex} className="flex items-center gap-2 text-xs">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              {item}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">{new Date(doc.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          Process
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Document Processing Trends</CardTitle>
                  <CardDescription>Weekly document volume and processing times</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                    Chart visualization would be implemented here
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Priority Distribution</CardTitle>
                  <CardDescription>Breakdown of document priorities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Urgent</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-red-200 rounded-full">
                          <div className="w-3/4 h-2 bg-red-600 rounded-full"></div>
                        </div>
                        <span className="text-xs text-muted-foreground">15%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">High</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-orange-200 rounded-full">
                          <div className="w-1/2 h-2 bg-orange-600 rounded-full"></div>
                        </div>
                        <span className="text-xs text-muted-foreground">25%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Medium</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-yellow-200 rounded-full">
                          <div className="w-2/3 h-2 bg-yellow-600 rounded-full"></div>
                        </div>
                        <span className="text-xs text-muted-foreground">40%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Low</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-green-200 rounded-full">
                          <div className="w-1/5 h-2 bg-green-600 rounded-full"></div>
                        </div>
                        <span className="text-xs text-muted-foreground">20%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* All Departments Overview */}
      {selectedDepartment === "All" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-1">
            <ActionItemsDashboard />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:col-span-1">
            {Object.entries(departmentConfig)
              .filter(([dept]) => dept !== "All")
              .map(([dept, config]) => {
                const Icon = config.icon

                return (
                  <Card
                    key={dept}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedDepartment(dept as Department)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${config.bgColor}`}>
                          <Icon className={`h-6 w-6 ${config.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{dept}</CardTitle>
                          <CardDescription className="text-sm">{config.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Documents</p>
                          <p className="font-bold">{(deptOverview[dept]?.docs || 0).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Pending</p>
                          <p className="font-bold">{deptOverview[dept]?.pending || 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}
