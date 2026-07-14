const STORAGE_KEYS = {
  history: "allerx.history.v1",
  customTriggers: "allerx.customTriggers.v2",
};

const HISTORY_LIMIT = 50;
const TESSERACT_SCRIPT_URL = "https://cdn.jsdelivr.net/npm/tesseract.js@7.0.0/dist/tesseract.min.js";
const TESSERACT_SCRIPT_INTEGRITY = "sha384-2BQ3U3OdKOb0Uczxqr41I9UvZkzr4V9Hv8uSzMMZAlmhsFClvdZX5wi5fDCzG+tM";

const feedbackOptions = [
  { value: "correct", label: "Correct" },
  { value: "false_alarm", label: "False alarm" },
  { value: "missed_trigger", label: "Missed trigger" },
  { value: "unsure", label: "Unsure" },
];

const builtInTriggers = [
  {
    id: "dimethicone",
    label: "Dimethicone",
    priority: "high",
    group: "Dimethicone family",
    source: "silicone",
    pattern: /\bdimethicone\b/gi,
  },
  {
    id: "amodimethicone",
    label: "Amodimethicone",
    priority: "high",
    group: "Dimethicone family",
    source: "silicone",
    pattern: /\bamodimethicone\b/gi,
  },
  {
    id: "peg-dimethicone",
    label: "PEG/PPG dimethicone",
    priority: "high",
    group: "Dimethicone family",
    source: "silicone",
    pattern: /\b(?:bis-peg|peg|ppg)[^,;()]*dimethicone\b/gi,
  },
  {
    id: "dimethiconol",
    label: "Dimethiconol",
    priority: "watch",
    group: "Silicone watchlist",
    source: "silicone",
    pattern: /\bdimethiconol\b/gi,
  },
  {
    id: "cyclopentasiloxane",
    label: "Cyclopentasiloxane",
    priority: "watch",
    group: "Silicone watchlist",
    source: "silicone",
    pattern: /\bcyclopentasiloxane\b/gi,
  },
  {
    id: "cyclohexasiloxane",
    label: "Cyclohexasiloxane",
    priority: "watch",
    group: "Silicone watchlist",
    source: "silicone",
    pattern: /\bcyclohexasiloxane\b/gi,
  },
  {
    id: "cyclomethicone",
    label: "Cyclomethicone",
    priority: "watch",
    group: "Silicone watchlist",
    source: "silicone",
    pattern: /\bcyclomethicone\b/gi,
  },
  {
    id: "phenyl-trimethicone",
    label: "Phenyl trimethicone",
    priority: "watch",
    group: "Silicone watchlist",
    source: "silicone",
    pattern: /\bphenyl\s+trimethicone\b/gi,
  },
  {
    id: "trimethylsiloxysilicate",
    label: "Trimethylsiloxysilicate",
    priority: "watch",
    group: "Silicone watchlist",
    source: "silicone",
    pattern: /\btrimethylsiloxysilicate\b/gi,
  },
  {
    id: "silicone-quaternium",
    label: "Silicone quaternium",
    priority: "watch",
    group: "Silicone watchlist",
    source: "silicone",
    pattern: /\bsilicone\s+quaternium-?\d*\b/gi,
  },
  {
    id: "polysilicone",
    label: "Polysilicone",
    priority: "watch",
    group: "Silicone watchlist",
    source: "silicone",
    pattern: /\bpoly\s?silicone-?\d*\b/gi,
  },
  {
    id: "silsesquioxane",
    label: "Silsesquioxane",
    priority: "watch",
    group: "Silicone watchlist",
    source: "silicone",
    pattern: /\b[a-z0-9-]*silsesquioxane\b/gi,
  },
  {
    id: "siloxane",
    label: "Siloxane",
    priority: "watch",
    group: "Silicone watchlist",
    source: "silicone",
    pattern: /\b[a-z0-9-]*siloxane\b/gi,
  },
  {
    id: "methicone",
    label: "Methicone",
    priority: "watch",
    group: "Silicone watchlist",
    source: "silicone",
    pattern: /\b[a-z0-9-]*methicone\b/gi,
  },
  {
    id: "silane",
    label: "Silane",
    priority: "watch",
    group: "Silicone watchlist",
    source: "silicone",
    pattern: /\b[a-z0-9-]*silane\b/gi,
  },
];

