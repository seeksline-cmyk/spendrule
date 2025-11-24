"use client"

import React from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  getStoredContracts,
  addStoredContract,
  deleteStoredContract,
  type StoredContract,
} from "@/lib/use-upload-store"
import { useState, useEffect } from "react"
import { Plus, Trash2, Upload, Calendar } from "lucide-react"

export default function ContractsManagementPage() {
  const [contracts, setContracts] = useState<StoredContract[]>([])
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  useEffect(() => {
    setContracts(getStoredContracts())
  }, [])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      // Simulate file reading and text extraction
      const text = await file.text()
      const newContract: StoredContract = {
        id: `contract_${Date.now()}`,
        name: file.name.replace(/\.pdf$/i, ""),
        vendor: "New Vendor", // Would be extracted from contract
        contractNumber: `C-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        extractedText: text,
        uploadedAt: new Date().toISOString(),
        locations: ["Primary Location"],
        pricingRules: [],
      }

      addStoredContract(newContract)
      setContracts([...contracts, newContract])
      setShowUploadForm(false)
      setUploading(false)
    } catch (error) {
      console.error("Error processing contract:", error)
      setUploading(false)
    }
  }

  const handleDelete = (id: string) => {
    deleteStoredContract(id)
    setContracts(contracts.filter((c) => c.id !== id))
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Contracts Management</h2>
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            <Plus className="h-4 w-4 mr-2" />
            {uploading ? "Uploading..." : "Upload Contract"}
          </Button>
          <input ref={fileInputRef} type="file" accept=".pdf,.txt" onChange={handleFileSelect} className="hidden" />
        </div>

        {contracts.length === 0 ? (
          <Card className="p-12 text-center">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">No contracts uploaded yet</p>
            <Button onClick={() => fileInputRef.current?.click()}>Upload Your First Contract</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contracts.map((contract) => (
              <Card key={contract.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground truncate">{contract.name}</h3>
                    <p className="text-xs text-muted-foreground">{contract.contractNumber}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(contract.id)}
                    className="p-1 hover:bg-destructive/10 rounded text-destructive/70 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-medium">Vendor:</span>
                    <span>{contract.vendor}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {contract.startDate} to {contract.endDate}
                    </span>
                  </div>
                </div>

                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  Active
                </Badge>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
