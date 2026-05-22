/* QA Release Intelligence
   Main browser application. The app is intentionally dependency-light:
   upload documents, OCR them, extract structured fields, validate the QA
   release package, and present an auditable review dashboard. */

// ---------------------------------------------------------------------------
// Configuration and State
// ---------------------------------------------------------------------------

const DOCUMENT_OWNERS = Object.freeze({
  COMPANY: "COMPANY",
  SUPPLIER: "SUPPLIER",
});

const DOCUMENT_TYPES = Object.freeze({
  PACKING_LIST: "Packing List",
  INSPECTION_SHEET: "Inspection Sheet",
  LABEL_IMAGE: "Label Image",
  COA: "COA",
  COC: "COC",
  DATA_LOGGER_REPORT: "Data Logger Report",
  SUPPORTING: "Supporting Document",
});

const CERTIFICATE_FIELDS = Object.freeze({
  analytical: ["assay", "purity", "pH", "moisture", "viscosity", "microbiology", "heavyMetals", "density", "appearance"],
  compliance: ["gmpCompliance", "isoCompliance", "regulatoryDeclarations", "packagingCompliance", "storageConditions", "transportationConditions", "countryOfOrigin", "agreedCommitments"],
});

const REQUIRED_DOCUMENTS = [
  DOCUMENT_TYPES.PACKING_LIST,
  DOCUMENT_TYPES.INSPECTION_SHEET,
  DOCUMENT_TYPES.LABEL_IMAGE,
  "Company COA",
  "Supplier COA",
  "Company COC",
  "Supplier COC",
  DOCUMENT_TYPES.DATA_LOGGER_REPORT,
];

const GEN_AI_CONFIG = Object.freeze({
  // Browser calls the local server. The server can forward to a real model
  // without exposing API credentials in frontend code.
  extractionEndpoint: "/api/extract-document",
});

const state = {
  cases: [],
  selectedCaseId: null,
  tab: "upload",
  stage: "intake",
  uploadedFiles: [],
  processLog: [],
  ocrProgress: [],
  fieldHistory: [],
  processing: false,
};

// ---------------------------------------------------------------------------
// Utility Helpers
// ---------------------------------------------------------------------------

function byId(id) {
  return document.getElementById(id);
}

function normalizeOrder(value) {
  return String(value || "").toUpperCase().replace(/^ORD-?/, "").replace(/^SO-?/, "").replace(/^0+/, "").replace(/[^A-Z0-9]/g, "");
}

function normalizeId(value) {
  return String(value || "").toUpperCase().replace(/\s+/g, "").replace(/[^A-Z0-9]/g, "");
}

function valueOrBlank(value) {
  return value === null || value === undefined || value === "" ? "Blank" : String(value);
}

function isResolvedValue(value) {
  return value !== null && value !== undefined && value !== "";
}

function numberOrNull(value) {
  if (value === null || value === undefined) return null;
  const clean = String(value).trim();
  if (!clean || clean.toUpperCase() === "NULL") return clean.toUpperCase() === "NULL" ? "NULL" : null;
  const parsed = Number(clean);
  return Number.isFinite(parsed) ? parsed : null;
}

function findFirst(text, regex) {
  const match = String(text || "").match(regex);
  if (!match) return null;
  return match.length > 1 ? String(match[1]).trim() : String(match[0]).trim();
}

function findAll(text, regex) {
  return [...String(text || "").matchAll(regex)].map((match) => String(match[1] || match[0]).trim()).filter(Boolean);
}

function unique(values) {
  return [...new Set(values)];
}

function statusClass(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "pass" || normalized.includes("ready") || normalized.includes("within")) return "good";
  if (normalized === "fail" || normalized.includes("hold") || normalized.includes("missing") || normalized.includes("unsigned") || normalized.includes("excursion") || normalized.includes("correction")) return "bad";
  if (normalized.includes("review") || normalized.includes("low") || normalized.includes("pending")) return "warn";
  return "neutral";
}

function icon(name) {
  const icons = {
    queue: "M4 7h16M4 12h16M4 17h10",
    shield: "M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-3z",
    file: "M7 3h7l5 5v13H7V3z M14 3v6h5",
    scan: "M5 8V5h3M16 5h3v3M19 16v3h-3M8 19H5v-3M8 12h8",
    alert: "M12 3l10 18H2L12 3z M12 9v5 M12 17h.01",
    check: "M20 6L9 17l-5-5",
    clock: "M12 6v6l4 2 M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0z",
    database: "M4 6c0-2 16-2 16 0v12c0 2-16 2-16 0V6z M4 6c0 2 16 2 16 0 M4 12c0 2 16 2 16 0",
  };
  return `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="${icons[name]}"></path></svg>`;
}

// ---------------------------------------------------------------------------
// Document Classification and OCR
// ---------------------------------------------------------------------------

function inferDocumentType(fileName, text = "") {
  const source = `${fileName} ${text}`.toLowerCase();
  if (source.includes("packing")) return DOCUMENT_TYPES.PACKING_LIST;
  if (source.includes("inspection")) return DOCUMENT_TYPES.INSPECTION_SHEET;
  if (source.includes("label")) return DOCUMENT_TYPES.LABEL_IMAGE;
  if (source.includes("logger") || source.includes("temperature data")) return DOCUMENT_TYPES.DATA_LOGGER_REPORT;
  if (source.includes("coa") || source.includes("certificate of analysis") || source.includes("certificate_of_analysis")) return DOCUMENT_TYPES.COA;
  if (source.includes("coc") || source.includes("certificate of compliance") || source.includes("certificate_of_compliance")) return DOCUMENT_TYPES.COC;
  return DOCUMENT_TYPES.SUPPORTING;
}

function inferDocumentOwner(fileName, text = "") {
  const lowerName = String(fileName || "").toLowerCase();
  const rawText = String(text || "");
  const lowerText = rawText.toLowerCase();

  // Explicit owner signals win over broad words. Supplier documents often
  // mention company specifications, so scanning for "company" first is unsafe.
  if (/\bsupplier\b|supplier_|_supplier|vendor|manufacturer/.test(lowerName)) return DOCUMENT_OWNERS.SUPPLIER;
  if (/\bcompany\b|company_|_company|internal|master/.test(lowerName)) return DOCUMENT_OWNERS.COMPANY;

  const explicitOwner = rawText.match(/Document Owner:\s*(COMPANY|SUPPLIER)/i);
  if (explicitOwner) return explicitOwner[1].toUpperCase();
  if (/^\s*SUPPLIER\s+Certificate/im.test(rawText) || /Supplier-provided/i.test(rawText)) return DOCUMENT_OWNERS.SUPPLIER;
  if (/^\s*COMPANY\s+Certificate/im.test(rawText) || /Company-approved/i.test(rawText)) return DOCUMENT_OWNERS.COMPANY;
  if (/\b(supplier|vendor|manufacturer|provided)\b/.test(lowerText)) return DOCUMENT_OWNERS.SUPPLIER;
  if (/\b(company-approved|approved company reference|master specification|internal specification)\b/.test(lowerText)) return DOCUMENT_OWNERS.COMPANY;

  return DOCUMENT_OWNERS.SUPPLIER;
}

function inferOrderId(fileName, text = "") {
  const found = findFirst(text, /(?:Order ID|Order No\.|Oracle Order|Sales Order|Customer Order|Order Reference|PO \/ Order Ref):?\s*([A-Z]{2,4}[- ]?\d{6})/i);
  if (found) return found;
  const fileMatch = String(fileName || "").toUpperCase().match(/ORD[-_ ]?\d{6}/);
  return fileMatch ? fileMatch[0].replace("_", "-").replace(" ", "-") : "Pending OCR";
}

function setPdfWorkerIfAvailable() {
  if (window.pdfjsLib && !window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }
}