const sampleText = "Water, glycerin, cetyl alcohol, dimethicone, cyclopentasiloxane, fragrance, phenoxyethanol, carbomer, triethanolamine.";

const elements = {
  productName: document.querySelector("#productName"),
  sourceNotes: document.querySelector("#sourceNotes"),
  ingredientText: document.querySelector("#ingredientText"),
  analyzeButton: document.querySelector("#analyzeButton"),
  clearButton: document.querySelector("#clearButton"),
  sampleButton: document.querySelector("#sampleButton"),
  resultBanner: document.querySelector("#resultBanner"),
  resultTitle: document.querySelector("#resultTitle"),
  resultSummary: document.querySelector("#resultSummary"),
  matchCount: document.querySelector("#matchCount"),
  matchEmpty: document.querySelector("#matchEmpty"),
  matchList: document.querySelector("#matchList"),
  highlightBox: document.querySelector("#highlightBox"),
  textSource: document.querySelector("#textSource"),
  builtInChips: document.querySelector("#builtInChips"),
  customTrigger: document.querySelector("#customTrigger"),
  addTriggerButton: document.querySelector("#addTriggerButton"),
  customChips: document.querySelector("#customChips"),
  historyEmpty: document.querySelector("#historyEmpty"),
  historyList: document.querySelector("#historyList"),
  clearHistoryButton: document.querySelector("#clearHistoryButton"),
  exportHistoryButton: document.querySelector("#exportHistoryButton"),
  barcodeInput: document.querySelector("#barcodeInput"),
  lookupBarcodeButton: document.querySelector("#lookupBarcodeButton"),
  scanBarcodeButton: document.querySelector("#scanBarcodeButton"),
  stopScanButton: document.querySelector("#stopScanButton"),
  scannerPanel: document.querySelector("#scannerPanel"),
  scannerVideo: document.querySelector("#scannerVideo"),
  scannerStatus: document.querySelector("#scannerStatus"),
  lookupStatus: document.querySelector("#lookupStatus"),
  lookupStatusTitle: document.querySelector("#lookupStatusTitle"),
  lookupStatusDetail: document.querySelector("#lookupStatusDetail"),
  lookupProductImage: document.querySelector("#lookupProductImage"),
  labelPhotoInput: document.querySelector("#labelPhotoInput"),
  labelPhotoButton: document.querySelector("#labelPhotoButton"),
};

let customTriggers = loadJson(STORAGE_KEYS.customTriggers, []);
let history = loadJson(STORAGE_KEYS.history, []);
let cameraStream = null;
let scanTimerId = null;
let barcodeDetector = null;
let scanInProgress = false;
let zxingControls = null;
let tesseractLoadPromise = null;
let ocrWorker = null;
let ocrDraftNeedsReview = false;

function loadJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function customTriggerToRule(term) {
  return {
    id: `custom-${term.toLowerCase()}`,
    label: term,
    priority: "watch",
    group: "Custom trigger",
    source: "custom",
    pattern: new RegExp(`\\b${escapeRegExp(term)}\\b`, "gi"),
  };
}

function getAllTriggers() {
  return [
    ...builtInTriggers,
    ...customTriggers.map(customTriggerToRule),
  ];
}

function findMatches(text) {
  const rawMatches = [];

  getAllTriggers().forEach((rule) => {
    const pattern = new RegExp(rule.pattern.source, rule.pattern.flags);
    let match;

    while ((match = pattern.exec(text)) !== null) {
      rawMatches.push({
        id: rule.id,
        label: rule.label,
        group: rule.group,
        priority: rule.priority,
        source: rule.source,
        text: match[0],
        index: match.index,
        end: match.index + match[0].length,
      });

      if (match[0].length === 0) {
        pattern.lastIndex += 1;
      }
    }
  });

  return rawMatches
    .sort((a, b) => {
      const priorityA = a.priority === "high" ? 0 : 1;
      const priorityB = b.priority === "high" ? 0 : 1;
      const lengthDelta = (b.end - b.index) - (a.end - a.index);
      return priorityA - priorityB || lengthDelta || a.index - b.index;
    })
    .reduce((accepted, match) => {
      const overlaps = accepted.some((item) => match.index < item.end && match.end > item.index);
      return overlaps ? accepted : [...accepted, match];
    }, [])
    .sort((a, b) => a.index - b.index);
}

