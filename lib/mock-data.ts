// Parties (vendors and customer organizations)
export const mockParties = [
  { id: "party-001", name: "Premier Medical Supplies", type: "vendor", legalName: "Premier Medical Supply LLC" },
  { id: "party-002", name: "HealthCare Distribution Inc", type: "vendor", legalName: "HEALTHCARЕ DISTRIBUTION CORP" },
  { id: "party-003", name: "Precision Lab Equipment", type: "vendor", legalName: "Precision Lab Equipment Solutions" },
  { id: "party-004", name: "Medical Devices LLC", type: "vendor", legalName: "MEDICAL DEVICES OF AMERICA LLC" },
  { id: "party-005", name: "Supply Chain Partners", type: "vendor", legalName: "Supply Chain Partners Inc" },
]

// Locations (hospital facilities)
export const mockLocations = [
  { id: "loc-001", name: "Central Hospital", bedCount: 450, code: "CH-001" },
  { id: "loc-002", name: "Medical Center East", bedCount: 320, code: "MCE-001" },
  { id: "loc-003", name: "Specialty Care Facility", bedCount: 180, code: "SCF-001" },
]

// Contracts with pricing models
export const mockContracts = [
  {
    id: "ctr-001",
    vendorId: "party-001",
    contractNumber: "PMS-2024-001",
    effectiveDate: "2024-01-15",
    expirationDate: "2025-12-31",
    status: "active",
    annualValue: 500000,
    billableItems: [
      {
        id: "bi-001",
        description: "Surgical Masks (Box of 50)",
        uom: "BOX",
        contractPrice: 45.0,
        catalogNumber: "SM-50-001",
      },
      {
        id: "bi-002",
        description: "Nitrile Gloves (Box of 100)",
        uom: "BOX",
        contractPrice: 28.5,
        catalogNumber: "NG-100-001",
      },
    ],
  },
  {
    id: "ctr-002",
    vendorId: "party-002",
    contractNumber: "HDI-2024-002",
    effectiveDate: "2024-02-01",
    expirationDate: "2024-12-31",
    status: "expiring_soon",
    annualValue: 350000,
    billableItems: [
      { id: "bi-003", description: "IV Drip Sets", uom: "UNIT", contractPrice: 12.0, catalogNumber: "IVD-001" },
      { id: "bi-004", description: "Catheter Kits", uom: "UNIT", contractPrice: 35.5, catalogNumber: "CK-001" },
    ],
  },
  {
    id: "ctr-003",
    vendorId: "party-003",
    contractNumber: "PLE-2024-003",
    effectiveDate: "2024-03-01",
    expirationDate: "2025-06-30",
    status: "active",
    annualValue: 200000,
    billableItems: [
      {
        id: "bi-005",
        description: "Lab Analyzer (Model X500)",
        uom: "UNIT",
        contractPrice: 45000.0,
        catalogNumber: "LAX500",
      },
    ],
  },
  {
    id: "ctr-004",
    vendorId: "party-004",
    contractNumber: "MDL-2024-004",
    effectiveDate: "2024-01-01",
    expirationDate: "2024-12-15",
    status: "expiring_soon",
    annualValue: 750000,
    billableItems: [
      { id: "bi-006", description: "Pacemaker Device", uom: "UNIT", contractPrice: 8500.0, catalogNumber: "PM-1000" },
    ],
  },
]

// Document extraction data (proof citations from PDFs)
export const mockExtractions = [
  {
    id: "extr-001",
    documentId: "doc-inv-001",
    documentType: "invoice",
    pageNumber: 1,
    boundingBox: { x: 45, y: 120, width: 200, height: 30 },
    extractedText: "$52.00",
    confidence: 0.98,
  },
  {
    id: "extr-002",
    documentId: "doc-ctr-001",
    documentType: "contract",
    pageNumber: 3,
    boundingBox: { x: 60, y: 340, width: 150, height: 25 },
    extractedText: "$45.00 per box",
    confidence: 0.96,
  },
  {
    id: "extr-003",
    documentId: "doc-inv-002",
    documentType: "invoice",
    pageNumber: 1,
    boundingBox: { x: 50, y: 200, width: 250, height: 40 },
    extractedText: "INV-2024-8835 duplicated from 2024-11-20",
    confidence: 0.99,
  },
]