async function performRealOcr(upload) {
  if (!upload.file) return { text: "", method: "none", confidence: 0 };
  const mime = upload.file.type || "";
  const lowerName = upload.name.toLowerCase();

  if (mime.includes("pdf") || lowerName.endsWith(".pdf")) return ocrPdf(upload.file, upload.name);
  if (mime.startsWith("image/") || /\.(png|jpe?g|tif?f|bmp|webp)$/i.test(lowerName)) return ocrImage(upload.file, upload.name);
  return { text: "", method: "unsupported", confidence: 0 };
}

async function ocrImage(file, fileName) {
  ensureTesseractAvailable();
  state.ocrProgress.push(`OCR started for image ${fileName}`);
  const result = await Tesseract.recognize(file, "eng", {
    logger: (message) => recordOcrProgress(fileName, message),
  });
  state.ocrProgress.push(`OCR completed for image ${fileName}`);
  return { text: result.data.text || "", method: "tesseract-image", confidence: Math.round(result.data.confidence || 0) / 100 };
}

async function ocrPdf(file, fileName) {
  ensurePdfJsAvailable();
  ensureTesseractAvailable();
  setPdfWorkerIfAvailable();

  const data = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data }).promise;
  const pageTexts = [];
  state.ocrProgress.push(`OCR started for PDF ${fileName} (${pdf.numPages} page${pdf.numPages === 1 ? "" : "s"})`);

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textLayer = await page.getTextContent();
    const digitalText = textLayer.items.map((item) => item.str).join("\n");

    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    await page.render({ canvasContext: context, viewport }).promise;
    const ocrResult = await Tesseract.recognize(canvas, "eng", {
      logger: (message) => recordOcrProgress(`${fileName} page ${pageNumber}`, message),
    });
    pageTexts.push([digitalText, ocrResult.data.text || ""].filter(Boolean).join("\n"));
  }

  state.ocrProgress.push(`OCR completed for PDF ${fileName}`);
  return { text: pageTexts.join("\n"), method: "pdfjs-text+pdfjs-render+tesseract", confidence: 0.9 };
}

function ensurePdfJsAvailable() {
  if (!window.pdfjsLib) throw new Error("PDF.js is not loaded. Start the app through the local server and check network access.");
}

function ensureTesseractAvailable() {
  if (!window.Tesseract) throw new Error("Tesseract.js is not loaded. Start the app through the local server and check network access.");
}

function recordOcrProgress(label, message) {
  if (!message || message.status !== "recognizing text") return;
  const progressLine = `${label}: OCR ${Math.round((message.progress || 0) * 100)}%`;
  state.ocrProgress = [...state.ocrProgress.filter((item) => !item.startsWith(`${label}: OCR`)), progressLine].slice(-8);
}

// ---------------------------------------------------------------------------
// Extraction Pipeline
// ---------------------------------------------------------------------------

async function extractDocumentWithNlp(upload, ocrText) {
  const modelExtraction = await tryGenAiExtraction(upload, ocrText);
  return modelExtraction || extractDocumentLocally(upload, ocrText);
}

async function tryGenAiExtraction(upload, ocrText) {
  try {
    const response = await fetch(GEN_AI_CONFIG.extractionEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file_name: upload.name, document_type_hint: upload.type, ocr_text: ocrText }),
    });
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

function extractDocumentLocally(upload, text) {
  return {
    document_type: inferDocumentType(upload.name, text),
    document_owner: inferDocumentOwner(upload.name, text),
    order_id: inferOrderId(upload.name, text),
    fields: {
      lot: findFirst(text, /Lot(?: Number)?:?\s*([A-Z0-9-]+)/i) || findFirst(text, /LOT:\s*([A-Z0-9-]+)/i),
      ndc: findFirst(text, /NDC:?\s*([0-9-]+)/i),
      expiry: findFirst(text, /Expiration Date:?\s*([0-9-]+)/i) || findFirst(text, /EXP:\s*([0-9-]+)/i),
      data_logger_numbers: findAll(text, /(?:Temp Logger|Device Serial No\.|Recorder ID|Serial Number|DL No\.|Logger ID):\s*([A-Z0-9 -]+)/gi),
    },
    confidence: text ? 0.86 : 0.2,
    provider: "local-pattern-extractor",
  };
}

async function readUploadedDocument(upload) {
  const ocr = await performRealOcr(upload);
  const extraction = await extractDocumentWithNlp(upload, ocr.text);
  return {
    ...upload,
    text: ocr.text,
    ocrMethod: ocr.method,
    extraction,
    type: extraction.document_type,
    owner: extraction.document_owner,
    detectedOrder: extraction.order_id || inferOrderId(upload.name, ocr.text),
    confidence: extraction.confidence || ocr.confidence || upload.confidence,
  };
}

// ---------------------------------------------------------------------------
// Certificate Parsing and Validation
// ---------------------------------------------------------------------------

function getOwnedCertificate(qaCase, documentType, owner) {
  const candidates = qaCase.extracted.certificates.filter((doc) => doc.document_type === documentType && doc.document_owner === owner);
  return candidates.sort((a, b) => (b.field_count || 0) - (a.field_count || 0))[0] || {
    document_type: documentType,
    document_owner: owner,
    present: false,
    signed: false,
    fields: {},
    field_count: 0,
  };
}

function buildCertificateRecord(doc) {
  const owner = doc.owner || inferDocumentOwner(doc.name, doc.text);
  const fields = doc.type === DOCUMENT_TYPES.COA ? extractAnalyticalFields(doc.text, owner) : extractComplianceFields(doc.text, owner);
  return {
    document_type: doc.type,
    document_owner: owner,
    source_file: doc.name,
    ocr_method: doc.ocrMethod,
    extraction_provider: doc.extraction?.provider || "unknown",
    present: Boolean(doc.text),
    signed: isSignedCertificate(doc.type, doc.text),
    field_count: countCertificateFields(fields),
    fields,
  };
}

function isSignedCertificate(documentType, text) {
  if (documentType === DOCUMENT_TYPES.COA) return /Quality Approval:\s*(?!\s*$).+/i.test(text) && !/Unsigned/i.test(text);
  return /Signature:\s*(?!\s*$).+/i.test(text) && !/Unsigned/i.test(text);
}

function countCertificateFields(fields) {
  return Object.values(fields || {}).reduce((sum, group) => {
    if (!group || typeof group !== "object") return sum;
    return sum + Object.values(group).filter(isResolvedValue).length;
  }, 0);
}

function extractAnalyticalFields(text, owner) {
  const table = parsePipeDelimitedRows(text);
  if (owner === DOCUMENT_OWNERS.COMPANY) {
    return {
      specifications: {
        assay: specRuleFromRow(table.assay, { rule: "range", min: 95, max: 105, unit: "%" }),
        purity: specRuleFromRow(table.purity, { rule: "min", min: 98, unit: "%" }),
        pH: specRuleFromRow(table.pH, { rule: "range", min: 6.8, max: 7.4 }),
        moisture: specRuleFromRow(table.moisture, { rule: "max", max: 2, unit: "%" }),
        viscosity: specRuleFromRow(table.viscosity, { rule: "range", min: 10, max: 14, unit: "cP" }),
        microbiology: { rule: "exact", value: table.microbiology?.specification || "Conforms" },
        heavyMetals: { rule: "exact", value: table.heavyMetals?.specification || "Conforms" },
        density: specRuleFromRow(table.density, { rule: "range", min: 0.98, max: 1.03, unit: "g/mL" }),
        appearance: { rule: "exact", value: table.appearance?.specification || "Clear" },
      },
    };
  }

  return {
    results: {
      assay: numberOrText(table.assay?.result),
      purity: numberOrText(table.purity?.result),
      pH: numberOrText(table.pH?.result),
      moisture: numberOrText(table.moisture?.result),
      viscosity: numberOrText(table.viscosity?.result),
      microbiology: table.microbiology?.result,
      heavyMetals: table.heavyMetals?.result,
      density: numberOrText(table.density?.result),
      appearance: table.appearance?.result,
    },
  };
}

