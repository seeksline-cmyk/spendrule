"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockVendorMetrics } from "@/lib/mock-data"
import { TrendingUp, TrendingDown, AlertCircle, ChevronRight } from "lucide-react"

interface SelectedVendor {
  vendor: (typeof mockVendorMetrics)[0]
}

function ComplianceBadge({ rate }: { rate: number }) {
  if (rate >= 95) return <span className="text-success font-semibold">Excellent</span>
  if (rate >= 90) return <span className="text-blue-600 dark:text-blue-400 font-semibold">Good</span>
  if (rate >= 80) return <span className="text-warning font-semibold">Fair</span>
  return <span className="text-destructive font-semibold">Poor</span>
}

export default function VendorPerformancePage() {
  const [selectedVendor, setSelectedVendor] = useState<SelectedVendor | null>(null)

  const avgCompliance = (
    mockVendorMetrics.reduce((sum, v) => sum + v.complianceRate, 0) / mockVendorMetrics.length
  ).toFixed(1)

  const vendorsByOvercharge = [...mockVendorMetrics].sort((a, b) => b.overchargeAmount - a.overchargeAmount)

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Vendor Performance</h2>

        <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <p className="text-sm text-muted-foreground mb-1">Average Compliance Rate</p>
          <p className="text-3xl font-bold text-primary">{avgCompliance}%</p>
        </Card>

        <Card>
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Vendor League Table</h3>
            <p className="text-sm text-muted-foreground mt-1">Ranked by total overcharges and compliance performance</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Rank</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Vendor</th>
                  <th className="px-6 py-3 text-right font-semibold text-foreground">Total Spend</th>
                  <th className="px-6 py-3 text-right font-semibold text-foreground">Overcharged $</th>
                  <th className="px-6 py-3 text-center font-semibold text-foreground">Compliance</th>
                  <th className="px-6 py-3 text-center font-semibold text-foreground">Risk</th>
                  <th className="px-6 py-3 text-center font-semibold text-foreground">Disputes</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {vendorsByOvercharge.map((vendor, index) => (
                  <tr key={vendor.vendorId} className="border-b border-border hover:bg-muted/30">
                    <td className="px-6 py-3 font-semibold text-foreground">#{index + 1}</td>
                    <td className="px-6 py-3 font-medium text-foreground">{vendor.vendorName}</td>
                    <td className="px-6 py-3 text-right text-foreground">${(vendor.totalSpend / 1000).toFixed(0)}K</td>
                    <td className="px-6 py-3 text-right font-semibold text-destructive">
                      ${vendor.overchargeAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex items-center justify-center">
                        <span className="font-semibold text-foreground mr-2">{vendor.complianceRate.toFixed(1)}%</span>
                        <ComplianceBadge rate={vendor.complianceRate} />
                      </div>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <Badge
                        variant="outline"
                        className={
                          vendor.riskScore === "high"
                            ? "bg-destructive/10 text-destructive border-destructive/20"
                            : vendor.riskScore === "medium"
                              ? "bg-warning/10 text-warning border-warning/20"
                              : "bg-success/10 text-success border-success/20"
                        }
                      >
                        {vendor.riskScore.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-center text-foreground">{vendor.exceptionCount}</td>
                    <td className="px-6 py-3 text-left">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedVendor({ vendor })}
                        className="gap-1"
                      >
                        View <ChevronRight className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Individual Vendor Scorecards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockVendorMetrics.map((vendor) => (
              <Card key={vendor.vendorId} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{vendor.vendorName}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        <ComplianceBadge rate={vendor.complianceRate} />
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          vendor.riskScore === "high"
                            ? "bg-destructive/10 text-destructive border-destructive/20"
                            : vendor.riskScore === "medium"
                              ? "bg-warning/10 text-warning border-warning/20"
                              : "bg-success/10 text-success border-success/20"
                        }`}
                      >
                        {vendor.riskScore.toUpperCase()} RISK
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">{vendor.complianceRate.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">Compliance %</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Invoices</p>
                    <p className="text-lg font-semibold text-foreground">{vendor.totalInvoices}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Spend</p>
                    <p className="text-lg font-semibold text-foreground">${(vendor.totalSpend / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Exceptions Found</p>
                    <p className="text-lg font-semibold text-destructive">{vendor.exceptionCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Overcharges</p>
                    <p className="text-lg font-semibold text-destructive">
                      ${vendor.overchargeAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Recovered</p>
                    <p className="text-lg font-semibold text-success">${vendor.recoveredAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Recovery Rate</p>
                    <p className="text-lg font-semibold text-foreground">{vendor.recoveryRate.toFixed(1)}%</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  {vendor.riskScore === "high" ? (
                    <>
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <p className="text-xs text-destructive">Requires immediate attention</p>
                    </>
                  ) : vendor.complianceRate >= 95 ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-success" />
                      <p className="text-xs text-success">Reliable vendor - low risk</p>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-4 w-4 text-warning" />
                      <p className="text-xs text-warning">Monitor for improvements</p>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {selectedVendor && (
          <Card className="p-6 border-l-4 border-l-primary/50 bg-primary/5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-foreground text-lg mb-2">{selectedVendor.vendor.vendorName} - Details</h3>
                <p className="text-sm text-muted-foreground">12-month performance data and compliance trend</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedVendor(null)}>
                ✕
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Spend</p>
                <p className="font-bold text-foreground">${(selectedVendor.vendor.totalSpend / 1000).toFixed(0)}K</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Exceptions</p>
                <p className="font-bold text-destructive">{selectedVendor.vendor.exceptionCount}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Compliance</p>
                <p className="font-bold text-success">{selectedVendor.vendor.complianceRate.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Recovery Rate</p>
                <p className="font-bold text-foreground">{selectedVendor.vendor.recoveryRate.toFixed(1)}%</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
