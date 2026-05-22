# QA Release Intelligence

QA document verification and release decision support application for OCR-based intake, structured extraction, validation, and auditable QA review.

## Run

```powershell
node server.js
```

Then open:

```text
http://localhost:4173
```

## Capabilities

- Bulk QA document upload/intake
- Smart grouping of mixed documents into separate Order IDs
- Real browser-side OCR using PDF.js page rendering plus Tesseract.js
- GenAI-ready NLP extraction via `/api/extract-document`, with deterministic local fallback for continuity
- Editable missing inspection field resolution using QA-entered values, `0`, or `NULL`
- QA release queue
- OCR/NLP extraction results for Order ID and data logger numbers
- Oracle reference comparison
- Company-vs-Supplier COA/COC validation and label verification
- Validation rule matrix output
- Prescriptive release recommendation
- Exception queue and audit trail

The OCR layer performs actual Tesseract recognition. The GenAI extraction layer is designed as a backend-safe integration point: configure `GENAI_EXTRACTION_ENDPOINT` and optional `GENAI_EXTRACTION_TOKEN` on the Node server to connect a real extraction model without exposing credentials in the browser.

For best results, run through the local server instead of opening `index.html` directly:

```powershell
node server.js
```

Then open `http://localhost:4173`.

The extraction prompt template is stored at:

```text
prompts/document_extraction_prompt.md
```

## Expected Document Package

Each order should include:

- Packing list
- QA inspection sheet
- Product label PDF
- Company Certificate of Analysis
- Supplier Certificate of Analysis
- Company Certificate of Compliance
- Supplier Certificate of Compliance
- Data logger report

COC means Certificate of Compliance in this project. The workflow compares Supplier COA against Company COA and Supplier COC against Company COC. Overall certificate result is `PASS` only when both COA validation and COC validation pass.

Certificate documents use owner-aware structure:

```json
{
  "document_type": "COA",
  "document_owner": "SUPPLIER",
  "fields": {}
}
```

Allowed `document_owner` values are `COMPANY` and `SUPPLIER`.
