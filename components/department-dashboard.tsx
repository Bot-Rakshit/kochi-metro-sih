"use client"

import { useState } from "react"
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

const departmentData = {
  Engineering: {
    stats: {
      totalDocs: 1247,
      pendingReview: 23,
      activeProjects: 8,
      completionRate: 94,
    },
    recentDocs: [
      {
        title: "Track Inspection Report - Line 1 Section A",
        priority: "high" as const,
        time: "15 minutes ago",
        summary: "Routine inspection identified minor rail wear requiring maintenance within 30 days.",
        actionItems: ["Schedule maintenance crew", "Order replacement materials"],
      },
      {
        title: "Signal System Upgrade Proposal",
        priority: "medium" as const,
        time: "2 hours ago",
        summary: "Technical specifications for upgrading legacy signaling systems to modern CBTC.",
        actionItems: ["Review technical specs", "Budget approval required"],
      },
      {
        title: "Rolling Stock Maintenance Schedule Q1",
        priority: "low" as const,
        time: "1 day ago",
        summary: "Quarterly maintenance schedule for all metro trains and equipment.",
        actionItems: ["Coordinate with operations", "Resource allocation"],
      },
    ],
    alerts: [
      { message: "Critical track maintenance due in 5 days", type: "urgent" as const },
      { message: "Equipment inspection overdue", type: "high" as const },
    ],
  },
  Safety: {
    stats: {
      totalDocs: 892,
      pendingReview: 45,
      activeIncidents: 3,
      complianceRate: 98,
    },
    recentDocs: [
      {
        title: "സുരക്ഷാ പ്രോട്ടോക്കോൾ അപ്ഡേറ്റ് - പ്ലാറ്റ്ഫോം സുരക്ഷ",
        priority: "urgent" as const,
        time: "30 minutes ago",
        summary: "Updated platform safety protocols for peak hour crowd management.",
        actionItems: ["Train station staff", "Update safety signage"],
      },
      {
        title: "Incident Report - Minor Passenger Injury",
        priority: "high" as const,
        time: "3 hours ago",
        summary: "Passenger slip incident at Aluva station, investigation completed.",
        actionItems: ["File regulatory report", "Review platform conditions"],
      },
    ],
    alerts: [
      { message: "Safety audit scheduled for next week", type: "medium" as const },
      { message: "Emergency drill compliance pending", type: "high" as const },
    ],
  },
  Operations: {
    stats: {
      totalDocs: 2156,
      pendingReview: 67,
      activeRoutes: 25,
      onTimePerformance: 96,
    },
    recentDocs: [
      {
        title: "Daily Operations Report - Peak Hour Analysis",
        priority: "medium" as const,
        time: "1 hour ago",
        summary: "Analysis of morning peak hour performance and passenger flow patterns.",
        actionItems: ["Adjust train frequency", "Monitor crowd levels"],
      },
      {
        title: "Service Disruption Protocol Update",
        priority: "high" as const,
        time: "4 hours ago",
        summary: "Updated procedures for handling service disruptions and passenger communication.",
        actionItems: ["Train control room staff", "Update passenger apps"],
      },
    ],
    alerts: [
      { message: "Peak hour capacity at 95%", type: "medium" as const },
      { message: "Weather advisory for tomorrow", type: "low" as const },
    ],
  },
  Finance: {
    stats: {
      totalDocs: 743,
      pendingReview: 12,
      budgetUtilization: 87,
      revenueGrowth: 8,
    },
    recentDocs: [
      {
        title: "Q4 2024 Financial Performance Report",
        priority: "high" as const,
        time: "2 hours ago",
        summary: "Quarterly financial analysis showing 8% revenue growth and cost optimization.",
        actionItems: ["Board presentation", "Budget planning for Q1"],
      },
      {
        title: "Vendor Payment Authorization - Track Maintenance",
        priority: "medium" as const,
        time: "5 hours ago",
        summary: "Payment approval for completed track maintenance work by contractor.",
        actionItems: ["Verify work completion", "Process payment"],
      },
    ],
    alerts: [
      { message: "Budget review meeting tomorrow", type: "medium" as const },
      { message: "Audit preparation required", type: "low" as const },
    ],
  },
}

export function DepartmentDashboard() {
  const [selectedDepartment, setSelectedDepartment] = useState<Department>("All")
  const [viewMode, setViewMode] = useState<"overview" | "documents" | "analytics">("overview")

  const currentDeptConfig = departmentConfig[selectedDepartment]
  const currentDeptData = departmentData[selectedDepartment as keyof typeof departmentData]
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
      {selectedDepartment !== "All" && currentDeptData && (
        <Tabs value={viewMode} onValueChange={(value: "overview" | "documents" | "analytics") => setViewMode(value)}>
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
                  <div className="text-2xl font-bold">{currentDeptData.stats.totalDocs.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentDeptData.stats.pendingReview}</div>
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
                  <div className="text-2xl font-bold">
                    {selectedDepartment === "Finance"
                      ? `${Object.values(currentDeptData.stats)[2]}%`
                      : Object.values(currentDeptData.stats)[2]}
                  </div>
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
                  <div className="text-2xl font-bold">{Object.values(currentDeptData.stats)[3]}%</div>
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
                  {currentDeptData.alerts.map((alert, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        alert.type === "urgent"
                          ? "bg-red-50 border border-red-200"
                          : alert.type === "high"
                            ? "bg-orange-50 border border-orange-200"
                            : "bg-yellow-50 border border-yellow-200"
                      }`}
                    >
                      <p className="font-medium text-sm">{alert.message}</p>
                      <Badge className={getPriorityColor(alert.type)}>{alert.type.toUpperCase()}</Badge>
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
                  {currentDeptData.recentDocs.slice(0, 2).map((doc, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{doc.title}</h4>
                        <Badge className={getPriorityColor(doc.priority)}>{doc.priority.toUpperCase()}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{doc.summary}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{doc.time}</span>
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
                  {currentDeptData.recentDocs.map((doc, index) => (
                    <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{doc.title}</h4>
                          <Badge className={getPriorityColor(doc.priority)}>{doc.priority.toUpperCase()}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{doc.summary}</p>
                        <div className="space-y-1">
                          <p className="text-xs font-medium">Action Items:</p>
                          {doc.actionItems.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center gap-2 text-xs">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              {item}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">{doc.time}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(departmentConfig)
            .filter(([dept]) => dept !== "All")
            .map(([dept, config]) => {
              const Icon = config.icon
              const deptData = departmentData[dept as keyof typeof departmentData]

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
                  {deptData && (
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Documents</p>
                          <p className="font-bold">{deptData.stats.totalDocs.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Pending</p>
                          <p className="font-bold">{deptData.stats.pendingReview}</p>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              )
            })}
        </div>
      )}
    </div>
  )
}
