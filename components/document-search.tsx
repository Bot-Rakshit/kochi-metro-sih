"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Filter,
  CalendarIcon,
  Clock,
  Building,
  Tag,
  Languages,
  SortAsc,
  SortDesc,
  X,
  History,
  Star,
  Download,
  Eye,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface SearchFilters {
  query: string
  departments: string[]
  priorities: string[]
  categories: string[]
  languages: string[]
  dateRange: {
    from?: Date
    to?: Date
  }
  sortBy: "relevance" | "date" | "priority" | "department"
  sortOrder: "asc" | "desc"
}

interface SearchResult {
  id: string
  title: string
  summary: string
  department: string
  priority: "low" | "medium" | "high" | "urgent"
  category: string
  language: string
  date: string
  relevanceScore: number
  highlights: string[]
  tags: string[]
}

const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    title: "Track Maintenance Report - Section A12",
    summary: "Routine inspection completed. Minor wear detected on rail joints requiring scheduled maintenance.",
    department: "Engineering",
    priority: "high",
    category: "maintenance",
    language: "English",
    date: "2024-12-07",
    relevanceScore: 95,
    highlights: ["track maintenance", "rail joints", "scheduled maintenance"],
    tags: ["track", "maintenance", "inspection", "rails"],
  },
  {
    id: "2",
    title: "സുരക്ഷാ നിർദ്ദേശങ്ങൾ - സ്റ്റേഷൻ കൺട്രോൾ",
    summary: "New safety protocols for station crowd management during peak hours.",
    department: "Safety",
    priority: "urgent",
    category: "safety",
    language: "Malayalam",
    date: "2024-12-07",
    relevanceScore: 88,
    highlights: ["safety protocols", "crowd management", "peak hours"],
    tags: ["safety", "crowd", "station", "protocol"],
  },
  {
    id: "3",
    title: "Quarterly Financial Review Q4 2024",
    summary: "Revenue targets exceeded by 8%. Operational costs reduced through efficiency improvements.",
    department: "Finance",
    priority: "medium",
    category: "financial",
    language: "English",
    date: "2024-12-06",
    relevanceScore: 82,
    highlights: ["revenue targets", "operational costs", "efficiency improvements"],
    tags: ["finance", "revenue", "quarterly", "review"],
  },
  {
    id: "4",
    title: "Vendor Contract Renewal - Cleaning Services",
    summary: "Annual contract renewal for station cleaning services with performance metrics review.",
    department: "Procurement",
    priority: "medium",
    category: "contract",
    language: "English",
    date: "2024-12-05",
    relevanceScore: 75,
    highlights: ["vendor contract", "cleaning services", "performance metrics"],
    tags: ["procurement", "contract", "cleaning", "vendor"],
  },
  {
    id: "5",
    title: "IT System Upgrade Proposal",
    summary: "Proposal for upgrading legacy IT infrastructure to support digital transformation initiatives.",
    department: "IT",
    priority: "high",
    category: "technical",
    language: "English",
    date: "2024-12-04",
    relevanceScore: 70,
    highlights: ["IT system upgrade", "legacy infrastructure", "digital transformation"],
    tags: ["IT", "upgrade", "infrastructure", "digital"],
  },
]

const departments = [
  "Engineering",
  "Safety",
  "Operations",
  "Finance",
  "HR",
  "Procurement",
  "Legal",
  "IT",
  "Customer Service",
]
const priorities = ["low", "medium", "high", "urgent"]
const categories = [
  "maintenance",
  "safety",
  "financial",
  "operational",
  "administrative",
  "technical",
  "compliance",
  "contract",
]
const languages = ["English", "Malayalam"]

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

