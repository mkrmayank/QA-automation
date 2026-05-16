let cases = [
  {
    id: "QAC-10291",
    orderId: "ORD-458920",
    grn: "GRN-88412",
    supplier: "Northwind Pharma Logistics",
    product: "Sterile Injectable Kit 20 mL",
    ndc: "12345-6789-10",
    lot: "LTN-2026-045",
    expiry: "2027-05-31",
    priority: "Backorder Risk",
    assignedTo: "M. Shah",
    ageHours: 18,
    oracle: {
      orderId: "ORD-458920",
      expectedLoggerCount: 3,
      ndc: "12345-6789-10",
      lot: "LTN-2026-045",
      expiry: "2027-05-31",
      caseQuantity: 24,
    },
    documents: [
      { type: "Packing List", present: true, readable: true, status: "Pass" },
      { type: "Inspection Sheet", present: true, readable: true, status: "Missing Fields" },
      { type: "Label Image", present: true, readable: true, status: "Pass" },
      { type: "COA", present: true, readable: true, status: "Unsigned" },
      { type: "COC", present: false, readable: false, status: "Missing" },
      { type: "Data Logger Report", present: true, readable: true, status: "Pass" },
    ],
    extracted: {
      orderCandidates: [
        { source: "Packing List", label: "Sales Order", value: "ORD-458920", confidence: 0.98 },
        { source: "Inspection Sheet", label: "Order No.", value: "458920", confidence: 0.93 },
        { source: "COA", label: "Customer Order", value: "ORD-458290", confidence: 0.89 },
      ],
      dataLoggers: [
        { source: "Packing List", label: "Temp Logger", value: "DL-100245", confidence: 0.96 },
        { source: "Packing List", label: "Temp Logger", value: "DL-100246", confidence: 0.95 },
      ],
      inspection: {
        amountPerCase: null,
        fullCasesReceived: 10,
        caseQuantity: 24,
      },
      label: {
        ndc: "12345-6789-10",
        lot: "LTN-2026-045",
        expiry: "2027-05-31",
      },
      coa: {
        present: true,
        signed: false,
        lot: "LTN-2026-045",
        productMatch: true,
      },
      coc: {
        present: false,
        signed: false,
        lot: null,
        productMatch: null,
      },
      loggerReport: {
        loggerIds: ["DL-100245", "DL-100246"],
        temperatureStatus: "Within limits",
        minTemp: "2.4 C",
        maxTemp: "7.8 C",
      },
    },
    audit: [
      "09:12 Documents uploaded by Receiving",
      "09:14 OCR completed across 6 documents",
      "09:15 Rules engine identified 4 open exceptions",
    ],
  },
  {
    id: "QAC-10292",
    orderId: "ORD-459104",
    grn: "GRN-88429",
    supplier: "Apex Biologics",
    product: "Cold Chain Diagnostic Reagent",
    ndc: "54321-1122-09",
    lot: "ABX-7110",
    expiry: "2027-11-30",
    priority: "High",
    assignedTo: "R. Patel",
    ageHours: 7,
    oracle: {
      orderId: "ORD-459104",
      expectedLoggerCount: 2,
      ndc: "54321-1122-09",
      lot: "ABX-7110",
      expiry: "2027-11-30",
      caseQuantity: 12,
    },
    documents: [
      { type: "Packing List", present: true, readable: true, status: "Pass" },
      { type: "Inspection Sheet", present: true, readable: true, status: "Pass" },
      { type: "Label Image", present: true, readable: true, status: "Pass" },
      { type: "COA", present: true, readable: true, status: "Pass" },
      { type: "COC", present: true, readable: true, status: "Pass" },
      { type: "Data Logger Report", present: true, readable: true, status: "Pass" },
    ],
    extracted: {
      orderCandidates: [
        { source: "Packing List", label: "Oracle Order", value: "459104", confidence: 0.94 },
        { source: "Inspection Sheet", label: "SO Number", value: "ORD-459104", confidence: 0.97 },
      ],
      dataLoggers: [
        { source: "Packing List", label: "Device Serial No.", value: "TT4-710445", confidence: 0.94 },
        { source: "Packing List", label: "Device Serial No.", value: "TT4-710446", confidence: 0.95 },
      ],
      inspection: {
        amountPerCase: 12,
        fullCasesReceived: 16,
        caseQuantity: 12,
      },
      label: {
        ndc: "54321-1122-09",
        lot: "ABX-7110",
        expiry: "2027-11-30",
      },
      coa: {
        present: true,
        signed: true,
        lot: "ABX-7110",
        productMatch: true,
      },
      coc: {
        present: true,
        signed: true,
        lot: "ABX-7110",
        productMatch: true,
      },
      loggerReport: {
        loggerIds: ["TT4-710445", "TT4-710446"],
        temperatureStatus: "Within limits",
        minTemp: "3.1 C",
        maxTemp: "6.9 C",
      },
    },
    audit: [
      "10:22 Documents uploaded by Receiving",
      "10:24 OCR completed across 6 documents",
      "10:25 No blocking exceptions found",
    ],
  },
  {
    id: "QAC-10293",
    orderId: "ORD-459221",
    grn: "GRN-88453",
    supplier: "Helix Therapeutics",
    product: "Temperature Controlled Vial Pack",
    ndc: "67789-2201-04",
    lot: "HX-5029-B",
    expiry: "2028-02-28",
    priority: "Normal",
    assignedTo: "Unassigned",
    ageHours: 31,
    oracle: {
      orderId: "ORD-459221",
      expectedLoggerCount: 1,
      ndc: "67789-2201-04",
      lot: "HX-5029-B",
      expiry: "2028-02-28",
      caseQuantity: 48,
    },
    documents: [
      { type: "Packing List", present: true, readable: true, status: "Pass" },
      { type: "Inspection Sheet", present: true, readable: true, status: "Pass" },
      { type: "Label Image", present: true, readable: false, status: "Low Confidence" },
      { type: "COA", present: true, readable: true, status: "Pass" },
      { type: "COC", present: true, readable: true, status: "Pass" },
      { type: "Data Logger Report", present: true, readable: true, status: "Excursion" },
    ],
    extracted: {
      orderCandidates: [
        { source: "Packing List", label: "Order Reference", value: "ORD-459221", confidence: 0.96 },
      ],
      dataLoggers: [
        { source: "Packing List", label: "Recorder ID", value: "LOG-992310", confidence: 0.91 },
      ],
      inspection: {
        amountPerCase: 48,
        fullCasesReceived: 4,
        caseQuantity: 48,
      },
      label: {
        ndc: "67789-2201-04",
        lot: "HX-5029-8",
        expiry: "2028-02-28",
      },
      coa: {
        present: true,
        signed: true,
        lot: "HX-5029-B",
        productMatch: true,
      },
      coc: {
        present: true,
        signed: true,
        lot: "HX-5029-B",
        productMatch: true,
      },
      loggerReport: {
        loggerIds: ["LOG-992310"],
        temperatureStatus: "Excursion detected",
        minTemp: "1.1 C",
        maxTemp: "9.4 C",
      },
    },
    audit: [
      "Yesterday 14:46 Documents uploaded by Receiving",
      "Yesterday 14:49 OCR flagged label lot number with low confidence",
      "Yesterday 14:50 Temperature excursion routed to QA review",
    ],
  },
];

const seededDemoCases = JSON.parse(JSON.stringify(cases));

const DOCUMENT_OWNERS = {
  COMPANY: "COMPANY",
  SUPPLIER: "SUPPLIER",
};

const ANALYTICAL_SPEC_FIELDS = ["assay", "purity", "pH", "moisture", "viscosity", "microbiology", "heavyMetals", "density", "appearance"];
const COMPLIANCE_FIELDS = ["gmpCompliance", "isoCompliance", "regulatoryDeclarations", "packagingCompliance", "storageConditions", "transportationConditions", "countryOfOrigin", "agreedCommitments"];

