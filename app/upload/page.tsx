"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Upload, FileText, CheckCircle, Loader2, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getStoredContracts, type StoredContract } from "@/lib/use-upload-store"

interface UploadedDocument {
  id: string
  name: string
  type: "invoice"
  vendor: string
  contractId: string
  contractName: string
  uploadedAt: string
  status: "uploading" | "validating" | "complete" | "error"
  errorMessage?: string
}

export default function UploadPage() {
  const [documents, setDocuments] = useState<UploadedDocument[]>([])
  const [contracts, setContracts] = useState<StoredContract[]>([])
  const [selectedContractId, setSelectedContractId] = useState<string>("")
  const [showContractDropdown, setShowContractDropdown] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const stored = getStoredContracts()
    setContracts(stored)
    if (stored.length > 0 && !selectedContractId) {
      setSelectedContractId(stored[0].id)
    }
  }, [selectedContractId])

  if (contracts.length === 0) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Upload Invoices</h2>
            <p className="text-sm text-muted-foreground">Select a contract and upload an invoice to validate</p>
          </div>

          <Card className="p-12 text-center border border-border/50 bg-muted/20">
            <AlertCircle className="h-12 w-12 text-warning/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No contracts available</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Please upload contracts first on the Contracts Management page
            </p>
            <Button asChild>
              <a href="/contracts-management">Go to Contracts Management</a>
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      await processFiles(files)
    }
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      await processFiles(files)
    }
  }

  const processFiles = async (files: FileList) => {
    if (!selectedContractId) {
      alert("Please select a contract first")
      return
    }

    const selectedContract = contracts.find((c) => c.id === selectedContractId)
    if (!selectedContract) return

    const fileArray = Array.from(files)

    for (const file of fileArray) {
      const vendor = file.name.split("_")[0] || "Unknown Vendor"

      const doc: UploadedDocument = {
        id: Date.now() + Math.random(),
        name: file.name,
        type: "invoice",
        vendor,
        contractId: selectedContractId,
        contractName: selectedContract.name,
        uploadedAt: new Date().toLocaleString(),
        status: "uploading",
      }

      setDocuments((prev) => [...prev, doc])

      await new Promise((resolve) => setTimeout(resolve, 800))

      setDocuments((prev) => prev.map((d) => (d.id === doc.id ? { ...d, status: "validating" } : d)))

      try {
        const response = await fetch("/api/validate-invoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileSize: file.size,
            fileType: "invoice",
            vendor: vendor,
            contractId: selectedContractId,
            contractName: selectedContract.name,
            uploadedAt: new Date().toISOString(),
          }),
        })

        const result = await response.json()
        console.log("[v0] Validation response:", result)

        if (response.ok) {
          if (result.exceptions && result.exceptions.length > 0) {
            console.log("[v0] Saving exceptions to localStorage:", result.exceptions)
            const { addToUploadedExceptions } = await import("@/lib/use-upload-store")
            addToUploadedExceptions(result.exceptions)
            console.log("[v0] Exceptions saved successfully")
          }
          setDocuments((prev) => prev.map((d) => (d.id === doc.id ? { ...d, status: "complete" } : d)))
        } else {
          setDocuments((prev) =>
            prev.map((d) =>
              d.id === doc.id ? { ...d, status: "error", errorMessage: result.error || "Validation failed" } : d,
            ),
          )
        }
      } catch (error) {
        console.log("[v0] Upload error:", error)
        setDocuments((prev) =>
          prev.map((d) => (d.id === doc.id ? { ...d, status: "error", errorMessage: "Upload failed" } : d)),
        )
      }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "uploading":
      case "validating":
        return <Loader2 className="h-5 w-5 text-primary animate-spin" />
      case "complete":
        return <CheckCircle className="h-5 w-5 text-success" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-destructive" />
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "uploading":
        return "Uploading..."
      case "validating":
        return "Validating..."
      case "complete":
        return "Validated"
      case "error":
        return "Error"
      default:
        return "Pending"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "uploading":
      case "validating":
        return "bg-primary/10 text-primary"
      case "complete":
        return "bg-success/10 text-success"
      case "error":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-muted/50 text-muted-foreground"
    }
  }

  const completeCount = documents.filter((d) => d.status === "complete").length
  const errorCount = documents.filter((d) => d.status === "error").length

  const handleSelectFilesClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">Upload Invoices</h2>
          <p className="text-sm text-muted-foreground">
            Select a contract and upload an invoice to validate it against the contract terms
          </p>
        </div>

        <Card className="p-4 border border-border">
          <label className="block text-sm font-medium text-foreground mb-2">Select Contract to Validate Against</label>
          <div className="relative">
            <button
              onClick={() => setShowContractDropdown(!showContractDropdown)}
              className="w-full px-4 py-2.5 text-left bg-background border border-border rounded-lg hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all flex items-center justify-between"
            >
              <span className="text-foreground">
                {contracts.find((c) => c.id === selectedContractId)?.name || "Select a contract..."}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${
                  showContractDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showContractDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-10">
                {contracts.map((contract) => (
                  <button
                    key={contract.id}
                    onClick={() => {
                      setSelectedContractId(contract.id)
                      setShowContractDropdown(false)
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-muted/50 transition-colors border-b border-border last:border-b-0 first:rounded-t-lg last:rounded-b-lg"
                  >
                    <p className="font-medium text-foreground">{contract.name}</p>
                    <p className="text-xs text-muted-foreground">{contract.contractNumber}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Upload Area */}
        <Card
          className={`p-12 border-2 border-dashed transition-colors cursor-pointer ${
            dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/20"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            id="file-input"
            multiple
            accept=".pdf,.doc,.docx"
            onChange={handleFileInput}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">Drop invoice files here or click to upload</p>
              <p className="text-sm text-muted-foreground mt-1">
                Will be validated against {contracts.find((c) => c.id === selectedContractId)?.name}
              </p>
            </div>
            <Button className="mt-2" size="sm" onClick={handleSelectFilesClick}>
              Select Files
            </Button>
          </div>
        </Card>

        {/* Stats */}
        {documents.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 border border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase">Total Uploaded</p>
              <p className="text-2xl font-bold text-foreground mt-1">{documents.length}</p>
            </Card>
            <Card className="p-4 border border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase">Validated</p>
              <p className="text-2xl font-bold text-success mt-1">{completeCount}</p>
            </Card>
            <Card className="p-4 border border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase">Errors</p>
              <p className="text-2xl font-bold text-destructive mt-1">{errorCount}</p>
            </Card>
          </div>
        )}

        {/* Document List */}
        {documents.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Upload History</h3>
            <div className="space-y-3">
              {documents.map((doc) => (
                <Card key={doc.id} className="p-4 border border-border hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">{getStatusIcon(doc.status)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-foreground">{doc.name}</p>
                          <Badge variant="outline" className="text-xs">
                            Invoice
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Vendor: {doc.vendor} • Contract: {doc.contractName} • Uploaded: {doc.uploadedAt}
                        </p>
                        {doc.errorMessage && <p className="text-sm text-destructive mt-2">{doc.errorMessage}</p>}
                      </div>
                    </div>
                    <Badge className={getStatusColor(doc.status)}>{getStatusLabel(doc.status)}</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {documents.length === 0 && (
          <Card className="p-12 text-center border border-border/50 bg-muted/20">
            <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No invoices uploaded yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Select a contract above and upload an invoice to begin validation
            </p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
