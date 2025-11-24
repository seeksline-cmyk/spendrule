interface DocumentProof {
  documentId: string
  documentName: string
  documentType: "contract" | "invoice"
  extractedText: string
  pageNumber: number
  uploadedAt: string
}

interface UploadedException {
  id: string
  invoiceNumber: string
  vendorName: string
  varianceAmount: number
  severity: string
  uploadedAt: string
  contractProof?: DocumentProof
  invoiceProof?: DocumentProof
  expectedValue: number
  actualValue: number
  exceptionType: string
  description: string
}

interface UploadedDocument {
  id: string
  name: string
  type: "contract" | "invoice"
  vendor: string
  uploadedAt: string
  extractedText: string
}

export interface StoredContract {
  id: string
  name: string
  vendor: string
  contractNumber: string
  startDate: string
  endDate: string
  extractedText: string
  uploadedAt: string
  locations: string[]
  pricingRules: {
    itemName: string
    unitPrice: number
    unit: string
  }[]
}

interface UploadStore {
  uploadedExceptions: UploadedException[]
  uploadedDocuments: UploadedDocument[]
  storedContracts: StoredContract[]
  addExceptions: (exceptions: UploadedException[]) => void
  addDocument: (document: UploadedDocument) => void
  addContract: (contract: StoredContract) => void
  clearExceptions: () => void
}

export function getUploadedExceptions(): UploadedException[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("spendRule_uploadedExceptions")
  return stored ? JSON.parse(stored) : []
}

export function getUploadedDocuments(): UploadedDocument[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("spendRule_uploadedDocuments")
  return stored ? JSON.parse(stored) : []
}

export function getStoredContracts(): StoredContract[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("spendRule_storedContracts")
  return stored ? JSON.parse(stored) : []
}

export function saveUploadedExceptions(exceptions: UploadedException[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("spendRule_uploadedExceptions", JSON.stringify(exceptions))
  }
}

export function saveUploadedDocuments(documents: UploadedDocument[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("spendRule_uploadedDocuments", JSON.stringify(documents))
  }
}

export function saveStoredContracts(contracts: StoredContract[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("spendRule_storedContracts", JSON.stringify(contracts))
  }
}

export function addToUploadedExceptions(newExceptions: UploadedException[]) {
  const current = getUploadedExceptions()
  const merged = [...current, ...newExceptions]
  saveUploadedExceptions(merged)
}

export function addUploadedDocument(document: UploadedDocument) {
  const current = getUploadedDocuments()
  const merged = [...current, document]
  saveUploadedDocuments(merged)
}

export function addStoredContract(contract: StoredContract) {
  const current = getStoredContracts()
  const merged = [...current, contract]
  saveStoredContracts(merged)
}

export function clearUploadedExceptions() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("spendRule_uploadedExceptions")
  }
}

export function clearUploadedDocuments() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("spendRule_uploadedDocuments")
  }
}

export function clearStoredContracts() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("spendRule_storedContracts")
  }
}

export function deleteStoredContract(id: string) {
  const current = getStoredContracts()
  const filtered = current.filter((c) => c.id !== id)
  saveStoredContracts(filtered)
}