function summarizeMatches(matches, text) {
  if (!text.trim()) {
    return {
      status: "unknown",
      title: "Unknown",
      summary: "Paste ingredient text to check this label.",
    };
  }

  if (matches.some((match) => match.priority === "high")) {
    return {
      status: "avoid",
      title: "Avoid",
      summary: "High-priority dimethicone family trigger found in the listed ingredients.",
    };
  }

  if (matches.some((match) => match.source === "silicone")) {
    return {
      status: "review",
      title: "Possible Match",
      summary: "Silicone watchlist ingredient found. Review the label before using this product.",
    };
  }

  if (matches.length > 0) {
    return {
      status: "review",
      title: "Custom Trigger",
      summary: "A custom trigger was found. No silicone watchlist ingredient was found in the text provided.",
    };
  }

  return {
    status: "clear",
    title: "No Listed Match",
    summary: "No silicone trigger was found in the ingredient text provided.",
  };
}

function groupMatches(matches) {
  const grouped = new Map();

  matches.forEach((match) => {
    const key = `${match.label}-${match.priority}-${match.group}`;
    if (!grouped.has(key)) {
      grouped.set(key, {
        label: match.label,
        priority: match.priority,
        group: match.group,
        source: match.source,
        count: 0,
        examples: new Set(),
      });
    }

    const item = grouped.get(key);
    item.count += 1;
    item.examples.add(match.text);
  });

  return [...grouped.values()];
}

function renderResult(summary) {
  elements.resultBanner.className = `result-banner ${summary.status}`;
  elements.resultTitle.textContent = summary.title;
  elements.resultSummary.textContent = summary.summary;
}

function renderMatches(matches) {
  const grouped = AllerXDetector.groupMatches(matches);

  elements.matchCount.textContent = String(grouped.length);
  elements.matchEmpty.hidden = grouped.length > 0;
  elements.matchList.innerHTML = grouped
    .map((match) => {
      const badgeClass = match.priority === "high" ? "danger" : "warning";
      const badgeText = match.priority === "high" ? "High" : match.source === "custom" ? "Custom" : "Watch";
      const examples = [...match.examples].join(", ");
      const countText = match.count > 1 ? `${match.count} matches` : "1 match";

      return `
        <li class="match-card">
          <div class="match-topline">
            <span class="match-name">${escapeHtml(match.label)}</span>
            <span class="badge ${badgeClass}">${badgeText}</span>
          </div>
          <p class="match-detail">${escapeHtml(match.group)} - ${countText}</p>
          <p class="match-detail">Seen as: ${escapeHtml(examples)}</p>
        </li>
      `;
    })
    .join("");
}

function renderHighlight(text, matches) {
  if (!text.trim()) {
    elements.textSource.textContent = "Waiting";
    elements.highlightBox.textContent = "Ingredient text will appear here after analysis.";
    return;
  }

  let output = "";
  let cursor = 0;

  matches.forEach((match) => {
    output += escapeHtml(text.slice(cursor, match.index));
    const className = match.priority === "high" ? "high-match" : "watch-match";
    output += `<mark class="${className}">${escapeHtml(text.slice(match.index, match.end))}</mark>`;
    cursor = match.end;
  });

  output += escapeHtml(text.slice(cursor));
  elements.textSource.textContent = matches.length ? "Highlighted" : "Checked";
  elements.highlightBox.innerHTML = output;
}

