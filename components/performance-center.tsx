"use client"

import type React from "react"

import { useState, useEffect, Fragment } from "react"
import { ChevronDown, ChevronUp, Download, Filter, X, ArrowUp, ArrowDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/star-rating"
import { Unbounded } from "next/font/google"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

// Initialize the Unbounded font
const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
})

// Define sort types for different columns
type SortColumn =
  | "name"
  | "category"
  | "rating"
  | "expenseGross"
  | "expenseNet"
  | "ytd"
  | "year1"
  | "year3"
  | "year5"
  | "year10"
  | "sinceInception"

// Update the SortDirection type to include "none"
type SortDirection = "asc" | "desc" | "none"

// Mock data structure for footnotes that would come from a CMS
const footnotes = [
  {
    id: 1,
    text: "Performance shown for periods prior to the inception date of a specific fund is the performance of an older share class of the fund and has been adjusted to reflect the fees and expenses of the newer share class.",
  },
  {
    id: 2,
    text: "The fund's investment adviser has contractually agreed to waive fees and/or reimburse expenses through April 30, 2026.",
  },
  {
    id: 3,
    text: "This fund invests in securities that may be affected by market risk, interest rate risk, and credit risk. Returns may be lower due to these risks.",
  },
  {
    id: 4,
    text: "The fund is subject to special risks including volatility due to investments in small and mid-size companies and foreign securities.",
  },
  {
    id: 5,
    text: "A portion of the fund's income may be subject to federal or state income taxes or the alternative minimum tax.",
  },
]

// Mock data for disclaimer that would come from a CMS
const disclaimer = {
  text: "The information contained herein: (1) is proprietary to the company and/or its content providers; (2) may not be copied or distributed; and (3) is not warranted to be accurate, complete or timely. Neither the company nor its content providers are responsible for any damages or losses arising from any use of this information. Past performance is no guarantee of future results. Investment returns and principal value will fluctuate so that shares, when redeemed, may be worth more or less than their original cost. Current performance may be lower or higher than the performance data quoted. Please visit our website for standardized performance information and to obtain a prospectus.",
}