function createDefaultCertificates(qaCase, options = {}) {
  const supplierCoaValues = {
    assay: options.assay ?? 99.4,
    purity: options.purity ?? 99.1,
    pH: options.pH ?? 7.1,
    moisture: options.moisture ?? 1.2,
    viscosity: options.viscosity ?? 12,
    microbiology: options.microbiology ?? "Conforms",
    heavyMetals: options.heavyMetals ?? "Conforms",
    density: options.density ?? 1.01,
    appearance: options.appearance ?? "Clear",
  };

  const supplierCocValues = {
    gmpCompliance: options.gmpCompliance ?? "Compliant",
    isoCompliance: options.isoCompliance ?? "ISO 13485",
    regulatoryDeclarations: options.regulatoryDeclarations ?? "Compliant",
    packagingCompliance: options.packagingCompliance ?? "Compliant",
    storageConditions: options.storageConditions ?? "2-8 C",
    transportationConditions: options.transportationConditions ?? "Temperature controlled",
    countryOfOrigin: options.countryOfOrigin ?? "Declared",
    agreedCommitments: options.agreedCommitments ?? "Compliant",
  };

  return [
    {
      document_type: "COA",
      document_owner: DOCUMENT_OWNERS.COMPANY,
      present: options.companyCoaPresent ?? true,
      signed: true,
      fields: {
        specifications: {
          assay: { rule: "range", min: 95, max: 105, unit: "%" },
          purity: { rule: "min", min: 98, unit: "%" },
          pH: { rule: "range", min: 6.8, max: 7.4 },
          moisture: { rule: "max", max: 2, unit: "%" },
          viscosity: { rule: "range", min: 10, max: 14, unit: "cP" },
          microbiology: { rule: "exact", value: "Conforms" },
          heavyMetals: { rule: "exact", value: "Conforms" },
          density: { rule: "range", min: 0.98, max: 1.03, unit: "g/mL" },
          appearance: { rule: "exact", value: "Clear" },
        },
      },
    },
    {
      document_type: "COA",
      document_owner: DOCUMENT_OWNERS.SUPPLIER,
      present: options.supplierCoaPresent ?? true,
      signed: options.supplierCoaSigned ?? true,
      fields: {
        results: supplierCoaValues,
      },
    },
    {
      document_type: "COC",
      document_owner: DOCUMENT_OWNERS.COMPANY,
      present: options.companyCocPresent ?? true,
      signed: true,
      fields: {
        commitments: {
          gmpCompliance: "Compliant",
          isoCompliance: "ISO 13485",
          regulatoryDeclarations: "Compliant",
          packagingCompliance: "Compliant",
          storageConditions: "2-8 C",
          transportationConditions: "Temperature controlled",
          countryOfOrigin: "Declared",
          agreedCommitments: "Compliant",
        },
      },
    },
    {
      document_type: "COC",
      document_owner: DOCUMENT_OWNERS.SUPPLIER,
      present: options.supplierCocPresent ?? true,
      signed: options.supplierCocSigned ?? true,
      fields: {
        declarations: supplierCocValues,
      },
    },
  ];
}

function hydrateCaseSchema(qaCase, options = {}) {
  const certificates = qaCase.extracted.certificates || createDefaultCertificates(qaCase, options);
  return {
    ...qaCase,
    documents: [
      ...(qaCase.documents || []).filter((doc) => doc.type !== "COA" && doc.type !== "COC"),
      ...certificates.map((doc) => ({
        type: `${doc.document_owner === DOCUMENT_OWNERS.COMPANY ? "Company" : "Supplier"} ${doc.document_type}`,
        present: doc.present,
        readable: doc.present,
        status: doc.present ? (doc.signed ? "Pass" : "Unsigned") : "Missing",
      })),
    ],
    extracted: {
      ...qaCase.extracted,
      certificates,
    },
  };
}

cases = cases.map((qaCase, index) => hydrateCaseSchema(qaCase, [
  { supplierCoaSigned: false, supplierCocSigned: false, supplierCocPresent: false },
  {},
  { assay: 106.2, gmpCompliance: "Compliant" },
][index] || {}));

function getOwnedDocument(qaCase, documentType, owner) {
  return qaCase.extracted.certificates?.find((doc) => doc.document_type === documentType && doc.document_owner === owner) || {
    document_type: documentType,
    document_owner: owner,
    present: false,
    signed: false,
    fields: {},
  };
}

function compareAnalyticalValue(fieldName, companyRule, supplierValue) {
  if (!companyRule || supplierValue === null || supplierValue === undefined || supplierValue === "") {
    return { fieldName, passed: false, expected: "Required specification/result", actual: valueOrBlank(supplierValue) };
  }

  if (companyRule.rule === "exact") {
    const passed = normalizeId(supplierValue) === normalizeId(companyRule.value);
    return { fieldName, passed, expected: companyRule.value, actual: supplierValue };
  }

  const numeric = Number(supplierValue);
  if (!Number.isFinite(numeric)) {
    return { fieldName, passed: false, expected: formatSpec(companyRule), actual: supplierValue };
  }

  const minOk = companyRule.min === undefined || numeric >= companyRule.min;
  const maxOk = companyRule.max === undefined || numeric <= companyRule.max;
  return { fieldName, passed: minOk && maxOk, expected: formatSpec(companyRule), actual: `${supplierValue}${companyRule.unit ? ` ${companyRule.unit}` : ""}` };
}

function formatSpec(rule) {
  if (!rule) return "Required";
  if (rule.rule === "range") return `${rule.min} - ${rule.max}${rule.unit ? ` ${rule.unit}` : ""}`;
  if (rule.rule === "min") return `>= ${rule.min}${rule.unit ? ` ${rule.unit}` : ""}`;
  if (rule.rule === "max") return `<= ${rule.max}${rule.unit ? ` ${rule.unit}` : ""}`;
  return String(rule.value ?? "Required");
}

function compareCoaDocuments(qaCase) {
  const companyCoa = getOwnedDocument(qaCase, "COA", DOCUMENT_OWNERS.COMPANY);
  const supplierCoa = getOwnedDocument(qaCase, "COA", DOCUMENT_OWNERS.SUPPLIER);
  const details = [];

  if (!companyCoa.present) details.push({ fieldName: "Company COA", passed: false, expected: "Present", actual: "Missing" });
  if (!supplierCoa.present) details.push({ fieldName: "Supplier COA", passed: false, expected: "Present", actual: "Missing" });
  if (supplierCoa.present && !supplierCoa.signed) details.push({ fieldName: "Supplier COA signature", passed: false, expected: "Signed/approved", actual: "Unsigned" });

  const specs = companyCoa.fields?.specifications || {};
  const results = supplierCoa.fields?.results || {};
  ANALYTICAL_SPEC_FIELDS.forEach((fieldName) => {
    details.push(compareAnalyticalValue(fieldName, specs[fieldName], results[fieldName]));
  });

  return {
    status: details.every((item) => item.passed) ? "PASS" : "FAIL",
    details,
  };
}

function compareComplianceValue(fieldName, required, declared) {
  if (!required || declared === null || declared === undefined || declared === "") {
    return { fieldName, passed: false, expected: valueOrBlank(required), actual: valueOrBlank(declared) };
  }
  const passed = normalizeId(required) === normalizeId(declared) || normalizeId(declared).includes(normalizeId(required));
  return { fieldName, passed, expected: required, actual: declared };
}

function compareCocDocuments(qaCase) {
  const companyCoc = getOwnedDocument(qaCase, "COC", DOCUMENT_OWNERS.COMPANY);
  const supplierCoc = getOwnedDocument(qaCase, "COC", DOCUMENT_OWNERS.SUPPLIER);
  const details = [];

  if (!companyCoc.present) details.push({ fieldName: "Company COC", passed: false, expected: "Present", actual: "Missing" });
  if (!supplierCoc.present) details.push({ fieldName: "Supplier COC", passed: false, expected: "Present", actual: "Missing" });
  if (supplierCoc.present && !supplierCoc.signed) details.push({ fieldName: "Supplier COC signature", passed: false, expected: "Signed/approved", actual: "Unsigned" });

  const commitments = companyCoc.fields?.commitments || {};
  const declarations = supplierCoc.fields?.declarations || {};
  COMPLIANCE_FIELDS.forEach((fieldName) => {
    details.push(compareComplianceValue(fieldName, commitments[fieldName], declarations[fieldName]));
  });

  return {
    status: details.every((item) => item.passed) ? "PASS" : "FAIL",
    details,
  };
}

function getCertificateDecision(qaCase) {
  const coaValidation = compareCoaDocuments(qaCase);
  const cocValidation = compareCocDocuments(qaCase);
  return {
    coaValidation,
    cocValidation,
    overallStatus: coaValidation.status === "PASS" && cocValidation.status === "PASS" ? "PASS" : "FAIL",
  };
}