function setLookupStatus(tone, title, detail, imageUrl = "") {
  elements.lookupStatus.hidden = false;
  elements.lookupStatus.className = `lookup-status ${tone}`;
  elements.lookupStatusTitle.textContent = title;
  elements.lookupStatusDetail.textContent = detail;

  const secureImageUrl = imageUrl.replace(/^http:/i, "https:");
  if (secureImageUrl.startsWith("https://")) {
    elements.lookupProductImage.src = secureImageUrl;
    elements.lookupProductImage.hidden = false;
  } else {
    elements.lookupProductImage.removeAttribute("src");
    elements.lookupProductImage.hidden = true;
  }
}

function clearLookupStatus() {
  elements.lookupStatus.hidden = true;
  elements.lookupStatus.className = "lookup-status";
  elements.lookupStatusTitle.textContent = "";
  elements.lookupStatusDetail.textContent = "";
  elements.lookupProductImage.removeAttribute("src");
  elements.lookupProductImage.hidden = true;
}

function normalizeBarcode(value) {
  return value.replace(/\D/g, "");
}

function setOcrDraftState(needsReview) {
  ocrDraftNeedsReview = needsReview;
  elements.analyzeButton.textContent = needsReview ? "Check reviewed text" : "Analyze";
}

function normalizeOcrText(value) {
  return value
    .replaceAll("\r", "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function loadTesseract() {
  if (globalThis.Tesseract?.createWorker) {
    return Promise.resolve(globalThis.Tesseract);
  }

  if (!tesseractLoadPromise) {
    tesseractLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = TESSERACT_SCRIPT_URL;
      script.integrity = TESSERACT_SCRIPT_INTEGRITY;
      script.crossOrigin = "anonymous";
      script.addEventListener("load", () => resolve(globalThis.Tesseract), { once: true });
      script.addEventListener("error", () => {
        script.remove();
        reject(new Error("OCR library could not be loaded."));
      }, { once: true });
      document.head.append(script);
    }).catch((error) => {
      tesseractLoadPromise = null;
      throw error;
    });
  }

  return tesseractLoadPromise;
}

function renderOcrProgress(message) {
  const progress = Number.isFinite(message.progress) ? Math.round(message.progress * 100) : 0;
  const isReading = message.status === "recognizing text";
  const detail = isReading
    ? `Reading label on this device - ${progress}%`
    : "Preparing on-device text recognition.";
  setLookupStatus("", "Reading ingredient label", detail);
}

async function readLabelPhoto(file) {
  if (!file || !file.type.startsWith("image/")) {
    setLookupStatus("error", "Choose a label photo", "Use the camera or select an image file.");
    return;
  }

  stopBarcodeScan();
  setOcrDraftState(false);
  elements.labelPhotoButton.disabled = true;
  elements.ingredientText.value = "";
  renderUnknownLookup("Reading the package ingredient label.");
  setLookupStatus("", "Preparing label photo", "Loading on-device text recognition.");

  try {
    const tesseract = await loadTesseract();
    if (!tesseract?.createWorker) {
      throw new Error("OCR is unavailable.");
    }

    ocrWorker = await tesseract.createWorker("eng", 1, { logger: renderOcrProgress });
    const result = await ocrWorker.recognize(file);
    const ingredientText = normalizeOcrText(result?.data?.text || "");
    if (!ingredientText) {
      setLookupStatus("warning", "No text detected", "Retake the photo close to the ingredient panel in bright, even light.");
      renderUnknownLookup("No ingredient text could be read from the photo.");
      return;
    }

    const barcode = normalizeBarcode(elements.barcodeInput.value);
    if (!elements.productName.value.trim() && barcode) {
      elements.productName.value = `Barcode ${barcode}`;
    }
    elements.sourceNotes.value = barcode
      ? `Package ingredient label - OCR draft - barcode ${barcode}`
      : "Package ingredient label - OCR draft";
    elements.ingredientText.value = ingredientText;
    setOcrDraftState(true);
    setLookupStatus("warning", "OCR draft ready", "Review every line against the package, correct mistakes, then select Check reviewed text.");
    renderUnknownLookup("OCR text must be reviewed before AllerX checks it.");
    elements.ingredientText.focus();
  } catch {
    setLookupStatus("error", "Label reading unavailable", "Check the connection, retake the photo, or enter the package ingredients manually.");
    renderUnknownLookup("The package label could not be read.");
  } finally {
    if (ocrWorker) {
      await ocrWorker.terminate().catch(() => {});
      ocrWorker = null;
    }
    elements.labelPhotoButton.disabled = false;
    elements.labelPhotoInput.value = "";
  }
}

