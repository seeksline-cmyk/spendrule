"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockMyApprovals, mockVendorMetrics } from "@/lib/mock-data"
import { ExceptionDetailModal } from "@/components/exception-detail-modal"
import { AlertCircle, TrendingUp, CheckCircle, FileCheck } from "lucide-react"
import { getUploadedExceptions } from "@/lib/use-upload-store"

export default function MyInboxPage() {
  const [selectedApproval, setSelectedApproval] = useState<any>(null)
  const [approvedItems, setApprovedItems] = useState<Set<string>>(new Set())
  const [rejectedItems, setRejectedItems] = useState<Set<string>>(new Set())
  const [uploadedExceptions, setUploadedExceptions] = useState<any[]>([])

  useEffect(() => {
    const exceptions = getUploadedExceptions()
    console.log("[v0] Loaded uploaded exceptions from localStorage:", exceptions)
    setUploadedExceptions(exceptions)
  }, [])

  const combinedApprovals = [
    ...mockMyApprovals,
    ...uploadedExceptions.map((e) => ({
      id: e.id,
      invoiceNumber: e.invoiceNumber,
      vendorId: `vendor-${e.vendorName.toLowerCase().replace(/\s+/g, "-")}`,
      vendorName: e.vendorName,
      exceptionType: e.exceptionType || "uploaded_invoice",
      severity: e.severity,
      resolutionStatus: "open",
      expectedValue: e.expectedValue || 0,
      actualValue: e.actualValue || 0,
      varianceAmount: e.varianceAmount,
      description: e.description || `Uploaded invoice validation exception`,
      date: new Date(e.uploadedAt).toLocaleDateString(),
      days_pending: 0,
      contractProof: e.contractProof,
      invoiceProof: e.invoiceProof,
    })),
  ]

  const pendingApprovalsCount = combinedApprovals.filter(
    (a) => !approvedItems.has(a.id) && !rejectedItems.has(a.id),
  ).length
  const totalVarianceAmount = combinedApprovals.reduce((sum, a) => sum + a.varianceAmount, 0)
  const criticalCount = combinedApprovals.filter(
    (a) => a.severity === "critical" && !approvedItems.has(a.id) && !rejectedItems.has(a.id),
  ).length

  const getVendorMetrics = (vendorId: string) => {
    return mockVendorMetrics.find((v) => v.vendorId === vendorId)
  }

  const getRiskColor = (riskScore: string) => {
    switch (riskScore) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "medium":
        return "bg-warning/10 text-warning border-warning/20"
      default:
        return "bg-success/10 text-success border-success/20"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "high":
        return "bg-warning/10 text-warning border-warning/20"
      case "medium":
        return "bg-amber-100/10 text-amber-700 border-amber-200/20"
      default:
        return "bg-accent/10 text-accent border-accent/20"
    }
  }

  const pendingApprovals = combinedApprovals.filter((a) => !approvedItems.has(a.id) && !rejectedItems.has(a.id))

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">My Inbox</h2>
          <p className="text-sm text-muted-foreground">Review and approve pending exceptions with proof citations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-5 border border-border hover:border-primary/30 transition-colors shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Items Awaiting</p>
                <p className="text-3xl font-bold text-foreground mt-2">{pendingApprovalsCount}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </Card>

          <Card className="p-5 border border-border hover:border-primary/30 transition-colors shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Variance</p>
                <p className="text-3xl font-bold text-success mt-2">${(totalVarianceAmount / 1000).toFixed(1)}K</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
            </div>
          </Card>

          <Card className="p-5 border border-border hover:border-primary/30 transition-colors shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Critical Issues</p>
                <p className="text-3xl font-bold text-warning mt-2">{criticalCount}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-warning" />
              </div>
            </div>
          </Card>

          <Card className="p-5 border border-border hover:border-primary/30 transition-colors shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Completed</p>
                <p className="text-3xl font-bold text-primary mt-2">{approvedItems.size}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
            </div>
          </Card>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
            Pending Approvals
          </h3>
          <div className="space-y-3">
            {pendingApprovals.length > 0 ? (
              pendingApprovals.map((approval) => {
                const metrics = getVendorMetrics(approval.vendorId)
                return (
                  <Card
                    key={approval.id}
                    className="p-5 border border-border hover:border-primary/40 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setSelectedApproval(approval)}
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-3 flex-wrap">
                          <h4 className="font-semibold text-foreground text-base">{approval.vendorName}</h4>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline" className={getSeverityColor(approval.severity)}>
                              {approval.severity.charAt(0).toUpperCase() + approval.severity.slice(1)}
                            </Badge>
                            {metrics && (
                              <Badge variant="outline" className={getRiskColor(metrics.riskScore)}>
                                {metrics.riskScore === "low"
                                  ? "Low Risk"
                                  : metrics.riskScore === "medium"
                                    ? "Med Risk"
                                    : "High Risk"}
                              </Badge>
                            )}
                            <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-border">
                              {approval.days_pending}d pending
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {approval.invoiceNumber} • {approval.date}
                        </p>
                        <div className="bg-muted/40 rounded-lg p-3 border border-border/50 text-sm">
                          <p className="font-semibold text-foreground mb-1">
                            {approval.exceptionType.replace(/_/g, " ")}
                          </p>
                          <p className="text-muted-foreground line-clamp-2">{approval.description}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3 md:pt-1">
                        <div className="text-right">
                          <p className="text-xs font-medium text-muted-foreground">VARIANCE</p>
                          <p className="text-2xl font-bold text-success">${approval.varianceAmount.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedApproval(approval)
                            }}
                            className="text-primary hover:bg-primary/5"
                          >
                            View Proof
                          </Button>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setApprovedItems((prev) => new Set([...prev, approval.id]))
                            }}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                          >
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })
            ) : (
              <Card className="p-12 text-center border border-border/50 bg-muted/20">
                <CheckCircle className="h-12 w-12 text-success/30 mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">All approvals completed!</p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {selectedApproval && (
        <ExceptionDetailModal
          exception={selectedApproval}
          onClose={() => setSelectedApproval(null)}
          onApprove={(id) => {
            setApprovedItems((prev) => new Set([...prev, id]))
            setSelectedApproval(null)
          }}
          onReject={(id) => {
            setRejectedItems((prev) => new Set([...prev, id]))
            setSelectedApproval(null)
          }}
        />
      )}
    </DashboardLayout>
  )
}
