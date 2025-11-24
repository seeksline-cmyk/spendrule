"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Check, FileText, AlertCircle } from "lucide-react"

interface ExceptionDetailModalProps {
  exception: any
  onClose: () => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export function ExceptionDetailModal({ exception, onClose, onApprove, onReject }: ExceptionDetailModalProps) {
  const severityColors = {
    critical: "bg-destructive/10 text-destructive border-destructive/20",
    high: "bg-warning/10 text-warning border-warning/20",
    medium: "bg-amber-100/10 text-amber-700 border-amber-200/20",
    low: "bg-accent/10 text-accent border-accent/20",
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card p-6 bg-gradient-to-r from-primary/5 to-transparent">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{exception.vendorName}</h2>
            <p className="text-sm text-muted-foreground mt-1">Invoice {exception.invoiceNumber}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-muted transition-colors" aria-label="Close">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge
                variant="outline"
                className={severityColors[exception.severity as keyof typeof severityColors] || ""}
              >
                {exception.severity.charAt(0).toUpperCase() + exception.severity.slice(1)} Severity
              </Badge>
              <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-border">
                {exception.exceptionType.replace(/_/g, " ")}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{exception.description}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-1">VARIANCE</p>
              <p className="text-xl font-bold text-success">${exception.varianceAmount.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-1">EXPECTED</p>
              <p className="text-xl font-bold text-foreground">${exception.expectedValue.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-1">ACTUAL</p>
              <p className="text-xl font-bold text-destructive">${exception.actualValue.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-1">DIFFERENCE</p>
              <p className="text-xl font-bold text-warning">
                {((exception.varianceAmount / exception.expectedValue) * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Proof Evidence
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              {exception.contractProof && (
                <div className="p-4 rounded-xl border-2 border-blue-200 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-950/20 hover:border-blue-300 dark:hover:border-blue-900/60 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-700 dark:text-blue-300">CONTRACT TERMS</p>
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                        {exception.contractProof.documentName || exception.contractProof.contractNumber}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-blue-100 dark:border-blue-900/20">
                    <p className="text-sm font-mono text-foreground leading-relaxed">
                      "{exception.contractProof.extractedText || exception.contractProof.text}"
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Page {exception.contractProof.pageNumber}
                  </p>
                </div>
              )}

              {exception.invoiceProof && (
                <div className="p-4 rounded-xl border-2 border-amber-200 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/20 hover:border-amber-300 dark:hover:border-amber-900/60 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-700 dark:text-amber-300">INVOICE CHARGED</p>
                      <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                        {exception.invoiceProof.documentName || exception.invoiceProof.invoiceNumber}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-950 p-3 rounded-lg border border-amber-100 dark:border-amber-900/20">
                    <p className="text-sm font-mono text-foreground leading-relaxed">
                      "{exception.invoiceProof.extractedText || exception.invoiceProof.text}"
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Page {exception.invoiceProof.pageNumber}
                  </p>
                </div>
              )}
            </div>

            {(!exception.contractProof || !exception.invoiceProof) && (
              <div className="p-3 rounded-lg bg-muted/30 border border-border text-sm text-muted-foreground text-center">
                Proof data not available for this exception
              </div>
            )}

            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-start gap-3">
              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm text-foreground">
                <p className="font-semibold">Proof Verified</p>
                <p className="text-muted-foreground">Contract terms vs. invoice charges successfully validated</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 text-muted-foreground hover:bg-muted/30 bg-transparent"
            >
              Close
            </Button>
            <Button
              variant="outline"
              onClick={() => onReject(exception.id)}
              className="flex-1 text-destructive hover:bg-destructive/10 border-destructive/20"
            >
              Reject & Recover
            </Button>
            <Button
              onClick={() => onApprove(exception.id)}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
            >
              Approve
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