function getFactsSource(url) {
  const host = new URL(url).hostname;
  if (host.includes("openbeautyfacts")) {
    return "Open Beauty Facts";
  }
  if (host.includes("openproductsfacts")) {
    return "Open Products Facts";
  }
  if (host.includes("openfoodfacts")) {
    return "Open Food Facts";
  }
  return "Open Facts";
}

function renderUnknownLookup(summary) {
  renderResult({
    status: "unknown",
    title: "Unknown",
    summary,
  });
  renderMatches([]);
  renderHighlight("", []);
}

async function lookupBarcode(rawBarcode = elements.barcodeInput.value) {
  const barcode = normalizeBarcode(rawBarcode);
  elements.barcodeInput.value = barcode;

  if (barcode.length < 8 || barcode.length > 14) {
    setLookupStatus("error", "Check barcode", "Enter an 8-14 digit UPC or EAN.");
    return;
  }

  stopBarcodeScan();
  setOcrDraftState(false);
  elements.productName.value = "";
  elements.sourceNotes.value = "";
  elements.ingredientText.value = "";
  elements.lookupBarcodeButton.disabled = true;
  setLookupStatus("", "Looking up product", `Barcode ${barcode}`);

  try {
    const endpoint = new URL(`https://world.openfoodfacts.org/api/v3.6/product/${encodeURIComponent(barcode)}`);
    endpoint.searchParams.set("product_type", "all");
    endpoint.searchParams.set("fields", "code,product_name,brands,ingredients_text,ingredients_text_en,image_front_url,last_modified_t,product_type");
    const response = await fetch(endpoint, {
      headers: { Accept: "application/json" },
    });

    if (response.status === 404) {
      elements.productName.value = `Barcode ${barcode}`;
      elements.sourceNotes.value = `Package label - barcode ${barcode}`;
      setLookupStatus("warning", "Product not found", "No Open Facts record was available. Photograph the ingredient label below.");
      renderUnknownLookup("No product record was available for this barcode.");
      return;
    }

    if (!response.ok) {
      throw new Error(`Lookup failed with status ${response.status}`);
    }

    const data = await response.json();
    const product = data.product;
    if (!product) {
      elements.productName.value = `Barcode ${barcode}`;
      elements.sourceNotes.value = `Package label - barcode ${barcode}`;
      setLookupStatus("warning", "Product not found", "No Open Facts record was available. Photograph the ingredient label below.");
      renderUnknownLookup("No product record was available for this barcode.");
      return;
    }

    const productName = product.product_name || product.brands || `Barcode ${barcode}`;
    const ingredientText = product.ingredients_text_en || product.ingredients_text || "";
    const source = getFactsSource(response.url);
    elements.productName.value = productName;
    elements.sourceNotes.value = `${source} - barcode ${barcode}`;
    elements.ingredientText.value = ingredientText;

    if (!ingredientText.trim()) {
      setLookupStatus("warning", productName, "Product found, but no ingredient list was available.", product.image_front_url || "");
      renderUnknownLookup("Product found, but its ingredient list was missing. Verify the package label.");
      return;
    }

    setLookupStatus("success", productName, `Ingredients retrieved from ${source}.`, product.image_front_url || "");
    analyze();
  } catch {
    elements.ingredientText.value = "";
    setLookupStatus("error", "Lookup unavailable", "Check the connection or enter the package ingredients manually.");
    renderUnknownLookup("The product database could not be reached.");
  } finally {
    elements.lookupBarcodeButton.disabled = false;
  }
}

function stopBarcodeScan() {
  if (zxingControls) {
    zxingControls.stop();
    zxingControls = null;
  }

  if (scanTimerId !== null) {
    window.clearTimeout(scanTimerId);
    scanTimerId = null;
  }

  scanInProgress = false;
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
  }

  elements.scannerVideo.srcObject = null;
  elements.scannerPanel.hidden = true;
}