// Validation exceptions with proof citations
export const mockExceptions = [
  {
    id: "exc-001",
    invoiceId: "inv-001",
    invoiceNumber: "INV-2024-8834",
    vendorId: "party-001",
    vendorName: "Premier Medical Supplies",
    exceptionType: "price_overcharge",
    severity: "high",
    resolutionStatus: "open",
    expectedValue: 11250, // 250 boxes × $45
    actualValue: 13000, // 250 boxes × $52
    varianceAmount: 1750,
    description: "Unit price variance: Contract rate $45/box but invoice charged $52/box",
    contractExtractionId: "extr-002",
    invoiceExtractionId: "extr-001",
    contractProof: {
      contractNumber: "PMS-2024-001",
      text: "$45.00 per box",
      pageNumber: 3,
    },
    invoiceProof: {
      invoiceNumber: "INV-2024-8834",
      text: "$52.00",
      pageNumber: 1,
    },
    billableItemId: "bi-001",
    quantity: 250,
    uom: "BOX",
    date: "2024-11-22",
  },
  {
    id: "exc-002",
    invoiceId: "inv-002",
    invoiceNumber: "INV-2024-8835",
    vendorId: "party-002",
    vendorName: "HealthCare Distribution Inc",
    exceptionType: "duplicate_invoice",
    severity: "critical",
    resolutionStatus: "open",
    expectedValue: 0,
    actualValue: 8200,
    varianceAmount: 8200,
    description: "Duplicate invoice detected from prior period",
    contractExtractionId: null,
    invoiceExtractionId: "extr-003",
    contractProof: null,
    invoiceProof: {
      invoiceNumber: "INV-2024-8835",
      text: "Duplicate of invoice from 2024-11-20",
      pageNumber: 1,
    },
    date: "2024-11-21",
  },
  {
    id: "exc-003",
    invoiceId: "inv-003",
    invoiceNumber: "INV-2024-8836",
    vendorId: "party-003",
    vendorName: "Precision Lab Equipment",
    exceptionType: "unauthorized_item",
    severity: "medium",
    resolutionStatus: "open",
    expectedValue: 0,
    actualValue: 3400,
    varianceAmount: 3400,
    description: "Item not on approved contract",
    contractExtractionId: null,
    invoiceExtractionId: null,
    contractProof: null,
    invoiceProof: null,
    billableItemId: null,
    date: "2024-11-21",
  },
  {
    id: "exc-004",
    invoiceId: "inv-004",
    invoiceNumber: "INV-2024-8837",
    vendorId: "party-004",
    vendorName: "Medical Devices LLC",
    exceptionType: "expired_contract",
    severity: "high",
    resolutionStatus: "open",
    expectedValue: 0,
    actualValue: 5600,
    varianceAmount: 5600,
    description: "Invoice dated after contract expiration",
    contractExtractionId: null,
    invoiceExtractionId: null,
    contractProof: null,
    invoiceProof: null,
    date: "2024-11-20",
  },
]

