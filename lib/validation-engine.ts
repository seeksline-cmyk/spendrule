import type { StoredContract } from "./use-upload-store"

export interface ValidationResult {
  passed: boolean
  exceptions: ValidationException[]
  summary: {
    totalChecks: number
    failedChecks: number
    passedChecks: number
    recommendedPayment: number
    invoiceAmount: number
  }
}

export interface ValidationException {
  id: string
  type:
    | "price_variance"
    | "quantity_mismatch"
    | "date_violation"
    | "location_violation"
    | "duplicate"
    | "contract_compliance"
  severity: "critical" | "high" | "medium" | "low"
  title: string
  description: string
  contractValue: number
  invoiceValue: number
  variance: number
  variancePercent: number
  recommendedPayment: number
}

export function validateInvoiceAgainstContract(
  invoice: { items: InvoiceItem[]; vendor: string; invoiceDate: string; invoiceNumber: string },
  contract: StoredContract,
): ValidationResult {
  const exceptions: ValidationException[] = []

  // 1. Price Validation - Check if invoice prices match contract rates
  const priceVariances = validatePricing(invoice.items, contract)
  exceptions.push(...priceVariances)

  // 2. Quantity Validation - Check for unusual quantities
  const quantityIssues = validateQuantities(invoice.items, contract)
  exceptions.push(...quantityIssues)

  // 3. Date Validation - Check if service date is within contract period
  const dateIssues = validateDates(invoice.invoiceDate, contract)
  exceptions.push(...dateIssues)

  // 4. Location Validation - Check if location is in contract scope
  const locationIssues = validateLocations(invoice.items, contract)
  exceptions.push(...locationIssues)

  // 5. Item Matching - Check if items in invoice are in contract
  const itemMatchIssues = validateItemMatching(invoice.items, contract)
  exceptions.push(...itemMatchIssues)

  // 6. Duplicate Detection - Check for duplicate line items
  const duplicateIssues = detectDuplicates(invoice.items)
  exceptions.push(...duplicateIssues)

  // 7. Contract Terms Compliance
  const complianceIssues = validateContractCompliance(invoice.items, contract)
  exceptions.push(...complianceIssues)

  const totalInvoiceAmount = invoice.items.reduce((sum, item) => sum + item.totalAmount, 0)
  const recommendedPayment = totalInvoiceAmount - exceptions.reduce((sum, e) => sum + e.variance, 0)

  return {
    passed: exceptions.length === 0,
    exceptions,
    summary: {
      totalChecks: 7,
      failedChecks: exceptions.length,
      passedChecks: 7 - exceptions.length,
      recommendedPayment: Math.max(0, recommendedPayment),
      invoiceAmount: totalInvoiceAmount,
    },
  }
}

function validatePricing(items: InvoiceItem[], contract: StoredContract): ValidationException[] {
  const exceptions: ValidationException[] = []
  const pricingRules = extractPricingRulesFromContract(contract.extractedText)

  items.forEach((item, idx) => {
    for (const rule of pricingRules) {
      if (item.description.toLowerCase().includes(rule.itemName.toLowerCase())) {
        const expectedRate = rule.unitPrice
        const invoiceRate = item.unitPrice
        const variance = (invoiceRate - expectedRate) * item.quantity

        if (variance > expectedRate * 0.05) {
          // More than 5% variance
          exceptions.push({
            id: `price-var-${idx}`,
            type: "price_variance",
            severity: variance > expectedRate * 0.2 ? "critical" : "high",
            title: `Price Variance: ${item.description}`,
            description: `Invoiced at $${invoiceRate}/unit vs contract rate of $${expectedRate}/unit (${((invoiceRate / expectedRate - 1) * 100).toFixed(1)}% over)`,
            contractValue: expectedRate * item.quantity,
            invoiceValue: item.totalAmount,
            variance,
            variancePercent: (invoiceRate / expectedRate - 1) * 100,
            recommendedPayment: expectedRate * item.quantity,
          })
        }
      }
    }
  })

  return exceptions
}

function validateQuantities(items: InvoiceItem[], contract: StoredContract): ValidationException[] {
  const exceptions: ValidationException[] = []

  items.forEach((item, idx) => {
    // Flag unusually high quantities (>2x normal or >5000 units)
    if (item.quantity > 5000 || item.quantity > 2000) {
      exceptions.push({
        id: `qty-${idx}`,
        type: "quantity_mismatch",
        severity: item.quantity > 10000 ? "high" : "medium",
        title: `Unusual Quantity: ${item.description}`,
        description: `Quantity of ${item.quantity} units is unusually high. Recommend review for accuracy.`,
        contractValue: item.totalAmount,
        invoiceValue: item.totalAmount,
        variance: 0,
        variancePercent: 0,
        recommendedPayment: item.totalAmount,
      })
    }
  })

  return exceptions
}