const rules = [
  {
    id: "R001",
    name: "Order ID must match Oracle",
    severity: "Critical",
    run: (qaCase) => {
      const matches = qaCase.extracted.orderCandidates.some((candidate) =>
        normalizeOrder(candidate.value) === normalizeOrder(qaCase.oracle.orderId)
      );
      return result(matches, "Order ID", qaCase.oracle.orderId, listValues(qaCase.extracted.orderCandidates), "Investigate document or order mismatch before release.");
    },
  },
  {
    id: "R001A",
    name: "All high-confidence Order IDs must match Oracle",
    severity: "Critical",
    run: (qaCase) => {
      const mismatches = qaCase.extracted.orderCandidates.filter((candidate) =>
        candidate.confidence >= 0.85 && normalizeOrder(candidate.value) !== normalizeOrder(qaCase.oracle.orderId)
      );
      return result(
        mismatches.length === 0,
        "Order ID candidates",
        qaCase.oracle.orderId,
        mismatches.length ? listValues(mismatches) : "All candidates matched",
        "Confirm whether the mismatched document belongs to the correct shipment."
      );
    },
  },
  {
    id: "R002",
    name: "Data logger count must match expected count",
    severity: "High",
    run: (qaCase) => result(
      unique(qaCase.extracted.dataLoggers.map((logger) => normalizeId(logger.value))).length === qaCase.oracle.expectedLoggerCount,
      "Data logger count",
      String(qaCase.oracle.expectedLoggerCount),
      String(unique(qaCase.extracted.dataLoggers.map((logger) => normalizeId(logger.value))).length),
      "QA should verify missing or extra data logger numbers."
    ),
  },
  {
    id: "R003",
    name: "Data logger report must match packing list",
    severity: "High",
    run: (qaCase) => {
      const loggerIds = qaCase.extracted.dataLoggers.map((logger) => normalizeId(logger.value));
      const reportIds = qaCase.extracted.loggerReport.loggerIds.map(normalizeId);
      const allMatch = loggerIds.every((logger) => reportIds.includes(logger));
      return result(allMatch, "Logger IDs", listRaw(qaCase.extracted.dataLoggers), qaCase.extracted.loggerReport.loggerIds.join(", "), "Attach the correct logger report or confirm IDs manually.");
    },
  },
  {
    id: "R004",
    name: "Temperature result must be acceptable",
    severity: "Critical",
    run: (qaCase) => result(
      qaCase.extracted.loggerReport.temperatureStatus.toLowerCase().includes("within"),
      "Temperature status",
      "Within limits",
      qaCase.extracted.loggerReport.temperatureStatus,
      "Route to temperature excursion/deviation review."
    ),
  },
  {
    id: "R005",
    name: "Amount per case must be present",
    severity: "High",
    run: (qaCase) => result(Boolean(qaCase.extracted.inspection.amountPerCase), "Amount per case", "Required", valueOrBlank(qaCase.extracted.inspection.amountPerCase), "Receiving or QA must update the inspection sheet."),
  },
  {
    id: "R006",
    name: "Full cases received must be present",
    severity: "High",
    run: (qaCase) => result(Boolean(qaCase.extracted.inspection.fullCasesReceived), "Full cases received", "Required", valueOrBlank(qaCase.extracted.inspection.fullCasesReceived), "Receiving or QA must update the inspection sheet."),
  },
  {
    id: "R007",
    name: "Label lot must match Oracle",
    severity: "Critical",
    run: (qaCase) => result(normalizeId(qaCase.extracted.label.lot) === normalizeId(qaCase.oracle.lot), "Label lot", qaCase.oracle.lot, qaCase.extracted.label.lot, "Place shipment on hold and verify label image."),
  },
  {
    id: "R008",
    name: "Label NDC must match Oracle",
    severity: "Critical",
    run: (qaCase) => result(normalizeId(qaCase.extracted.label.ndc) === normalizeId(qaCase.oracle.ndc), "Label NDC", qaCase.oracle.ndc, qaCase.extracted.label.ndc, "Investigate product or label mismatch."),
  },
  {
    id: "R009",
    name: "Supplier COA must comply with Company COA",
    severity: "Critical",
    run: (qaCase) => {
      const coa = compareCoaDocuments(qaCase);
      const failed = coa.details.filter((item) => !item.passed).map((item) => item.fieldName).join(", ");
      return result(coa.status === "PASS", "COA comparison", "Supplier COA compliant with Company COA specifications", coa.status, failed ? `Review non-compliant COA field(s): ${failed}.` : "No action required.");
    },
  },
  {
    id: "R010",
    name: "Supplier COC must comply with Company COC",
    severity: "Critical",
    run: (qaCase) => {
      const coc = compareCocDocuments(qaCase);
      const failed = coc.details.filter((item) => !item.passed).map((item) => item.fieldName).join(", ");
      return result(coc.status === "PASS", "COC comparison", "Supplier COC compliant with Company COC commitments", coc.status, failed ? `Review non-compliant COC commitment(s): ${failed}.` : "No action required.");
    },
  },
  {
    id: "R011",
    name: "Overall COA/COC compliance decision",
    severity: "Critical",
    run: (qaCase) => {
      const decision = getCertificateDecision(qaCase);
      return result(decision.overallStatus === "PASS", "Overall certificate decision", "PASS", decision.overallStatus, "Overall result is FAIL unless both COA validation and COC validation pass.");
    },
  },
];

const state = {
  selectedCaseId: cases[0].id,
  tab: "upload",
  stage: "intake",
  uploadedFiles: [],
  processLog: [],
  processing: false,
};

const demoUploadFiles = [
  { name: "ORD-458920_detailed_packing_list.pdf", type: "Packing List", detectedOrder: "ORD-458920", confidence: 0.98 },
  { name: "ORD-458920_inspection_sheet.pdf", type: "Inspection Sheet", detectedOrder: "ORD-458920", confidence: 0.93 },
  { name: "ORD-458920_label_image.jpg", type: "Label Image", detectedOrder: "ORD-458920", confidence: 0.96 },
  { name: "ORD-458920_company_COA.pdf", type: "COA", owner: DOCUMENT_OWNERS.COMPANY, detectedOrder: "ORD-458920", confidence: 0.92 },
  { name: "ORD-458920_supplier_COA.pdf", type: "COA", owner: DOCUMENT_OWNERS.SUPPLIER, detectedOrder: "ORD-458920", confidence: 0.89 },
  { name: "ORD-458920_company_COC.pdf", type: "COC", owner: DOCUMENT_OWNERS.COMPANY, detectedOrder: "ORD-458920", confidence: 0.92 },
  { name: "ORD-458920_supplier_COC.pdf", type: "COC", owner: DOCUMENT_OWNERS.SUPPLIER, detectedOrder: "ORD-458920", confidence: 0.89 },
  { name: "ORD-459104_packing_list.pdf", type: "Packing List", detectedOrder: "ORD-459104", confidence: 0.94 },
  { name: "ORD-459104_inspection_sheet.pdf", type: "Inspection Sheet", detectedOrder: "ORD-459104", confidence: 0.97 },
  { name: "ORD-459104_company_COA.pdf", type: "COA", owner: DOCUMENT_OWNERS.COMPANY, detectedOrder: "ORD-459104", confidence: 0.95 },
  { name: "ORD-459104_supplier_COA.pdf", type: "COA", owner: DOCUMENT_OWNERS.SUPPLIER, detectedOrder: "ORD-459104", confidence: 0.95 },
  { name: "ORD-459104_company_COC.pdf", type: "COC", owner: DOCUMENT_OWNERS.COMPANY, detectedOrder: "ORD-459104", confidence: 0.95 },
  { name: "ORD-459104_supplier_COC.pdf", type: "COC", owner: DOCUMENT_OWNERS.SUPPLIER, detectedOrder: "ORD-459104", confidence: 0.95 },
  { name: "ORD-459221_logger_report.pdf", type: "Data Logger Report", detectedOrder: "ORD-459221", confidence: 0.91 },
  { name: "ORD-459221_label_photo.png", type: "Label Image", detectedOrder: "ORD-459221", confidence: 0.72 },
];

function normalizeOrder(value) {
  return String(value || "").toUpperCase().replace(/^ORD-?/, "").replace(/^SO-?/, "").replace(/^0+/, "").replace(/[^A-Z0-9]/g, "");
}

function normalizeId(value) {
  return String(value || "").toUpperCase().replace(/\s+/g, "").replace(/[^A-Z0-9]/g, "");
}

function unique(values) {
  return [...new Set(values)];
}

function valueOrBlank(value) {
  return value === null || value === undefined || value === "" ? "Blank" : String(value);
}

function signedText(value) {
  return value ? "Signed" : "Unsigned";
}

function listRaw(items) {
  return items.map((item) => item.value).join(", ");
}

function listValues(items) {
  return items.map((item) => `${item.value} (${item.source})`).join(", ");
}

function result(passed, field, expected, extracted, action) {
  return {
    passed,
    field,
    expected,
    extracted,
    action: passed ? "No action required." : action,
  };
}

function evaluateCase(qaCase) {
  const results = rules.map((rule) => ({ ...rule, ...rule.run(qaCase) }));
  const failed = results.filter((item) => !item.passed);
  const critical = failed.filter((item) => item.severity === "Critical");
  const high = failed.filter((item) => item.severity === "High");
  const certificateDecision = getCertificateDecision(qaCase);

  let recommendation = "Ready for QA Release";
  if (certificateDecision.overallStatus === "FAIL" || critical.length > 0) recommendation = "Compliance Hold";
  else if (high.length > 0) recommendation = "Correction Required";
  else if (failed.length > 0) recommendation = "QA Review Required";

  return { results, failed, critical, high, recommendation, certificateDecision };
}