// Invoices
export const mockInvoices = [
  {
    id: "inv-001",
    invoiceNumber: "INV-2024-8834",
    vendorId: "party-001",
    invoiceDate: "2024-11-22",
    grossAmount: 13000,
    status: "exception",
    approvalStatus: "pending_review",
    lineItems: [
      { id: "li-001", description: "Surgical Masks (Box of 50)", quantity: 250, unitPrice: 52.0, total: 13000 },
    ],
  },
  {
    id: "inv-002",
    invoiceNumber: "INV-2024-8835",
    vendorId: "party-002",
    invoiceDate: "2024-11-21",
    grossAmount: 8200,
    status: "exception",
    approvalStatus: "pending_review",
    lineItems: [{ id: "li-002", description: "IV Drip Sets", quantity: 650, unitPrice: 12.62, total: 8200 }],
  },
  {
    id: "inv-003",
    invoiceNumber: "INV-2024-8836",
    vendorId: "party-003",
    invoiceDate: "2024-11-21",
    grossAmount: 3400,
    status: "exception",
    approvalStatus: "pending_review",
    lineItems: [{ id: "li-003", description: "Unlisted Item", quantity: 1, unitPrice: 3400.0, total: 3400 }],
  },
  {
    id: "inv-004",
    invoiceNumber: "INV-2024-8837",
    vendorId: "party-004",
    invoiceDate: "2024-11-20",
    grossAmount: 5600,
    status: "exception",
    approvalStatus: "pending_review",
    lineItems: [{ id: "li-004", description: "Pacemaker Device", quantity: 1, unitPrice: 5600.0, total: 5600 }],
  },
]

// Vendor scorecards (aggregated metrics)
export const mockVendorMetrics = [
  {
    vendorId: "party-001",
    vendorName: "Premier Medical Supplies",
    totalInvoices: 142,
    totalSpend: 1775000,
    exceptionCount: 12,
    overchargeAmount: 35000,
    recoveredAmount: 28500,
    complianceRate: 91.5,
    recoveryRate: 81.4,
    riskScore: "medium",
  },
  {
    vendorId: "party-002",
    vendorName: "HealthCare Distribution Inc",
    totalInvoices: 89,
    totalSpend: 729800,
    exceptionCount: 3,
    overchargeAmount: 2400,
    recoveredAmount: 2400,
    complianceRate: 96.6,
    recoveryRate: 100,
    riskScore: "low",
  },
  {
    vendorId: "party-003",
    vendorName: "Precision Lab Equipment",
    totalInvoices: 56,
    totalSpend: 235200,
    exceptionCount: 4,
    overchargeAmount: 8900,
    recoveredAmount: 7200,
    complianceRate: 92.9,
    recoveryRate: 80.9,
    riskScore: "low",
  },
  {
    vendorId: "party-004",
    vendorName: "Medical Devices LLC",
    totalInvoices: 78,
    totalSpend: 1450800,
    exceptionCount: 18,
    overchargeAmount: 52000,
    recoveredAmount: 44000,
    complianceRate: 76.9,
    recoveryRate: 84.6,
    riskScore: "high",
  },
  {
    vendorId: "party-005",
    vendorName: "Supply Chain Partners",
    totalInvoices: 201,
    totalSpend: 1127600,
    exceptionCount: 8,
    overchargeAmount: 12300,
    recoveredAmount: 11200,
    complianceRate: 96.0,
    recoveryRate: 91.1,
    riskScore: "low",
  },
]

// Service category benchmarks
export const mockBenchmarks = [
  {
    category: "Surgical Supplies",
    yourRate: 45.0,
    medianRate: 42.5,
    p25Rate: 38.0,
    p75Rate: 48.5,
    percentile: 68,
    vendors: ["Premier Medical Supplies", "Supply Chain Partners"],
  },
  {
    category: "IV Equipment",
    yourRate: 12.0,
    medianRate: 11.8,
    p25Rate: 10.5,
    p75Rate: 13.2,
    percentile: 52,
    vendors: ["HealthCare Distribution Inc"],
  },
  {
    category: "Lab Equipment",
    yourRate: 45000.0,
    medianRate: 43000.0,
    p25Rate: 39000.0,
    p75Rate: 47500.0,
    percentile: 62,
    vendors: ["Precision Lab Equipment"],
  },
  {
    category: "Medical Devices",
    yourRate: 8500.0,
    medianRate: 8200.0,
    p25Rate: 7500.0,
    p75Rate: 9100.0,
    percentile: 71,
    vendors: ["Medical Devices LLC"],
  },
]