function validateDates(invoiceDate: string, contract: StoredContract): ValidationException[] {
  const exceptions: ValidationException[] = []
  const invDate = new Date(invoiceDate)
  const contractStart = new Date(contract.startDate)
  const contractEnd = new Date(contract.endDate)

  if (invDate < contractStart || invDate > contractEnd) {
    exceptions.push({
      id: "date-violation",
      type: "date_violation",
      severity: "high",
      title: "Invoice Date Outside Contract Period",
      description: `Invoice dated ${invoiceDate} is outside contract period (${contract.startDate} to ${contract.endDate})`,
      contractValue: 0,
      invoiceValue: 0,
      variance: 0,
      variancePercent: 0,
      recommendedPayment: 0,
    })
  }

  return exceptions
}

function validateLocations(items: InvoiceItem[], contract: StoredContract): ValidationException[] {
  const exceptions: ValidationException[] = []

  items.forEach((item, idx) => {
    if (item.location && !contract.locations.some((loc) => loc.toLowerCase().includes(item.location.toLowerCase()))) {
      exceptions.push({
        id: `loc-${idx}`,
        type: "location_violation",
        severity: "medium",
        title: `Location Not in Contract: ${item.location}`,
        description: `Service location ${item.location} is not listed in contract scope (${contract.locations.join(", ")})`,
        contractValue: 0,
        invoiceValue: item.totalAmount,
        variance: item.totalAmount,
        variancePercent: 100,
        recommendedPayment: 0,
      })
    }
  })

  return exceptions
}

function validateItemMatching(items: InvoiceItem[], contract: StoredContract): ValidationException[] {
  const exceptions: ValidationException[] = []
  const contractItems = extractItemsFromContract(contract.extractedText)

  items.forEach((item, idx) => {
    const confidence = calculateItemMatchConfidence(item.description, contractItems)
    if (confidence < 0.5) {
      exceptions.push({
        id: `item-match-${idx}`,
        type: "contract_compliance",
        severity: "medium",
        title: `Item Not in Contract: ${item.description}`,
        description: `Item "${item.description}" does not match contract items (confidence: ${(confidence * 100).toFixed(0)}%)`,
        contractValue: 0,
        invoiceValue: item.totalAmount,
        variance: item.totalAmount,
        variancePercent: 100,
        recommendedPayment: 0,
      })
    }
  })

  return exceptions
}

function detectDuplicates(items: InvoiceItem[]): ValidationException[] {
  const exceptions: ValidationException[] = []
  const seen = new Map<string, number>()

  items.forEach((item, idx) => {
    const key = `${item.description}-${item.unitPrice}`
    if (seen.has(key)) {
      exceptions.push({
        id: `dup-${idx}`,
        type: "duplicate",
        severity: "high",
        title: `Duplicate Line Item: ${item.description}`,
        description: `This line item appears to be a duplicate of another entry on the invoice`,
        contractValue: 0,
        invoiceValue: item.totalAmount,
        variance: item.totalAmount,
        variancePercent: 100,
        recommendedPayment: 0,
      })
    } else {
      seen.set(key, idx)
    }
  })

  return exceptions
}

function validateContractCompliance(items: InvoiceItem[], contract: StoredContract): ValidationException[] {
  const exceptions: ValidationException[] = []

  // Check for volume discount applicability
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0)
  if (totalQty > 1000) {
    // If over 1000 units, check if discounts were applied
    const hasDiscount = items.some((item) => item.discount && item.discount > 0)
    if (!hasDiscount && contract.extractedText.toLowerCase().includes("volume discount")) {
      exceptions.push({
        id: "discount-compliance",
        type: "contract_compliance",
        severity: "medium",
        title: "Volume Discount Not Applied",
        description: `Invoice qualifies for volume discount (${totalQty} units > 1000) but discount was not applied`,
        contractValue: 0,
        invoiceValue: 0,
        variance: 0,
        variancePercent: 0,
        recommendedPayment: 0,
      })
    }
  }

  return exceptions
}

// Helper functions
function extractPricingRulesFromContract(text: string) {
  // Simulated extraction - in production this would use AI
  return [
    { itemName: "Implants", unitPrice: 250 },
    { itemName: "Pharma", unitPrice: 15 },
    { itemName: "Linens", unitPrice: 0.5 },
    { itemName: "Services", unitPrice: 100 },
  ]
}

function extractItemsFromContract(text: string): string[] {
  // Simulated extraction
  return ["Implants", "Pharma", "Linens", "Services", "Medical Supplies"]
}

function calculateItemMatchConfidence(item: string, contractItems: string[]): number {
  const lower = item.toLowerCase()
  for (const contractItem of contractItems) {
    if (lower.includes(contractItem.toLowerCase()) || contractItem.toLowerCase().includes(lower)) {
      return 0.9
    }
  }
  return 0.3
}

interface InvoiceItem {
  sku: string
  description: string
  quantity: number
  unitPrice: number
  totalAmount: number
  discount?: number
  location?: string
}