export function DocumentSearch() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    departments: [],
    priorities: [],
    categories: [],
    languages: [],
    dateRange: {},
    sortBy: "relevance",
    sortOrder: "desc",
  })

  const [searchHistory, setSearchHistory] = useState<string[]>([
    "track maintenance",
    "safety protocols",
    "financial report",
    "vendor contracts",
  ])

  const [savedSearches, setSavedSearches] = useState<string[]>([
    "Urgent safety documents",
    "Engineering maintenance reports",
    "Financial quarterly reviews",
  ])

  const [showFilters, setShowFilters] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  // Filter and sort results
  const filteredResults = useMemo(() => {
    let results = mockSearchResults

    // Text search
    if (filters.query) {
      results = results.filter(
        (doc) =>
          doc.title.toLowerCase().includes(filters.query.toLowerCase()) ||
          doc.summary.toLowerCase().includes(filters.query.toLowerCase()) ||
          doc.tags.some((tag) => tag.toLowerCase().includes(filters.query.toLowerCase())),
      )
    }

    // Department filter
    if (filters.departments.length > 0) {
      results = results.filter((doc) => filters.departments.includes(doc.department))
    }

    // Priority filter
    if (filters.priorities.length > 0) {
      results = results.filter((doc) => filters.priorities.includes(doc.priority))
    }

    // Category filter
    if (filters.categories.length > 0) {
      results = results.filter((doc) => filters.categories.includes(doc.category))
    }

    // Language filter
    if (filters.languages.length > 0) {
      results = results.filter((doc) => filters.languages.includes(doc.language))
    }

    // Date range filter
    if (filters.dateRange.from || filters.dateRange.to) {
      results = results.filter((doc) => {
        const docDate = new Date(doc.date)
        const fromDate = filters.dateRange.from
        const toDate = filters.dateRange.to

        if (fromDate && toDate) {
          return docDate >= fromDate && docDate <= toDate
        } else if (fromDate) {
          return docDate >= fromDate
        } else if (toDate) {
          return docDate <= toDate
        }
        return true
      })
    }

    // Sort results
    results.sort((a, b) => {
      let comparison = 0

      switch (filters.sortBy) {
        case "relevance":
          comparison = b.relevanceScore - a.relevanceScore
          break
        case "date":
          comparison = new Date(b.date).getTime() - new Date(a.date).getTime()
          break
        case "priority":
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority]
          break
        case "department":
          comparison = a.department.localeCompare(b.department)
          break
      }

      return filters.sortOrder === "asc" ? -comparison : comparison
    })

    return results
  }, [filters])

  const handleSearch = async (query: string) => {
    if (!query.trim()) return

    setIsSearching(true)

    // Add to search history
    if (!searchHistory.includes(query)) {
      setSearchHistory((prev) => [query, ...prev.slice(0, 9)])
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSearching(false)
  }

  const clearFilters = () => {
    setFilters({
      query: "",
      departments: [],
      priorities: [],
      categories: [],
      languages: [],
      dateRange: {},
      sortBy: "relevance",
      sortOrder: "desc",
    })
  }

  const activeFilterCount =
    filters.departments.length +
    filters.priorities.length +
    filters.categories.length +
    filters.languages.length +
    (filters.dateRange.from || filters.dateRange.to ? 1 : 0)

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Document Search
          </CardTitle>
          <CardDescription>
            Search across all KMRL documents with advanced filtering and AI-powered relevance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents, summaries, or keywords..."
                value={filters.query}
                onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(filters.query)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => handleSearch(filters.query)} disabled={isSearching}>
              {isSearching ? "Searching..." : "Search"}
            </Button>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Recent:</span>
              {searchHistory.slice(0, 3).map((term, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters((prev) => ({ ...prev, query: term }))}
                  className="h-6 px-2 text-xs"
                >
                  {term}
                </Button>
              ))}
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Saved:</span>
              {savedSearches.slice(0, 2).map((search, index) => (
                <Button key={index} variant="ghost" size="sm" className="h-6 px-2 text-xs">
                  {search}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Advanced Filters</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList>
                <TabsTrigger value="basic">Basic Filters</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
                <TabsTrigger value="date">Date Range</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Department Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Department
                    </label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {departments.map((dept) => (
                        <div key={dept} className="flex items-center space-x-2">
                          <Checkbox
                            id={`dept-${dept}`}
                            checked={filters.departments.includes(dept)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFilters((prev) => ({
                                  ...prev,
                                  departments: [...prev.departments, dept],
                                }))
                              } else {
                                setFilters((prev) => ({
                                  ...prev,
                                  departments: prev.departments.filter((d) => d !== dept),
                                }))
                              }
                            }}
                          />
                          <label htmlFor={`dept-${dept}`} className="text-sm">
                            {dept}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Priority Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <div className="space-y-2">
                      {priorities.map((priority) => (
                        <div key={priority} className="flex items-center space-x-2">
                          <Checkbox
                            id={`priority-${priority}`}
                            checked={filters.priorities.includes(priority)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFilters((prev) => ({
                                  ...prev,
                                  priorities: [...prev.priorities, priority],
                                }))
                              } else {
                                setFilters((prev) => ({
                                  ...prev,
                                  priorities: prev.priorities.filter((p) => p !== priority),
                                }))
                              }
                            }}
                          />
                          <label htmlFor={`priority-${priority}`} className="text-sm capitalize">
                            {priority}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Category
                    </label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`cat-${category}`}
                            checked={filters.categories.includes(category)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFilters((prev) => ({
                                  ...prev,
                                  categories: [...prev.categories, category],
                                }))
                              } else {
                                setFilters((prev) => ({
                                  ...prev,
                                  categories: prev.categories.filter((c) => c !== category),
                                }))
                              }
                            }}
                          />
                          <label htmlFor={`cat-${category}`} className="text-sm capitalize">
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Language Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Languages className="h-4 w-4" />
                      Language
                    </label>
                    <div className="space-y-2">
                      {languages.map((language) => (
                        <div key={language} className="flex items-center space-x-2">
                          <Checkbox
                            id={`lang-${language}`}
                            checked={filters.languages.includes(language)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFilters((prev) => ({
                                  ...prev,
                                  languages: [...prev.languages, language],
                                }))
                              } else {
                                setFilters((prev) => ({
                                  ...prev,
                                  languages: prev.languages.filter((l) => l !== language),
                                }))
                              }
                            }}
                          />
                          <label htmlFor={`lang-${language}`} className="text-sm">
                            {language}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sort By</label>
                    <Select
                      value={filters.sortBy}
                      onValueChange={(value: "relevance" | "date" | "priority" | "department") =>
                        setFilters((prev) => ({ ...prev, sortBy: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                        <SelectItem value="department">Department</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sort Order</label>
                    <Select
                      value={filters.sortOrder}
                      onValueChange={(value: "asc" | "desc") => setFilters((prev) => ({ ...prev, sortOrder: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desc">
                          <div className="flex items-center gap-2">
                            <SortDesc className="h-4 w-4" />
                            Descending
                          </div>
                        </SelectItem>
                        <SelectItem value="asc">
                          <div className="flex items-center gap-2">
                            <SortAsc className="h-4 w-4" />
                            Ascending
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="date" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">From Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !filters.dateRange.from && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.dateRange.from ? format(filters.dateRange.from, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.dateRange.from}
                          onSelect={(date) =>
                            setFilters((prev) => ({
                              ...prev,
                              dateRange: { ...prev.dateRange, from: date },
                            }))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">To Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !filters.dateRange.to && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.dateRange.to ? format(filters.dateRange.to, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.dateRange.to}
                          onSelect={(date) =>
                            setFilters((prev) => ({
                              ...prev,
                              dateRange: { ...prev.dateRange, to: date },
                            }))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                Found {filteredResults.length} documents
                {filters.query && ` for "${filters.query}"`}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredResults.map((result) => (
              <div key={result.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{result.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {result.language}
                      </Badge>
                      <Badge className={getPriorityColor(result.priority)}>{result.priority.toUpperCase()}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{result.summary}</p>

                    {/* Highlights */}
                    {result.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {result.highlights.map((highlight, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {result.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {result.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(result.date), "MMM d, yyyy")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Search className="h-3 w-3" />
                        {result.relevanceScore}% match
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {result.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}

            {filteredResults.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No documents found</p>
                <p className="text-sm">Try adjusting your search terms or filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