function getMissingFieldActions() {
  return cases.flatMap((qaCase) => {
    const missing = [];
    if (qaCase.extracted.inspection.amountPerCase === null || qaCase.extracted.inspection.amountPerCase === undefined || qaCase.extracted.inspection.amountPerCase === "") {
      missing.push({
        caseId: qaCase.id,
        orderId: qaCase.orderId,
        field: "Amount per case",
        path: "amountPerCase",
        source: "Inspection Sheet",
        recommended: qaCase.oracle.caseQuantity,
      });
    }
    if (qaCase.extracted.inspection.fullCasesReceived === null || qaCase.extracted.inspection.fullCasesReceived === undefined || qaCase.extracted.inspection.fullCasesReceived === "") {
      missing.push({
        caseId: qaCase.id,
        orderId: qaCase.orderId,
        field: "Full cases received",
        path: "fullCasesReceived",
        source: "Inspection Sheet",
        recommended: 0,
      });
    }
    return missing;
  });
}

function groupUploadedFiles() {
  const files = state.uploadedFiles.length ? state.uploadedFiles : demoUploadFiles;
  return files.reduce((groups, file) => {
    const key = file.detectedOrder || "Pending OCR";
    groups[key] = groups[key] || [];
    groups[key].push(file);
    return groups;
  }, {});
}

