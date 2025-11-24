"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockLocationSpendAnalysis } from "@/lib/mock-data"
import { Building2, TrendingUp, BarChart3 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface SelectedFacility {
  facility: (typeof mockLocationSpendAnalysis)[0]
}

export default function FacilityViewPage() {
  const [selectedFacility, setSelectedFacility] = useState<SelectedFacility | null>(null)

  // Calculate totals across all facilities
  const totalSpend = mockLocationSpendAnalysis.reduce((sum, loc) => sum + loc.total_spend, 0)
  const totalSavings = mockLocationSpendAnalysis.reduce((sum, loc) => sum + loc.total_savings, 0)
  const avgCompliance =
    mockLocationSpendAnalysis.reduce((sum, loc) => sum + loc.compliance_rate, 0) / mockLocationSpendAnalysis.length

  // Chart data for spend distribution
  const spendChartData = mockLocationSpendAnalysis.map((loc) => ({
    name: loc.name,
    spend: loc.total_spend,
    savings: loc.total_savings,
  }))

  // Worst compliance facilities for heatmap
  const facilitiesByCompliance = [...mockLocationSpendAnalysis].sort((a, b) => a.compliance_rate - b.compliance_rate)

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Facility View</h2>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spend (All Sites)</p>
                <p className="text-2xl font-bold text-foreground">${(totalSpend / 1000000).toFixed(1)}M</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary/30" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Savings (All Sites)</p>
                <p className="text-2xl font-bold text-success">${(totalSavings / 1000).toFixed(0)}K</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success/30" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Compliance Rate</p>
                <p className="text-2xl font-bold text-foreground">{avgCompliance.toFixed(1)}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary/30" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Facilities Monitored</p>
                <p className="text-2xl font-bold text-foreground">{mockLocationSpendAnalysis.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-primary/30" />
            </div>
          </Card>
        </div>

        {/* Spend & Savings by Location Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Spend & Savings by Facility</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spendChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: `1px solid var(--color-border)`,
                }}
                formatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              />
              <Bar dataKey="spend" fill="var(--color-chart-1)" name="Total Spend" />
              <Bar dataKey="savings" fill="var(--color-chart-2)" name="Savings" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Facility Performance Table */}
        <Card>
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Facility Performance Dashboard</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Ranked by compliance rate - identify which locations have pricing challenges
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Facility</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Beds</th>
                  <th className="px-6 py-3 text-right font-semibold text-foreground">Total Spend</th>
                  <th className="px-6 py-3 text-right font-semibold text-foreground">Savings</th>
                  <th className="px-6 py-3 text-center font-semibold text-foreground">Compliance %</th>
                  <th className="px-6 py-3 text-center font-semibold text-foreground">Exceptions</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Top Vendor</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {facilitiesByCompliance.map((facility) => (
                  <tr key={facility.id} className="border-b border-border hover:bg-muted/30">
                    <td className="px-6 py-3 font-medium text-foreground">{facility.name}</td>
                    <td className="px-6 py-3 text-muted-foreground">{facility.bedCount}</td>
                    <td className="px-6 py-3 text-right font-semibold text-foreground">
                      ${(facility.total_spend / 1000).toFixed(0)}K
                    </td>
                    <td className="px-6 py-3 text-right font-semibold text-success">
                      ${(facility.total_savings / 1000).toFixed(0)}K
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span
                        className={`font-semibold ${
                          facility.compliance_rate >= 95
                            ? "text-success"
                            : facility.compliance_rate >= 90
                              ? "text-blue-600 dark:text-blue-400"
                              : facility.compliance_rate >= 85
                                ? "text-warning"
                                : "text-destructive"
                        }`}
                      >
                        {facility.compliance_rate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <Badge
                        variant="outline"
                        className={
                          facility.exception_count > 10
                            ? "bg-destructive/10 text-destructive border-destructive/20"
                            : facility.exception_count > 5
                              ? "bg-warning/10 text-warning border-warning/20"
                              : "bg-success/10 text-success border-success/20"
                        }
                      >
                        {facility.exception_count}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">{facility.top_vendor.vendorName}</td>
                    <td className="px-6 py-3">
                      <Button size="sm" variant="outline" onClick={() => setSelectedFacility({ facility })}>
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Facility Detail View */}
        {selectedFacility && (
          <Card className="p-6 border-l-4 border-l-primary/50 bg-primary/5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-foreground text-lg mb-2">{selectedFacility.facility.name} - Details</h3>
                <p className="text-sm text-muted-foreground">Facility code: {selectedFacility.facility.code}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedFacility(null)}>
                ✕
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Spend</p>
                <p className="font-bold text-foreground text-lg">
                  ${(selectedFacility.facility.total_spend / 1000).toFixed(0)}K
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Savings</p>
                <p className="font-bold text-success text-lg">
                  ${(selectedFacility.facility.total_savings / 1000).toFixed(0)}K
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Exceptions Found</p>
                <p className="font-bold text-destructive text-lg">{selectedFacility.facility.exception_count}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Compliance Rate</p>
                <p className="font-bold text-foreground text-lg">
                  {selectedFacility.facility.compliance_rate.toFixed(1)}%
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
