import { DepartmentDashboard } from "@/components/department-dashboard"
import { Header } from "@/components/header"

export default function DepartmentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-balance">Department Dashboards</h1>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Customized views and analytics for each KMRL department with role-based document management
            </p>
          </div>
          <DepartmentDashboard />
        </div>
      </main>
    </div>
  )
}