async function scanVideoFrame() {
  if (!scanInProgress || !barcodeDetector) {
    return;
  }

  try {
    if (elements.scannerVideo.readyState >= 2) {
      const results = await barcodeDetector.detect(elements.scannerVideo);
      const barcode = normalizeBarcode(results[0]?.rawValue || "");
      if (barcode) {
        elements.barcodeInput.value = barcode;
        stopBarcodeScan();
        await lookupBarcode(barcode);
        return;
      }
    }
  } catch {
    elements.scannerStatus.textContent = "Hold steady and keep the barcode inside the frame.";
  }

  scanTimerId = window.setTimeout(scanVideoFrame, 250);
}

async function startBarcodeScan() {
  if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
    setLookupStatus("warning", "Camera unavailable", "Open the installed HTTPS version or enter the barcode manually.");
    return;
  }

  const hasNativeDetector = "BarcodeDetector" in globalThis;
  const hasZxingFallback = Boolean(globalThis.ZXingBrowser?.BrowserMultiFormatReader);
  if (!hasNativeDetector && !hasZxingFallback) {
    setLookupStatus("warning", "Scanner unsupported", "Enter the barcode manually in this browser.");
    return;
  }

  stopBarcodeScan();
  clearLookupStatus();

  try {
    elements.scannerPanel.hidden = false;
    elements.scannerStatus.textContent = "Point the rear camera at the barcode.";

    if (!hasNativeDetector) {
      const codeReader = new globalThis.ZXingBrowser.BrowserMultiFormatReader();
      scanInProgress = true;
      zxingControls = await codeReader.decodeFromConstraints(
        {
          audio: false,
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 960 },
          },
        },
        elements.scannerVideo,
        (result) => {
          const barcode = normalizeBarcode(result?.getText?.() || result?.text || "");
          if (barcode) {
            elements.barcodeInput.value = barcode;
            stopBarcodeScan();
            lookupBarcode(barcode);
          }
        },
      );
      return;
    }

    const preferredFormats = ["ean_13", "ean_8", "upc_a", "upc_e", "code_128"];
    const supportedFormats = await globalThis.BarcodeDetector.getSupportedFormats();
    const formats = preferredFormats.filter((format) => supportedFormats.includes(format));
    barcodeDetector = formats.length
      ? new globalThis.BarcodeDetector({ formats })
      : new globalThis.BarcodeDetector();
    cameraStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 960 },
      },
    });
    elements.scannerVideo.srcObject = cameraStream;
    await elements.scannerVideo.play();
    scanInProgress = true;
    await scanVideoFrame();
  } catch (error) {
    stopBarcodeScan();
    const detail = error?.name === "NotAllowedError"
      ? "Camera permission was not granted."
      : "The rear camera could not be started.";
    setLookupStatus("error", "Camera unavailable", detail);
  }
}

function analyze({ save = true } = {}) {
  if (ocrDraftNeedsReview) {
    setOcrDraftState(false);
  }
  const productName = elements.productName.value.trim();
  const sourceNotes = elements.sourceNotes.value.trim();
  const ingredientText = elements.ingredientText.value;
  const matches = AllerXDetector.findMatches(ingredientText, customTriggers);
  const summary = AllerXDetector.summarizeMatches(matches, ingredientText);

  renderResult(summary);
  renderMatches(matches);
  renderHighlight(ingredientText, matches);

  if (save && ingredientText.trim()) {
    const previousEntry = history.find((item) => item.ingredientText === ingredientText);
    const entry = {
      id: String(Date.now()),
      productName: productName || "Untitled product",
      sourceNotes,
      ingredientText,
      status: summary.status,
      title: summary.title,
      matches: AllerXDetector.groupMatches(matches).map((match) => ({
        label: match.label,
        priority: match.priority,
        source: match.source,
      })),
      checkedAt: new Date().toISOString(),
      feedback: previousEntry?.feedback || "",
      feedbackAt: previousEntry?.feedbackAt || "",
    };

    history = [entry, ...history.filter((item) => item.ingredientText !== ingredientText)].slice(0, HISTORY_LIMIT);
    saveJson(STORAGE_KEYS.history, history);
    renderHistory();
  }
}

