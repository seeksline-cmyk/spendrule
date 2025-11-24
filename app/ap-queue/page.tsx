"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockInvoices, mockExceptions, mockAutoApprovalMetrics } from "@/lib/mock-data"
import { BarChart3, TrendingUp, AlertTriangle, Zap } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export default function APQueuePage() {
  const autoApprovalRate = mockAutoApprovalMetrics?.auto_approval_rate ?? 0
  const touchlessRate = mockAutoApprovalMetrics?.touchless_rate ?? 0
  const avgCycleTime = mockAutoApprovalMetrics?.avg_cycle_time_hours ?? 0
  const autoApprovedAmount = mockAutoApprovalMetrics?.auto_approved_amount ?? 0

  const totalSpend = mockInvoices.reduce((sum, inv) => sum + inv.grossAmount, 0)
  const pendingAmount = mockInvoices
    .filter((inv) => inv.approvalStatus === "pending_review")
    .reduce((sum, inv) => sum + inv.grossAmount, 0)

  const statusCounts = {
    auto_approved: mockAutoApprovalMetrics?.invoices_by_status?.auto_approved ?? 0,
    pending_review: mockAutoApprovalMetrics?.invoices_by_status?.pending_review ?? 0,
    approved: mockAutoApprovalMetrics?.invoices_by_status?.approved ?? 0,
    rejected: mockAutoApprovalMetrics?.invoices_by_status?.rejected ?? 0,
  }

  const getStatusBadge = (invoice: any) => {
    if (invoice.approvalStatus === "pending_review") {
      return "bg-warning/10 text-warning border-warning/20"
    } else if (invoice.status === "exception") {
      return "bg-destructive/10 text-destructive border-destructive/20"
    }
    return "bg-success/10 text-success border-success/20"
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">AP Queue</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Auto-Approved %</p>
                <p className="text-2xl font-bold text-success">{autoApprovalRate.toFixed(1)}%</p>
              </div>
              <Zap className="h-8 w-8 text-success/30" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Touchless $</p>
                <p className="text-2xl font-bold text-foreground">${(autoApprovedAmount / 1000).toFixed(0)}K</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary/30" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Cycle Time</p>
                <p className="text-2xl font-bold text-foreground">{avgCycleTime} hrs</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary/30" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold text-warning">${(pendingAmount / 1000).toFixed(0)}K</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning/30" />
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Invoice Processing Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockAutoApprovalMetrics?.monthly_trend ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: `1px solid var(--color-border)`,
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="rejected" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Invoice Status Distribution</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
            <div className="text-center p-4 bg-success/5 rounded-lg border border-success/20">
              <p className="text-2xl font-bold text-success">{statusCounts.auto_approved}</p>
              <p className="text-sm text-muted-foreground mt-1">Auto-Approved</p>
            </div>
            <div className="text-center p-4 bg-warning/5 rounded-lg border border-warning/20">
              <p className="text-2xl font-bold text-warning">{statusCounts.pending_review}</p>
              <p className="text-sm text-muted-foreground mt-1">Pending Review</p>
            </div>
            <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-2xl font-bold text-primary">{statusCounts.approved}</p>
              <p className="text-sm text-muted-foreground mt-1">Approved</p>
            </div>
            <div className="text-center p-4 bg-destructive/5 rounded-lg border border-destructive/20">
              <p className="text-2xl font-bold text-destructive">{statusCounts.rejected}</p>
              <p className="text-sm text-muted-foreground mt-1">Rejected</p>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Invoice #</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Vendor</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Amount</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Date</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Exceptions</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockInvoices.map((invoice) => {
                  const invoiceExceptions = mockExceptions.filter((e) => e.invoiceId === invoice.id)
                  return (
                    <tr key={invoice.id} className="border-b border-border hover:bg-muted/30">
                      <td className="px-6 py-3 font-medium text-foreground">{invoice.invoiceNumber}</td>
                      <td className="px-6 py-3 text-muted-foreground">{invoice.vendorId}</td>
                      <td className="px-6 py-3 font-semibold text-foreground">
                        ${invoice.grossAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">{invoice.invoiceDate}</td>
                      <td className="px-6 py-3">
                        {invoiceExceptions.length > 0 ? (
                          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                            {invoiceExceptions.length} found
                          </Badge>
                        ) : (
                          <span className="text-success text-xs">—</span>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        <Badge variant="outline" className={getStatusBadge(invoice)}>
                          {invoice.approvalStatus === "pending_review"
                            ? "Pending Review"
                            : invoice.status === "exception"
                              ? "Exception"
                              : "Approved"}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