function statusClass(status) {
  const normalized = status.toLowerCase();
  if (normalized === "pass" || normalized.includes("ready") || normalized.includes("pass") || normalized.includes("within")) return "good";
  if (normalized === "fail") return "bad";
  if (normalized.includes("review") || normalized.includes("missing fields") || normalized.includes("low")) return "warn";
  if (normalized.includes("hold") || normalized.includes("missing") || normalized.includes("unsigned") || normalized.includes("excursion") || normalized.includes("correction")) return "bad";
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

function render() {
  const selected = cases.find((qaCase) => qaCase.id === state.selectedCaseId);
  const selectedEval = evaluateCase(selected);
  const evaluatedCases = cases.map((qaCase) => ({ ...qaCase, evaluation: evaluateCase(qaCase) }));
  const openExceptions = evaluatedCases.flatMap((qaCase) =>
    qaCase.evaluation.failed.map((failure) => ({ caseId: qaCase.id, orderId: qaCase.orderId, priority: qaCase.priority, ...failure }))
  );

  document.getElementById("app").innerHTML = `
    <header class="topbar">
      <div>
        <p class="eyebrow">GenAI QA Release Intelligence</p>
        <h1>Document Verification & Product Release Dashboard</h1>
      </div>
      <div class="system-card">
        ${icon("shield")}
        <div>
          <strong>Decision Support</strong>
          <span>AI extracts. Rules validate. QA approves.</span>
        </div>
      </div>
    </header>

    <main class="layout">
      <aside class="sidebar">
        <button class="nav-item ${state.tab === "upload" ? "active" : ""}" data-tab="upload">${icon("scan")}Process Documents</button>
        <button class="nav-item ${state.tab === "overview" ? "active" : ""}" data-tab="overview">${icon("queue")}Release Queue</button>
        <button class="nav-item ${state.tab === "exceptions" ? "active" : ""}" data-tab="exceptions">${icon("alert")}Exceptions</button>
        <button class="nav-item ${state.tab === "architecture" ? "active" : ""}" data-tab="architecture">${icon("database")}Architecture</button>
        <div class="sidebar-note">
          <strong>MVP Focus</strong>
          <span>Order ID extraction, data logger counting, inspection gaps, Company-vs-Supplier COA/COC validation, and Oracle checks.</span>
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

function renderOverview(evaluatedCases, selected, selectedEval) {
  return `
    <section class="metrics">
      ${metric("Cases Pending QA", cases.length, "clock")}
      ${metric("Ready for Release", evaluatedCases.filter((item) => item.evaluation.recommendation === "Ready for QA Release").length, "check")}
      ${metric("Compliance Holds", evaluatedCases.filter((item) => item.evaluation.recommendation === "Compliance Hold").length, "alert")}
      ${metric("Open Exceptions", evaluatedCases.reduce((sum, item) => sum + item.evaluation.failed.length, 0), "file")}
    </section>

    <section class="split">
      <div class="panel queue-panel">
        <div class="panel-title">
          <h2>QA Release Queue</h2>
          <span>Click a case to inspect validation evidence</span>
        </div>
        <div class="case-list">
          ${evaluatedCases.map(renderCaseRow).join("")}
        </div>
      </div>

      <div class="panel recommendation ${statusClass(selectedEval.recommendation)}">
        <span class="pill ${statusClass(selectedEval.recommendation)}">${selectedEval.recommendation}</span>
        <h2>${selected.id} · ${selected.orderId}</h2>
        <p>${recommendationText(selected, selectedEval)}</p>
        <div class="case-meta">
          <span>${selected.product}</span>
          <span>Lot ${selected.lot}</span>
          <span>Certificate Result ${selectedEval.certificateDecision.overallStatus}</span>
          <span>${selected.priority}</span>
          <span>${selected.ageHours}h pending</span>
        </div>
      </div>
    </section>

    <section class="detail-grid">
      ${renderDocumentChecklist(selected)}
      ${renderOrderExtraction(selected)}
      ${renderDataLoggers(selected)}
      ${renderFieldComparison(selected)}
      ${renderCertificateComparison(selected, selectedEval)}
      ${renderRules(selectedEval)}
      ${renderAudit(selected)}
    </section>
  `;
}

function metric(label, value, iconName) {
  return `
    <div class="metric">
      ${icon(iconName)}
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `;
}

function renderUploadWorkflow(evaluatedCases) {
  const missing = getMissingFieldActions();
  return `
    <section class="workflow">
      <div class="stepper">
        ${step("1", "Upload", state.stage === "intake" || state.stage === "processing" || state.stage === "review" || state.stage === "complete")}
        ${step("2", "AI Processing", state.stage === "processing" || state.stage === "review" || state.stage === "complete")}
        ${step("3", "Resolve Missing Fields", state.stage === "review" || state.stage === "complete")}
        ${step("4", "Dashboard", state.stage === "complete")}
      </div>

      ${state.stage === "intake" ? renderIntake() : ""}
      ${state.stage === "processing" ? renderProcessing() : ""}
      ${state.stage === "review" ? renderMissingReview(missing) : ""}
      ${state.stage === "complete" ? renderProcessComplete(evaluatedCases) : ""}
    </section>
  `;
}

function step(number, label, active) {
  return `
    <div class="step ${active ? "active" : ""}">
      <span>${number}</span>
      <strong>${label}</strong>
    </div>
  `;
}

function renderIntake() {
  const groups = groupUploadedFiles();
  const files = state.uploadedFiles.length ? state.uploadedFiles : demoUploadFiles;
  return `
    <section class="panel full upload-panel">
      <div class="panel-title">
        <h2>Bulk QA Document Intake</h2>
        <span>Upload documents for one or many orders. The prototype groups them by detected Order ID.</span>
      </div>
      <div class="upload-body">
        <label class="drop-zone">
          ${icon("file")}
          <strong>Drop or select QA documents</strong>
          <span>Packing lists, inspection sheets, labels, Company/Supplier COA, Company/Supplier COC (Certificate of Compliance), and data logger reports can be processed together.</span>
          <input id="documentUpload" type="file" multiple />
        </label>

        <div class="action-row">
          <button class="primary-action" data-action="use-demo">Use Demo Batch</button>
          <button class="primary-action" data-action="process" ${files.length ? "" : "disabled"}>Start AI Processing</button>
        </div>
      </div>
    </section>

    <section class="split">
      <div class="panel">
        <div class="panel-title">
          <h2>Detected Upload Batch</h2>
          <span>${files.length} document(s) ready</span>
        </div>
        <table>
          <thead><tr><th>File</th><th>Document Type</th><th>Owner</th><th>Detected Order</th><th>Confidence</th></tr></thead>
          <tbody>
            ${files.map((file) => `
              <tr>
                <td>${file.name}</td>
                <td>${file.type}</td>
                <td>${file.owner || "N/A"}</td>
                <td>${file.detectedOrder}</td>
                <td>${Math.round(file.confidence * 100)}%</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <div class="panel">
        <div class="panel-title">
          <h2>Smart Order Grouping</h2>
          <span>Documents are separated before validation</span>
        </div>
        <div class="group-list">
          ${Object.entries(groups).map(([orderId, groupedFiles]) => `
            <button class="group-card" data-order="${orderId}">
              <span class="pill ${statusClass("review")}">${groupedFiles.length} docs</span>
              <strong>${orderId}</strong>
              <small>${groupedFiles.map((file) => `${file.owner ? `${file.owner} ` : ""}${file.type}`).join(", ")}</small>
            </button>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderProcessing() {
  const groups = groupUploadedFiles();
  return `
    <section class="panel full processing-panel">
      <div class="panel-title">
        <h2>AI Processing in Progress</h2>
        <span>Simulated OCR, NLP extraction, normalization, and rules execution</span>
      </div>
      <div class="process-grid">
        ${processCard("Document Classification", "Complete", "Files identified as packing list, inspection sheet, label, Company/Supplier COA, Company/Supplier COC, and logger report.")}
        ${processCard("Order ID Grouping", "Complete", `${Object.keys(groups).length} order group(s) detected from the uploaded batch.`)}
        ${processCard("OCR + GenAI Extraction", "Complete", "Order IDs, data logger numbers, label fields, COA specifications/results, and COC commitments/declarations extracted.")}
        ${processCard("Rules Engine", "Complete", "Oracle, inspection, logger, label, and certificate checks executed separately per order.")}
      </div>
      <div class="process-log">
        ${state.processLog.map((item) => `<div>${icon("check")}<span>${item}</span></div>`).join("")}
      </div>
    </section>
  `;
}

function processCard(title, status, body) {
  return `
    <div class="process-card">
      <span class="pill good">${status}</span>
      <h2>${title}</h2>
      <p>${body}</p>
    </div>
  `;
}

function renderMissingReview(missing) {
  if (!missing.length) {
    return `
      <section class="panel full">
        <div class="empty-state">
          ${icon("check")}
          <h2>No Missing Fields Found</h2>
          <p>All required inspection fields are complete. Continue to the dashboard for release review.</p>
          <button class="primary-action" data-action="complete">Go to Dashboard</button>
        </div>
      </section>
    `;
  }

  return `
    <section class="panel full">
      <div class="panel-title">
        <h2>Missing Field Resolution</h2>
        <span>QA must fill the value or intentionally set 0 / NULL before dashboard release review.</span>
      </div>
      <table>
        <thead><tr><th>Order</th><th>Field</th><th>Source</th><th>Current Value</th><th>Actions</th></tr></thead>
        <tbody>
          ${missing.map((item) => `
            <tr>
              <td>${item.orderId}</td>
              <td>${item.field}</td>
              <td>${item.source}</td>
              <td><span class="pill bad">Empty</span></td>
              <td>
                <div class="field-actions">
                  <input type="number" placeholder="Enter value" data-fill-input="${item.caseId}:${item.path}" />
                  <button data-fill="${item.caseId}:${item.path}">Fill</button>
                  <button data-default-zero="${item.caseId}:${item.path}">Use 0</button>
                  <button data-default-null="${item.caseId}:${item.path}">Use NULL</button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      <div class="review-footer">
        <p>Using 0 or NULL is captured as a QA action in the audit trail so the decision is traceable.</p>
        <button class="primary-action" data-action="complete" ${getMissingFieldActions().length ? "disabled" : ""}>Go to Dashboard</button>
      </div>
    </section>
  `;
}

function renderProcessComplete(evaluatedCases) {
  return `
    <section class="panel full">
      <div class="panel-title">
        <h2>Processing Complete</h2>
        <span>Each order is now available separately in the QA release queue.</span>
      </div>
      <div class="completion-grid">
        ${evaluatedCases.map((qaCase) => `
          <button class="completion-card" data-open-case="${qaCase.id}">
            <span class="pill ${statusClass(qaCase.evaluation.recommendation)}">${qaCase.evaluation.recommendation}</span>
            <strong>${qaCase.orderId}</strong>
            <small>${qaCase.evaluation.failed.length} exception(s) · ${qaCase.product}</small>
          </button>
        `).join("")}
      </div>
      <div class="action-row">
        <button class="primary-action" data-tab="overview">Open Release Dashboard</button>
      </div>
    </section>
  `;
}

function inferDocumentType(fileName) {
  const lower = fileName.toLowerCase();
  if (lower.includes("packing")) return "Packing List";
  if (lower.includes("inspection")) return "Inspection Sheet";
  if (lower.includes("label")) return "Label Image";
  if (lower.includes("logger") || lower.includes("temperature")) return "Data Logger Report";
  if (lower.includes("coa")) return "COA";
  if (lower.includes("coc")) return "COC";
  return "Supporting Document";
}

function inferDocumentOwner(fileName, text = "") {
  const combined = `${fileName} ${text}`.toLowerCase();
  if (/\b(company|approved|master|internal|committed|specification|spec)\b/.test(combined)) return DOCUMENT_OWNERS.COMPANY;
  if (/\b(supplier|vendor|manufacturer|provided)\b/.test(combined)) return DOCUMENT_OWNERS.SUPPLIER;
  return DOCUMENT_OWNERS.SUPPLIER;
}

function inferOrderId(fileName, index) {
  const match = fileName.toUpperCase().match(/ORD[-_ ]?\d{6}/);
  if (match) return match[0].replace("_", "-").replace(" ", "-");
  return cases[index % cases.length].orderId;
}

function extractPdfStrings(rawText) {
  const values = [];
  const regex = /\((?:\\.|[^\\)])*\)\s*Tj/g;
  let match;
  while ((match = regex.exec(rawText))) {
    const value = match[0]
      .replace(/\)\s*Tj$/, "")
      .replace(/^\(/, "")
      .replace(/\\\(/g, "(")
      .replace(/\\\)/g, ")")
      .replace(/\\\\/g, "\\")
      .trim();
    if (value) values.push(value);
  }
  return values.length ? values.join("\n") : rawText;
}

async function readUploadedDocument(upload) {
  if (!upload.file) return { ...upload, text: "" };
  const buffer = await upload.file.arrayBuffer();
  const raw = new TextDecoder("latin1").decode(buffer);
  const text = extractPdfStrings(raw);
  return {
    ...upload,
    text,
    type: inferDocumentTypeFromText(text, upload.name),
    owner: inferDocumentOwner(upload.name, text),
    detectedOrder: findFirst(text, /(?:Order ID|Order No\.|Oracle Order|Sales Order|Customer Order|Order Reference|PO \/ Order Ref|Customer Order):?\s*([A-Z]{2,4}[- ]?\d{6})/i) || inferOrderId(upload.name, 0),
    confidence: text ? 0.96 : upload.confidence,
  };
}

function inferDocumentTypeFromText(text, fileName) {
  if (/Detailed Packing List/i.test(text)) return "Packing List";
  if (/QA Inspection and Release Report/i.test(text)) return "Inspection Sheet";
  if (/Product Label Image Simulation/i.test(text)) return "Label Image";
  if (/Certificate of Analysis/i.test(text)) return "COA";
  if (/Certificate of Compliance/i.test(text)) return "COC";
  if (/Temperature Data Logger Report/i.test(text)) return "Data Logger Report";
  return inferDocumentType(fileName);
}

function findFirst(text, regex) {
  const match = text.match(regex);
  if (!match) return null;
  return match.length > 1 ? String(match[1]).trim() : String(match[0]).trim();
}

function findAll(text, regex) {
  return [...text.matchAll(regex)].map((match) => String(match[1] || match[0]).trim());
}

function numberOrNull(value) {
  if (value === null || value === undefined) return null;
  const clean = String(value).trim();
  if (!clean) return null;
  const parsed = Number(clean);
  return Number.isFinite(parsed) ? parsed : null;
}

function groupDocumentsByOrderOrLot(documents) {
  const anchors = documents
    .filter((doc) => ["Packing List", "Inspection Sheet", "Label Image", "Data Logger Report"].includes(doc.type))
    .map((doc) => ({
      orderId: findFirst(doc.text, /(?:Order ID|Order No\.|Oracle Order|Sales Order|Customer Order|Order Reference|PO \/ Order Ref):?\s*([A-Z]{2,4}[- ]?\d{6})/i) || doc.detectedOrder,
      lot: findFirst(doc.text, /Lot(?: Number)?:?\s*([A-Z0-9-]+)/i) || findFirst(doc.text, /LOT:\s*([A-Z0-9-]+)/i),
      product: findFirst(doc.text, /Product(?: Description)?:?\s*([^\n]+)/i),
    }));

  return documents.reduce((groups, doc) => {
    const orderId = findFirst(doc.text, /(?:Order ID|Order No\.|Oracle Order|Sales Order|Customer Order|Order Reference|PO \/ Order Ref):?\s*([A-Z]{2,4}[- ]?\d{6})/i) || doc.detectedOrder;
    const lot = findFirst(doc.text, /Lot(?: Number)?:?\s*([A-Z0-9-]+)/i) || findFirst(doc.text, /LOT:\s*([A-Z0-9-]+)/i);
    const product = findFirst(doc.text, /Product(?: Description)?:?\s*([^\n]+)/i);
    const anchor = anchors.find((item) => item.lot && lot && normalizeId(item.lot) === normalizeId(lot) && item.product && product && item.product === product);
    const key = doc.type === "COA" || doc.type === "COC" ? (anchor?.orderId || orderId) : orderId;
    groups[key] = groups[key] || [];
    groups[key].push(doc);
    return groups;
  }, {});
}

function docOf(docs, type) {
  return docs.find((doc) => doc.type === type) || { text: "", type, name: `${type} missing` };
}

function ownedDocOf(docs, type, owner) {
  return docs.find((doc) => doc.type === type && doc.owner === owner) || { text: "", type, owner, name: `${owner} ${type} missing` };
}

function extractAnalyticalFields(text, owner) {
  if (!text) return owner === DOCUMENT_OWNERS.COMPANY ? { specifications: {} } : { results: {} };
  if (owner === DOCUMENT_OWNERS.COMPANY) {
    return {
      specifications: {
        assay: extractSpecRule(text, "Assay", { rule: "range", min: 95, max: 105, unit: "%" }),
        purity: extractSpecRule(text, "Purity", { rule: "min", min: 98, unit: "%" }),
        pH: extractSpecRule(text, "pH", { rule: "range", min: 6.8, max: 7.4 }),
        moisture: extractSpecRule(text, "Moisture", { rule: "max", max: 2, unit: "%" }),
        viscosity: extractSpecRule(text, "Viscosity", { rule: "range", min: 10, max: 14, unit: "cP" }),
        microbiology: { rule: "exact", value: findFirst(text, /Microbiology\s*\|\s*([^|\n]+)/i) || "Conforms" },
        heavyMetals: { rule: "exact", value: findFirst(text, /Heavy Metals\s*\|\s*([^|\n]+)/i) || "Conforms" },
        density: extractSpecRule(text, "Density", { rule: "range", min: 0.98, max: 1.03, unit: "g/mL" }),
        appearance: { rule: "exact", value: findFirst(text, /Appearance\s*\|\s*([^|\n]+)/i) || "Clear" },
      },
    };
  }
  return {
    results: {
      assay: numberOrText(findFirst(text, /Assay\s*\|[^|\n]*\|\s*([^|\n]+)/i)),
      purity: numberOrText(findFirst(text, /Purity\s*\|[^|\n]*\|\s*([^|\n]+)/i)),
      pH: numberOrText(findFirst(text, /pH\s*\|[^|\n]*\|\s*([^|\n]+)/i)),
      moisture: numberOrText(findFirst(text, /Moisture\s*\|[^|\n]*\|\s*([^|\n]+)/i)),
      viscosity: numberOrText(findFirst(text, /Viscosity\s*\|[^|\n]*\|\s*([^|\n]+)/i)),
      microbiology: findFirst(text, /Microbiology\s*\|[^|\n]*\|\s*([^|\n]+)/i) || "Conforms",
      heavyMetals: findFirst(text, /Heavy Metals\s*\|[^|\n]*\|\s*([^|\n]+)/i) || "Conforms",
      density: numberOrText(findFirst(text, /Density\s*\|[^|\n]*\|\s*([^|\n]+)/i)),
      appearance: findFirst(text, /Appearance\s*\|[^|\n]*\|\s*([^|\n]+)/i) || "Clear",
    },
  };
}

function numberOrText(value) {
  const parsed = numberOrNull(value);
  return parsed === null ? value : parsed;
}

function extractSpecRule(text, label, fallback) {
  const spec = findFirst(text, new RegExp(`${label}\\s*\\|\\s*([^|\\n]+)`, "i"));
  if (!spec) return fallback;
  const range = spec.match(/([0-9.]+)\s*[-–]\s*([0-9.]+)/);
  if (range) return { rule: "range", min: Number(range[1]), max: Number(range[2]), unit: fallback.unit };
  const min = spec.match(/(?:>=|NLT|not less than|min)\s*([0-9.]+)/i);
  if (min) return { rule: "min", min: Number(min[1]), unit: fallback.unit };
  const max = spec.match(/(?:<=|NMT|not more than|max)\s*([0-9.]+)/i);
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
  const defaultValues = {
    gmpCompliance: "Compliant",
    isoCompliance: "ISO 13485",
    regulatoryDeclarations: "Compliant",
    packagingCompliance: "Compliant",
    storageConditions: "2-8 C",
    transportationConditions: "Temperature controlled",
    countryOfOrigin: "Declared",
    agreedCommitments: "Compliant",
  };
  return owner === DOCUMENT_OWNERS.COMPANY
    ? { commitments: Object.fromEntries(COMPLIANCE_FIELDS.map((field) => [field, values[field] || defaultValues[field]])) }
    : { declarations: Object.fromEntries(COMPLIANCE_FIELDS.map((field) => [field, values[field] || defaultValues[field]])) };
}

function buildCertificateRecord(doc) {
  const owner = doc.owner || inferDocumentOwner(doc.name, doc.text);
  return {
    document_type: doc.type,
    document_owner: owner,
    present: Boolean(doc.text),
    signed: doc.type === "COA"
      ? /Quality Approval:\s*(?!\s*$).+/i.test(doc.text) && !/Unsigned/i.test(doc.text)
      : /Signature:\s*(?!\s*$).+/i.test(doc.text) && !/Unsigned/i.test(doc.text),
    fields: doc.type === "COA" ? extractAnalyticalFields(doc.text, owner) : extractComplianceFields(doc.text, owner),
  };
}

function buildCaseFromDocuments(orderId, docs, index) {
  const packing = docOf(docs, "Packing List");
  const inspection = docOf(docs, "Inspection Sheet");
  const label = docOf(docs, "Label Image");
  const supplierCoa = ownedDocOf(docs, "COA", DOCUMENT_OWNERS.SUPPLIER);
  const supplierCoc = ownedDocOf(docs, "COC", DOCUMENT_OWNERS.SUPPLIER);
  const loggerReport = docOf(docs, "Data Logger Report");
  const allText = docs.map((doc) => doc.text).join("\n");

  const product = findFirst(allText, /Product(?: Description)?:?\s*([^\n]+)/i) || "Unknown Product";
  const ndc = findFirst(allText, /NDC:?\s*([0-9-]+)/i) || "Unknown";
  const lot = findFirst(packing.text + "\n" + inspection.text, /Lot(?: Number)?:?\s*([A-Z0-9-]+)/i) || findFirst(label.text, /LOT:\s*([A-Z0-9-]+)/i) || "Unknown";
  const expiry = findFirst(packing.text + "\n" + inspection.text, /Expiration Date:?\s*([0-9-]+)/i) || findFirst(label.text, /EXP:\s*([0-9-]+)/i) || "Unknown";
  const expectedLoggerCount = numberOrNull(findFirst(packing.text, /Expected Data Logger Count:?\s*(\d+)/i)) || findAll(packing.text, /(?:Temp Logger|Device Serial No\.|Recorder ID|Serial Number|DL No\.):\s*([A-Z0-9 -]+)/gi).length;
  const loggerNumbers = findAll(packing.text, /(?:Temp Logger|Device Serial No\.|Recorder ID|Serial Number|DL No\.):\s*([A-Z0-9 -]+)/gi);
  const reportLoggerIds = findAll(loggerReport.text, /Logger ID:\s*([A-Z0-9 -]+)/gi);
  const amountPerCase = findFirst(inspection.text, /Amount per case:\s*([^\n]*)/i);
  const fullCasesReceived = findFirst(inspection.text, /Full cases received:\s*([^\n]*)/i);
  const certificates = docs.filter((doc) => doc.type === "COA" || doc.type === "COC").map(buildCertificateRecord);

  return {
    id: `QAC-UP-${String(index + 1).padStart(3, "0")}`,
    orderId,
    grn: findFirst(allText, /GRN \/ Receiving No\.?:?\s*([A-Z0-9-]+)/i) || "Pending",
    supplier: findFirst(allText, /Supplier:?\s*([^\n]+)/i) || "Unknown Supplier",
    product,
    ndc,
    lot,
    expiry,
    priority: /Backorder|excursion|Unsigned|Incomplete/i.test(allText) ? "High" : "Normal",
    assignedTo: "Unassigned",
    ageHours: 0,
    oracle: {
      orderId,
      expectedLoggerCount,
      ndc,
      lot,
      expiry,
      caseQuantity: numberOrNull(findFirst(allText, /Case Quantity:?\s*(\d+)/i)) || numberOrNull(findFirst(allText, /CASE QTY:\s*(\d+)/i)) || 0,
    },
    documents: ["Packing List", "Inspection Sheet", "Label Image", "Company COA", "Supplier COA", "Company COC", "Supplier COC", "Data Logger Report"].map((type) => {
      const found = type.includes("Company") ? docs.find((doc) => doc.type === type.split(" ")[1] && doc.owner === DOCUMENT_OWNERS.COMPANY)
        : type.includes("Supplier") ? docs.find((doc) => doc.type === type.split(" ")[1] && doc.owner === DOCUMENT_OWNERS.SUPPLIER)
          : docs.find((doc) => doc.type === type);
      return {
        type,
        present: Boolean(found),
        readable: Boolean(found?.text),
        status: found ? documentStatus(type, found.text) : "Missing",
      };
    }),
    extracted: {
      orderCandidates: docs.map((doc) => ({
        source: `${doc.owner ? `${doc.owner} ` : ""}${doc.type}`,
        label: orderLabelFor(doc.text),
        value: findFirst(doc.text, /(?:Order ID|Order No\.|Oracle Order|Sales Order|Customer Order|Order Reference|PO \/ Order Ref):?\s*([A-Z]{2,4}[- ]?\d{6})/i) || orderId,
        confidence: doc.confidence || 0.9,
      })),
      dataLoggers: loggerNumbers.map((value) => ({ source: "Packing List", label: "Detected Logger ID", value, confidence: 0.94 })),
      inspection: {
        amountPerCase: numberOrNull(amountPerCase),
        fullCasesReceived: numberOrNull(fullCasesReceived),
        caseQuantity: numberOrNull(findFirst(inspection.text, /Case Quantity:?\s*(\d+)/i)) || 0,
      },
      label: {
        ndc: findFirst(label.text, /NDC\s*([0-9-]+)/i) || ndc,
        lot: findFirst(label.text, /LOT:\s*([A-Z0-9-]+)/i) || lot,
        expiry: findFirst(label.text, /EXP:\s*([0-9-]+)/i) || expiry,
      },
      coa: {
        present: Boolean(supplierCoa.text),
        signed: getOwnedDocument({ extracted: { certificates } }, "COA", DOCUMENT_OWNERS.SUPPLIER).signed,
        lot: findFirst(supplierCoa.text, /Lot Number:?\s*([A-Z0-9-]+)/i) || lot,
        productMatch: supplierCoa.text ? supplierCoa.text.includes(product) : false,
      },
      coc: {
        present: Boolean(supplierCoc.text),
        signed: getOwnedDocument({ extracted: { certificates } }, "COC", DOCUMENT_OWNERS.SUPPLIER).signed,
        lot: findFirst(supplierCoc.text, /Lot:?\s*([A-Z0-9-]+)/i) || lot,
        productMatch: supplierCoc.text ? supplierCoc.text.includes(product) : false,
      },
      certificates,
      loggerReport: {
        loggerIds: reportLoggerIds,
        temperatureStatus: findFirst(loggerReport.text, /Temperature Status:?\s*([^\n]+)/i) || "Missing",
        minTemp: findFirst(loggerReport.text, /Minimum Temperature:?\s*([^\n]+)/i) || "N/A",
        maxTemp: findFirst(loggerReport.text, /Maximum Temperature:?\s*([^\n]+)/i) || "N/A",
      },
    },
    audit: [
      `${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ${docs.length} uploaded document(s) parsed`,
      `${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} Grouped under ${orderId} using Order ID and lot/product matching`,
      `${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} Validation rules executed`,
    ],
  };
}

function documentStatus(type, text) {
  if (!text) return "Unreadable";
  if (/Unsigned/i.test(text)) return "Unsigned";
  if (/Excursion detected|FAIL/i.test(text)) return "Excursion";
  if (/\[BLANK\]|Incomplete/i.test(text)) return "Incomplete";
  if (/Low-confidence|ambiguous/i.test(text)) return "Low Confidence";
  if (/Amount per case:\s*$/im.test(text) || /Full cases received:\s*$/im.test(text)) return "Missing Fields";
  return "Pass";
}

function orderLabelFor(text) {
  const labels = ["Sales Order", "Oracle Order", "Order No.", "Customer Order", "Order Reference", "PO / Order Ref", "Order ID"];
  return labels.find((label) => text.includes(label)) || "Order ID";
}

async function buildCasesFromUploads() {
  const parsedDocuments = await Promise.all(state.uploadedFiles.map(readUploadedDocument));
  state.uploadedFiles = parsedDocuments.map((doc) => ({
    name: doc.name,
    type: doc.type,
    owner: doc.owner,
    detectedOrder: doc.detectedOrder,
    confidence: doc.confidence,
    file: doc.file,
    text: doc.text,
  }));
  const grouped = groupDocumentsByOrderOrLot(parsedDocuments);
  return Object.entries(grouped).map(([orderId, docs], index) => buildCaseFromDocuments(orderId, docs, index));
}

async function processDocuments() {
  state.stage = "processing";
  state.processLog = [
    "Uploaded documents classified by type.",
    "COA/COC documents classified by owner: COMPANY or SUPPLIER.",
    "Order IDs extracted from varied labels and filenames.",
    "Documents grouped into separate QA cases.",
    "Data logger numbers extracted and counted.",
    "Supplier COA compared against Company COA.",
    "Supplier COC compared against Company COC.",
    "Missing inspection fields routed for QA action.",
  ];
  render();
  if (state.uploadedFiles.some((file) => file.file)) {
    cases = await buildCasesFromUploads();
    state.selectedCaseId = cases[0]?.id;
  }
  window.setTimeout(() => {
    state.stage = getMissingFieldActions().length ? "review" : "complete";
    render();
  }, 500);
}

function resolveMissingField(token, value) {
  const [caseId, path] = token.split(":");
  const qaCase = cases.find((item) => item.id === caseId);
  if (!qaCase) return;
  qaCase.extracted.inspection[path] = value;
  qaCase.audit.push(`${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} QA resolved ${path} as ${value}`);
}

function renderCaseRow(qaCase) {
  return `
    <button class="case-row ${qaCase.id === state.selectedCaseId ? "selected" : ""}" data-case="${qaCase.id}">
      <div>
        <strong>${qaCase.orderId}</strong>
        <span>${qaCase.product}</span>
      </div>
      <span class="pill ${statusClass(qaCase.evaluation.recommendation)}">${qaCase.evaluation.recommendation}</span>
      <small>${qaCase.grn} · ${qaCase.ageHours}h</small>
    </button>
  `;
}

function recommendationText(qaCase, evaluation) {
  if (evaluation.recommendation === "Ready for QA Release") {
    return "COA validation and COC validation passed, and all priority checks passed. QA can proceed with release approval after final review.";
  }
  if (evaluation.certificateDecision.overallStatus === "FAIL") {
    return `Do not release yet. Overall certificate result is FAIL because COA validation is ${evaluation.certificateDecision.coaValidation.status} and COC validation is ${evaluation.certificateDecision.cocValidation.status}.`;
  }
  const reasons = evaluation.failed.slice(0, 3).map((item) => item.name.toLowerCase()).join(", ");
  return `Do not release yet. The system found ${evaluation.failed.length} exception(s): ${reasons}.`;
}

function renderDocumentChecklist(qaCase) {
  return `
    <div class="panel">
      <div class="panel-title">
        <h2>Document Checklist</h2>
        <span>Required release package</span>
      </div>
      <table>
        <thead><tr><th>Document</th><th>Present</th><th>Readable</th><th>Status</th></tr></thead>
        <tbody>
          ${qaCase.documents.map((doc) => `
            <tr>
              <td>${doc.type}</td>
              <td>${doc.present ? "Yes" : "No"}</td>
              <td>${doc.readable ? "Yes" : "No"}</td>
              <td><span class="pill ${statusClass(doc.status)}">${doc.status}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderOrderExtraction(qaCase) {
  return `
    <div class="panel">
      <div class="panel-title">
        <h2>Order ID Extraction</h2>
        <span>Varied labels normalized against Oracle</span>
      </div>
      <table>
        <thead><tr><th>Source</th><th>Detected Label</th><th>Extracted</th><th>Confidence</th><th>Oracle Match</th></tr></thead>
        <tbody>
          ${qaCase.extracted.orderCandidates.map((candidate) => {
            const match = normalizeOrder(candidate.value) === normalizeOrder(qaCase.oracle.orderId);
            return `
              <tr>
                <td>${candidate.source}</td>
                <td>${candidate.label}</td>
                <td>${candidate.value}</td>
                <td>${Math.round(candidate.confidence * 100)}%</td>
                <td><span class="pill ${match ? "good" : "bad"}">${match ? "Yes" : "No"}</span></td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderDataLoggers(qaCase) {
  const loggerCount = unique(qaCase.extracted.dataLoggers.map((logger) => normalizeId(logger.value))).length;
  const countOk = loggerCount === qaCase.oracle.expectedLoggerCount;
  return `
    <div class="panel highlight-panel">
      <div class="panel-title">
        <h2>Data Logger Validation</h2>
        <span>Extraction, count, report match, temperature result</span>
      </div>
      <div class="logger-summary">
        <div><span>Found</span><strong>${loggerCount}</strong></div>
        <div><span>Expected</span><strong>${qaCase.oracle.expectedLoggerCount}</strong></div>
        <div><span>Count Result</span><strong class="${countOk ? "text-good" : "text-bad"}">${countOk ? "Pass" : "Review"}</strong></div>
        <div><span>Temp Status</span><strong class="${statusClass(qaCase.extracted.loggerReport.temperatureStatus)}">${qaCase.extracted.loggerReport.temperatureStatus}</strong></div>
      </div>
      <table>
        <thead><tr><th>Logger ID</th><th>Source Label</th><th>Source</th><th>Confidence</th></tr></thead>
        <tbody>
          ${qaCase.extracted.dataLoggers.map((logger) => `
            <tr>
              <td>${logger.value}</td>
              <td>${logger.label}</td>
              <td>${logger.source}</td>
              <td>${Math.round(logger.confidence * 100)}%</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
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
  return `
    <div class="panel wide">
      <div class="panel-title">
        <h2>Extracted Field Comparison</h2>
        <span>Oracle reference vs document evidence</span>
      </div>
      <table>
        <thead><tr><th>Field</th><th>Oracle / Rule</th><th>Extracted</th><th>Source</th><th>Result</th></tr></thead>
        <tbody>
          ${rows.map(([field, expected, extracted, source]) => {
            const pass = expected === "Required" ? extracted !== "Blank" : normalizeId(expected) === normalizeId(extracted);
            return `
              <tr>
                <td>${field}</td>
                <td>${expected}</td>
                <td>${extracted}</td>
                <td>${source}</td>
                <td><span class="pill ${pass ? "good" : "bad"}">${pass ? "Pass" : "Fail"}</span></td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderCertificateComparison(qaCase, evaluation) {
  const decision = evaluation.certificateDecision;
  const coaRows = decision.coaValidation.details;
  const cocRows = decision.cocValidation.details;
  return `
    <div class="panel wide">
      <div class="panel-title">
        <h2>Company vs Supplier Certificate Validation</h2>
        <span>COC means Certificate of Compliance. Overall result passes only when both COA and COC pass.</span>
      </div>
      <div class="certificate-summary">
        <div><span>COA Validation</span><strong class="${decision.coaValidation.status === "PASS" ? "text-good" : "text-bad"}">${decision.coaValidation.status}</strong></div>
        <div><span>COC Validation</span><strong class="${decision.cocValidation.status === "PASS" ? "text-good" : "text-bad"}">${decision.cocValidation.status}</strong></div>
        <div><span>Overall Certificate Result</span><strong class="${decision.overallStatus === "PASS" ? "text-good" : "text-bad"}">${decision.overallStatus}</strong></div>
      </div>
      <table>
        <thead><tr><th>Document</th><th>Field / Commitment</th><th>Company Requirement</th><th>Supplier Value</th><th>Result</th></tr></thead>
        <tbody>
          ${coaRows.map((item) => certificateRow("COA", item)).join("")}
          ${cocRows.map((item) => certificateRow("COC", item)).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function certificateRow(documentType, item) {
  return `
    <tr>
      <td>${documentType}</td>
      <td>${item.fieldName}</td>
      <td>${item.expected}</td>
      <td>${item.actual}</td>
      <td><span class="pill ${item.passed ? "good" : "bad"}">${item.passed ? "PASS" : "FAIL"}</span></td>
    </tr>
  `;
}

function renderRules(evaluation) {
  return `
    <div class="panel wide">
      <div class="panel-title">
        <h2>Validation Rule Results</h2>
        <span>Configurable QA controls</span>
      </div>
      <table>
        <thead><tr><th>Rule</th><th>Severity</th><th>Expected</th><th>Extracted</th><th>Result</th><th>Recommended Action</th></tr></thead>
        <tbody>
          ${evaluation.results.map((item) => `
            <tr>
              <td>${item.id} · ${item.name}</td>
              <td>${item.severity}</td>
              <td>${item.expected}</td>
              <td>${item.extracted}</td>
              <td><span class="pill ${item.passed ? "good" : "bad"}">${item.passed ? "Pass" : "Fail"}</span></td>
              <td>${item.action}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderAudit(qaCase) {
  return `
    <div class="panel">
      <div class="panel-title">
        <h2>Audit Trail</h2>
        <span>Traceable system activity</span>
      </div>
      <ol class="audit-list">
        ${qaCase.audit.map((event) => `<li>${event}</li>`).join("")}
      </ol>
      <div class="decision-box">
        <strong>QA Decision Controls</strong>
        <button>Confirm Values</button>
        <button>Request Correction</button>
        <button>Approve / Hold</button>
      </div>
    </div>
  `;
}

function renderExceptions(openExceptions) {
  return `
    <section class="panel full">
      <div class="panel-title">
        <h2>Exception Queue</h2>
        <span>Open items requiring QA, Receiving, or Supplier action</span>
      </div>
      <table>
        <thead><tr><th>Case</th><th>Order</th><th>Severity</th><th>Exception</th><th>Field</th><th>Recommended Action</th><th>Status</th></tr></thead>
        <tbody>
          ${openExceptions.map((item) => `
            <tr>
              <td>${item.caseId}</td>
              <td>${item.orderId}</td>
              <td>${item.severity}</td>
              <td>${item.name}</td>
              <td>${item.field}</td>
              <td>${item.action}</td>
              <td><span class="pill ${item.severity === "Critical" ? "bad" : "warn"}">Open</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </section>
  `;
}

function renderArchitecture() {
  return `
    <section class="architecture">
      ${architectureCard("1", "Document Intake", "Packing lists, inspection sheets, labels, Company COA, Supplier COA, Company COC, Supplier COC, and data logger reports are attached to a QA case.")}
      ${architectureCard("2", "OCR + Computer Vision", "Documents are read, classified, and converted into text, tables, field candidates, and confidence scores.")}
      ${architectureCard("3", "NLP / GenAI Extraction", "Order IDs and data logger numbers are detected across varied labels and formats, then returned as structured JSON.")}
      ${architectureCard("4", "Normalization", "IDs, dates, and quantities are standardized while preserving original source values for auditability.")}
      ${architectureCard("5", "Oracle Validation", "Extracted fields are compared with Oracle order, lot, NDC, expiry, quantity, and shipment reference data.")}
      ${architectureCard("6", "Rules Engine", "Configurable QA rules compare Supplier COA against Company COA and Supplier COC against Company COC, then identify missing fields, mismatches, and compliance blockers.")}
      ${architectureCard("7", "Prescriptive Output", "The dashboard provides release recommendation, exception owner, and next best action.")}
      ${architectureCard("8", "QA Approval + Audit", "QA confirms, corrects, overrides with justification, and final decisions are logged.")}
    </section>
  `;
}

function architectureCard(number, title, body) {
  return `
    <div class="arch-card">
      <span>${number}</span>
      <h2>${title}</h2>
      <p>${body}</p>
    </div>
  `;
}

function bindEvents() {
  const uploader = document.getElementById("documentUpload");
  if (uploader) {
    uploader.addEventListener("change", (event) => {
      const selectedFiles = Array.from(event.target.files || []);
      state.uploadedFiles = selectedFiles.map((file, index) => ({
        name: file.name,
        file,
        type: inferDocumentType(file.name),
        detectedOrder: file.name.toUpperCase().match(/ORD[-_ ]?\d{6}/) ? inferOrderId(file.name, index) : "Pending OCR",
        confidence: Math.max(0.72, 0.98 - index * 0.03),
      }));
      render();
    });
  }

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      if (action === "use-demo") {
        cases = JSON.parse(JSON.stringify(seededDemoCases)).map((qaCase, index) => hydrateCaseSchema(qaCase, [
          { supplierCoaSigned: false, supplierCocSigned: false, supplierCocPresent: false },
          {},
          { assay: 106.2 },
        ][index] || {}));
        state.selectedCaseId = cases[0].id;
        state.uploadedFiles = demoUploadFiles;
        state.stage = "intake";
      }
      if (action === "process") {
        processDocuments();
        return;
      }
      if (action === "complete") {
        state.stage = "complete";
      }
      render();
    });
  });

  document.querySelectorAll("[data-open-case]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedCaseId = button.dataset.openCase;
      state.tab = "overview";
      render();
    });
  });

  document.querySelectorAll("[data-fill]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.querySelector(`[data-fill-input="${button.dataset.fill}"]`);
      const value = input && input.value !== "" ? Number(input.value) : "";
      if (value === "") return;
      resolveMissingField(button.dataset.fill, value);
      render();
    });
  });

  document.querySelectorAll("[data-default-zero]").forEach((button) => {
    button.addEventListener("click", () => {
      resolveMissingField(button.dataset.defaultZero, 0);
      render();
    });
  });

  document.querySelectorAll("[data-default-null]").forEach((button) => {
    button.addEventListener("click", () => {
      resolveMissingField(button.dataset.defaultNull, "NULL");
      render();
    });
  });

  document.querySelectorAll("[data-case]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedCaseId = button.dataset.case;
      render();
    });
  });

  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.tab = button.dataset.tab;
      if (state.tab === "upload" && state.stage === "complete") {
        state.stage = "intake";
      }
      render();
    });
  });
}

render();