function renderBuiltInChips() {
  elements.builtInChips.innerHTML = AllerXDetector.builtInTriggers
    .filter((trigger) => trigger.id !== "peg-dimethicone")
    .map((trigger) => {
      const highClass = trigger.priority === "high" ? " high" : "";
      return `<span class="chip${highClass}">${escapeHtml(trigger.label)}</span>`;
    })
    .join("");
}

function renderCustomChips() {
  elements.customChips.innerHTML = customTriggers
    .map((term, index) => `
      <span class="chip">
        ${escapeHtml(term)}
        <button type="button" aria-label="Remove ${escapeHtml(term)}" data-remove-custom="${index}">x</button>
      </span>
    `)
    .join("");
}

function addCustomTrigger() {
  const term = elements.customTrigger.value.trim();

  if (!term) {
    return;
  }

  const exists = customTriggers.some((item) => item.toLowerCase() === term.toLowerCase());
  if (!exists) {
    customTriggers = [...customTriggers, term];
    saveJson(STORAGE_KEYS.customTriggers, customTriggers);
    renderCustomChips();
  }

  elements.customTrigger.value = "";
}

function renderHistory() {
  elements.historyEmpty.hidden = history.length > 0;
  elements.exportHistoryButton.disabled = history.length === 0;
  elements.historyList.innerHTML = history
    .map((item) => {
      const badgeClass = item.status === "avoid" ? "danger" : item.status === "review" ? "warning" : "ok";
      const date = new Date(item.checkedAt).toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
      const itemMatches = Array.isArray(item.matches) ? item.matches : [];
      const matchText = itemMatches.length
        ? itemMatches.map((match) => match.label).join(", ")
        : "No trigger matches";
      const sourceLine = item.sourceNotes
        ? `<p class="history-detail">Source: ${escapeHtml(item.sourceNotes)}</p>`
        : "";
      const feedbackButtons = feedbackOptions
        .map((option) => {
          const isSelected = item.feedback === option.value;
          return `<button type="button" data-feedback-history="${escapeHtml(item.id)}" data-feedback-value="${option.value}" aria-pressed="${isSelected}">${option.label}</button>`;
        })
        .join("");

      return `
        <li class="history-card">
          <div class="history-topline">
            <span class="history-name">${escapeHtml(item.productName)}</span>
            <span class="badge ${badgeClass}">${escapeHtml(item.title)}</span>
          </div>
          <p class="history-detail">${escapeHtml(date)} - ${escapeHtml(matchText)}</p>
          ${sourceLine}
          <p class="feedback-label">Was this result right?</p>
          <div class="feedback-actions" role="group" aria-label="Accuracy feedback for ${escapeHtml(item.productName)}">
            ${feedbackButtons}
          </div>
          <div class="history-actions">
            <button type="button" data-load-history="${escapeHtml(item.id)}">Open</button>
            <button type="button" data-delete-history="${escapeHtml(item.id)}">Delete</button>
          </div>
        </li>
      `;
    })
    .join("");
}

function saveHistoryFeedback(id, feedback) {
  if (!feedbackOptions.some((option) => option.value === feedback)) {
    return;
  }

  history = history.map((entry) => entry.id === id
    ? { ...entry, feedback, feedbackAt: new Date().toISOString() }
    : entry);
  saveJson(STORAGE_KEYS.history, history);
  renderHistory();
}

function csvCell(value) {
  const text = String(value ?? "").replaceAll("\r\n", "\n");
  const spreadsheetSafeText = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${spreadsheetSafeText.replaceAll('"', '""')}"`;
}

