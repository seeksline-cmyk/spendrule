import { getStoredContracts } from "@/lib/use-upload-store"
import { validateInvoiceAgainstContract } from "@/lib/validation-engine"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fileName, fileType, vendor, contractId, contractName, uploadedAt } = body

    if (fileType !== "invoice") {
      return Response.json({ error: "Only invoices can be validated" }, { status: 400 })
    }

    if (!contractId) {
      return Response.json({ error: "Contract ID is required" }, { status: 400 })
    }

    const contracts = getStoredContracts()
    const selectedContract = contracts.find((c) => c.id === contractId)

    if (!selectedContract) {
      return Response.json({ error: "Contract not found" }, { status: 404 })
    }

    const validationResult = runInvoiceValidation(fileName, vendor, selectedContract, uploadedAt)

    if (validationResult.success) {
      return Response.json({
        success: true,
        exceptionId: validationResult.exceptionId,
        message: validationResult.message,
        exceptions: validationResult.exceptions,
        documentId: validationResult.documentId,
        validationSummary: validationResult.summary,
      })
    } else {
      return Response.json({ error: validationResult.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Validation error:", error)
    return Response.json({ error: "Validation failed" }, { status: 500 })
  }
}

function runInvoiceValidation(fileName: string, vendor: string, contract: any, uploadedAt: string) {
  try {
    const documentId = `doc-${Date.now()}-${Math.random()}`

    // Simulate extracting invoice data from file
    const simulatedInvoice = {
      invoiceNumber: `INV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      vendor: vendor,
      invoiceDate: new Date().toISOString().split("T")[0],
      items: [
        {
          sku: "SKU-001",
          description: "Implants",
          quantity: 500,
          unitPrice: 260, // 4% over contract
          totalAmount: 130000,
          location: "Primary Location",
        },
        {
          sku: "SKU-002",
          description: "Pharma",
          quantity: 2000,
          unitPrice: 18, // 20% over contract
          totalAmount: 36000,
          location: "Primary Location",
        },
        {
          sku: "SKU-003",
          description: "Linens",
          quantity: 5000,
          unitPrice: 0.52, // 4% over contract
          totalAmount: 2600,
          location: "Primary Location",
        },
      ],
    }

    const result = validateInvoiceAgainstContract(simulatedInvoice, contract)

    // Convert validation exceptions to SpendRule exceptions format
    const exceptions = result.exceptions.map((exc: any, idx: number) => ({
      id: `generated-${Date.now()}-${idx}`,
      invoiceNumber: simulatedInvoice.invoiceNumber,
      vendorName: vendor,
      varianceAmount: exc.variance,
      severity: exc.severity,
      uploadedAt,
      contractProof: {
        documentId: `contract-ref-${idx}`,
        documentName: contract.name,
        documentType: "contract" as const,
        extractedText: `Contract Term: ${exc.title}. Expected: ${exc.contractValue}. Contract specifies ${contract.contractNumber}.`,
        pageNumber: 1,
        uploadedAt: contract.uploadedAt,
      },
      invoiceProof: {
        documentId: documentId,
        documentName: fileName,
        documentType: "invoice" as const,
        extractedText: `Invoice Item: ${exc.title}. Actual: ${exc.invoiceValue}. Line item on invoice.`,
        pageNumber: 1,
        uploadedAt: uploadedAt,
      },
      expectedValue: exc.contractValue,
      actualValue: exc.invoiceValue,
      exceptionType: exc.type,
      description: exc.description,
    }))

    return {
      success: true,
      exceptionId: exceptions.length > 0 ? exceptions[0].id : `validation-${Date.now()}`,
      exceptions,
      documentId,
      summary: result.summary,
      message:
        exceptions.length > 0 ? `Found ${exceptions.length} validation exceptions` : "Invoice validated successfully",
    }
  } catch (error) {
    console.error("Validation engine error:", error)
    return {
      success: false,
      error: "Validation engine error",
    }
  }
}