// Mock data structure with portfolio managers, separate standardized/non-standardized returns, and footnotes
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
        footnotes: [1, 4], // References to footnote IDs
        portfolioManagers: ["John Smith", "Emily Williams"],
        morningStar: {
          category: "Large Growth",
          rating: 4,
        },
        expense: {
          gross: 0.85,
          net: 0.75,
        },
        surrenderCharges: {
          year1: 5.0,
          year3: 4.0,
          year5: 3.0,
          year7: 2.0,
          year9: 1.0,
        },
        standardizedReturns: {
          ytd: 11.25,
          year1: 13.82,
          year3: 9.11,
          year5: 8.97,
          year10: 8.12,
          sinceInception: 10.33,
        },
        nonStandardizedReturns: {
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
        footnotes: [2, 5], // References to footnote IDs
        portfolioManagers: ["Jane Doe"],
        morningStar: {
          category: "Large Value",
          rating: 5,
        },
        expense: {
          gross: 0.92,
          net: 0.82,
        },
        surrenderCharges: {
          year1: 5.0,
          year3: 4.0,
          year5: 3.0,
          year7: 2.0,
          year9: 1.0,
        },
        standardizedReturns: {
          ytd: 7.85,
          year1: 10.12,
          year3: 7.91,
          year5: 6.85,
          year10: 6.42,
          sinceInception: 9.07,
        },
        nonStandardizedReturns: {
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
        footnotes: [3], // References to footnote IDs
        portfolioManagers: ["Robert Johnson", "Jane Doe"],
        morningStar: {
          category: "Intermediate Core Bond",
          rating: 3,
        },
        expense: {
          gross: 0.65,
          net: 0.55,
        },
        surrenderCharges: {
          year1: 4.0,
          year3: 3.0,
          year5: 2.0,
          year7: 1.0,
          year9: 0.5,
        },
        standardizedReturns: {
          ytd: 2.75,
          year1: 3.42,
          year3: 3.31,
          year5: 3.15,
          year10: 2.92,
          sinceInception: 4.27,
        },
        nonStandardizedReturns: {
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
        footnotes: [2, 3], // References to footnote IDs
        portfolioManagers: ["Robert Johnson"],
        morningStar: {
          category: "High Yield Bond",
          rating: 4,
        },
        expense: {
          gross: 0.78,
          net: 0.68,
        },
        surrenderCharges: {
          year1: 4.0,
          year3: 3.0,
          year5: 2.0,
          year7: 1.0,
          year9: 0.5,
        },
        standardizedReturns: {
          ytd: 4.95,
          year1: 6.52,
          year3: 5.41,
          year5: 5.17,
          year10: 4.72,
          sinceInception: 5.33,
        },
        nonStandardizedReturns: {
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
        footnotes: [1, 4, 5], // References to footnote IDs
        portfolioManagers: ["Emily Williams"],
        morningStar: {
          category: "Real Estate",
          rating: 4,
        },
        expense: {
          gross: 0.95,
          net: 0.85,
        },
        surrenderCharges: {
          year1: 5.5,
          year3: 4.5,
          year5: 3.5,
          year7: 2.5,
          year9: 1.5,
        },
        standardizedReturns: {
          ytd: 6.35,
          year1: 8.02,
          year3: 7.01,
          year5: 6.35,
          year10: 6.12,
          sinceInception: 7.57,
        },
        nonStandardizedReturns: {
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
        footnotes: [3, 4], // References to footnote IDs
        portfolioManagers: ["John Smith", "Robert Johnson"],
        morningStar: {
          category: "Commodities",
          rating: 3,
        },
        expense: {
          gross: 0.98,
          net: 0.88,
        },
        surrenderCharges: {
          year1: 5.5,
          year3: 4.5,
          year5: 3.5,
          year7: 2.5,
          year9: 1.5,
        },
        standardizedReturns: {
          ytd: 3.95,
          year1: 5.52,
          year3: 4.41,
          year5: 4.17,
          year10: 3.72,
          sinceInception: 5.13,
        },
        nonStandardizedReturns: {
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

// Type for flattened fund data for easier sorting
interface FlattenedFund {
  id: number
  categoryId: number
  categoryName: string
  name: string
  number: string
  footnotes?: number[]
  portfolioManagers: string[]
  category: string
  rating: number
  expenseGross: number
  expenseNet: number
  ytd: number
  year1: number
  year3: number
  year5: number
  year10: number
  sinceInception: number
}

export default function PerformanceCenter() {
  const [categories, setCategories] = useState(assetCategories)
  const [filteredCategories, setFilteredCategories] = useState(assetCategories)
  const [assetCategoryFilter, setAssetCategoryFilter] = useState("All")
  const [morningstarCategoryFilter, setMorningstarCategoryFilter] = useState("All")
  const [morningstarRatingFilter, setMorningstarRatingFilter] = useState("all")
  const [portfolioManagerFilter, setPortfolioManagerFilter] = useState("All")
  const [showFilters, setShowFilters] = useState(false)

  // Table visibility state
  const [showStandardized, setShowStandardized] = useState(true)
  const [showNonStandardized, setShowNonStandardized] = useState(true)

  // Sorting state
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [standardizedSortColumn, setStandardizedSortColumn] = useState<SortColumn | null>(null)
  const [standardizedSortDirection, setStandardizedSortDirection] = useState<SortDirection>("asc")
  const [nonStandardizedSortColumn, setNonStandardizedSortColumn] = useState<SortColumn | null>(null)
  const [nonStandardizedSortDirection, setNonStandardizedSortDirection] = useState<SortDirection>("asc")

  // Track which footnotes are actually used in the filtered data
  const [activeFootnotes, setActiveFootnotes] = useState<number[]>([])

  // Use media query hook instead of direct window access
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Check if any filters are active
  const hasActiveFilters =
    assetCategoryFilter !== "All" ||
    morningstarCategoryFilter !== "All" ||
    morningstarRatingFilter !== "all" ||
    portfolioManagerFilter !== "All"

  // Reset all filters
  const resetFilters = () => {
    setAssetCategoryFilter("All")
    setMorningstarCategoryFilter("All")
    setMorningstarRatingFilter("all")
    setPortfolioManagerFilter("All")
  }

  // Update the handleSort function to implement three-state sorting
  const handleSort = (column: SortColumn, isStandardized: boolean) => {
    // Determine which sort state to update based on table type
    const currentSortColumn = isStandardized ? standardizedSortColumn : nonStandardizedSortColumn
    const currentSortDirection = isStandardized ? standardizedSortDirection : nonStandardizedSortDirection

    // Implement three-state sorting logic
    let newDirection: SortDirection = "asc"
    if (currentSortColumn === column) {
      if (currentSortDirection === "asc") {
        newDirection = "desc"
      } else if (currentSortDirection === "desc") {
        newDirection = "none"
      } else {
        newDirection = "asc"
      }
    }

    // Update the appropriate sort state
    if (isStandardized) {
      setStandardizedSortColumn(newDirection === "none" ? null : column)
      setStandardizedSortDirection(newDirection)
    } else {
      setNonStandardizedSortColumn(newDirection === "none" ? null : column)
      setNonStandardizedSortDirection(newDirection)
    }
  }

  // Function to flatten and sort funds
  const getSortedFunds = (
    categories: typeof assetCategories,
    column: SortColumn | null,
    direction: SortDirection,
    isStandardized: boolean,
  ): FlattenedFund[] => {
    // If no sort column is selected, return the original order
    if (!column) {
      return categories.flatMap((category) =>
        category.funds.map((fund) => ({
          id: fund.id,
          categoryId: category.id,
          categoryName: category.name,
          name: fund.name,
          number: fund.number,
          footnotes: fund.footnotes,
          portfolioManagers: fund.portfolioManagers,
          category: fund.morningStar.category,
          rating: fund.morningStar.rating,
          expenseGross: fund.expense.gross,
          expenseNet: fund.expense.net,
          ytd: isStandardized ? fund.standardizedReturns.ytd : fund.nonStandardizedReturns.ytd,
          year1: isStandardized ? fund.standardizedReturns.year1 : fund.nonStandardizedReturns.year1,
          year3: isStandardized ? fund.standardizedReturns.year3 : fund.nonStandardizedReturns.year3,
          year5: isStandardized ? fund.standardizedReturns.year5 : fund.nonStandardizedReturns.year5,
          year10: isStandardized ? fund.standardizedReturns.year10 : fund.nonStandardizedReturns.year10,
          sinceInception: isStandardized
            ? fund.standardizedReturns.sinceInception
            : fund.nonStandardizedReturns.sinceInception,
        })),
      )
    }

    // Flatten the funds for sorting
    const flattenedFunds = categories.flatMap((category) =>
      category.funds.map((fund) => ({
        id: fund.id,
        categoryId: category.id,
        categoryName: category.name,
        name: fund.name,
        number: fund.number,
        footnotes: fund.footnotes,
        portfolioManagers: fund.portfolioManagers,
        category: fund.morningStar.category,
        rating: fund.morningStar.rating,
        expenseGross: fund.expense.gross,
        expenseNet: fund.expense.net,
        ytd: isStandardized ? fund.standardizedReturns.ytd : fund.nonStandardizedReturns.ytd,
        year1: isStandardized ? fund.standardizedReturns.year1 : fund.nonStandardizedReturns.year1,
        year3: isStandardized ? fund.standardizedReturns.year3 : fund.nonStandardizedReturns.year3,
        year5: isStandardized ? fund.standardizedReturns.year5 : fund.nonStandardizedReturns.year5,
        year10: isStandardized ? fund.standardizedReturns.year10 : fund.nonStandardizedReturns.year10,
        sinceInception: isStandardized
          ? fund.standardizedReturns.sinceInception
          : fund.nonStandardizedReturns.sinceInception,
      })),
    )

    // Sort the flattened funds
    return flattenedFunds.sort((a, b) => {
      let aValue = a[column]
      let bValue = b[column]

      // Handle string comparisons (case-insensitive)
      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      // Compare values based on direction
      if (direction === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      }
    })
  }

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

    // Update active footnotes based on filtered data
    const usedFootnotes: number[] = []
    result.forEach((category) => {
      category.funds.forEach((fund) => {
        if (fund.footnotes) {
          fund.footnotes.forEach((footnoteId) => {
            if (!usedFootnotes.includes(footnoteId)) {
              usedFootnotes.push(footnoteId)
            }
          })
        }
      })
    })
    setActiveFootnotes(usedFootnotes.sort((a, b) => a - b))
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
      "Standardized YTD Return",
      "Standardized 1-Year Return",
      "Standardized 3-Year Return",
      "Standardized 5-Year Return",
      "Standardized 10-Year Return",
      "Standardized Since Inception Return",
      "Non-Standardized YTD Return",
      "Non-Standardized 1-Year Return",
      "Non-Standardized 3-Year Return",
      "Non-Standardized 5-Year Return",
      "Non-Standardized 10-Year Return",
      "Non-Standardized Since Inception Return",
      "Portfolio Managers",
      "Footnotes",
    ]

    // Create CSV rows
    let csvContent = headers.join(",") + "\n"

    // Add data rows
    filteredCategories.forEach((category) => {
      category.funds.forEach((fund) => {
        const footnoteText = fund.footnotes ? fund.footnotes.join(", ") : ""

        const row = [
          category.name,
          fund.name,
          fund.number,
          fund.morningStar.category,
          fund.morningStar.rating.toString(),
          fund.expense.gross.toFixed(2) + "%",
          fund.expense.net.toFixed(2) + "%",
          fund.standardizedReturns.ytd.toFixed(2) + "%",
          fund.standardizedReturns.year1.toFixed(2) + "%",
          fund.standardizedReturns.year3.toFixed(2) + "%",
          fund.standardizedReturns.year5.toFixed(2) + "%",
          fund.standardizedReturns.year10.toFixed(2) + "%",
          fund.standardizedReturns.sinceInception.toFixed(2) + "%",
          fund.nonStandardizedReturns.ytd.toFixed(2) + "%",
          fund.nonStandardizedReturns.year1.toFixed(2) + "%",
          fund.nonStandardizedReturns.year3.toFixed(2) + "%",
          fund.nonStandardizedReturns.year5.toFixed(2) + "%",
          fund.nonStandardizedReturns.year10.toFixed(2) + "%",
          fund.nonStandardizedReturns.sinceInception.toFixed(2) + "%",
          fund.portfolioManagers.join("; "),
          footnoteText,
        ]

        // Escape any commas in the data
        const escapedRow = row.map((field) => {
          // Convert field to string and check if it contains a comma
          const stringField = String(field)
          if (stringField.includes(",")) {
            return `"${stringField}"`
          }
          return stringField
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

  // Function to render footnote superscripts
  const renderFootnotes = (footnoteIds: number[] | undefined) => {
    if (!footnoteIds || footnoteIds.length === 0) return null

    return (
      <span className="align-super text-xs ml-1" aria-hidden="true">
        {footnoteIds.map((id, index) => (
          <Fragment key={id}>
            <a href={`#footnote-${id}`} className="text-primary font-medium no-underline">
              {id}
            </a>
            {index < footnoteIds.length - 1 ? "," : ""}
          </Fragment>
        ))}
      </span>
    )
  }

  // Update the renderSortIndicator function to handle the "none" state
  const renderSortIndicator = (column: SortColumn, isStandardized: boolean) => {
    const currentSortColumn = isStandardized ? standardizedSortColumn : nonStandardizedSortColumn
    const currentSortDirection = isStandardized ? standardizedSortDirection : nonStandardizedSortDirection

    if (currentSortColumn !== column) {
      return <span className="text-transparent ml-1 h-4 w-4 inline opacity-0 group-hover:opacity-30">•</span>
    }

    if (currentSortDirection === "asc") {
      return <ArrowUp className="ml-1 h-4 w-4 inline" aria-hidden="true" />
    } else if (currentSortDirection === "desc") {
      return <ArrowDown className="ml-1 h-4 w-4 inline" aria-hidden="true" />
    }

    return null
  }

  // Update the renderSortableHeader function to include group hover state
  const renderSortableHeader = (
    column: SortColumn,
    label: string,
    isStandardized: boolean,
    className?: string,
    children?: React.ReactNode,
  ) => {
    const currentSortColumn = isStandardized ? standardizedSortColumn : nonStandardizedSortColumn
    const currentSortDirection = isStandardized ? standardizedSortDirection : nonStandardizedSortDirection
    const isActive = currentSortColumn === column

    return (
      <TableHead
        scope="col"
        className={cn("cursor-pointer hover:bg-muted/30 transition-colors group", isActive && "bg-muted/40", className)}
        onClick={() => handleSort(column, isStandardized)}
        aria-sort={
          isActive
            ? currentSortDirection === "asc"
              ? "ascending"
              : currentSortDirection === "desc"
                ? "descending"
                : "none"
            : "none"
        }
      >
        <div className="flex items-center justify-between">
          <span>{label}</span>
          <span className="inline-flex items-center">{renderSortIndicator(column, isStandardized)}</span>
        </div>
        {children}
      </TableHead>
    )
  }

  // Function to render a performance table
  const renderPerformanceTable = (isStandardized: boolean) => {
    const tableId = isStandardized ? "standardized-returns-table" : "non-standardized-returns-table"
    const tableTitle = isStandardized
      ? "Standardized Returns (Including Surrender Charges)"
      : "Non-Standardized Returns (Excluding Surrender Charges)"

    // Get the current sort column and direction for this table
    const currentSortColumn = isStandardized ? standardizedSortColumn : nonStandardizedSortColumn
    const currentSortDirection = isStandardized ? standardizedSortDirection : nonStandardizedSortDirection

    // Get sorted funds if a sort column is selected
    const sortedFunds = getSortedFunds(filteredCategories, currentSortColumn, currentSortDirection, isStandardized)

    // Group sorted funds by category
    const groupedFunds: Record<number, FlattenedFund[]> = {}
    sortedFunds.forEach((fund) => {
      if (!groupedFunds[fund.categoryId]) {
        groupedFunds[fund.categoryId] = []
      }
      groupedFunds[fund.categoryId].push(fund)
    })

    // Create sorted categories with their funds
    const sortedCategories = filteredCategories.map((category) => ({
      ...category,
      funds: groupedFunds[category.id] || [],
    }))

    return (
      <section className="mb-8" aria-labelledby={`${tableId}-heading`}>
        <h2 id={`${tableId}-heading`} className="text-xl font-semibold mb-3">
          {tableTitle}
        </h2>
        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0">
          <div className="min-w-[800px]">
            <Table className="border w-full" aria-labelledby={`${tableId}-heading`}>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  {renderSortableHeader("name", "Sub-Account", isStandardized, "w-[250px]")}
                  {renderSortableHeader("category", "Morningstar Category", isStandardized)}
                  {renderSortableHeader("rating", "Morningstar Rating", isStandardized)}
                  {renderSortableHeader(
                    "expenseGross",
                    "Expense Ratio",
                    isStandardized,
                    undefined,
                    <div className="flex text-xs font-normal">
                      <span className="w-1/2">Gross</span>
                      <span className="w-1/2">Net</span>
                    </div>,
                  )}
                  {renderSortableHeader("ytd", "YTD Return", isStandardized)}
                  {renderSortableHeader("year1", "1-Year", isStandardized)}
                  {renderSortableHeader("year3", "3-Year", isStandardized)}
                  {renderSortableHeader("year5", "5-Year", isStandardized)}
                  {renderSortableHeader("year10", "10-Year", isStandardized)}
                  {renderSortableHeader("sinceInception", "Since Inception", isStandardized)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCategories.map((category) => (
                  <Fragment key={`category-${category.id}`}>
                    <TableRow
                      className="bg-muted/20 cursor-pointer hover:bg-muted/30"
                      onClick={() => toggleCategory(category.id)}
                    >
                      <TableCell colSpan={10} className="font-medium">
                        <button
                          className="flex items-center w-full text-left py-2"
                          aria-expanded={category.expanded}
                          aria-controls={`category-${category.id}-content`}
                        >
                          {category.expanded ? (
                            <ChevronUp className="mr-2 h-5 w-5" aria-hidden="true" />
                          ) : (
                            <ChevronDown className="mr-2 h-5 w-5" aria-hidden="true" />
                          )}
                          {category.name} ({category.funds.length})
                        </button>
                      </TableCell>
                    </TableRow>
                    {category.expanded && (
                      <tr className="sr-only">
                        <td>
                          <span id={`category-${category.id}-content`}>{category.name} funds</span>
                        </td>
                      </tr>
                    )}
                    {category.expanded &&
                      category.funds.map((fund) => {
                        // Find the original fund to get all data
                        const originalFund = assetCategories
                          .find((c) => c.id === fund.categoryId)
                          ?.funds.find((f) => f.id === fund.id)

                        if (!originalFund) return null

                        return (
                          <TableRow key={`fund-${fund.id}`} aria-labelledby={`category-${category.id}-content`}>
                            <TableCell>
                              <div className="font-medium">
                                {fund.name}
                                {fund.footnotes && renderFootnotes(fund.footnotes)}
                                {/* Screen reader accessible footnotes */}
                                {fund.footnotes && (
                                  <span className="sr-only">
                                    {" "}
                                    with footnotes{" "}
                                    {fund.footnotes.map((id) => {
                                      const note = footnotes.find((f) => f.id === id)
                                      return note ? `${id}: ${note.text}. ` : ""
                                    })}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">Fund Number: {fund.number}</div>
                            </TableCell>
                            <TableCell>{fund.category}</TableCell>
                            <TableCell>
                              <div aria-label={`${fund.rating} out of 5 stars`}>
                                <StarRating rating={fund.rating} />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex text-sm">
                                <span className="w-1/2">{fund.expenseGross}%</span>
                                <span className="w-1/2">{fund.expenseNet}%</span>
                              </div>
                            </TableCell>
                            <TableCell>{formatPercent(fund.ytd)}</TableCell>
                            <TableCell>{formatPercent(fund.year1)}</TableCell>
                            <TableCell>{formatPercent(fund.year3)}</TableCell>
                            <TableCell>{formatPercent(fund.year5)}</TableCell>
                            <TableCell>{formatPercent(fund.year10)}</TableCell>
                            <TableCell>{formatPercent(fund.sinceInception)}</TableCell>
                          </TableRow>
                        )
                      })}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-2 italic">
          <span className="md:hidden">Swipe horizontally to view more data</span>
        </div>
      </section>
    )
  }

  return (
    <main className="container mx-auto py-6 px-4 sm:px-6" aria-labelledby="performance-center-title">
      <div className="w-full mb-6 py-4 sm:py-6 px-4 bg-[#1e3869] rounded-md">
        <h1
          id="performance-center-title"
          className={`text-2xl sm:text-3xl font-bold text-[#f06d22] text-center md:text-left ${unbounded.className}`}
        >
          Performance Center
        </h1>
      </div>

      {/* Filters Toggle for Mobile/Tablet */}
      <div className="md:hidden mb-4 flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
          aria-expanded={showFilters}
          aria-controls="filter-panel"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-sm flex items-center gap-1"
            aria-label="Reset all filters"
          >
            <X className="h-3 w-3" />
            Reset
          </Button>
        )}
      </div>

      {/* Filters */}
      <section
        aria-labelledby="filters-heading"
        id="filter-panel"
        className={cn("transition-all duration-300", {
          "max-h-0 overflow-hidden opacity-0 md:max-h-full md:opacity-100": !showFilters && isMobile,
          "max-h-[1000px] opacity-100": showFilters || !isMobile,
        })}
      >
        <h2 id="filters-heading" className="sr-only">
          Performance Filters
        </h2>
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="asset-category" className="text-sm font-medium">
                  Asset Category
                </Label>
                <Select
                  defaultValue="All"
                  value={assetCategoryFilter}
                  onValueChange={(value) => setAssetCategoryFilter(value)}
                >
                  <SelectTrigger id="asset-category" aria-label="Select asset category" className="h-10">
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
                <Label htmlFor="morningstar-category" className="text-sm font-medium">
                  Morningstar Categories
                </Label>
                <Select
                  defaultValue="All"
                  value={morningstarCategoryFilter}
                  onValueChange={(value) => setMorningstarCategoryFilter(value)}
                >
                  <SelectTrigger id="morningstar-category" aria-label="Select Morningstar category" className="h-10">
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

              <div className="space-y-2">
                <Label id="morningstar-ratings-label" className="text-sm font-medium block mb-2">
                  Morningstar Ratings
                </Label>
                <RadioGroup
                  defaultValue="all"
                  value={morningstarRatingFilter}
                  className="flex flex-wrap gap-x-4 gap-y-2"
                  onValueChange={(value) => setMorningstarRatingFilter(value)}
                  aria-labelledby="morningstar-ratings-label"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all" className="text-sm">
                      All
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5" id="5-stars" />
                    <Label htmlFor="5-stars" className="text-sm">
                      5 stars
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4" id="4-plus-stars" />
                    <Label htmlFor="4-plus-stars" className="text-sm">
                      4+ stars
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="3-plus-stars" />
                    <Label htmlFor="3-plus-stars" className="text-sm">
                      3+ stars
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolio-manager" className="text-sm font-medium">
                  Portfolio Managers
                </Label>
                <Select
                  defaultValue="All"
                  value={portfolioManagerFilter}
                  onValueChange={(value) => setPortfolioManagerFilter(value)}
                >
                  <SelectTrigger id="portfolio-manager" aria-label="Select portfolio manager" className="h-10">
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

            {/* Reset Filters Button - Desktop */}
            <div className="hidden md:flex justify-end mt-4">
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="text-sm"
                  aria-label="Reset all filters"
                >
                  Reset Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Table Type Filter and Export Button */}
      <section
        className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        aria-labelledby="return-type-heading"
      >
        <div>
          <h3 id="return-type-heading" className="text-base sm:text-lg font-medium mb-2">
            Return Type
          </h3>
          <div className="flex flex-wrap gap-x-6 gap-y-2" role="group" aria-labelledby="return-type-heading">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="standardized"
                checked={showStandardized}
                onCheckedChange={(checked) => setShowStandardized(checked as boolean)}
                aria-label="Show standardized returns"
                className="h-5 w-5"
              />
              <Label htmlFor="standardized" className="text-sm">
                Standardized
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="non-standardized"
                checked={showNonStandardized}
                onCheckedChange={(checked) => setShowNonStandardized(checked as boolean)}
                aria-label="Show non-standardized returns"
                className="h-5 w-5"
              />
              <Label htmlFor="non-standardized" className="text-sm">
                Non-Standardized
              </Label>
            </div>
          </div>
        </div>
        <div>
          <Button
            onClick={downloadCSV}
            className="flex items-center gap-2 h-10 px-4"
            aria-label="Export data to CSV file"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Export CSV
          </Button>
        </div>
      </section>

      {/* Performance Tables */}
      {showStandardized && renderPerformanceTable(true)}
      {showNonStandardized && renderPerformanceTable(false)}

      {/* Generic Disclaimer and Footnotes */}
      <footer className="mt-8 border-t pt-4" aria-label="Performance data disclaimers">
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Performance data as of 04/30/2025. Past performance is not a guarantee of future results.
          </p>
          <div className="mt-2" aria-labelledby="returns-explanation">
            <h3 id="returns-explanation" className="sr-only">
              Returns Explanation
            </h3>
            <p className="text-sm text-muted-foreground">
              <strong>Standardized Returns:</strong> Include the effect of applicable surrender charges (contingent
              deferred sales charges) that would apply if you terminated your contract at the end of the applicable time
              period.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              <strong>Non-Standardized Returns:</strong> Do not include the effect of surrender charges. If surrender
              charges were included, returns would be lower.
            </p>
          </div>
        </div>

        {/* Dynamic Disclaimer from CMS */}
        <div
          className="bg-muted/20 p-3 sm:p-4 rounded-md text-sm text-muted-foreground mb-4"
          aria-labelledby="disclaimer-heading"
        >
          <h3 id="disclaimer-heading" className="sr-only">
            Legal Disclaimer
          </h3>
          <p className="text-sm leading-relaxed">{disclaimer.text}</p>
        </div>

        {/* Footnotes Section - now below disclaimers with matching formatting */}
        {activeFootnotes.length > 0 && (
          <div className="text-sm text-muted-foreground mt-4" aria-label="Footnotes">
            {activeFootnotes.map((id) => {
              const note = footnotes.find((f) => f.id === id)
              if (!note) return null
              return (
                <div key={note.id} id={`footnote-${note.id}`} className="mb-2 flex">
                  <span className="font-medium mr-2 flex-shrink-0">{note.id}.</span>
                  <span className="leading-relaxed">{note.text}</span>
                </div>
              )
            })}
          </div>
        )}
      </footer>

      {filteredCategories.length === 0 && (
        <div className="p-6 sm:p-8 text-center border rounded-md" aria-live="polite" role="status">
          <p>No funds match your current filter criteria. Please adjust your filters to see results.</p>
        </div>
      )}
    </main>
  )
}