function exportHistoryCsv() {
  if (!history.length) {
    return;
  }

  const headers = [
    "Checked at",
    "Product",
    "Result",
    "Matched triggers",
    "Feedback",
    "Source or notes",
    "Ingredient text",
  ];
  const rows = history.map((item) => {
    const matches = Array.isArray(item.matches)
      ? item.matches.map((match) => match.label).join("; ")
      : "";
    const feedback = feedbackOptions.find((option) => option.value === item.feedback)?.label || "Not reviewed";
    return [
      item.checkedAt,
      item.productName,
      item.title,
      matches,
      feedback,
      item.sourceNotes || "",
      item.ingredientText,
    ];
  });
  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
  const dateStamp = new Date().toISOString().slice(0, 10);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = downloadUrl;
  link.download = `allerx-test-log-${dateStamp}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(downloadUrl);
}

function loadHistoryItem(id) {
  const item = history.find((entry) => entry.id === id);
  if (!item) {
    return;
  }

  elements.productName.value = item.productName === "Untitled product" ? "" : item.productName;
  elements.sourceNotes.value = item.sourceNotes || "";
  elements.ingredientText.value = item.ingredientText;
  analyze({ save: false });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteHistoryItem(id) {
  history = history.filter((entry) => entry.id !== id);
  saveJson(STORAGE_KEYS.history, history);
  renderHistory();
}

function clearForm() {
  stopBarcodeScan();
  setOcrDraftState(false);
  elements.barcodeInput.value = "";
  elements.productName.value = "";
  elements.sourceNotes.value = "";
  elements.ingredientText.value = "";
  elements.labelPhotoInput.value = "";
  renderResult(AllerXDetector.summarizeMatches([], ""));
  renderMatches([]);
  renderHighlight("", []);
  clearLookupStatus();
}

function bindEvents() {
  elements.lookupBarcodeButton.addEventListener("click", () => lookupBarcode());
  elements.scanBarcodeButton.addEventListener("click", startBarcodeScan);
  elements.stopScanButton.addEventListener("click", stopBarcodeScan);
  elements.labelPhotoButton.addEventListener("click", () => {
    elements.labelPhotoInput.value = "";
    elements.labelPhotoInput.click();
  });
  elements.labelPhotoInput.addEventListener("change", () => {
    readLabelPhoto(elements.labelPhotoInput.files?.[0]);
  });
  elements.barcodeInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      lookupBarcode();
    }
  });
  elements.analyzeButton.addEventListener("click", () => analyze());
  elements.clearButton.addEventListener("click", clearForm);
  elements.sampleButton.addEventListener("click", () => {
    elements.productName.value = "Sample moisturizer";
    elements.sourceNotes.value = "AllerX sample";
    elements.ingredientText.value = sampleText;
    analyze();
  });

  elements.ingredientText.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      analyze();
    }
  });

  elements.addTriggerButton.addEventListener("click", addCustomTrigger);
  elements.customTrigger.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addCustomTrigger();
    }
  });

  elements.customChips.addEventListener("click", (event) => {
    const index = event.target.dataset.removeCustom;
    if (index === undefined) {
      return;
    }

    customTriggers = customTriggers.filter((_, itemIndex) => itemIndex !== Number(index));
    saveJson(STORAGE_KEYS.customTriggers, customTriggers);
    renderCustomChips();
  });

  elements.historyList.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) {
      return;
    }

    const loadId = button.dataset.loadHistory;
    const deleteId = button.dataset.deleteHistory;
    const feedbackId = button.dataset.feedbackHistory;
    const feedbackValue = button.dataset.feedbackValue;

    if (loadId) {
      loadHistoryItem(loadId);
    }

    if (deleteId) {
      deleteHistoryItem(deleteId);
    }

    if (feedbackId && feedbackValue) {
      saveHistoryFeedback(feedbackId, feedbackValue);
    }
  });

  elements.exportHistoryButton.addEventListener("click", exportHistoryCsv);

  elements.clearHistoryButton.addEventListener("click", () => {
    if (!history.length || !window.confirm("Clear all saved checks? Export your CSV first if you want to keep this test log.")) {
      return;
    }

    history = [];
    saveJson(STORAGE_KEYS.history, history);
    renderHistory();
  });

  window.addEventListener("pagehide", stopBarcodeScan);
}

renderBuiltInChips();
renderCustomChips();
renderHistory();
bindEvents();

if ("serviceWorker" in navigator && window.isSecureContext) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}