// Savings summary
export const mockSavings = {
  totalSavings: 127400,
  monthlyRate: 18200,
  percentageOfSpend: 3.8,
  potentialSavings: 98900,
  recoveredSavings: 28500,
  topExceptionType: "price_overcharge",
  categories: [
    { name: "Price Overcharges", value: 42000, count: 23 },
    { name: "Duplicate Charges", value: 31500, count: 8 },
    { name: "Unauthorized Items", value: 28900, count: 12 },
    { name: "Contract Violations", value: 15000, count: 5 },
    { name: "Early Payment Discounts", value: 10000, count: 15 },
  ],
}

// Approval levels configuration
export const mockApprovalLevels = [
  { level: 1, title: "AP Specialist", maxAmount: 500, roleId: "role-001" },
  { level: 2, title: "AP Manager", maxAmount: 5000, roleId: "role-002" },
  { level: 3, title: "Director of Supply Chain", maxAmount: 50000, roleId: "role-003" },
  { level: 4, title: "CFO", maxAmount: Number.POSITIVE_INFINITY, roleId: "role-004" },
]

// Materialized View 1: vw_my_approvals - User's personalized approvals and exceptions
export const mockMyApprovals = mockExceptions.slice(0, 2).map((exc) => ({
  ...exc,
  assignedTo: "john.smith@hospital.org",
  priority: exc.severity === "critical" ? "high" : "medium",
  days_pending: Math.floor(Math.random() * 10) + 1,
}))

// Materialized View 2: vw_open_exceptions - All open exceptions across system
export const mockOpenExceptions = mockExceptions.filter((e) => e.resolutionStatus === "open")

// Materialized View 3: vw_invoice_dashboard - Invoice processing status metrics
export const mockInvoiceDashboard = {
  total_invoices: mockInvoices.length,
  total_spend: mockInvoices.reduce((sum, i) => sum + i.grossAmount, 0),
  approved_invoices: mockInvoices.filter((i) => i.approvalStatus === "approved").length,
  pending_invoices: mockInvoices.filter((i) => i.approvalStatus === "pending_review").length,
  exception_invoices: mockInvoices.filter((i) => i.status === "exception").length,
  invoices_by_status: {
    auto_approved: mockInvoices.filter((i) => i.approvalStatus === "auto_approved").length || 0,
    pending_review: mockInvoices.filter((i) => i.approvalStatus === "pending_review").length,
    approved: mockInvoices.filter((i) => i.approvalStatus === "approved").length,
    rejected: mockInvoices.filter((i) => i.approvalStatus === "rejected").length || 0,
  },
}

// Materialized View 4: vw_auto_approval_metrics - Auto-approval performance KPIs
export const mockAutoApprovalMetrics = {
  auto_approved_count: 87,
  auto_approved_amount: 456000,
  total_processed: mockInvoices.length,
  total_spend: mockInvoices.reduce((sum, i) => sum + i.grossAmount, 0),
  auto_approval_rate: 72.5,
  touchless_rate: 65.2,
  avg_cycle_time_hours: 2.3,
  monthly_trend: [
    { date: "2024-11-01", approved: 45, rejected: 8, pending: 12 },
    { date: "2024-11-05", approved: 52, rejected: 5, pending: 10 },
    { date: "2024-11-10", approved: 61, rejected: 3, pending: 8 },
    { date: "2024-11-15", approved: 58, rejected: 7, pending: 11 },
    { date: "2024-11-20", approved: 63, rejected: 2, pending: 6 },
    { date: "2024-11-24", approved: 71, rejected: 4, pending: 5 },
  ],
}

// Materialized View 5: vw_vendor_scorecard - Vendor performance aggregations
export const mockVendorScorecard = mockVendorMetrics