function parsePipeDelimitedRows(text) {
  const rows = {};
  String(text || "").replace(/[¦]/g, "|").split("\n").forEach((line) => {
    const cells = line.split("|").map((cell) => cell.trim()).filter(Boolean);
    if (cells.length < 3) return;
    const fieldKey = analyticalFieldKey(cells[0]);
    if (!fieldKey) return;
    rows[fieldKey] = { field: cells[0], specification: cells[1], result: cells[2], status: cells[3] || "" };
  });
  return rows;
}

function analyticalFieldKey(label) {
  const normalized = normalizeId(label);
  if (normalized.includes("ASSAY") || normalized.includes("POTENCY")) return "assay";
  if (normalized.includes("PURITY")) return "purity";
  if (normalized === "PH") return "pH";
  if (normalized.includes("MOISTURE")) return "moisture";
  if (normalized.includes("VISCOSITY")) return "viscosity";
  if (normalized.includes("MICROBIOLOGY")) return "microbiology";
  if (normalized.includes("HEAVYMETAL")) return "heavyMetals";
  if (normalized.includes("DENSITY")) return "density";
  if (normalized.includes("APPEARANCE")) return "appearance";
  return null;
}

function numberOrText(value) {
  const parsed = numberOrNull(value);
  return parsed === null ? value ?? null : parsed;
}

function specRuleFromRow(row, fallback) {
  if (!row?.specification) return fallback;
  return extractSpecRule(row.specification, fallback);
}

function extractSpecRule(specification, fallback) {
  const range = specification.match(/([0-9.]+)\s*[-–]\s*([0-9.]+)/);
  if (range) return { rule: "range", min: Number(range[1]), max: Number(range[2]), unit: fallback.unit };
  const min = specification.match(/(?:>=|NLT|not less than|min)\s*([0-9.]+)/i);
  if (min) return { rule: "min", min: Number(min[1]), unit: fallback.unit };
  const max = specification.match(/(?:<=|NMT|not more than|max)\s*([0-9.]+)/i);
  if (max) return { rule: "max", max: Number(max[1]), unit: fallback.unit };
  return fallback;
}

function extractComplianceFields(text, owner) {
  const values = {
    gmpCompliance: findFirst(text, /GMP Compliance:?\s*([^\n]+)/i) || findFirst(text, /GMP:?\s*([^\n]+)/i),
    isoCompliance: findFirst(text, /ISO Compliance:?\s*([^\n]+)/i) || findFirst(text, /ISO:?\s*([^\n]+)/i),
    regulatoryDeclarations: findFirst(text, /Regulatory Declarations:?\s*([^\n]+)/i),
    packagingCompliance: findFirst(text, /Packaging Compliance:?\s*([^\n]+)/i),
    storageConditions: findFirst(text, /Storage Conditions:?\s*([^\n]+)/i) || findFirst(text, /Storage:?\s*([^\n]+)/i),
    transportationConditions: findFirst(text, /Transportation Conditions:?\s*([^\n]+)/i) || findFirst(text, /Shipment Condition:?\s*([^\n]+)/i),
    countryOfOrigin: findFirst(text, /Country of Origin:?\s*([^\n]+)/i),
    agreedCommitments: findFirst(text, /Agreed Commitments:?\s*([^\n]+)/i) || findFirst(text, /Certification Statement:?\s*([^\n]+)/i),
  };
  const defaults = {
    gmpCompliance: "Compliant",
    isoCompliance: "ISO 13485",
    regulatoryDeclarations: "Compliant",
    packagingCompliance: "Compliant",
    storageConditions: "2-8 C",
    transportationConditions: "Temperature controlled",
    countryOfOrigin: "Declared",
    agreedCommitments: "Compliant",
  };
  const key = owner === DOCUMENT_OWNERS.COMPANY ? "commitments" : "declarations";
  return { [key]: Object.fromEntries(CERTIFICATE_FIELDS.compliance.map((field) => [field, owner === DOCUMENT_OWNERS.COMPANY ? values[field] || defaults[field] : values[field] || null])) };
}

function compareAnalyticalValue(fieldName, companyRule, supplierValue) {
  if (!companyRule || !isResolvedValue(supplierValue)) {
    return { fieldName, passed: false, expected: "Required specification/result", actual: valueOrBlank(supplierValue) };
  }
  if (companyRule.rule === "exact") {
    const passed = normalizeId(supplierValue) === normalizeId(companyRule.value);
    return { fieldName, passed, expected: companyRule.value, actual: supplierValue };
  }
  const numeric = Number(supplierValue);
  const minOk = companyRule.min === undefined || numeric >= companyRule.min;
  const maxOk = companyRule.max === undefined || numeric <= companyRule.max;
  return { fieldName, passed: Number.isFinite(numeric) && minOk && maxOk, expected: formatSpec(companyRule), actual: `${supplierValue}${companyRule.unit ? ` ${companyRule.unit}` : ""}` };
}

function compareComplianceValue(fieldName, required, declared) {
  if (!isResolvedValue(required) || !isResolvedValue(declared)) {
    return { fieldName, passed: false, expected: valueOrBlank(required), actual: valueOrBlank(declared) };
  }
  const passed = normalizeId(required) === normalizeId(declared) || normalizeId(declared).includes(normalizeId(required));
  return { fieldName, passed, expected: required, actual: declared };
}

function formatSpec(rule) {
  if (rule.rule === "range") return `${rule.min} - ${rule.max}${rule.unit ? ` ${rule.unit}` : ""}`;
  if (rule.rule === "min") return `>= ${rule.min}${rule.unit ? ` ${rule.unit}` : ""}`;
  if (rule.rule === "max") return `<= ${rule.max}${rule.unit ? ` ${rule.unit}` : ""}`;
  return String(rule.value ?? "Required");
}

function compareCoaDocuments(qaCase) {
  const companyCoa = getOwnedCertificate(qaCase, DOCUMENT_TYPES.COA, DOCUMENT_OWNERS.COMPANY);
  const supplierCoa = getOwnedCertificate(qaCase, DOCUMENT_TYPES.COA, DOCUMENT_OWNERS.SUPPLIER);
  const details = [];

  if (!companyCoa.present) details.push({ fieldName: "Company COA", passed: false, expected: "Present", actual: "Missing" });
  if (!supplierCoa.present) details.push({ fieldName: "Supplier COA", passed: false, expected: "Present", actual: "Missing" });
  if (supplierCoa.present && !supplierCoa.signed) details.push({ fieldName: "Supplier COA signature", passed: false, expected: "Signed/approved", actual: "Unsigned" });

  const specs = companyCoa.fields?.specifications || {};
  const results = supplierCoa.fields?.results || {};
  CERTIFICATE_FIELDS.analytical.forEach((fieldName) => details.push(compareAnalyticalValue(fieldName, specs[fieldName], results[fieldName])));
  return { status: details.every((item) => item.passed) ? "PASS" : "FAIL", details };
}

function compareCocDocuments(qaCase) {
  const companyCoc = getOwnedCertificate(qaCase, DOCUMENT_TYPES.COC, DOCUMENT_OWNERS.COMPANY);
  const supplierCoc = getOwnedCertificate(qaCase, DOCUMENT_TYPES.COC, DOCUMENT_OWNERS.SUPPLIER);
  const details = [];

  if (!companyCoc.present) details.push({ fieldName: "Company COC", passed: false, expected: "Present", actual: "Missing" });
  if (!supplierCoc.present) details.push({ fieldName: "Supplier COC", passed: false, expected: "Present", actual: "Missing" });
  if (supplierCoc.present && !supplierCoc.signed) details.push({ fieldName: "Supplier COC signature", passed: false, expected: "Signed/approved", actual: "Unsigned" });

  const commitments = companyCoc.fields?.commitments || {};
  const declarations = supplierCoc.fields?.declarations || {};
  CERTIFICATE_FIELDS.compliance.forEach((fieldName) => details.push(compareComplianceValue(fieldName, commitments[fieldName], declarations[fieldName])));
  return { status: details.every((item) => item.passed) ? "PASS" : "FAIL", details };
}

