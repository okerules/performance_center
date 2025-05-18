"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Download } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/star-rating"
import { Unbounded } from "next/font/google"

// Initialize the Unbounded font
const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
})

// Mock data structure with portfolio managers
const assetCategories = [
  {
    id: 1,
    name: "Equity",
    expanded: true,
    funds: [
      {
        id: 101,
        name: "Growth Fund",
        number: "ABCDE",
        portfolioManagers: ["John Smith", "Emily Williams"],
        morningStar: {
          category: "Large Growth",
          rating: 4,
        },
        expense: {
          gross: 0.85,
          net: 0.75,
        },
        returns: {
          ytd: 12.45,
          year1: 15.32,
          year3: 10.21,
          year5: 9.87,
          year10: 8.92,
          sinceInception: 11.23,
        },
      },
      {
        id: 102,
        name: "Value Fund",
        number: "FGHIJ",
        portfolioManagers: ["Jane Doe"],
        morningStar: {
          category: "Large Value",
          rating: 5,
        },
        expense: {
          gross: 0.92,
          net: 0.82,
        },
        returns: {
          ytd: 8.75,
          year1: 11.42,
          year3: 8.91,
          year5: 7.65,
          year10: 7.12,
          sinceInception: 9.87,
        },
      },
    ],
  },
  {
    id: 2,
    name: "Fixed Income",
    expanded: true,
    funds: [
      {
        id: 201,
        name: "Bond Fund",
        number: "KLMNO",
        portfolioManagers: ["Robert Johnson", "Jane Doe"],
        morningStar: {
          category: "Intermediate Core Bond",
          rating: 3,
        },
        expense: {
          gross: 0.65,
          net: 0.55,
        },
        returns: {
          ytd: 3.25,
          year1: 4.12,
          year3: 3.91,
          year5: 3.65,
          year10: 3.42,
          sinceInception: 4.87,
        },
      },
      {
        id: 202,
        name: "High Yield Fund",
        number: "PQRST",
        portfolioManagers: ["Robert Johnson"],
        morningStar: {
          category: "High Yield Bond",
          rating: 4,
        },
        expense: {
          gross: 0.78,
          net: 0.68,
        },
        returns: {
          ytd: 5.75,
          year1: 7.42,
          year3: 6.21,
          year5: 5.87,
          year10: 5.32,
          sinceInception: 6.93,
        },
      },
    ],
  },
  {
    id: 3,
    name: "Alternative",
    expanded: true,
    funds: [
      {
        id: 301,
        name: "Real Estate Fund",
        number: "UVWXY",
        portfolioManagers: ["Emily Williams"],
        morningStar: {
          category: "Real Estate",
          rating: 4,
        },
        expense: {
          gross: 0.95,
          net: 0.85,
        },
        returns: {
          ytd: 7.25,
          year1: 9.12,
          year3: 7.91,
          year5: 7.15,
          year10: 6.82,
          sinceInception: 8.37,
        },
      },
      {
        id: 302,
        name: "Commodities Fund",
        number: "ZABCD",
        portfolioManagers: ["John Smith", "Robert Johnson"],
        morningStar: {
          category: "Commodities",
          rating: 3,
        },
        expense: {
          gross: 0.98,
          net: 0.88,
        },
        returns: {
          ytd: 4.75,
          year1: 6.42,
          year3: 5.21,
          year5: 4.87,
          year10: 4.32,
          sinceInception: 5.93,
        },
      },
    ],
  },
]

// Filter options
const assetCategoryOptions = ["All", "Equity", "Fixed Income", "Alternative"]
const morningstarCategoryOptions = [
  "All",
  "Large Growth",
  "Large Value",
  "Intermediate Core Bond",
  "High Yield Bond",
  "Real Estate",
  "Commodities",
]
const portfolioManagerOptions = ["All", "John Smith", "Jane Doe", "Robert Johnson", "Emily Williams"]

