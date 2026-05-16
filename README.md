# QA Release Intelligence Prototype

This is a stakeholder demonstration prototype for a GenAI-assisted QA document verification and release decision support system.

## Run

```powershell
node server.js
```

Then open:

```text
http://localhost:4173
```

## What It Demonstrates

- Bulk QA document upload/intake
- Smart grouping of mixed documents into separate Order IDs
- Simulated OCR/NLP processing workflow before dashboard review
- Missing inspection field resolution using QA-entered values, `0`, or `NULL`
- QA release queue
- OCR/NLP extraction results for Order ID and data logger numbers
- Oracle reference comparison
- Company-vs-Supplier COA/COC validation and label verification
- Validation rule matrix output
- Prescriptive release recommendation
- Exception queue and audit trail

The OCR/GenAI results are simulated with realistic structured demo data so the architecture and workflow can be presented without connecting to enterprise systems.

## Dummy Document Pack

Generated PDFs are available under:

```text
dummy_qa_documents/
```

Each order folder contains:

- Packing list
- QA inspection sheet
- Product label PDF
- Company Certificate of Analysis
- Supplier Certificate of Analysis
- Company Certificate of Compliance
- Supplier Certificate of Compliance
- Data logger report

COC means Certificate of Compliance in this project. The corrected workflow compares Supplier COA against Company COA and Supplier COC against Company COC. Overall certificate result is `PASS` only when both COA validation and COC validation pass.

Certificate documents use owner-aware structure:

```json
{
  "document_type": "COA",
  "document_owner": "SUPPLIER",
  "fields": {}
}
```

Allowed `document_owner` values are `COMPANY` and `SUPPLIER`.