function getCertificateDecision(qaCase) {
  const coaValidation = compareCoaDocuments(qaCase);
  const cocValidation = compareCocDocuments(qaCase);
  return { coaValidation, cocValidation, overallStatus: coaValidation.status === "PASS" && cocValidation.status === "PASS" ? "PASS" : "FAIL" };
}

// ---------------------------------------------------------------------------
// Case Construction and Rules
// ---------------------------------------------------------------------------

function getMissingFieldActions() {
  return state.cases.flatMap((qaCase) => {
    const missing = [];
    if (!isResolvedValue(qaCase.extracted.inspection.amountPerCase)) {
      missing.push({ caseId: qaCase.id, orderId: qaCase.orderId, field: "Amount per case", path: "amountPerCase", source: "Inspection Sheet" });
    }
    if (!isResolvedValue(qaCase.extracted.inspection.fullCasesReceived)) {
      missing.push({ caseId: qaCase.id, orderId: qaCase.orderId, field: "Full cases received", path: "fullCasesReceived", source: "Inspection Sheet" });
    }
    return missing;
  });
}

function groupDocumentsByOrderOrLot(documents) {
  const anchors = documents
    .filter((doc) => [DOCUMENT_TYPES.PACKING_LIST, DOCUMENT_TYPES.INSPECTION_SHEET, DOCUMENT_TYPES.LABEL_IMAGE, DOCUMENT_TYPES.DATA_LOGGER_REPORT].includes(doc.type))
    .map((doc) => ({ orderId: inferOrderId(doc.name, doc.text), lot: extractLot(doc.text), product: extractProduct(doc.text) }));

  return documents.reduce((groups, doc) => {
    const orderId = inferOrderId(doc.name, doc.text);
    const lot = extractLot(doc.text);
    const product = extractProduct(doc.text);
    const anchor = anchors.find((item) => item.lot && lot && normalizeId(item.lot) === normalizeId(lot) && item.product && product && item.product === product);
    const key = [DOCUMENT_TYPES.COA, DOCUMENT_TYPES.COC].includes(doc.type) ? anchor?.orderId || orderId : orderId;
    groups[key] = groups[key] || [];
    groups[key].push(doc);
    return groups;
  }, {});
}

function extractLot(text) {
  return findFirst(text, /Lot(?: Number)?:?\s*([A-Z0-9-]+)/i) || findFirst(text, /LOT:\s*([A-Z0-9-]+)/i);
}

function extractProduct(text) {
  return findFirst(text, /Product(?: Description)?:?\s*([^\n]+)/i);
}

function docOf(docs, type) {
  return docs.find((doc) => doc.type === type) || { text: "", type, name: `${type} missing` };
}

function ownedDocOf(docs, type, owner) {
  return docs.find((doc) => doc.type === type && doc.owner === owner) || { text: "", type, owner, name: `${owner} ${type} missing` };
}

function buildCaseFromDocuments(orderId, docs, index) {
  const packing = docOf(docs, DOCUMENT_TYPES.PACKING_LIST);
  const inspection = docOf(docs, DOCUMENT_TYPES.INSPECTION_SHEET);
  const label = docOf(docs, DOCUMENT_TYPES.LABEL_IMAGE);
  const loggerReport = docOf(docs, DOCUMENT_TYPES.DATA_LOGGER_REPORT);
  const supplierCoa = ownedDocOf(docs, DOCUMENT_TYPES.COA, DOCUMENT_OWNERS.SUPPLIER);
  const supplierCoc = ownedDocOf(docs, DOCUMENT_TYPES.COC, DOCUMENT_OWNERS.SUPPLIER);
  const allText = docs.map((doc) => doc.text).join("\n");
  const certificates = docs.filter((doc) => [DOCUMENT_TYPES.COA, DOCUMENT_TYPES.COC].includes(doc.type)).map(buildCertificateRecord);

  const loggerNumbers = findAll(packing.text, /(?:Temp Logger|Device Serial No\.|Recorder ID|Serial Number|DL No\.):\s*([A-Z0-9 -]+)/gi);
  const expectedLoggerCount = numberOrNull(findFirst(packing.text, /Expected Data Logger Count:?\s*(\d+)/i)) || loggerNumbers.length;

  return {
    id: `QAC-${String(index + 1).padStart(4, "0")}`,
    orderId,
    grn: findFirst(allText, /GRN \/ Receiving No\.?:?\s*([A-Z0-9-]+)/i) || "Pending",
    supplier: findFirst(allText, /Supplier:?\s*([^\n]+)/i) || "Unknown Supplier",
    product: extractProduct(allText) || "Unknown Product",
    ndc: findFirst(allText, /NDC:?\s*([0-9-]+)/i) || "Unknown",
    lot: extractLot(packing.text + "\n" + inspection.text) || extractLot(label.text) || "Unknown",
    expiry: findFirst(packing.text + "\n" + inspection.text, /Expiration Date:?\s*([0-9-]+)/i) || findFirst(label.text, /EXP:\s*([0-9-]+)/i) || "Unknown",
    priority: /Backorder|excursion|Unsigned|Incomplete/i.test(allText) ? "High" : "Normal",
    assignedTo: "Unassigned",
    ageHours: 0,
    oracle: {
      orderId,
      expectedLoggerCount,
      ndc: findFirst(allText, /NDC:?\s*([0-9-]+)/i) || "Unknown",
      lot: extractLot(packing.text + "\n" + inspection.text) || "Unknown",
      expiry: findFirst(packing.text + "\n" + inspection.text, /Expiration Date:?\s*([0-9-]+)/i) || "Unknown",
      caseQuantity: numberOrNull(findFirst(allText, /Case Quantity:?\s*(\d+)/i)) || numberOrNull(findFirst(allText, /CASE QTY:\s*(\d+)/i)) || 0,
    },
    documents: buildDocumentChecklist(docs),
    extracted: {
      orderCandidates: docs.map((doc) => ({ source: `${doc.owner ? `${doc.owner} ` : ""}${doc.type}`, label: "Order ID", value: inferOrderId(doc.name, doc.text), confidence: doc.confidence || 0.9 })),
      dataLoggers: loggerNumbers.map((value) => ({ source: "Packing List", label: "Detected Logger ID", value, confidence: 0.94 })),
      inspection: {
        amountPerCase: numberOrNull(findFirst(inspection.text, /Amount per case:\s*([^\n]*)/i)),
        fullCasesReceived: numberOrNull(findFirst(inspection.text, /Full cases received:\s*([^\n]*)/i)),
        caseQuantity: numberOrNull(findFirst(inspection.text, /Case Quantity:?\s*(\d+)/i)) || 0,
      },
      label: {
        ndc: findFirst(label.text, /NDC\s*([0-9-]+)/i) || findFirst(allText, /NDC:?\s*([0-9-]+)/i) || "Unknown",
        lot: extractLot(label.text) || "Unknown",
        expiry: findFirst(label.text, /EXP:\s*([0-9-]+)/i) || "Unknown",
      },
      coa: { present: Boolean(supplierCoa.text), signed: isSignedCertificate(DOCUMENT_TYPES.COA, supplierCoa.text), lot: extractLot(supplierCoa.text), productMatch: supplierCoa.text.includes(extractProduct(allText) || "") },
      coc: { present: Boolean(supplierCoc.text), signed: isSignedCertificate(DOCUMENT_TYPES.COC, supplierCoc.text), lot: extractLot(supplierCoc.text), productMatch: supplierCoc.text.includes(extractProduct(allText) || "") },
      certificates,
      loggerReport: {
        loggerIds: findAll(loggerReport.text, /Logger ID:\s*([A-Z0-9 -]+)/gi),
        temperatureStatus: findFirst(loggerReport.text, /Temperature Status:?\s*([^\n]+)/i) || "Missing",
        minTemp: findFirst(loggerReport.text, /Minimum Temperature:?\s*([^\n]+)/i) || "N/A",
        maxTemp: findFirst(loggerReport.text, /Maximum Temperature:?\s*([^\n]+)/i) || "N/A",
      },
    },
    audit: [
      `${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ${docs.length} uploaded document(s) parsed`,
      `${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} Validation rules executed`,
    ],
  };
}

