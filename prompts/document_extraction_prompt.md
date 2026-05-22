# QA Document Extraction Prompt

Use this prompt behind the `/api/extract-document` endpoint when connecting a GenAI model.

Return valid JSON only. Do not guess. If a field is not visible in the OCR text, return `null`.

## Task

Extract structured QA document information from OCR text. The system supports mixed document batches and must classify both document type and document owner.

## Allowed Document Types

- `Packing List`
- `Inspection Sheet`
- `Label Image`
- `COA`
- `COC`
- `Data Logger Report`
- `Supporting Document`

## Certificate Ownership

For COA and COC documents, return:

- `document_owner: "COMPANY"` for company-approved specifications or company-approved compliance commitments.
- `document_owner: "SUPPLIER"` for supplier-provided analytical results or supplier-provided compliance declarations.

COC means **Certificate of Compliance**.

## Required JSON Shape

```json
{
  "document_type": "COA",
  "document_owner": "SUPPLIER",
  "order_id": "ORD-000000",
  "confidence": 0.0,
  "fields": {
    "lot": null,
    "ndc": null,
    "expiry": null,
    "data_logger_numbers": [],
    "coa_results": {},
    "coa_specifications": {},
    "coc_declarations": {},
    "coc_commitments": {}
  }
}
```

## Extraction Notes

- Detect varied labels such as `Order ID`, `Order No.`, `Sales Order`, `Customer Order`, `Oracle Order`, `PO / Order Ref`.
- Detect varied logger labels such as `Data Logger No.`, `Logger ID`, `Temp Logger`, `Recorder ID`, `Device Serial No.`, `DL No.`, `Serial Number`.
- For Company COA, extract analytical specifications such as assay, purity, pH, moisture, viscosity, microbiology, heavy metals, density, and appearance.
- For Supplier COA, extract analytical result values for the same fields.
- For Company COC, extract required commitments such as GMP, ISO, regulatory declarations, packaging, storage, transportation, country of origin, and agreed commitments.
- For Supplier COC, extract supplier declarations for those commitments.
