"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockContractCoverage } from "@/lib/mock-data"
import { Calendar, AlertCircle, CheckCircle2, Clock, AlertTriangle } from "lucide-react"

function getExpirationStatus(expirationDate: string) {
  const today = new Date()
  const expDate = new Date(expirationDate)
  const daysUntil = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (daysUntil <= 30) return { label: "Expiring Soon", color: "destructive", icon: AlertCircle, daysUntil }
  if (daysUntil <= 90) return { label: "Expiring", color: "warning", icon: Clock, daysUntil }
  return { label: "Active", color: "success", icon: CheckCircle2, daysUntil }
}

export default function ContractExpirationsPage() {
  const sortedContracts = [...mockContractCoverage].sort((a, b) => a.days_until_expiration - b.days_until_expiration)

  const expiringSoon = mockContractCoverage.filter((c) => c.days_until_expiration <= 30)
  const totalValue = mockContractCoverage.reduce((sum, c) => sum + c.annualValue, 0)
  const activeCount = mockContractCoverage.filter((c) => c.status === "active").length
  const expiredCount = mockContractCoverage.filter((c) => c.status === "expired").length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "expired":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "expiring_soon":
        return "bg-warning/10 text-warning border-warning/20"
      case "upcoming":
        return "bg-blue-100/10 text-blue-700 border-blue-200/20"
      default:
        return "bg-success/10 text-success border-success/20"
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Contract Expirations</h2>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Contracts</p>
                <p className="text-2xl font-bold text-foreground">{mockContractCoverage.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary/30" />
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-destructive/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiring Soon (30 days)</p>
                <p className="text-2xl font-bold text-destructive">{expiringSoon.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive/30" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Annual Value</p>
                <p className="text-2xl font-bold text-foreground">${(totalValue / 1000000).toFixed(1)}M</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success/30" />
            </div>
          </Card>

          <Card className="p-4 border-l-4 border-l-warning/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expired/Breached</p>
                <p className="text-2xl font-bold text-warning">{expiredCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning/30" />
            </div>
          </Card>
        </div>

        {/* Contracts Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Contract #</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Vendor</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Expiration Date</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Days Until</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Annual Value</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Items</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">This Period</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {sortedContracts.map((contract) => (
                  <tr key={contract.id} className="border-b border-border hover:bg-muted/30">
                    <td className="px-6 py-3 font-medium text-foreground">{contract.contractNumber}</td>
                    <td className="px-6 py-3 text-muted-foreground">{contract.vendorId}</td>
                    <td className="px-6 py-3 text-muted-foreground">{contract.expirationDate}</td>
                    <td className="px-6 py-3">
                      <span
                        className={
                          contract.days_until_expiration <= 0
                            ? "font-bold text-destructive"
                            : contract.days_until_expiration <= 30
                              ? "font-bold text-destructive"
                              : contract.days_until_expiration <= 90
                                ? "font-bold text-warning"
                                : "text-success"
                        }
                      >
                        {contract.days_until_expiration} days
                      </span>
                    </td>
                    <td className="px-6 py-3 font-semibold text-foreground">
                      ${(contract.annualValue / 1000).toFixed(0)}K
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">{contract.billable_items_count} items</td>
                    <td className="px-6 py-3 text-muted-foreground">{contract.invoices_this_period} invoices</td>
                    <td className="px-6 py-3">
                      <Badge variant="outline" className={getStatusBadge(contract.status)}>
                        {contract.status.replace(/_/g, " ").toUpperCase()}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