function buildDocumentChecklist(docs) {
  return REQUIRED_DOCUMENTS.map((requiredType) => {
    const found = requiredType.includes("Company")
      ? docs.find((doc) => doc.type === requiredType.split(" ")[1] && doc.owner === DOCUMENT_OWNERS.COMPANY)
      : requiredType.includes("Supplier")
        ? docs.find((doc) => doc.type === requiredType.split(" ")[1] && doc.owner === DOCUMENT_OWNERS.SUPPLIER)
        : docs.find((doc) => doc.type === requiredType);

    return { type: requiredType, present: Boolean(found), readable: Boolean(found?.text), status: found ? documentStatus(found.text) : "Missing" };
  });
}

function documentStatus(text) {
  if (!text) return "Unreadable";
  if (/Unsigned/i.test(text)) return "Unsigned";
  if (/Excursion detected|FAIL/i.test(text)) return "Excursion";
  if (/\[BLANK\]|Incomplete/i.test(text)) return "Incomplete";
  if (/Low-confidence|ambiguous/i.test(text)) return "Low Confidence";
  if (/Amount per case:\s*$/im.test(text) || /Full cases received:\s*$/im.test(text)) return "Missing Fields";
  return "Pass";
}

const rules = [
  {
    id: "R001",
    name: "Order ID must match Oracle",
    severity: "Critical",
    run: (qaCase) => {
      const matches = qaCase.extracted.orderCandidates.some((candidate) => normalizeOrder(candidate.value) === normalizeOrder(qaCase.oracle.orderId));
      return ruleResult(matches, "Order ID", qaCase.oracle.orderId, qaCase.extracted.orderCandidates.map((item) => item.value).join(", "), "Investigate document/order mismatch before release.");
    },
  },
  {
    id: "R002",
    name: "Data logger count must match expected count",
    severity: "High",
    run: (qaCase) => {
      const found = unique(qaCase.extracted.dataLoggers.map((logger) => normalizeId(logger.value))).length;
      return ruleResult(found === qaCase.oracle.expectedLoggerCount, "Data logger count", String(qaCase.oracle.expectedLoggerCount), String(found), "QA should verify missing or extra data logger numbers.");
    },
  },
  {
    id: "R003",
    name: "Temperature result must be acceptable",
    severity: "Critical",
    run: (qaCase) => ruleResult(qaCase.extracted.loggerReport.temperatureStatus.toLowerCase().includes("within"), "Temperature status", "Within limits", qaCase.extracted.loggerReport.temperatureStatus, "Route to temperature excursion/deviation review."),
  },
  {
    id: "R004",
    name: "Required inspection fields must be present",
    severity: "High",
    run: (qaCase) => {
      const passed = isResolvedValue(qaCase.extracted.inspection.amountPerCase) && isResolvedValue(qaCase.extracted.inspection.fullCasesReceived);
      return ruleResult(passed, "Inspection fields", "Amount per case and full cases received", `${valueOrBlank(qaCase.extracted.inspection.amountPerCase)}, ${valueOrBlank(qaCase.extracted.inspection.fullCasesReceived)}`, "QA or Receiving must complete required inspection fields.");
    },
  },
  {
    id: "R005",
    name: "Label lot and NDC must match Oracle",
    severity: "Critical",
    run: (qaCase) => {
      const passed = normalizeId(qaCase.extracted.label.lot) === normalizeId(qaCase.oracle.lot) && normalizeId(qaCase.extracted.label.ndc) === normalizeId(qaCase.oracle.ndc);
      return ruleResult(passed, "Label", `${qaCase.oracle.lot} / ${qaCase.oracle.ndc}`, `${qaCase.extracted.label.lot} / ${qaCase.extracted.label.ndc}`, "Investigate product or label mismatch.");
    },
  },
  {
    id: "R006",
    name: "Supplier COA must comply with Company COA",
    severity: "Critical",
    run: (qaCase) => {
      const coa = compareCoaDocuments(qaCase);
      const failed = coa.details.filter((item) => !item.passed).map((item) => item.fieldName).join(", ");
      return ruleResult(coa.status === "PASS", "COA comparison", "Supplier COA compliant with Company COA", coa.status, failed ? `Review non-compliant COA field(s): ${failed}.` : "No action required.");
    },
  },
  {
    id: "R007",
    name: "Supplier COC must comply with Company COC",
    severity: "Critical",
    run: (qaCase) => {
      const coc = compareCocDocuments(qaCase);
      const failed = coc.details.filter((item) => !item.passed).map((item) => item.fieldName).join(", ");
      return ruleResult(coc.status === "PASS", "COC comparison", "Supplier COC compliant with Company COC", coc.status, failed ? `Review non-compliant COC commitment(s): ${failed}.` : "No action required.");
    },
  },
];

function ruleResult(passed, field, expected, extracted, action) {
  return { passed, field, expected, extracted, action: passed ? "No action required." : action };
}

function evaluateCase(qaCase) {
  const results = rules.map((rule) => ({ ...rule, ...rule.run(qaCase) }));
  const failed = results.filter((item) => !item.passed);
  const critical = failed.filter((item) => item.severity === "Critical");
  const high = failed.filter((item) => item.severity === "High");
  const certificateDecision = getCertificateDecision(qaCase);

  let recommendation = "Ready for QA Release";
  if (certificateDecision.overallStatus === "FAIL" || critical.length) recommendation = "Compliance Hold";
  else if (high.length) recommendation = "Correction Required";
  else if (failed.length) recommendation = "QA Review Required";

  return { results, failed, critical, high, recommendation, certificateDecision };
}

// ---------------------------------------------------------------------------
// Processing Flow
// ---------------------------------------------------------------------------

function groupUploadedFiles() {
  return state.uploadedFiles.reduce((groups, file) => {
    const key = file.detectedOrder || "Pending OCR";
    groups[key] = groups[key] || [];
    groups[key].push(file);
    return groups;
  }, {});
}

async function buildCasesFromUploads() {
  const parsedDocuments = await Promise.all(state.uploadedFiles.map(readUploadedDocument));
  state.uploadedFiles = parsedDocuments.map((doc) => ({
    name: doc.name,
    type: doc.type,
    owner: doc.owner,
    detectedOrder: doc.detectedOrder,
    confidence: doc.confidence,
    ocrMethod: doc.ocrMethod,
    extraction: doc.extraction,
    file: doc.file,
    text: doc.text,
  }));
  const grouped = groupDocumentsByOrderOrLot(parsedDocuments);
  return Object.entries(grouped).filter(([orderId]) => orderId !== "Pending OCR").map(([orderId, docs], index) => buildCaseFromDocuments(orderId, docs, index));
}

async function processDocuments() {
  state.stage = "processing";
  state.processing = true;
  state.ocrProgress = [];
  state.processLog = [
    "Documents classified by type and owner.",
    "OCR extracted page text from uploaded files.",
    "Documents grouped into QA cases.",
    "Supplier COA compared against Company COA.",
    "Supplier COC compared against Company COC.",
  ];
  render();

  try {
    state.cases = await buildCasesFromUploads();
    state.selectedCaseId = state.cases[0]?.id || null;
    state.stage = getMissingFieldActions().length ? "review" : "complete";
  } catch (error) {
    state.processLog = [`Processing stopped: ${error.message}`];
    state.ocrProgress = ["Check that PDF.js and Tesseract.js loaded successfully and that uploaded files are readable."];
  } finally {
    state.processing = false;
    render();
  }
}