// Materialized View 6: vw_price_variance_detail - Detailed price variance analysis
export const mockPriceVarianceDetail = mockExceptions
  .filter((e) => e.exceptionType === "price_overcharge")
  .map((exc) => ({
    ...exc,
    variance_percentage: ((exc.varianceAmount / exc.expectedValue) * 100).toFixed(1),
    category: "Surgical Supplies",
  }))
  .sort((a, b) => b.varianceAmount - a.varianceAmount)
  .slice(0, 10)

// Materialized View 7: vw_contract_coverage - Contract coverage and expiration tracking
export const mockContractCoverage = mockContracts.map((ctr) => {
  const today = new Date("2024-11-24")
  const expirationDate = new Date(ctr.expirationDate)
  const daysUntilExpiration = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const status =
    daysUntilExpiration <= 0
      ? "expired"
      : daysUntilExpiration <= 90
        ? "expiring_soon"
        : daysUntilExpiration <= 180
          ? "upcoming"
          : "active"

  return {
    ...ctr,
    days_until_expiration: daysUntilExpiration,
    age_in_days: Math.ceil((today.getTime() - new Date(ctr.effectiveDate).getTime()) / (1000 * 60 * 60 * 24)),
    status,
    billable_items_count: ctr.billableItems.length,
    invoices_this_period: Math.floor(Math.random() * 50) + 5,
  }
})

// Materialized View 8: vw_location_spend_analysis - Spend analysis by facility
export const mockLocationSpendAnalysis = mockLocations.map((loc) => {
  const facilitySpend = Math.floor(Math.random() * 500000) + 100000
  const facilitySavings = Math.floor(facilitySpend * 0.038) // 3.8% average savings rate
  const facilityExceptions = Math.floor(Math.random() * 15) + 2

  return {
    ...loc,
    total_spend: facilitySpend,
    total_savings: facilitySavings,
    exception_count: facilityExceptions,
    compliance_rate: 91 + Math.random() * 7,
    top_vendor: mockVendorMetrics[Math.floor(Math.random() * mockVendorMetrics.length)],
  }
})

// Materialized View 9: vw_exception_proof_citations - Exceptions with proof extraction details
export const mockExceptionProofCitations = mockExceptions.map((exc) => ({
  ...exc,
  contract_citation: exc.contractProof
    ? {
        document_id: "doc-ctr-001",
        page: exc.contractProof.pageNumber,
        text: exc.contractProof.text,
        confidence: 0.96,
        bounding_box: { x: 60, y: 340, width: 150, height: 25 },
      }
    : null,
  invoice_citation: exc.invoiceProof
    ? {
        document_id: "doc-inv-001",
        page: exc.invoiceProof.pageNumber,
        text: exc.invoiceProof.text,
        confidence: 0.98,
        bounding_box: { x: 45, y: 120, width: 200, height: 30 },
      }
    : null,
}))

// Materialized View 10: vw_recovery_pipeline - Recovery rate trends and aging
export const mockRecoveryPipeline = {
  total_identified: 98900,
  recovered_ytd: 127400,
  pending_approval: 28500,
  pending_processing: 15600,
  disputed: 12800,
  monthly_recovery_rate: [
    { month: "Aug", rate: 68, amount: 8500 },
    { month: "Sep", rate: 72, amount: 12300 },
    { month: "Oct", rate: 78, amount: 14200 },
    { month: "Nov", rate: 81, amount: 18500 },
  ],
  recovery_by_category: [
    { name: "Price Overcharges", recovered: 42000, identified: 52000, rate: 80.8 },
    { name: "Duplicate Charges", recovered: 31500, identified: 31500, rate: 100 },
    { name: "Unauthorized Items", recovered: 28900, identified: 38500, rate: 75.1 },
    { name: "Contract Violations", recovered: 15000, identified: 22000, rate: 68.2 },
    { name: "Early Payment Disc.", recovered: 10000, identified: 12000, rate: 83.3 },
  ],
}