export default function PerformanceCenter() {
  const [categories, setCategories] = useState(assetCategories)
  const [filteredCategories, setFilteredCategories] = useState(assetCategories)
  const [assetCategoryFilter, setAssetCategoryFilter] = useState("All")
  const [morningstarCategoryFilter, setMorningstarCategoryFilter] = useState("All")
  const [morningstarRatingFilter, setMorningstarRatingFilter] = useState("all")
  const [portfolioManagerFilter, setPortfolioManagerFilter] = useState("All")

  // Table visibility state
  const [showStandardized, setShowStandardized] = useState(true)
  const [showNonStandardized, setShowNonStandardized] = useState(true)

  useEffect(() => {
    // Apply filters
    let result = [...assetCategories]

    // Filter by asset category
    if (assetCategoryFilter !== "All") {
      result = result.filter((category) => category.name === assetCategoryFilter)
    }

    // Filter funds within each category
    result = result.map((category) => {
      let filteredFunds = [...category.funds]

      // Filter by Morningstar category
      if (morningstarCategoryFilter !== "All") {
        filteredFunds = filteredFunds.filter((fund) => fund.morningStar.category === morningstarCategoryFilter)
      }

      // Filter by Morningstar rating
      if (morningstarRatingFilter !== "all") {
        const minRating = Number.parseInt(morningstarRatingFilter.replace("+", ""))
        filteredFunds = filteredFunds.filter((fund) => fund.morningStar.rating >= minRating)
      }

      // Filter by portfolio manager
      if (portfolioManagerFilter !== "All") {
        filteredFunds = filteredFunds.filter((fund) => fund.portfolioManagers.includes(portfolioManagerFilter))
      }

      // Return category with filtered funds
      return {
        ...category,
        funds: filteredFunds,
      }
    })

    // Remove empty categories (those with no funds after filtering)
    result = result.filter((category) => category.funds.length > 0)

    setFilteredCategories(result)
  }, [assetCategoryFilter, morningstarCategoryFilter, morningstarRatingFilter, portfolioManagerFilter])

  const toggleCategory = (categoryId: number) => {
    setCategories(
      categories.map((category) =>
        category.id === categoryId ? { ...category, expanded: !category.expanded } : category,
      ),
    )

    // Also update the filtered categories to maintain the expanded state
    setFilteredCategories(
      filteredCategories.map((category) =>
        category.id === categoryId ? { ...category, expanded: !category.expanded } : category,
      ),
    )
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  // Function to generate CSV data from the filtered categories
  const generateCSV = () => {
    // Define headers
    const headers = [
      "Asset Category",
      "Fund Name",
      "Fund Number",
      "Morningstar Category",
      "Morningstar Rating",
      "Gross Expense Ratio",
      "Net Expense Ratio",
      "YTD Return",
      "1-Year Return",
      "3-Year Return",
      "5-Year Return",
      "10-Year Return",
      "Since Inception Return",
      "Portfolio Managers",
    ]

    // Create CSV rows
    let csvContent = headers.join(",") + "\n"

    // Add data rows
    filteredCategories.forEach((category) => {
      category.funds.forEach((fund) => {
        const row = [
          category.name,
          fund.name,
          fund.number,
          fund.morningStar.category,
          fund.morningStar.rating,
          fund.expense.gross.toFixed(2) + "%",
          fund.expense.net.toFixed(2) + "%",
          fund.returns.ytd.toFixed(2) + "%",
          fund.returns.year1.toFixed(2) + "%",
          fund.returns.year3.toFixed(2) + "%",
          fund.returns.year5.toFixed(2) + "%",
          fund.returns.year10.toFixed(2) + "%",
          fund.returns.sinceInception.toFixed(2) + "%",
          fund.portfolioManagers.join("; "),
        ]

        // Escape any commas in the data
        const escapedRow = row.map((field) => {
          // If the field contains a comma, quote it
          if (field.includes(",")) {
            return `"${field}"`
          }
          return field
        })

        csvContent += escapedRow.join(",") + "\n"
      })
    })

    return csvContent
  }

  // Function to download CSV
  const downloadCSV = () => {
    const csv = generateCSV()
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "performance_data.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Function to render a performance table
  const renderPerformanceTable = (isStandardized: boolean) => {
    return (
      <div className="overflow-x-auto mb-8">
        <h2 className="text-xl font-semibold mb-3">
          {isStandardized ? "Standardized Returns" : "Non-Standardized Returns"}
        </h2>
        <Table className="border">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[250px]">Sub-Account</TableHead>
              <TableHead>Morningstar Category</TableHead>
              <TableHead>Morningstar Rating</TableHead>
              <TableHead>
                <div>Expense Ratio</div>
                <div className="flex text-xs font-normal">
                  <span className="w-1/2">Gross</span>
                  <span className="w-1/2">Net</span>
                </div>
              </TableHead>
              <TableHead>YTD Return</TableHead>
              <TableHead>1-Year</TableHead>
              <TableHead className="hidden md:table-cell">3-Year</TableHead>
              <TableHead className="hidden md:table-cell">5-Year</TableHead>
              <TableHead className="hidden lg:table-cell">10-Year</TableHead>
              <TableHead className="hidden lg:table-cell">Since Inception</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((category) => (
              <>
                <TableRow
                  key={category.id}
                  className="bg-muted/20 cursor-pointer hover:bg-muted/30"
                  onClick={() => toggleCategory(category.id)}
                >
                  <TableCell colSpan={10} className="font-medium">
                    <div className="flex items-center">
                      {category.expanded ? (
                        <ChevronUp className="mr-2 h-4 w-4" />
                      ) : (
                        <ChevronDown className="mr-2 h-4 w-4" />
                      )}
                      {category.name} ({category.funds.length})
                    </div>
                  </TableCell>
                </TableRow>
                {category.expanded &&
                  category.funds.map((fund) => (
                    <TableRow key={fund.id}>
                      <TableCell>
                        <div className="font-medium">{fund.name}</div>
                        <div className="text-xs text-muted-foreground">{fund.number}</div>
                      </TableCell>
                      <TableCell>{fund.morningStar.category}</TableCell>
                      <TableCell>
                        <StarRating rating={fund.morningStar.rating} />
                      </TableCell>
                      <TableCell>
                        <div className="flex text-sm">
                          <span className="w-1/2">{fund.expense.gross}%</span>
                          <span className="w-1/2">{fund.expense.net}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatPercent(fund.returns.ytd)}</TableCell>
                      <TableCell>{formatPercent(fund.returns.year1)}</TableCell>
                      <TableCell className="hidden md:table-cell">{formatPercent(fund.returns.year3)}</TableCell>
                      <TableCell className="hidden md:table-cell">{formatPercent(fund.returns.year5)}</TableCell>
                      <TableCell className="hidden lg:table-cell">{formatPercent(fund.returns.year10)}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {formatPercent(fund.returns.sinceInception)}
                      </TableCell>
                    </TableRow>
                  ))}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="w-full mb-8 py-6 px-4 bg-[#1158c9] rounded-md">
        <h1 className={`text-3xl font-bold text-[#f06d22] text-center md:text-left ${unbounded.className}`}>
          Performance Center
        </h1>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="asset-category">Asset Category</Label>
              <Select defaultValue="All" onValueChange={(value) => setAssetCategoryFilter(value)}>
                <SelectTrigger id="asset-category">
                  <SelectValue placeholder="Select Asset Category" />
                </SelectTrigger>
                <SelectContent>
                  {assetCategoryOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="morningstar-category">Morningstar Categories</Label>
              <Select defaultValue="All" onValueChange={(value) => setMorningstarCategoryFilter(value)}>
                <SelectTrigger id="morningstar-category">
                  <SelectValue placeholder="Select Morningstar Category" />
                </SelectTrigger>
                <SelectContent>
                  {morningstarCategoryOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex flex-col">
              <Label className="mb-2">Morningstar Ratings</Label>
              <div className="h-10 flex items-center">
                <RadioGroup
                  defaultValue="all"
                  className="flex space-x-4"
                  onValueChange={(value) => setMorningstarRatingFilter(value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5" id="5-stars" />
                    <Label htmlFor="5-stars">5 stars</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4" id="4-plus-stars" />
                    <Label htmlFor="4-plus-stars">4+ stars</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="3-plus-stars" />
                    <Label htmlFor="3-plus-stars">3+ stars</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio-manager">Portfolio Managers</Label>
              <Select defaultValue="All" onValueChange={(value) => setPortfolioManagerFilter(value)}>
                <SelectTrigger id="portfolio-manager">
                  <SelectValue placeholder="Select Portfolio Manager" />
                </SelectTrigger>
                <SelectContent>
                  {portfolioManagerOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Type Filter and Export Button */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium mb-2">Return Type</h3>
          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="standardized"
                checked={showStandardized}
                onCheckedChange={(checked) => setShowStandardized(checked as boolean)}
              />
              <Label htmlFor="standardized">Standardized</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="non-standardized"
                checked={showNonStandardized}
                onCheckedChange={(checked) => setShowNonStandardized(checked as boolean)}
              />
              <Label htmlFor="non-standardized">Non-Standardized</Label>
            </div>
          </div>
        </div>
        <div>
          <Button onClick={downloadCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Performance Tables */}
      {showStandardized && renderPerformanceTable(true)}
      {showNonStandardized && renderPerformanceTable(false)}

      <div className="mt-4 text-sm text-muted-foreground">
        <p>Performance data as of 04/30/2025. Past performance is not a guarantee of future results.</p>
      </div>
    </div>
  )
}