function updateInspectionField(token, value) {
  const [caseId, field] = token.split(":");
  const qaCase = state.cases.find((item) => item.id === caseId);
  if (!qaCase) return;
  const previousValue = qaCase.extracted.inspection[field];
  qaCase.extracted.inspection[field] = value;
  const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  qaCase.audit.push(`${timestamp} QA updated ${field} from ${valueOrBlank(previousValue)} to ${valueOrBlank(value)}`);
  state.fieldHistory.push({ caseId, field, previousValue, newValue: value, timestamp });
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function render() {
  const selected = state.cases.find((qaCase) => qaCase.id === state.selectedCaseId) || state.cases[0] || null;
  const evaluatedCases = state.cases.map((qaCase) => ({ ...qaCase, evaluation: evaluateCase(qaCase) }));
  const selectedEval = selected ? evaluateCase(selected) : null;
  const openExceptions = evaluatedCases.flatMap((qaCase) => qaCase.evaluation.failed.map((failure) => ({ caseId: qaCase.id, orderId: qaCase.orderId, ...failure })));

  byId("app").innerHTML = `
    <header class="topbar">
      <div>
        <p class="eyebrow">GenAI QA Release Intelligence</p>
        <h1>Document Verification & Product Release Dashboard</h1>
      </div>
      <div class="system-card">
        ${icon("shield")}
        <div><strong>Decision Support</strong><span>OCR extracts. Rules validate. QA approves.</span></div>
      </div>
    </header>
    <main class="layout">
      <aside class="sidebar">
        ${navButton("upload", "scan", "Process Documents")}
        ${navButton("overview", "queue", "Release Queue")}
        ${navButton("exceptions", "alert", "Exceptions")}
        ${navButton("architecture", "database", "Architecture")}
        <div class="sidebar-note">
          <strong>QA Focus</strong>
          <span>Order ID extraction, logger validation, inspection gaps, Company-vs-Supplier COA/COC validation, and Oracle checks.</span>
        </div>
      </aside>
      <section class="content">
        ${state.tab === "upload" ? renderUploadWorkflow(evaluatedCases) : ""}
        ${state.tab === "overview" ? renderOverview(evaluatedCases, selected, selectedEval) : ""}
        ${state.tab === "exceptions" ? renderExceptions(openExceptions) : ""}
        ${state.tab === "architecture" ? renderArchitecture() : ""}
      </section>
    </main>
  `;
  bindEvents();
}

function navButton(tab, iconName, label) {
  return `<button class="nav-item ${state.tab === tab ? "active" : ""}" data-tab="${tab}">${icon(iconName)}${label}</button>`;
}

function renderUploadWorkflow(evaluatedCases) {
  const missing = getMissingFieldActions();
  return `
    <section class="workflow">
      <div class="stepper">
        ${step("1", "Upload", ["intake", "processing", "review", "complete"].includes(state.stage))}
        ${step("2", "OCR + Extraction", ["processing", "review", "complete"].includes(state.stage))}
        ${step("3", "Resolve Fields", ["review", "complete"].includes(state.stage))}
        ${step("4", "Dashboard", state.stage === "complete")}
      </div>
      ${state.stage === "intake" ? renderIntake() : ""}
      ${state.stage === "processing" ? renderProcessing() : ""}
      ${state.stage === "review" ? renderMissingReview(missing) : ""}
      ${state.stage === "complete" ? renderProcessComplete(evaluatedCases) : ""}
    </section>`;
}

function step(number, label, active) {
  return `<div class="step ${active ? "active" : ""}"><span>${number}</span><strong>${label}</strong></div>`;
}

function renderIntake() {
  const groups = groupUploadedFiles();
  return `
    <section class="panel full upload-panel">
      <div class="panel-title">
        <h2>Bulk QA Document Intake</h2>
        <span>Upload documents for one or many orders. Documents are grouped after OCR extraction.</span>
      </div>
      <div class="upload-body">
        <label class="drop-zone">
          ${icon("file")}
          <strong>Drop or select QA documents</strong>
          <span>Packing lists, inspection sheets, labels, Company/Supplier COA, Company/Supplier COC, and data logger reports can be processed together.</span>
          <input id="documentUpload" type="file" multiple />
        </label>
        <div class="action-row">
          <button class="primary-action" data-action="process" ${state.uploadedFiles.length ? "" : "disabled"}>Start OCR Processing</button>
        </div>
      </div>
    </section>
    <section class="split">
      <div class="panel">
        <div class="panel-title"><h2>Upload Batch</h2><span>${state.uploadedFiles.length} document(s) ready</span></div>
        ${state.uploadedFiles.length ? renderUploadTable() : renderEmptyBlock("No documents selected yet.")}
      </div>
      <div class="panel">
        <div class="panel-title"><h2>Pre-OCR Grouping</h2><span>Based on filename hints only</span></div>
        <div class="group-list">
          ${Object.entries(groups).map(([orderId, files]) => `<button class="group-card"><span class="pill warn">${files.length} docs</span><strong>${orderId}</strong><small>${files.map((file) => `${file.owner ? `${file.owner} ` : ""}${file.type}`).join(", ")}</small></button>`).join("") || renderEmptyInline("Awaiting upload")}
        </div>
      </div>
    </section>`;
}

function renderUploadTable() {
  return `<table>
    <thead><tr><th>File</th><th>Document Type</th><th>Owner</th><th>Detected Order</th><th>Confidence</th></tr></thead>
    <tbody>${state.uploadedFiles.map((file) => `<tr><td>${file.name}</td><td>${file.type}</td><td>${file.owner || "N/A"}</td><td>${file.detectedOrder}</td><td>${Math.round((file.confidence || 0) * 100)}%</td></tr>`).join("")}</tbody>
  </table>`;
}

function renderProcessing() {
  return `<section class="panel full processing-panel">
    <div class="panel-title"><h2>Processing Documents</h2><span>Real Tesseract OCR, extraction, normalization, and rules execution</span></div>
    <div class="process-grid">
      ${processCard("OCR", "Running", "PDFs are rendered page-by-page and scanned with Tesseract.")}
      ${processCard("Extraction", "Running", "The app attempts a GenAI endpoint, then falls back to deterministic extraction.")}
      ${processCard("Validation", "Pending", "Rules compare Supplier COA/COC against Company references.")}
      ${processCard("Audit", "Pending", "QA corrections are captured in the case history.")}
    </div>
    <div class="process-log">
      ${state.processLog.map((item) => `<div>${icon("check")}<span>${item}</span></div>`).join("")}
      ${state.ocrProgress.map((item) => `<div class="ocr-line">${icon("scan")}<span>${item}</span></div>`).join("")}
    </div>
  </section>`;
}

function processCard(title, status, body) {
  return `<div class="process-card"><span class="pill ${statusClass(status)}">${status}</span><h2>${title}</h2><p>${body}</p></div>`;
}

function renderMissingReview(missing) {
  if (!missing.length) {
    return `<section class="panel full"><div class="empty-state">${icon("check")}<h2>No Missing Fields Found</h2><p>All required inspection fields are complete.</p><button class="primary-action" data-action="complete">Go to Dashboard</button></div></section>`;
  }
  return `<section class="panel full">
    <div class="panel-title"><h2>Missing Field Resolution</h2><span>QA must fill the value or intentionally set 0 / NULL before release review.</span></div>
    <table>
      <thead><tr><th>Order</th><th>Field</th><th>Source</th><th>Current Value</th><th>Actions</th></tr></thead>
      <tbody>${missing.map((item) => `<tr><td>${item.orderId}</td><td>${item.field}</td><td>${item.source}</td><td><span class="pill bad">Empty</span></td><td>${fieldActionControls(item.caseId, item.path)}</td></tr>`).join("")}</tbody>
    </table>
  </section>`;
}

function fieldActionControls(caseId, field) {
  const token = `${caseId}:${field}`;
  return `<div class="field-actions"><input type="number" placeholder="Enter value" data-field-input="${token}" /><button data-update-field="${token}">Fill</button><button data-set-zero="${token}">Use 0</button><button data-set-null="${token}">Use NULL</button></div>`;
}

function renderProcessComplete(evaluatedCases) {
  return `<section class="panel full">
    <div class="panel-title"><h2>Processing Complete</h2><span>Each order is available separately in the release queue.</span></div>
    <div class="completion-grid">${evaluatedCases.map((qaCase) => `<button class="completion-card" data-open-case="${qaCase.id}"><span class="pill ${statusClass(qaCase.evaluation.recommendation)}">${qaCase.evaluation.recommendation}</span><strong>${qaCase.orderId}</strong><small>${qaCase.evaluation.failed.length} exception(s) · ${qaCase.product}</small></button>`).join("")}</div>
    <div class="action-row"><button class="primary-action" data-tab="overview">Open Release Dashboard</button></div>
  </section>`;
}

function renderOverview(evaluatedCases, selected, selectedEval) {
  if (!selected) return renderEmptyBlock("No processed QA cases yet. Upload documents from Process Documents.");
  return `
    <section class="metrics">
      ${metric("Cases Pending QA", state.cases.length, "clock")}
      ${metric("Ready for Release", evaluatedCases.filter((item) => item.evaluation.recommendation === "Ready for QA Release").length, "check")}
      ${metric("Compliance Holds", evaluatedCases.filter((item) => item.evaluation.recommendation === "Compliance Hold").length, "alert")}
      ${metric("Open Exceptions", evaluatedCases.reduce((sum, item) => sum + item.evaluation.failed.length, 0), "file")}
    </section>
    <section class="split">
      <div class="panel queue-panel"><div class="panel-title"><h2>QA Release Queue</h2><span>Click a case to inspect evidence</span></div><div class="case-list">${evaluatedCases.map(renderCaseRow).join("")}</div></div>
      <div class="panel recommendation ${statusClass(selectedEval.recommendation)}"><span class="pill ${statusClass(selectedEval.recommendation)}">${selectedEval.recommendation}</span><h2>${selected.id} · ${selected.orderId}</h2><p>${recommendationText(selectedEval)}</p><div class="case-meta"><span>${selected.product}</span><span>Lot ${selected.lot}</span><span>Certificate Result ${selectedEval.certificateDecision.overallStatus}</span><span>${selected.priority}</span></div></div>
    </section>
    <section class="detail-grid">
      ${renderDocumentChecklist(selected)}
      ${renderOrderExtraction(selected)}
      ${renderDataLoggers(selected)}
      ${renderFieldComparison(selected)}
      ${renderInspectionFieldEditor(selected)}
      ${renderCertificateDiagnostics(selected)}
      ${renderCertificateComparison(selected, selectedEval)}
      ${renderRules(selectedEval)}
      ${renderAudit(selected)}
    </section>`;
}

function metric(label, value, iconName) {
  return `<div class="metric">${icon(iconName)}<span>${label}</span><strong>${value}</strong></div>`;
}

function renderCaseRow(qaCase) {
  return `<button class="case-row ${qaCase.id === state.selectedCaseId ? "selected" : ""}" data-case="${qaCase.id}"><div><strong>${qaCase.orderId}</strong><span>${qaCase.product}</span></div><span class="pill ${statusClass(qaCase.evaluation.recommendation)}">${qaCase.evaluation.recommendation}</span><small>${qaCase.grn} · ${qaCase.ageHours}h</small></button>`;
}

function recommendationText(evaluation) {
  if (evaluation.recommendation === "Ready for QA Release") return "COA validation and COC validation passed, and all priority checks passed.";
  if (evaluation.certificateDecision.overallStatus === "FAIL") return `Do not release yet. COA validation is ${evaluation.certificateDecision.coaValidation.status} and COC validation is ${evaluation.certificateDecision.cocValidation.status}.`;
  return `Do not release yet. The system found ${evaluation.failed.length} exception(s).`;
}

function renderDocumentChecklist(qaCase) {
  return `<div class="panel"><div class="panel-title"><h2>Document Checklist</h2><span>Required release package</span></div><table><thead><tr><th>Document</th><th>Present</th><th>Readable</th><th>Status</th></tr></thead><tbody>${qaCase.documents.map((doc) => `<tr><td>${doc.type}</td><td>${doc.present ? "Yes" : "No"}</td><td>${doc.readable ? "Yes" : "No"}</td><td><span class="pill ${statusClass(doc.status)}">${doc.status}</span></td></tr>`).join("")}</tbody></table></div>`;
}

function renderOrderExtraction(qaCase) {
  return `<div class="panel"><div class="panel-title"><h2>Order ID Extraction</h2><span>Varied labels normalized against Oracle</span></div><table><thead><tr><th>Source</th><th>Extracted</th><th>Confidence</th><th>Oracle Match</th></tr></thead><tbody>${qaCase.extracted.orderCandidates.map((candidate) => {
    const match = normalizeOrder(candidate.value) === normalizeOrder(qaCase.oracle.orderId);
    return `<tr><td>${candidate.source}</td><td>${candidate.value}</td><td>${Math.round(candidate.confidence * 100)}%</td><td><span class="pill ${match ? "good" : "bad"}">${match ? "Yes" : "No"}</span></td></tr>`;
  }).join("")}</tbody></table></div>`;
}

function renderDataLoggers(qaCase) {
  const count = unique(qaCase.extracted.dataLoggers.map((logger) => normalizeId(logger.value))).length;
  return `<div class="panel highlight-panel"><div class="panel-title"><h2>Data Logger Validation</h2><span>Extraction, count, report match, temperature result</span></div><div class="logger-summary"><div><span>Found</span><strong>${count}</strong></div><div><span>Expected</span><strong>${qaCase.oracle.expectedLoggerCount}</strong></div><div><span>Count Result</span><strong class="${count === qaCase.oracle.expectedLoggerCount ? "text-good" : "text-bad"}">${count === qaCase.oracle.expectedLoggerCount ? "Pass" : "Review"}</strong></div><div><span>Temp Status</span><strong class="${statusClass(qaCase.extracted.loggerReport.temperatureStatus)}">${qaCase.extracted.loggerReport.temperatureStatus}</strong></div></div><table><thead><tr><th>Logger ID</th><th>Source</th><th>Confidence</th></tr></thead><tbody>${qaCase.extracted.dataLoggers.map((logger) => `<tr><td>${logger.value}</td><td>${logger.source}</td><td>${Math.round(logger.confidence * 100)}%</td></tr>`).join("")}</tbody></table></div>`;
}

function renderFieldComparison(qaCase) {
  const rows = [
    ["NDC", qaCase.oracle.ndc, qaCase.extracted.label.ndc, "Label Image"],
    ["Lot Number", qaCase.oracle.lot, qaCase.extracted.label.lot, "Label Image"],
    ["Expiration Date", qaCase.oracle.expiry, qaCase.extracted.label.expiry, "Label Image"],
    ["Case Quantity", qaCase.oracle.caseQuantity, qaCase.extracted.inspection.caseQuantity, "Inspection Sheet"],
    ["Amount per Case", "Required", valueOrBlank(qaCase.extracted.inspection.amountPerCase), "Inspection Sheet"],
    ["Full Cases Received", "Required", valueOrBlank(qaCase.extracted.inspection.fullCasesReceived), "Inspection Sheet"],
  ];
  return `<div class="panel wide"><div class="panel-title"><h2>Extracted Field Comparison</h2><span>Oracle reference vs document evidence</span></div><table><thead><tr><th>Field</th><th>Oracle / Rule</th><th>Extracted</th><th>Source</th><th>Result</th></tr></thead><tbody>${rows.map(([field, expected, extracted, source]) => {
    const pass = expected === "Required" ? extracted !== "Blank" : normalizeId(expected) === normalizeId(extracted);
    return `<tr><td>${field}</td><td>${expected}</td><td>${extracted}</td><td>${source}</td><td><span class="pill ${pass ? "good" : "bad"}">${pass ? "Pass" : "Fail"}</span></td></tr>`;
  }).join("")}</tbody></table></div>`;
}

function renderInspectionFieldEditor(qaCase) {
  const fields = [
    { key: "amountPerCase", label: "Amount per case" },
    { key: "fullCasesReceived", label: "Full cases received" },
    { key: "caseQuantity", label: "Case quantity" },
  ];
  return `<div class="panel wide"><div class="panel-title"><h2>Editable QA Inspection Fields</h2><span>QA can revisit manually entered values; changes are audited.</span></div><table><thead><tr><th>Field</th><th>Current Value</th><th>Update Value</th><th>Actions</th></tr></thead><tbody>${fields.map((field) => `<tr><td>${field.label}</td><td>${valueOrBlank(qaCase.extracted.inspection[field.key])}</td><td><input class="inline-input" data-field-input="${qaCase.id}:${field.key}" value="${qaCase.extracted.inspection[field.key] ?? ""}" /></td><td>${fieldActionControls(qaCase.id, field.key)}</td></tr>`).join("")}</tbody></table></div>`;
}

function renderCertificateDiagnostics(qaCase) {
  const certificates = qaCase.extracted.certificates || [];
  return `<div class="panel wide"><div class="panel-title"><h2>Certificate Extraction Diagnostics</h2><span>Shows what the pipeline classified before validation.</span></div><table><thead><tr><th>Source File</th><th>Type</th><th>Owner</th><th>Signed</th><th>Extracted Fields</th><th>OCR Method</th></tr></thead><tbody>${certificates.length ? certificates.map((doc) => `<tr><td>${doc.source_file || "Uploaded certificate"}</td><td>${doc.document_type}</td><td><span class="pill ${doc.document_owner === DOCUMENT_OWNERS.SUPPLIER ? "warn" : "good"}">${doc.document_owner}</span></td><td>${doc.signed ? "Yes" : "No"}</td><td>${doc.field_count}</td><td>${doc.ocr_method || doc.extraction_provider || "N/A"}</td></tr>`).join("") : `<tr><td colspan="6">No certificate records were built.</td></tr>`}</tbody></table></div>`;
}

function renderCertificateComparison(qaCase, evaluation) {
  const decision = evaluation.certificateDecision;
  return `<div class="panel wide"><div class="panel-title"><h2>Company vs Supplier Certificate Validation</h2><span>COC means Certificate of Compliance. Overall result passes only when both COA and COC pass.</span></div><div class="certificate-summary"><div><span>COA Validation</span><strong class="${decision.coaValidation.status === "PASS" ? "text-good" : "text-bad"}">${decision.coaValidation.status}</strong></div><div><span>COC Validation</span><strong class="${decision.cocValidation.status === "PASS" ? "text-good" : "text-bad"}">${decision.cocValidation.status}</strong></div><div><span>Overall Certificate Result</span><strong class="${decision.overallStatus === "PASS" ? "text-good" : "text-bad"}">${decision.overallStatus}</strong></div></div><table><thead><tr><th>Document</th><th>Field / Commitment</th><th>Company Requirement</th><th>Supplier Value</th><th>Result</th></tr></thead><tbody>${decision.coaValidation.details.map((item) => certificateRow("COA", item)).join("")}${decision.cocValidation.details.map((item) => certificateRow("COC", item)).join("")}</tbody></table></div>`;
}

function certificateRow(documentType, item) {
  return `<tr><td>${documentType}</td><td>${item.fieldName}</td><td>${item.expected}</td><td>${item.actual}</td><td><span class="pill ${item.passed ? "good" : "bad"}">${item.passed ? "PASS" : "FAIL"}</span></td></tr>`;
}

function renderRules(evaluation) {
  return `<div class="panel wide"><div class="panel-title"><h2>Validation Rule Results</h2><span>Configurable QA controls</span></div><table><thead><tr><th>Rule</th><th>Severity</th><th>Expected</th><th>Extracted</th><th>Result</th><th>Recommended Action</th></tr></thead><tbody>${evaluation.results.map((item) => `<tr><td>${item.id} · ${item.name}</td><td>${item.severity}</td><td>${item.expected}</td><td>${item.extracted}</td><td><span class="pill ${item.passed ? "good" : "bad"}">${item.passed ? "Pass" : "Fail"}</span></td><td>${item.action}</td></tr>`).join("")}</tbody></table></div>`;
}

function renderAudit(qaCase) {
  return `<div class="panel"><div class="panel-title"><h2>Audit Trail</h2><span>Traceable system activity</span></div><ol class="audit-list">${qaCase.audit.map((event) => `<li>${event}</li>`).join("")}</ol></div>`;
}

function renderExceptions(openExceptions) {
  return `<section class="panel full"><div class="panel-title"><h2>Exception Queue</h2><span>Open items requiring QA, Receiving, or Supplier action</span></div>${openExceptions.length ? `<table><thead><tr><th>Case</th><th>Order</th><th>Severity</th><th>Exception</th><th>Field</th><th>Recommended Action</th><th>Status</th></tr></thead><tbody>${openExceptions.map((item) => `<tr><td>${item.caseId}</td><td>${item.orderId}</td><td>${item.severity}</td><td>${item.name}</td><td>${item.field}</td><td>${item.action}</td><td><span class="pill ${item.severity === "Critical" ? "bad" : "warn"}">Open</span></td></tr>`).join("")}</tbody></table>` : renderEmptyBlock("No open exceptions.")}</section>`;
}

function renderArchitecture() {
  const cards = [
    ["1", "Document Intake", "Packing lists, inspection sheets, labels, Company/Supplier COA, Company/Supplier COC, and data logger reports are attached to a QA case."],
    ["2", "OCR", "PDF pages and images are read by Tesseract after PDF.js rendering."],
    ["3", "Extraction", "A backend GenAI endpoint can return structured JSON; local extraction remains a fallback."],
    ["4", "Normalization", "IDs, dates, and quantities are standardized while source values are preserved."],
    ["5", "Rules", "Supplier COA is compared against Company COA and Supplier COC against Company COC."],
    ["6", "QA Approval", "QA corrects fields, resolves exceptions, and decisions are audited."],
  ];
  return `<section class="architecture">${cards.map(([number, title, body]) => `<div class="arch-card"><span>${number}</span><h2>${title}</h2><p>${body}</p></div>`).join("")}</section>`;
}

function renderEmptyBlock(message) {
  return `<section class="panel full"><div class="empty-state">${icon("file")}<h2>${message}</h2></div></section>`;
}

function renderEmptyInline(message) {
  return `<div class="empty-inline">${message}</div>`;
}

// ---------------------------------------------------------------------------
// Event Binding
// ---------------------------------------------------------------------------

function bindEvents() {
  const uploader = byId("documentUpload");
  if (uploader) {
    uploader.addEventListener("change", (event) => {
      const selectedFiles = Array.from(event.target.files || []);
      state.uploadedFiles = selectedFiles.map((file) => ({
        name: file.name,
        file,
        type: inferDocumentType(file.name),
        owner: [DOCUMENT_TYPES.COA, DOCUMENT_TYPES.COC].includes(inferDocumentType(file.name)) ? inferDocumentOwner(file.name) : null,
        detectedOrder: inferOrderId(file.name),
        confidence: 0.5,
      }));
      render();
    });
  }

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.action === "process") processDocuments();
      if (button.dataset.action === "complete") {
        state.stage = "complete";
        state.tab = "overview";
        render();
      }
    });
  });

  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.tab = button.dataset.tab;
      if (state.tab === "upload" && state.stage === "complete") state.stage = "intake";
      render();
    });
  });

  document.querySelectorAll("[data-case], [data-open-case]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedCaseId = button.dataset.case || button.dataset.openCase;
      state.tab = "overview";
      render();
    });
  });

  document.querySelectorAll("[data-update-field]").forEach((button) => {
    button.addEventListener("click", () => {
      const token = button.dataset.updateField;
      const input = document.querySelector(`[data-field-input="${token}"]`);
      if (!input) return;
      const rawValue = input.value.trim();
      updateInspectionField(token, rawValue.toUpperCase() === "NULL" ? "NULL" : numberOrNull(rawValue) ?? rawValue);
      render();
    });
  });

  document.querySelectorAll("[data-set-zero]").forEach((button) => {
    button.addEventListener("click", () => {
      updateInspectionField(button.dataset.setZero, 0);
      render();
    });
  });

  document.querySelectorAll("[data-set-null]").forEach((button) => {
    button.addEventListener("click", () => {
      updateInspectionField(button.dataset.setNull, "NULL");
      render();
    });
  });
}

render();
