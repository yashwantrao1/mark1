const LOGIN_STATUS_KEY = "adminDemoLoggedIn";
const DEMO_NUMBER = "1111";
const DEMO_PASSWORD = "1111";
const ADMIN_PAGE_PATH = "./admin.html";
const ROOT_FOLDER_NAME = "mark1";
const ROOT_OPTION_VALUE = "__ROOT__";
const IGNORED_FOLDERS = new Set(["admin", ".git", ".vscode", "assets"]);
const ROOT_HANDLE_DB = "admin-root-handle-db";
const ROOT_HANDLE_STORE = "handles";
const ROOT_HANDLE_KEY = "root";
const LAST_LOADED_ROUTE_KEY = "adminLastLoadedRoute";
const PUBLIC_UPLOADS_DIR = "public";

const loginOverlay = document.getElementById("loginOverlay");
const loginForm = document.getElementById("loginForm");
const numberInput = document.getElementById("numberInput");
const passwordInput = document.getElementById("passwordInput");
const msg = document.getElementById("msg");
const welcomeText = document.getElementById("welcomeText");
const adminContent = document.getElementById("adminContent");
const connectionStatusText = document.getElementById("connectionStatus");
const selectedRouteText = document.getElementById("selectedRoute");
const saveGlobalBtn = document.getElementById("saveGlobalBtn");
const routePanel = document.querySelector(".route-panel");
const demoPanel = document.querySelector(".demo-panel");

let connectedRootHandle = null;
let cachedFolders = [];
let cachedIndexFiles = [];
let activeManagementTab = "edit";
let currentLoadedRoutePath = "";
let currentLoadedDocument = null;
let selectedCanvasElement = null;
let activeSectionElement = null;
let selectedOverlayElement = null;
let previousSelectedBackgroundImage = "";
let previousSelectedBackgroundSize = "";
const pendingImageUploads = new Map();

function updateWorkspaceButtonsState() {
    const hasLoadedFile = currentLoadedRoutePath !== "";
    const sectionBtn = adminContent?.querySelector('[data-view-btn="section"]');
    const contentBtn = adminContent?.querySelector('[data-view-btn="edit"]');
    const layersBtn = adminContent?.querySelector('[data-view-btn="layers"]');
    if (sectionBtn) sectionBtn.disabled = !hasLoadedFile;
    if (contentBtn) contentBtn.disabled = !hasLoadedFile;
    if (layersBtn) layersBtn.disabled = !hasLoadedFile;
    updateEditButtonsState();
}

function saveLastLoadedRoute(path) {
    localStorage.setItem(LAST_LOADED_ROUTE_KEY, path || "");
}

function getLastLoadedRoute() {
    return localStorage.getItem(LAST_LOADED_ROUTE_KEY) || "";
}

function openHandleDb() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(ROOT_HANDLE_DB, 1);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(ROOT_HANDLE_STORE)) {
                db.createObjectStore(ROOT_HANDLE_STORE);
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function saveRootHandle(handle) {
    const db = await openHandleDb();
    await new Promise((resolve, reject) => {
        const tx = db.transaction(ROOT_HANDLE_STORE, "readwrite");
        tx.objectStore(ROOT_HANDLE_STORE).put(handle, ROOT_HANDLE_KEY);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
    db.close();
}

async function getSavedRootHandle() {
    const db = await openHandleDb();
    const handle = await new Promise((resolve, reject) => {
        const tx = db.transaction(ROOT_HANDLE_STORE, "readonly");
        const request = tx.objectStore(ROOT_HANDLE_STORE).get(ROOT_HANDLE_KEY);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
    });
    db.close();
    return handle;
}

async function clearSavedRootHandle() {
    const db = await openHandleDb();
    await new Promise((resolve, reject) => {
        const tx = db.transaction(ROOT_HANDLE_STORE, "readwrite");
        tx.objectStore(ROOT_HANDLE_STORE).delete(ROOT_HANDLE_KEY);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
    db.close();
}

async function hasRootPermission(handle) {
    if (!handle) return false;
    const options = { mode: "readwrite" };
    if (await handle.queryPermission(options) === "granted") return true;
    return (await handle.requestPermission(options)) === "granted";
}

function isLoggedIn() {
    return localStorage.getItem(LOGIN_STATUS_KEY) === "true";
}

function setLoggedInStatus(value) {
    localStorage.setItem(LOGIN_STATUS_KEY, value ? "true" : "false");
}

function setConnectionStatus(text) {
    if (!connectionStatusText) return;
    const normalized = String(text || "").toLowerCase();
    const isConnected = normalized.startsWith("connected");
    connectionStatusText.textContent = "●";
    connectionStatusText.style.color = isConnected ? "#22c55e" : "#ef4444";
    connectionStatusText.setAttribute("title", String(text || ""));
}

function setSelectedRoute(text) {
    if (selectedRouteText) selectedRouteText.textContent = text;
}

function updateRootButtonsState(isConnected) {
    const connectBtn = adminContent?.querySelector("#connectRootBtn");
    const disconnectBtn = adminContent?.querySelector("#disconnectRootBtn");
    if (connectBtn) {
        connectBtn.classList.toggle("hidden", isConnected);
        connectBtn.style.display = isConnected ? "none" : "inline-flex";
    }
    if (disconnectBtn) {
        disconnectBtn.classList.toggle("hidden", !isConnected);
        disconnectBtn.style.display = isConnected ? "inline-flex" : "none";
    }
}

function setTopPanelActive(active) {
    if (demoPanel) demoPanel.classList.toggle("active", active);
    if (routePanel) routePanel.classList.toggle("active", active);
}

function normalizePath(path) {
    return (path || "").replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
}

function getParentFolderFromIndexPath(indexPath) {
    const normalized = normalizePath(indexPath);
    if (!normalized || normalized === "index.html") return "";
    return normalized.slice(0, -"/index.html".length);
}

function buildIndexPath(folderPath) {
    const normalized = normalizePath(folderPath);
    return normalized ? `${normalized}/index.html` : "index.html";
}

function getCreateParentPath() {
    const createParentSelect = adminContent?.querySelector("#createParentSelect");
    if (!createParentSelect) return "";
    return createParentSelect.value === ROOT_OPTION_VALUE ? "" : normalizePath(createParentSelect.value);
}

function getCanvasElement() {
    return adminContent?.querySelector("#adminCanvas");
}

function getEditableRoot() {
    const canvas = getCanvasElement();
    if (!canvas) return null;
    return canvas.querySelector("#pageGrid") || canvas.firstElementChild || canvas;
}

function getElementGridContainer(element) {
    if (!(element instanceof HTMLElement)) return null;
    const parent = element.parentElement;
    if (!(parent instanceof HTMLElement)) return null;
    return parent;
}

function shouldEnableResizeHandle(element) {
    if (!(element instanceof HTMLElement)) return false;
    const root = getEditableRoot();
    if (!root) return false;
    if (element.tagName.toLowerCase() === "section") return true;
    const parent = element.parentElement;
    if (!parent) return false;
    if (parent === root && element.style.gridColumn) return true;
    if (parent.tagName.toLowerCase() === "section" && element.style.gridColumn) return true;
    return false;
}

function resolveInsertionContainer(tagName) {
    const root = getEditableRoot();
    if (!root || !(root instanceof HTMLElement)) return null;
    if (String(tagName).toLowerCase() === "section") return root;
    const selectedSection = getSelectedSectionElement();
    return selectedSection || null;
}

function updateEditButtonsState() {
    const hasLoadedFile = currentLoadedRoutePath !== "";
    const hasSelectedSection = !!getSelectedSectionElement();
    const hasSelectedBlock = !!getSelectedBlockElement();
    const addBlockBtn = adminContent?.querySelector("#addBlockBtn");
    const blockStylePanel = adminContent?.querySelector("#blockStylePanel");
    const blockContentPanel = adminContent?.querySelector("#blockContentPanel");
    const imageStylePanel = adminContent?.querySelector("#imageStylePanel");
    const textStylePanel = adminContent?.querySelector("#textStylePanel");
    if (addBlockBtn) addBlockBtn.disabled = !hasLoadedFile || !hasSelectedSection;
    if (blockStylePanel) {
        const show = hasSelectedBlock;
        blockStylePanel.classList.toggle("hidden", !show);
        blockStylePanel.style.display = show ? "grid" : "none";
    }
    if (blockContentPanel) {
        const show = hasSelectedBlock;
        blockContentPanel.classList.toggle("hidden", !show);
        blockContentPanel.style.display = show ? "grid" : "none";
    }
    if (imageStylePanel) {
        const show = isSelectedImageElement();
        imageStylePanel.classList.toggle("hidden", !show);
        imageStylePanel.style.display = show ? "grid" : "none";
    }
    if (textStylePanel) {
        const show = isSelectedTextElement();
        textStylePanel.classList.toggle("hidden", !show);
        textStylePanel.style.display = show ? "grid" : "none";
    }
}

function getSelectedBlockElement() {
    if (!(selectedCanvasElement instanceof HTMLElement)) return null;
    if (selectedCanvasElement.tagName.toLowerCase() !== "div") return null;
    if (selectedCanvasElement.tagName.toLowerCase() === "section") return null;
    return selectedCanvasElement;
}

function isSelectedImageElement() {
    return selectedCanvasElement instanceof HTMLElement && selectedCanvasElement.tagName.toLowerCase() === "img";
}

function isSelectedTextElement() {
    if (!(selectedCanvasElement instanceof HTMLElement)) return false;
    const tag = selectedCanvasElement.tagName.toLowerCase();
    return tag === "p" || tag === "h1" || tag === "h2" || tag === "h3" || tag === "h4" || tag === "h5" || tag === "h6";
}

function getSelectedTextElement() {
    return isSelectedTextElement() ? selectedCanvasElement : null;
}

function syncBlockControlsFromSelection() {
    const block = getSelectedBlockElement();
    const paddingInput = adminContent?.querySelector("#blockPaddingInput");
    const radiusInput = adminContent?.querySelector("#blockRadiusInput");
    const borderWidthInput = adminContent?.querySelector("#blockBorderWidthInput");
    const borderColorInput = adminContent?.querySelector("#blockBorderColorInput");
    const bgColorInput = adminContent?.querySelector("#blockBgColorInput");
    if (!paddingInput || !radiusInput || !borderWidthInput || !borderColorInput || !bgColorInput) return;
    if (!block) return;
    paddingInput.value = String(parseInt(block.style.padding || "0", 10) || 0);
    radiusInput.value = String(parseInt(block.style.borderRadius || "0", 10) || 0);
    borderWidthInput.value = String(parseInt(block.style.borderWidth || "0", 10) || 0);
    borderColorInput.value = cssColorToHex(block.style.borderColor || "#93c5fd");
    bgColorInput.value = cssColorToHex(block.style.backgroundColor || block.style.background || "#dbeafe");
}

function applyBlockStyleFromControls() {
    const block = getSelectedBlockElement();
    if (!block) return;
    const paddingInput = adminContent?.querySelector("#blockPaddingInput");
    const radiusInput = adminContent?.querySelector("#blockRadiusInput");
    const borderWidthInput = adminContent?.querySelector("#blockBorderWidthInput");
    const borderColorInput = adminContent?.querySelector("#blockBorderColorInput");
    const bgColorInput = adminContent?.querySelector("#blockBgColorInput");
    if (!paddingInput || !radiusInput || !borderWidthInput || !borderColorInput || !bgColorInput) return;
    const borderWidth = Math.max(0, Number(borderWidthInput.value || 0));
    block.style.padding = `${Math.max(0, Number(paddingInput.value || 0))}px`;
    block.style.borderRadius = `${Math.max(0, Number(radiusInput.value || 0))}px`;
    block.style.borderStyle = borderWidth > 0 ? "solid" : "none";
    block.style.borderWidth = `${borderWidth}px`;
    block.style.borderColor = borderColorInput.value || "#93c5fd";
    block.style.background = bgColorInput.value || "#dbeafe";
}

function syncTextControlsFromSelection() {
    const textSizeUnitInput = adminContent?.querySelector("#textSizeUnitInput");
    const textMinSizeInput = adminContent?.querySelector("#textMinSizeInput");
    const textSizeInput = adminContent?.querySelector("#textSizeInput");
    const textColorInput = adminContent?.querySelector("#textColorInput");
    const textLineHeightInput = adminContent?.querySelector("#textLineHeightInput");
    const textParagraphSpacingInput = adminContent?.querySelector("#textParagraphSpacingInput");
    if (!textSizeInput || !textColorInput || !textSizeUnitInput || !textMinSizeInput || !textLineHeightInput || !textParagraphSpacingInput) return;
    if (!isSelectedTextElement()) return;
    const textElement = getSelectedTextElement();
    if (!textElement) return;
    const fontSize = textElement.style.fontSize || "";
    const clampMatch = fontSize.match(/clamp\((\d+(?:\.\d+)?)px,\s*(\d+(?:\.\d+)?)(px|vw),/i);
    if (clampMatch) {
        textMinSizeInput.value = clampMatch[1];
        textSizeInput.value = clampMatch[2];
        textSizeUnitInput.value = clampMatch[3].toLowerCase();
    } else {
        const unit = fontSize.endsWith("vw") ? "vw" : "px";
        textSizeUnitInput.value = unit;
        textSizeInput.value = String(parseFloat(fontSize) || 16);
        textMinSizeInput.value = "12";
    }
    textColorInput.value = cssColorToHex(textElement.style.color || "#0f172a");
    textLineHeightInput.value = String(parseFloat(textElement.style.lineHeight) || 120);
    textParagraphSpacingInput.value = String(parseFloat(textElement.style.marginBottom) || 0);
}

function applyTextStyleFromControls() {
    const textElement = getSelectedTextElement();
    if (!textElement) return;
    const textSizeUnitInput = adminContent?.querySelector("#textSizeUnitInput");
    const textMinSizeInput = adminContent?.querySelector("#textMinSizeInput");
    const textSizeInput = adminContent?.querySelector("#textSizeInput");
    const textColorInput = adminContent?.querySelector("#textColorInput");
    const textLineHeightInput = adminContent?.querySelector("#textLineHeightInput");
    const textParagraphSpacingInput = adminContent?.querySelector("#textParagraphSpacingInput");
    if (!textSizeInput || !textColorInput || !textSizeUnitInput || !textMinSizeInput || !textLineHeightInput || !textParagraphSpacingInput) return;
    const size = Math.max(1, Number(textSizeInput.value || 16));
    const minSize = Math.max(1, Number(textMinSizeInput.value || 12));
    const unit = textSizeUnitInput.value === "vw" ? "vw" : "px";
    textElement.style.fontSize = `clamp(${minSize}px, ${size}${unit}, 999px)`;
    textElement.style.color = textColorInput.value || "#0f172a";
    textElement.style.lineHeight = `${Math.max(50, Number(textLineHeightInput.value || 120))}%`;
    textElement.style.marginBottom = `${Math.max(0, Number(textParagraphSpacingInput.value || 0))}%`;
}

function updateSelectedImageObjectPosition(x, y) {
    if (!isSelectedImageElement()) return;
    selectedCanvasElement.style.objectPosition = `${x}% ${y}%`;
}

function getPageSettingsControls() {
    return {
        bodyBgInput: adminContent?.querySelector("#pageBodyBgInput"),
        metaTitleInput: adminContent?.querySelector("#pageMetaTitleInput"),
        metaDescriptionInput: adminContent?.querySelector("#pageMetaDescriptionInput"),
    };
}

function ensureMetaDescriptionTag(doc) {
    if (!doc) return null;
    let tag = doc.querySelector('meta[name="description"]');
    if (tag) return tag;
    tag = doc.createElement("meta");
    tag.setAttribute("name", "description");
    doc.head.appendChild(tag);
    return tag;
}

function syncPageSettingsControlsFromDocument() {
    const { bodyBgInput, metaTitleInput, metaDescriptionInput } = getPageSettingsControls();
    if (!bodyBgInput || !metaTitleInput || !metaDescriptionInput) return;
    if (!currentLoadedDocument) {
        bodyBgInput.value = "#ffffff";
        metaTitleInput.value = "";
        metaDescriptionInput.value = "";
        return;
    }
    const descriptionTag = currentLoadedDocument.querySelector('meta[name="description"]');
    const bodyBackground = currentLoadedDocument.body?.style.background || currentLoadedDocument.body?.style.backgroundColor || "";
    bodyBgInput.value = cssColorToHex(bodyBackground || "#ffffff");
    metaTitleInput.value = currentLoadedDocument.title || "";
    metaDescriptionInput.value = descriptionTag?.getAttribute("content") || "";
}

function applyPageSettingsFromControls() {
    if (!currentLoadedDocument) return;
    const { bodyBgInput, metaTitleInput, metaDescriptionInput } = getPageSettingsControls();
    if (!bodyBgInput || !metaTitleInput || !metaDescriptionInput) return;

    const bodyBackground = bodyBgInput.value.trim();
    const title = metaTitleInput.value.trim();
    const description = metaDescriptionInput.value.trim();

    currentLoadedDocument.title = title;
    const descriptionTag = ensureMetaDescriptionTag(currentLoadedDocument);
    if (descriptionTag) descriptionTag.setAttribute("content", description);

    const docBody = currentLoadedDocument.body;
    if (docBody) {
        docBody.style.background = bodyBackground || "#ffffff";
    }

    const editableRoot = getEditableRoot();
    if (editableRoot instanceof HTMLElement) {
        editableRoot.style.background = bodyBackground || "#ffffff";
    }
}

function bindPageSettingsControls() {
    const { bodyBgInput, metaTitleInput, metaDescriptionInput } = getPageSettingsControls();
    const controls = [bodyBgInput, metaTitleInput, metaDescriptionInput].filter(Boolean);
    controls.forEach((control) => {
        control.addEventListener("input", applyPageSettingsFromControls);
        control.addEventListener("change", applyPageSettingsFromControls);
    });
    syncPageSettingsControlsFromDocument();
}

function ensureGridContainer(root) {
    if (!root || !(root instanceof HTMLElement)) return;
    root.style.display = root.style.display || "grid";
    root.style.gridTemplateColumns = root.style.gridTemplateColumns || "repeat(80, minmax(0, 1fr))";
    root.style.gridAutoRows = root.style.gridAutoRows || "minmax(20px, auto)";
}

function clearCanvasSelection() {
    if (selectedCanvasElement) {
        selectedCanvasElement.style.outline = "";
    }
    if (selectedOverlayElement) {
        selectedOverlayElement.style.backgroundImage = previousSelectedBackgroundImage;
        selectedOverlayElement.style.backgroundSize = previousSelectedBackgroundSize;
    }
    selectedCanvasElement = null;
    selectedOverlayElement = null;
    previousSelectedBackgroundImage = "";
    previousSelectedBackgroundSize = "";
    syncBlockControlsFromSelection();
    syncTextControlsFromSelection();
    updateEditButtonsState();
}

function setCanvasSelection(element) {
    clearCanvasSelection();
    if (!element || !(element instanceof HTMLElement)) return;
    selectedCanvasElement = element;
    selectedCanvasElement.style.outline = "2px solid #2563eb";
    if (shouldEnableResizeHandle(selectedCanvasElement)) ensureResizeHandle(selectedCanvasElement);
    const pickedSection = selectedCanvasElement.tagName.toLowerCase() === "section"
        ? selectedCanvasElement
        : selectedCanvasElement.closest("section");
    if (pickedSection) activeSectionElement = pickedSection;
    const overlayTarget = pickedSection || selectedCanvasElement;
    selectedOverlayElement = overlayTarget;
    applySelectionGridOverlay(overlayTarget);
    if (isSelectedTextElement()) {
        selectedCanvasElement.setAttribute("contenteditable", "true");
        selectedCanvasElement.setAttribute("spellcheck", "false");
    }
    syncSectionControlsFromSelection();
    syncBlockControlsFromSelection();
    syncTextControlsFromSelection();
    updateEditButtonsState();
}

function getSelectedSectionElement() {
    if (selectedCanvasElement) {
        if (selectedCanvasElement.tagName.toLowerCase() === "section") return selectedCanvasElement;
        const closest = selectedCanvasElement.closest("section");
        if (closest) return closest;
    }
    if (activeSectionElement && activeSectionElement.isConnected) return activeSectionElement;
    return null;
}

function parseGridValue(value) {
    const parts = String(value || "").split("/").map((part) => part.trim());
    const start = Number(parts[0]) || 1;
    let span = 1;
    if (parts[1] && parts[1].startsWith("span")) {
        span = Number(parts[1].replace("span", "").trim()) || 1;
    }
    return { start, span };
}

function cssColorToHex(colorValue) {
    if (!colorValue) return "#dbeafe";
    const trimmed = colorValue.trim();
    if (trimmed.startsWith("#")) {
        if (trimmed.length === 4) {
            const r = trimmed[1];
            const g = trimmed[2];
            const b = trimmed[3];
            return `#${r}${r}${g}${g}${b}${b}`;
        }
        return trimmed.slice(0, 7);
    }
    const rgbMatch = trimmed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!rgbMatch) return "#dbeafe";
    const toHex = (n) => Number(n).toString(16).padStart(2, "0");
    return `#${toHex(rgbMatch[1])}${toHex(rgbMatch[2])}${toHex(rgbMatch[3])}`;
}

function getGridCountFromTemplate(templateValue, fallbackValue) {
    if (!templateValue || templateValue === "none") return fallbackValue;
    if (templateValue.includes("repeat(")) {
        const match = templateValue.match(/repeat\(\s*(\d+)/);
        if (match) return Math.max(1, Number(match[1]) || fallbackValue);
    }
    return Math.max(1, templateValue.split(" ").filter(Boolean).length || fallbackValue);
}

function applySelectionGridOverlay(element) {
    if (!(element instanceof HTMLElement)) return;
    if (element === selectedOverlayElement && previousSelectedBackgroundImage !== "") {
        element.style.backgroundImage = previousSelectedBackgroundImage;
        element.style.backgroundSize = previousSelectedBackgroundSize;
    }
    const computed = window.getComputedStyle(element);
    const cols = getGridCountFromTemplate(computed.gridTemplateColumns, 12);
    const rows = getGridCountFromTemplate(computed.gridTemplateRows, 6);

    previousSelectedBackgroundImage = element.style.backgroundImage || "";
    previousSelectedBackgroundSize = element.style.backgroundSize || "";

    const lineX = "linear-gradient(to right, rgba(226,232,240,0.95) 1px, transparent 1px)";
    const lineY = "linear-gradient(to bottom, rgba(226,232,240,0.95) 1px, transparent 1px)";
    const existing = element.style.backgroundImage || "";
    element.style.backgroundImage = existing ? `${existing}, ${lineX}, ${lineY}` : `${lineX}, ${lineY}`;
    element.style.backgroundSize = existing
        ? `${element.style.backgroundSize || "auto"}, calc(100% / ${cols}) calc(100% / ${rows}), calc(100% / ${cols}) calc(100% / ${rows})`
        : `calc(100% / ${cols}) calc(100% / ${rows})`;
}

function getGridMetrics(root) {
    const rect = root.getBoundingClientRect();
    const styles = window.getComputedStyle(root);
    const colCount = 80;
    const colWidth = rect.width / colCount;

    let rowHeight = parseFloat(styles.gridAutoRows);
    if (!Number.isFinite(rowHeight) || rowHeight <= 0) {
        const rows = styles.gridTemplateRows && styles.gridTemplateRows !== "none"
            ? styles.gridTemplateRows.split(" ").length
            : 45;
        rowHeight = rect.height / Math.max(1, rows);
    }
    return { colWidth, rowHeight };
}

function ensureResizeHandle(element) {
    if (!(element instanceof HTMLElement)) return;
    let handle = element.querySelector(":scope > .editor-resize-handle");
    if (handle) return;
    handle = document.createElement("button");
    handle.type = "button";
    handle.className = "editor-resize-handle";
    handle.textContent = "";
    handle.style.position = "absolute";
    handle.style.right = "2px";
    handle.style.bottom = "2px";
    handle.style.width = "12px";
    handle.style.height = "12px";
    handle.style.border = "1px solid #2563eb";
    handle.style.background = "#bfdbfe";
    handle.style.cursor = "nwse-resize";
    handle.style.padding = "0";
    element.style.position = "relative";
    element.appendChild(handle);
}

function isSectionMovementLocked(element) {
    return element instanceof HTMLElement
        && element.tagName.toLowerCase() === "section"
        && element.dataset.lockSectionMovement === "true";
}

function setSectionMovementLocked(section, isLocked) {
    if (!(section instanceof HTMLElement) || section.tagName.toLowerCase() !== "section") return;
    section.dataset.lockSectionMovement = isLocked ? "true" : "false";
    const handle = section.querySelector(":scope > .editor-resize-handle");
    if (handle instanceof HTMLElement) {
        handle.style.display = isLocked ? "none" : "block";
    }
}

function bindElementDragAndResize(element) {
    if (!(element instanceof HTMLElement) || element.dataset.editorBound === "true") return;
    element.dataset.editorBound = "true";
    ensureResizeHandle(element);

    element.addEventListener("pointerdown", (event) => {
        const container = getElementGridContainer(element);
        if (!container || !(event.target instanceof HTMLElement)) return;
        if (isSectionMovementLocked(element)) return;
        const isResize = event.target.classList.contains("editor-resize-handle");
        if (isResize) return;
        if (event.button !== 0) return;
        setCanvasSelection(element);
        if (isSelectedTextElement()) return;

        const { colWidth, rowHeight } = getGridMetrics(container);
        const initialCol = parseGridValue(element.style.gridColumn);
        const initialRow = parseGridValue(element.style.gridRow);
        const startX = event.clientX;
        const startY = event.clientY;

        const onMove = (moveEvent) => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;
            const colShift = Math.round(dx / Math.max(colWidth, 1));
            const rowShift = Math.round(dy / Math.max(rowHeight, 1));
            element.style.gridColumn = `${Math.max(1, initialCol.start + colShift)} / span ${initialCol.span}`;
            element.style.gridRow = `${Math.max(1, initialRow.start + rowShift)} / span ${initialRow.span}`;
        };

        const onUp = () => {
            document.removeEventListener("pointermove", onMove);
            document.removeEventListener("pointerup", onUp);
        };

        document.addEventListener("pointermove", onMove);
        document.addEventListener("pointerup", onUp);
    });

    const handle = element.querySelector(":scope > .editor-resize-handle");
    if (handle) {
        handle.addEventListener("pointerdown", (event) => {
            event.preventDefault();
            event.stopPropagation();
            const container = getElementGridContainer(element);
            if (!container) return;
            if (isSectionMovementLocked(element)) return;
            setCanvasSelection(element);

            const { colWidth, rowHeight } = getGridMetrics(container);
            const col = parseGridValue(element.style.gridColumn);
            const row = parseGridValue(element.style.gridRow);
            const startX = event.clientX;
            const startY = event.clientY;

            const onMove = (moveEvent) => {
                const dx = moveEvent.clientX - startX;
                const dy = moveEvent.clientY - startY;
                const newColSpan = Math.max(1, col.span + Math.round(dx / Math.max(colWidth, 1)));
                const newRowSpan = Math.max(1, row.span + Math.round(dy / Math.max(rowHeight, 1)));
                element.style.gridColumn = `${col.start} / span ${newColSpan}`;
                element.style.gridRow = `${row.start} / span ${newRowSpan}`;
            };

            const onUp = () => {
                document.removeEventListener("pointermove", onMove);
                document.removeEventListener("pointerup", onUp);
            };

            document.addEventListener("pointermove", onMove);
            document.addEventListener("pointerup", onUp);
        });
    }
}

function bindCanvasSelectionHandlers() {
    const canvas = getCanvasElement();
    if (!canvas) return;
    canvas.onclick = (event) => {
        const root = getEditableRoot();
        if (!root) return;
        let node = event.target instanceof HTMLElement ? event.target : null;
        if (!node) return;
        while (node && node !== root) {
            if (node.dataset.editable === "true" || node.tagName.toLowerCase() === "section") {
                setCanvasSelection(node);
                return;
            }
            node = node.parentElement;
        }
        if (!node || node === root) {
            clearCanvasSelection();
            return;
        }
    };
}

function applyGridToElement(element, col, row, colSpan, rowSpan) {
    if (!(element instanceof HTMLElement)) return;
    element.style.gridColumn = `${Math.max(1, col)} / span ${Math.max(1, colSpan)}`;
    element.style.gridRow = `${Math.max(1, row)} / span ${Math.max(1, rowSpan)}`;
}

function addElementToCanvas(tagName, setupFn) {
    const container = resolveInsertionContainer(tagName);
    if (!container || !(container instanceof HTMLElement)) {
        if (String(tagName).toLowerCase() !== "section") {
            window.alert("Select a section first.");
        }
        return;
    }
    ensureGridContainer(container);
    const element = document.createElement(tagName);
    element.dataset.editable = "true";
    if (setupFn) setupFn(element);
    applyGridToElement(element, 1, 1, 10, 6);
    container.appendChild(element);
    bindElementDragAndResize(element);
    setCanvasSelection(element);
}

function stripEditorArtifacts(root) {
    if (!root || !(root instanceof HTMLElement)) return;
    root.querySelectorAll(".editor-resize-handle").forEach((handle) => handle.remove());
    root.querySelectorAll("[data-editor-bound]").forEach((element) => {
        if (element instanceof HTMLElement) {
            element.removeAttribute("data-editor-bound");
            element.style.outline = "";
        }
    });
}

function syncSectionControlsFromSelection() {
    const innerColsInput = adminContent?.querySelector("#sectionInnerColsInput");
    const innerRowsInput = adminContent?.querySelector("#sectionInnerRowsInput");
    const paddingInput = adminContent?.querySelector("#sectionPaddingInput");
    const radiusInput = adminContent?.querySelector("#sectionRadiusInput");
    const bgColorInput = adminContent?.querySelector("#sectionBgColorInput");
    const lockToggle = adminContent?.querySelector("#lockSectionMovementToggle");
    if (!innerColsInput || !innerRowsInput || !paddingInput || !radiusInput || !bgColorInput || !lockToggle) return;

    const sectionPanel = adminContent?.querySelector("#sectionPanel");
    const deleteSectionBtn = adminContent?.querySelector("#deleteSectionBtn");
    const selectedSection = getSelectedSectionElement();
    const isSection = !!selectedSection;
    if (sectionPanel) sectionPanel.style.opacity = isSection || !selectedCanvasElement ? "1" : "0.75";
    if (deleteSectionBtn) deleteSectionBtn.disabled = !isSection;
    lockToggle.disabled = !isSection;

    if (!isSection) {
        lockToggle.checked = false;
        return;
    }
    const innerCols = getGridCountFromTemplate(selectedSection.style.gridTemplateColumns, 12);
    const innerRows = getGridCountFromTemplate(selectedSection.style.gridTemplateRows, 6);
    innerColsInput.value = String(innerCols);
    innerRowsInput.value = String(innerRows);
    paddingInput.value = String(parseInt(selectedSection.style.padding || "0", 10) || 0);
    radiusInput.value = String(parseInt(selectedSection.style.borderRadius || "0", 10) || 0);

    const background = selectedSection.style.background || "";
    bgColorInput.value = cssColorToHex(background || selectedSection.style.backgroundColor || "#dbeafe");
    lockToggle.checked = isSectionMovementLocked(selectedSection);
}

function applySectionStyleFromControls() {
    const selectedSection = getSelectedSectionElement();
    if (!selectedSection) return;

    const innerColsInput = adminContent?.querySelector("#sectionInnerColsInput");
    const innerRowsInput = adminContent?.querySelector("#sectionInnerRowsInput");
    const paddingInput = adminContent?.querySelector("#sectionPaddingInput");
    const radiusInput = adminContent?.querySelector("#sectionRadiusInput");
    const bgColorInput = adminContent?.querySelector("#sectionBgColorInput");
    if (!innerColsInput || !innerRowsInput || !paddingInput || !radiusInput || !bgColorInput) return;

    const innerCols = Math.max(1, Number(innerColsInput.value || 1));
    const innerRows = Math.max(1, Number(innerRowsInput.value || 1));

    selectedSection.style.display = "grid";
    selectedSection.style.gridTemplateColumns = `repeat(${innerCols}, minmax(0, 1fr))`;
    selectedSection.style.gridTemplateRows = `repeat(${innerRows}, minmax(0, 1fr))`;
    selectedSection.style.padding = `${Math.max(0, Number(paddingInput.value || 0))}px`;
    selectedSection.style.borderRadius = `${Math.max(0, Number(radiusInput.value || 0))}px`;
    selectedSection.style.background = bgColorInput.value || "#dbeafe";
    selectedOverlayElement = selectedSection;
    applySelectionGridOverlay(selectedSection);
}

function bindSectionPanelControls() {
    const addSectionBtn = adminContent?.querySelector("#addSectionBtn");
    const deleteSectionBtn = adminContent?.querySelector("#deleteSectionBtn");
    const sectionPanel = adminContent?.querySelector("#sectionPanel");
    const innerColsInput = adminContent?.querySelector("#sectionInnerColsInput");
    const innerRowsInput = adminContent?.querySelector("#sectionInnerRowsInput");
    const paddingInput = adminContent?.querySelector("#sectionPaddingInput");
    const radiusInput = adminContent?.querySelector("#sectionRadiusInput");
    const bgColorInput = adminContent?.querySelector("#sectionBgColorInput");
    const lockToggle = adminContent?.querySelector("#lockSectionMovementToggle");

    if (addSectionBtn) {
        addSectionBtn.onclick = () => {
            addElementToCanvas("section", (element) => {
                element.textContent = "";
                element.style.display = "grid";
                element.style.gridTemplateColumns = "repeat(12, minmax(0, 1fr))";
                element.style.gridTemplateRows = "repeat(6, minmax(0, 1fr))";
                element.style.padding = "16px";
                element.style.borderRadius = "12px";
                element.style.background = "#dbeafe";
            });
            const section = getSelectedSectionElement();
            if (section) activeSectionElement = section;
            if (section) setSectionMovementLocked(section, false);
            applySectionStyleFromControls();
        };
    }

    const liveControls = [
        innerColsInput,
        innerRowsInput,
        paddingInput,
        radiusInput,
        bgColorInput,
    ].filter(Boolean);
    liveControls.forEach((control) => {
        control.addEventListener("input", applySectionStyleFromControls);
        control.addEventListener("change", applySectionStyleFromControls);
        control.oninput = applySectionStyleFromControls;
        control.onchange = applySectionStyleFromControls;
    });

    const liveIds = new Set([
        "sectionInnerColsInput",
        "sectionInnerRowsInput",
        "sectionPaddingInput",
        "sectionRadiusInput",
        "sectionBgColorInput",
    ]);
    if (sectionPanel) {
        const delegatedApply = (event) => {
            const target = event.target;
            if (!(target instanceof HTMLElement)) return;
            if (!liveIds.has(target.id)) return;
            applySectionStyleFromControls();
        };
        sectionPanel.addEventListener("input", delegatedApply);
        sectionPanel.addEventListener("change", delegatedApply);
    }

    if (deleteSectionBtn) {
        deleteSectionBtn.onclick = () => {
            const section = getSelectedSectionElement();
            if (!section) return;
            if (selectedCanvasElement === section) clearCanvasSelection();
            section.remove();
            activeSectionElement = null;
            syncSectionControlsFromSelection();
        };
    }

    if (lockToggle) {
        lockToggle.addEventListener("change", () => {
            const selectedSection = getSelectedSectionElement();
            if (!selectedSection) return;
            setSectionMovementLocked(selectedSection, lockToggle.checked);
        });
    }
}

async function saveCanvasToCurrentFile() {
    if (!connectedRootHandle || !currentLoadedRoutePath || !currentLoadedDocument) {
        window.alert("Load a route first.");
        return;
    }
    const root = getEditableRoot();
    if (!root) return;
    await flushPendingImageUploads(root);
    const cleanRoot = root.cloneNode(true);
    if (cleanRoot instanceof HTMLElement) {
        stripEditorArtifacts(cleanRoot);
    }
    currentLoadedDocument.body.innerHTML = "";
    currentLoadedDocument.body.appendChild(cleanRoot);
    const finalHtml = `<!DOCTYPE html>\n${currentLoadedDocument.documentElement.outerHTML}`;
    try {
        const folderPath = getParentFolderFromIndexPath(currentLoadedRoutePath);
        const folderHandle = await resolveDirectoryHandle(connectedRootHandle, folderPath, false);
        const fileHandle = await folderHandle.getFileHandle("index.html", { create: false });
        await writeTextFile(fileHandle, finalHtml);
        setConnectionStatus(`Connected: ${ROOT_FOLDER_NAME}`);
    } catch {
        window.alert("Unable to save changes.");
    }
}

function bindEditPanelControls() {
    const addBlockBtn = adminContent?.querySelector("#addBlockBtn");
    const deleteElementBtn = adminContent?.querySelector("#deleteElementBtn");
    const saveCanvasBtn = adminContent?.querySelector("#saveCanvasBtn");
    const blockPaddingInput = adminContent?.querySelector("#blockPaddingInput");
    const blockRadiusInput = adminContent?.querySelector("#blockRadiusInput");
    const blockBorderWidthInput = adminContent?.querySelector("#blockBorderWidthInput");
    const blockBorderColorInput = adminContent?.querySelector("#blockBorderColorInput");
    const blockBgColorInput = adminContent?.querySelector("#blockBgColorInput");
    const addBlockImageBtn = adminContent?.querySelector("#addBlockImageBtn");
    const addBlockParagraphBtn = adminContent?.querySelector("#addBlockParagraphBtn");
    const addBlockHeadingBtn = adminContent?.querySelector("#addBlockHeadingBtn");
    const addBlockHtmlBtn = adminContent?.querySelector("#addBlockHtmlBtn");
    const addBlockTableBtn = adminContent?.querySelector("#addBlockTableBtn");
    const addBlockListBtn = adminContent?.querySelector("#addBlockListBtn");
    const imageFitCoverBtn = adminContent?.querySelector("#imageFitCoverBtn");
    const imageFitContainBtn = adminContent?.querySelector("#imageFitContainBtn");
    const uploadBlockImageBtn = adminContent?.querySelector("#uploadBlockImageBtn");
    const uploadBlockImageInput = adminContent?.querySelector("#uploadBlockImageInput");
    const imagePosUpBtn = adminContent?.querySelector("#imagePosUpBtn");
    const imagePosDownBtn = adminContent?.querySelector("#imagePosDownBtn");
    const imagePosLeftBtn = adminContent?.querySelector("#imagePosLeftBtn");
    const imagePosRightBtn = adminContent?.querySelector("#imagePosRightBtn");
    const imagePosCenterBtn = adminContent?.querySelector("#imagePosCenterBtn");
    const textBoldBtn = adminContent?.querySelector("#textBoldBtn");
    const textItalicBtn = adminContent?.querySelector("#textItalicBtn");
    const textUnderlineBtn = adminContent?.querySelector("#textUnderlineBtn");
    const textAlignLeftBtn = adminContent?.querySelector("#textAlignLeftBtn");
    const textAlignCenterBtn = adminContent?.querySelector("#textAlignCenterBtn");
    const textAlignRightBtn = adminContent?.querySelector("#textAlignRightBtn");
    const textAlignJustifyBtn = adminContent?.querySelector("#textAlignJustifyBtn");
    const textSizeInput = adminContent?.querySelector("#textSizeInput");
    const textSizeUnitInput = adminContent?.querySelector("#textSizeUnitInput");
    const textMinSizeInput = adminContent?.querySelector("#textMinSizeInput");
    const textColorInput = adminContent?.querySelector("#textColorInput");
    const textLineHeightInput = adminContent?.querySelector("#textLineHeightInput");
    const textParagraphSpacingInput = adminContent?.querySelector("#textParagraphSpacingInput");

    if (addBlockBtn) {
        addBlockBtn.onclick = () => {
            addElementToCanvas("div", (element) => {
                element.textContent = "";
                element.dataset.blockContainer = "true";
                element.style.background = "#dbeafe";
                element.style.border = "1px solid #93c5fd";
                element.style.padding = "8px";
                element.style.overflow = "hidden";
            });
        };
    }
    if (deleteElementBtn) {
        deleteElementBtn.onclick = () => {
            if (!selectedCanvasElement) return;
            const target = selectedCanvasElement;
            clearCanvasSelection();
            target.remove();
        };
    }
    if (saveCanvasBtn) {
        saveCanvasBtn.onclick = saveCanvasToCurrentFile;
    }

    [blockPaddingInput, blockRadiusInput, blockBorderWidthInput, blockBorderColorInput, blockBgColorInput]
        .filter(Boolean)
        .forEach((control) => {
            control.addEventListener("input", applyBlockStyleFromControls);
            control.addEventListener("change", applyBlockStyleFromControls);
        });

    const addNodeToBlock = (builder) => {
        const block = getSelectedBlockElement();
        if (!block) {
            window.alert("Select a block first.");
            return;
        }
        const node = builder();
        if (!(node instanceof HTMLElement)) return;
        node.dataset.editable = "true";
        block.appendChild(node);
        setCanvasSelection(node);
    };

    if (addBlockImageBtn) {
        addBlockImageBtn.onclick = () => {
            addNodeToBlock(() => {
                const img = document.createElement("img");
                img.src = "/assets/no-image.png";
                img.alt = "Image";
                img.style.width = "100%";
                img.style.height = "100%";
                img.style.objectFit = "cover";
                img.style.objectPosition = "50% 50%";
                img.style.display = "block";
                return img;
            });
        };
    }
    if (addBlockParagraphBtn) {
        addBlockParagraphBtn.onclick = () => {
            addNodeToBlock(() => {
                const p = document.createElement("p");
                p.textContent = "Paragraph";
                p.style.margin = "0";
                p.style.padding = "8px 0";
                p.setAttribute("contenteditable", "true");
                p.setAttribute("spellcheck", "false");
                return p;
            });
        };
    }
    if (addBlockHeadingBtn) {
        addBlockHeadingBtn.onclick = () => {
            addNodeToBlock(() => {
                const h = document.createElement("h2");
                h.textContent = "Heading";
                h.style.margin = "0";
                h.style.padding = "8px 0";
                h.setAttribute("contenteditable", "true");
                h.setAttribute("spellcheck", "false");
                return h;
            });
        };
    }
    if (addBlockHtmlBtn) {
        addBlockHtmlBtn.onclick = () => {
            const html = window.prompt("Paste HTML", "<div>Custom HTML</div>");
            if (!html) return;
            const block = getSelectedBlockElement();
            if (!block) return;
            const wrapper = document.createElement("div");
            wrapper.innerHTML = html;
            [...wrapper.children].forEach((child) => {
                if (child instanceof HTMLElement) child.dataset.editable = "true";
            });
            block.append(...wrapper.children);
        };
    }
    if (addBlockTableBtn) {
        addBlockTableBtn.onclick = () => {
            addNodeToBlock(() => {
                const table = document.createElement("table");
                table.style.width = "100%";
                table.style.borderCollapse = "collapse";
                table.innerHTML = "<tr><th style=\"border:1px solid #94a3b8;padding:6px;\">A</th><th style=\"border:1px solid #94a3b8;padding:6px;\">B</th></tr><tr><td style=\"border:1px solid #94a3b8;padding:6px;\">1</td><td style=\"border:1px solid #94a3b8;padding:6px;\">2</td></tr>";
                return table;
            });
        };
    }
    if (addBlockListBtn) {
        addBlockListBtn.onclick = () => {
            addNodeToBlock(() => {
                const ul = document.createElement("ul");
                ul.style.margin = "0";
                ul.style.paddingLeft = "18px";
                ul.innerHTML = "<li>List item 1</li><li>List item 2</li>";
                return ul;
            });
        };
    }

    if (imageFitCoverBtn) imageFitCoverBtn.onclick = () => { if (isSelectedImageElement()) selectedCanvasElement.style.objectFit = "cover"; };
    if (imageFitContainBtn) imageFitContainBtn.onclick = () => { if (isSelectedImageElement()) selectedCanvasElement.style.objectFit = "contain"; };
    if (imagePosUpBtn) imagePosUpBtn.onclick = () => updateSelectedImageObjectPosition(50, 0);
    if (imagePosDownBtn) imagePosDownBtn.onclick = () => updateSelectedImageObjectPosition(50, 100);
    if (imagePosLeftBtn) imagePosLeftBtn.onclick = () => updateSelectedImageObjectPosition(0, 50);
    if (imagePosRightBtn) imagePosRightBtn.onclick = () => updateSelectedImageObjectPosition(100, 50);
    if (imagePosCenterBtn) imagePosCenterBtn.onclick = () => updateSelectedImageObjectPosition(50, 50);
    if (uploadBlockImageBtn && uploadBlockImageInput) {
        uploadBlockImageBtn.onclick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            uploadBlockImageInput.click();
        };
        uploadBlockImageInput.addEventListener("change", async (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (!isSelectedImageElement()) return;
            if (!connectedRootHandle) {
                window.alert("Connect root folder first.");
                return;
            }
            const [file] = uploadBlockImageInput.files || [];
            if (!file) return;
            const targetImage = selectedCanvasElement;
            if (!(targetImage instanceof HTMLImageElement)) return;
            try {
                queuePendingImageUpload(file, targetImage);
            } catch (error) {
                const reason = error instanceof Error ? error.message : "";
                window.alert(`Unable to save image in public folder.${reason ? ` ${reason}` : ""}`);
            } finally {
                uploadBlockImageInput.value = "";
            }
        });
    }

    if (textBoldBtn) textBoldBtn.onclick = () => {
        const textElement = getSelectedTextElement();
        if (!textElement) return;
        textElement.style.fontWeight = textElement.style.fontWeight === "700" ? "400" : "700";
    };
    if (textItalicBtn) textItalicBtn.onclick = () => {
        const textElement = getSelectedTextElement();
        if (!textElement) return;
        textElement.style.fontStyle = textElement.style.fontStyle === "italic" ? "normal" : "italic";
    };
    if (textUnderlineBtn) textUnderlineBtn.onclick = () => {
        const textElement = getSelectedTextElement();
        if (!textElement) return;
        textElement.style.textDecoration = textElement.style.textDecoration === "underline" ? "none" : "underline";
    };
    if (textAlignLeftBtn) textAlignLeftBtn.onclick = () => { const textElement = getSelectedTextElement(); if (textElement) textElement.style.textAlign = "left"; };
    if (textAlignCenterBtn) textAlignCenterBtn.onclick = () => { const textElement = getSelectedTextElement(); if (textElement) textElement.style.textAlign = "center"; };
    if (textAlignRightBtn) textAlignRightBtn.onclick = () => { const textElement = getSelectedTextElement(); if (textElement) textElement.style.textAlign = "right"; };
    if (textAlignJustifyBtn) textAlignJustifyBtn.onclick = () => { const textElement = getSelectedTextElement(); if (textElement) textElement.style.textAlign = "justify"; };

    [textSizeInput, textColorInput, textSizeUnitInput, textMinSizeInput, textLineHeightInput, textParagraphSpacingInput].filter(Boolean).forEach((control) => {
        control.addEventListener("input", applyTextStyleFromControls);
        control.addEventListener("change", applyTextStyleFromControls);
    });
}

function ensureTailwindInHtml(htmlText) {
    if (htmlText.includes("cdn.tailwindcss.com")) return htmlText;
    const scriptTag = "<script src=\"https://cdn.tailwindcss.com\"></script>";
    if (htmlText.includes("</head>")) return htmlText.replace("</head>", `${scriptTag}</head>`);
    return `${scriptTag}${htmlText}`;
}

function buildRouteTemplate(layoutMode) {
    const baseHead = `
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Route</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            * { box-sizing: border-box; }
            body { margin: 0; background: #f8fafc; }
            #pageGrid {
                width: 100%;
                display: grid;
                grid-template-columns: repeat(80, minmax(0, 1fr));
                background-image:
                    linear-gradient(to right, rgba(15, 23, 42, 0.08) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(15, 23, 42, 0.08) 1px, transparent 1px);
            }
        </style>
    `;

    const gridStyles = layoutMode === "auto"
        ? "min-height:100vh;grid-auto-rows:30px;background-size:calc(100%/80) 30px;"
        : "aspect-ratio:16/9;grid-template-rows:repeat(45,minmax(0,1fr));background-size:calc(100%/80) calc(100%/45);";

    return `<!DOCTYPE html>
<html lang="en">
<head>${baseHead}</head>
<body>
    <main id="pageGrid" style="${gridStyles}">
        <!-- Start editing with Tailwind classes -->
    </main>
</body>
</html>`;
}

function setWorkspaceView(viewName) {
    adminContent?.querySelectorAll("[data-view-btn]").forEach((button) => {
        button.classList.toggle("active", button.dataset.viewBtn === viewName);
    });
    const panelMap = {
        home: "homePanel",
        section: "sectionPanel",
        edit: "editPanel",
        layers: "layersPanel",
    };
    Object.entries(panelMap).forEach(([key, panelId]) => {
        const panel = adminContent?.querySelector(`#${panelId}`);
        if (!panel) return;
        const isActive = key === viewName;
        panel.style.display = isActive ? "block" : "none";
    });
}

function bindWorkspaceControls() {
    adminContent?.querySelectorAll("[data-view-btn]").forEach((button) => {
        button.addEventListener("click", () => setWorkspaceView(button.dataset.viewBtn || "home"));
    });
    updateWorkspaceButtonsState();
}

async function loadAdminPage() {
    if (!adminContent) return;
    try {
        const response = await fetch(ADMIN_PAGE_PATH, { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to load admin page.");
        const htmlText = await response.text();
        const parsed = new DOMParser().parseFromString(htmlText, "text/html");
        adminContent.innerHTML = parsed.body ? parsed.body.innerHTML : htmlText;
        adminContent.classList.remove("hidden");
        initAdminCrudUI();
    } catch {
        adminContent.classList.remove("hidden");
        adminContent.innerHTML = "<p class=\"msg error\">Could not load admin.html</p>";
    }
}

async function resolveDirectoryHandle(rootHandle, relativePath, create = false) {
    const safePath = normalizePath(relativePath);
    if (!safePath) return rootHandle;
    const parts = safePath.split("/").filter(Boolean);
    let current = rootHandle;
    for (const part of parts) {
        current = await current.getDirectoryHandle(part, { create });
    }
    return current;
}

async function collectFolders(dirHandle, basePath = "") {
    const result = [basePath];
    for await (const entry of dirHandle.values()) {
        if (entry.kind !== "directory") continue;
        if (IGNORED_FOLDERS.has(entry.name)) continue;
        const nextPath = basePath ? `${basePath}/${entry.name}` : entry.name;
        result.push(...(await collectFolders(entry, nextPath)));
    }
    return result;
}

async function collectIndexFiles(dirHandle, basePath = "") {
    const result = [];
    for await (const entry of dirHandle.values()) {
        if (entry.kind === "file" && entry.name.toLowerCase() === "index.html") {
            result.push(basePath ? `${basePath}/index.html` : "index.html");
            continue;
        }
        if (entry.kind === "directory") {
            if (IGNORED_FOLDERS.has(entry.name)) continue;
            const nextPath = basePath ? `${basePath}/${entry.name}` : entry.name;
            result.push(...(await collectIndexFiles(entry, nextPath)));
        }
    }
    return result;
}

async function refreshTreeData() {
    if (!connectedRootHandle) return;
    cachedFolders = (await collectFolders(connectedRootHandle)).sort((a, b) => a.localeCompare(b));
    cachedIndexFiles = (await collectIndexFiles(connectedRootHandle)).sort((a, b) => a.localeCompare(b));
}

function setManagementTab(tabName) {
    activeManagementTab = tabName;
    adminContent?.querySelectorAll(".tab-btn").forEach((button) => {
        button.classList.toggle("active", button.dataset.tab === tabName);
    });
    adminContent?.querySelectorAll(".tab-panel").forEach((panel) => {
        panel.classList.toggle("active", panel.dataset.panel === tabName);
    });
}

function renderManagementPanels() {
    const pathListing = adminContent?.querySelector("#pathListing");
    if (!pathListing || !connectedRootHandle) return;

    const createFolderOptions = cachedFolders
        .map((path) => (path === "" ? `<option value="${ROOT_OPTION_VALUE}">.</option>` : `<option value="${path}">${path}</option>`))
        .join("");
    const routeOptions = cachedIndexFiles.map((path) => `<option value="${path}">${path}</option>`).join("");

    pathListing.innerHTML = `
        <div class="crud-status">Connected root: <strong>${ROOT_FOLDER_NAME}</strong></div>
        <div class="tab-switch">
            <button class="tab-btn active" data-tab="edit" type="button">Edit</button>
            <button class="tab-btn" data-tab="create" type="button">Create</button>
        </div>
        <section class="tab-panel active" data-panel="edit">
            <div class="crud-grid">
                <label>Select index.html</label>
                <select id="editIndexSelect">
                    <option value="">Select route</option>
                    ${routeOptions}
                </select>
                <div class="crud-actions">
                    <button id="loadRouteBtn" type="button" class="cta fill">Load</button>
                    <button id="deleteRouteBtn" type="button" class="cta danger">Delete</button>
                </div>
                <div class="rename-block">
                    <p>Parent Folder: <strong id="parentFolderLabel">-</strong></p>
                    <label>Rename Parent Folder</label>
                    <input id="renameFolderInput" type="text" placeholder="New folder name">
                    <button id="renameFolderBtn" type="button" class="cta">Rename Folder</button>
                </div>
            </div>
        </section>
        <section class="tab-panel" data-panel="create">
            <div class="crud-grid">
                <label>Parent Folder</label>
                <select id="createParentSelect">
                    <option value="">Select folder</option>
                    ${createFolderOptions}
                </select>
                <label>Page Size</label>
                <select id="createPageModeSelect">
                    <option value="fixed169">16 / 9 (80 x 45)</option>
                    <option value="auto">AUTO (80 x dynamic rows)</option>
                </select>
                <label>New Folder Name</label>
                <input id="createFolderNameInput" type="text" placeholder="Leave empty only for root index.html">
                <button id="createRouteBtn" type="button" class="cta fill" disabled>Create</button>
            </div>
        </section>
    `;

    bindManagementEvents();
    setManagementTab(activeManagementTab);
}

async function readIndexFile(indexPath) {
    const folderPath = getParentFolderFromIndexPath(indexPath);
    const folderHandle = await resolveDirectoryHandle(connectedRootHandle, folderPath, false);
    const fileHandle = await folderHandle.getFileHandle("index.html", { create: false });
    return (await fileHandle.getFile()).text();
}

function updateParentFolderInfo(indexPath) {
    const parentLabel = adminContent?.querySelector("#parentFolderLabel");
    const renameBlock = adminContent?.querySelector(".rename-block");
    const parentFolderPath = getParentFolderFromIndexPath(indexPath);
    if (parentLabel) parentLabel.textContent = parentFolderPath || ".";
    if (renameBlock) renameBlock.style.display = parentFolderPath ? "grid" : "none";
}

async function loadSelectedRoute() {
    const select = adminContent?.querySelector("#editIndexSelect");
    if (!select || !select.value) {
        window.alert("Select a route first.");
        return;
    }
    try {
        const selectedPath = select.value;
        const htmlText = ensureTailwindInHtml(await readIndexFile(selectedPath));
        currentLoadedDocument = new DOMParser().parseFromString(htmlText, "text/html");
        const canvas = getCanvasElement();
        if (canvas) {
            canvas.innerHTML = currentLoadedDocument.body ? currentLoadedDocument.body.innerHTML : htmlText;
        }
        activeSectionElement = null;
        const root = getEditableRoot();
        if (root) {
            stripEditorArtifacts(root);
            root.querySelectorAll("[data-editable='true'], section").forEach((node) => {
                if (node instanceof HTMLElement) bindElementDragAndResize(node);
            });
        }
        bindCanvasSelectionHandlers();
        clearCanvasSelection();
        setSelectedRoute(selectedPath);
        currentLoadedRoutePath = selectedPath;
        saveLastLoadedRoute(selectedPath);
        syncPageSettingsControlsFromDocument();
        updateWorkspaceButtonsState();
        updateParentFolderInfo(selectedPath);
    } catch {
        window.alert("Unable to load selected index.html.");
    }
}

async function writeTextFile(fileHandle, text) {
    const writable = await fileHandle.createWritable();
    await writable.write(text);
    await writable.close();
}

async function writeBinaryFile(fileHandle, fileBlob) {
    const writable = await fileHandle.createWritable();
    await writable.write(fileBlob);
    await writable.close();
}

function sanitizeFilename(name) {
    return String(name || "image")
        .toLowerCase()
        .replace(/[^a-z0-9._-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

function buildPublicSrcForCurrentRoute(fileName) {
    const safeFile = String(fileName || "").replace(/^\/+/, "");
    return `/${PUBLIC_UPLOADS_DIR}/${safeFile}`;
}

async function saveUploadedImageToPublic(file) {
    if (!connectedRootHandle) throw new Error("Root not connected");
    if (!(await hasRootPermission(connectedRootHandle))) {
        throw new Error("Permission denied");
    }
    const publicDirHandle = await resolveDirectoryHandle(connectedRootHandle, PUBLIC_UPLOADS_DIR, true);
    const extFromName = (file.name.split(".").pop() || "").toLowerCase();
    const mimeExtMap = {
        "image/jpeg": "jpg",
        "image/jpg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "image/gif": "gif",
        "image/svg+xml": "svg",
        "image/avif": "avif",
    };
    const ext = extFromName || mimeExtMap[file.type] || "png";
    const baseRaw = file.name.includes(".") ? file.name.slice(0, file.name.lastIndexOf(".")) : file.name;
    const base = sanitizeFilename(baseRaw) || "image";
    const stampedName = `${base}-${Date.now()}.${ext}`;
    const fileHandle = await publicDirHandle.getFileHandle(stampedName, { create: true });
    await writeBinaryFile(fileHandle, file);
    return stampedName;
}

function queuePendingImageUpload(file, targetImage) {
    if (!(targetImage instanceof HTMLImageElement)) return;
    const uploadId = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const previewUrl = URL.createObjectURL(file);
    pendingImageUploads.set(uploadId, { file, previewUrl });
    targetImage.dataset.pendingUploadId = uploadId;
    targetImage.src = previewUrl;
}

async function flushPendingImageUploads(root) {
    if (!root || !(root instanceof HTMLElement)) return;
    const images = root.querySelectorAll("img[data-pending-upload-id]");
    for (const image of images) {
        if (!(image instanceof HTMLImageElement)) continue;
        const uploadId = image.dataset.pendingUploadId || "";
        if (!uploadId || !pendingImageUploads.has(uploadId)) continue;
        const pending = pendingImageUploads.get(uploadId);
        try {
            const savedFileName = await saveUploadedImageToPublic(pending.file);
            image.src = buildPublicSrcForCurrentRoute(savedFileName);
            image.removeAttribute("data-pending-upload-id");
        } finally {
            if (pending?.previewUrl) URL.revokeObjectURL(pending.previewUrl);
            pendingImageUploads.delete(uploadId);
        }
    }
}

async function deleteSelectedRoute() {
    const select = adminContent?.querySelector("#editIndexSelect");
    if (!select || !select.value) {
        window.alert("Select a route first.");
        return;
    }
    const selectedPath = select.value;
    const mode = window.prompt("Delete option:\n1 = delete only index.html\n2 = delete folder + index.html", "1");
    if (mode !== "1" && mode !== "2") return;
    try {
        const folderPath = getParentFolderFromIndexPath(selectedPath);
        const folderHandle = await resolveDirectoryHandle(connectedRootHandle, folderPath, false);
        if (mode === "1") {
            await folderHandle.removeEntry("index.html");
        } else {
            if (!folderPath) {
                window.alert("Root folder cannot be deleted.");
                return;
            }
            const folderName = folderPath.split("/").pop();
            const parentPath = folderPath.split("/").slice(0, -1).join("/");
            const parentHandle = await resolveDirectoryHandle(connectedRootHandle, parentPath, false);
            await parentHandle.removeEntry(folderName, { recursive: true });
        }
        await refreshTreeData();
        renderManagementPanels();
        const canvas = getCanvasElement();
        if (canvas) canvas.innerHTML = "";
        currentLoadedDocument = null;
        currentLoadedRoutePath = "";
        activeSectionElement = null;
        saveLastLoadedRoute("");
        updateWorkspaceButtonsState();
        setSelectedRoute("Not selected");
    } catch {
        window.alert("Delete failed.");
    }
}

async function copyDirectoryRecursive(sourceDir, targetDir) {
    for await (const entry of sourceDir.values()) {
        if (entry.kind === "file") {
            const sourceFile = await entry.getFile();
            const targetFile = await targetDir.getFileHandle(entry.name, { create: true });
            await writeTextFile(targetFile, await sourceFile.text());
        } else {
            const nestedTarget = await targetDir.getDirectoryHandle(entry.name, { create: true });
            await copyDirectoryRecursive(entry, nestedTarget);
        }
    }
}

async function renameSelectedParentFolder() {
    const select = adminContent?.querySelector("#editIndexSelect");
    const renameInput = adminContent?.querySelector("#renameFolderInput");
    if (!select || !renameInput || !select.value) {
        window.alert("Select a route first.");
        return;
    }
    const oldFolderPath = getParentFolderFromIndexPath(select.value);
    const newName = renameInput.value.trim();
    if (!oldFolderPath) {
        window.alert("Root folder cannot be renamed.");
        return;
    }
    if (!newName || newName.includes("/") || newName.includes("\\")) {
        window.alert("Enter a valid folder name.");
        return;
    }
    try {
        const parts = oldFolderPath.split("/");
        const oldName = parts.pop();
        const parentPath = parts.join("/");
        if (newName === oldName) return;
        const parentHandle = await resolveDirectoryHandle(connectedRootHandle, parentPath, false);
        const sourceHandle = await parentHandle.getDirectoryHandle(oldName, { create: false });
        const targetHandle = await parentHandle.getDirectoryHandle(newName, { create: true });
        await copyDirectoryRecursive(sourceHandle, targetHandle);
        await parentHandle.removeEntry(oldName, { recursive: true });
        await refreshTreeData();
        renderManagementPanels();
        const newIndexPath = buildIndexPath(parentPath ? `${parentPath}/${newName}` : newName);
        const editSelect = adminContent?.querySelector("#editIndexSelect");
        if (editSelect) editSelect.value = newIndexPath;
        currentLoadedRoutePath = newIndexPath;
        setSelectedRoute(newIndexPath);
        updateParentFolderInfo(newIndexPath);
    } catch {
        window.alert("Folder rename failed.");
    }
}

async function createFolderAndIndex() {
    const parentSelect = adminContent?.querySelector("#createParentSelect");
    const nameInput = adminContent?.querySelector("#createFolderNameInput");
    const pageModeSelect = adminContent?.querySelector("#createPageModeSelect");
    if (!parentSelect || !nameInput || !pageModeSelect) return;

    const parentPath = getCreateParentPath();
    const folderName = nameInput.value.trim();
    const pageMode = pageModeSelect.value === "auto" ? "auto" : "fixed169";

    try {
        const parentHandle = await resolveDirectoryHandle(connectedRootHandle, parentPath, true);
        let createdIndexPath = "";
        const templateHtml = buildRouteTemplate(pageMode);

        if (!folderName) {
            if (parentPath !== "") {
                window.alert("Enter folder name for non-root parent.");
                return;
            }
            try {
                await parentHandle.getFileHandle("index.html", { create: false });
                window.alert("index.html already exists in root folder.");
                return;
            } catch {
                const rootIndexHandle = await parentHandle.getFileHandle("index.html", { create: true });
                await writeTextFile(rootIndexHandle, templateHtml);
                createdIndexPath = "index.html";
            }
        } else {
            if (folderName.includes("/") || folderName.includes("\\")) {
                window.alert("Enter a valid folder name.");
                return;
            }
            const newFolderHandle = await parentHandle.getDirectoryHandle(folderName, { create: true });
            const indexHandle = await newFolderHandle.getFileHandle("index.html", { create: true });
            await writeTextFile(indexHandle, templateHtml);
            const createdFolderPath = parentPath ? `${parentPath}/${folderName}` : folderName;
            createdIndexPath = buildIndexPath(createdFolderPath);
        }

        await refreshTreeData();
        renderManagementPanels();
        setManagementTab("edit");
        const editSelect = adminContent?.querySelector("#editIndexSelect");
        if (editSelect) editSelect.value = createdIndexPath;
        await loadSelectedRoute();
    } catch {
        window.alert("Unable to create folder and index file.");
    }
}

function bindManagementEvents() {
    adminContent?.querySelectorAll(".tab-btn").forEach((button) => {
        button.addEventListener("click", () => setManagementTab(button.dataset.tab || "edit"));
    });

    const editIndexSelect = adminContent?.querySelector("#editIndexSelect");
    const loadRouteBtn = adminContent?.querySelector("#loadRouteBtn");
    const deleteRouteBtn = adminContent?.querySelector("#deleteRouteBtn");
    const renameFolderBtn = adminContent?.querySelector("#renameFolderBtn");
    const createParentSelect = adminContent?.querySelector("#createParentSelect");
    const createNameInput = adminContent?.querySelector("#createFolderNameInput");
    const createRouteBtn = adminContent?.querySelector("#createRouteBtn");

    if (editIndexSelect) {
        editIndexSelect.addEventListener("change", () => updateParentFolderInfo(editIndexSelect.value));
        updateParentFolderInfo(editIndexSelect.value);
    }
    if (loadRouteBtn) loadRouteBtn.addEventListener("click", loadSelectedRoute);
    if (deleteRouteBtn) deleteRouteBtn.addEventListener("click", deleteSelectedRoute);
    if (renameFolderBtn) renameFolderBtn.addEventListener("click", renameSelectedParentFolder);

    if (createParentSelect && createNameInput && createRouteBtn) {
        const syncState = () => {
            const parentSelected = createParentSelect.value !== "";
            const rootSelected = createParentSelect.value === ROOT_OPTION_VALUE;
            const hasFolderName = createNameInput.value.trim() !== "";
            createNameInput.disabled = !parentSelected;
            createRouteBtn.disabled = !parentSelected || (!rootSelected && !hasFolderName);
        };
        createParentSelect.addEventListener("change", syncState);
        createNameInput.addEventListener("input", syncState);
        syncState();
    }
    if (createRouteBtn) createRouteBtn.addEventListener("click", createFolderAndIndex);
}

async function connectRootFolder() {
    setConnectionStatus("Connecting...");
    if (!("showDirectoryPicker" in window)) {
        setConnectionStatus("Browser not supported");
        window.alert("Your browser does not support File System Access API.");
        return;
    }
    if (!window.isSecureContext) {
        setConnectionStatus("Use https or localhost");
        window.alert("File System Access works only on HTTPS or localhost.");
        return;
    }

    try {
        const picked = await window.showDirectoryPicker({ mode: "readwrite" });
        if (picked.name.toLowerCase() !== ROOT_FOLDER_NAME) {
            setConnectionStatus(`Please select ${ROOT_FOLDER_NAME}`);
            window.alert(`Please select "${ROOT_FOLDER_NAME}" folder.`);
            return;
        }
        connectedRootHandle = picked;
        await saveRootHandle(picked);
        await refreshTreeData();
        renderManagementPanels();
        setConnectionStatus(`Connected: ${picked.name}`);
        setSelectedRoute("");
        updateRootButtonsState(true);
        const connectRootContainer = adminContent?.querySelector("#connectWithRoot");
        if (connectRootContainer) connectRootContainer.classList.remove("hidden");
        const lastRoute = getLastLoadedRoute();
        if (lastRoute && cachedIndexFiles.includes(lastRoute)) {
            const editSelect = adminContent?.querySelector("#editIndexSelect");
            if (editSelect) editSelect.value = lastRoute;
            await loadSelectedRoute();
        }
    } catch (error) {
        if (error && error.name === "AbortError") {
            setConnectionStatus("Connection cancelled");
            return;
        }
        setConnectionStatus("Connection failed");
        window.alert("Unable to connect root folder.");
    }
}

async function tryRestoreRootConnection() {
    try {
        const savedHandle = await getSavedRootHandle();
        if (!savedHandle) return;
        if (!(await hasRootPermission(savedHandle))) return;
        if (savedHandle.name.toLowerCase() !== ROOT_FOLDER_NAME) {
            await clearSavedRootHandle();
            return;
        }
        connectedRootHandle = savedHandle;
        await refreshTreeData();
        renderManagementPanels();
        setConnectionStatus(`Connected: ${savedHandle.name}`);
        setSelectedRoute("");
        updateRootButtonsState(true);
        const connectRootContainer = adminContent?.querySelector("#connectWithRoot");
        if (connectRootContainer) connectRootContainer.classList.remove("hidden");
        const lastRoute = getLastLoadedRoute();
        if (lastRoute && cachedIndexFiles.includes(lastRoute)) {
            const editSelect = adminContent?.querySelector("#editIndexSelect");
            if (editSelect) editSelect.value = lastRoute;
            await loadSelectedRoute();
        }
    } catch {
        await clearSavedRootHandle();
    }
}

async function disconnectRootFolder() {
    connectedRootHandle = null;
    cachedFolders = [];
    cachedIndexFiles = [];
    currentLoadedRoutePath = "";
    saveLastLoadedRoute("");
    await clearSavedRootHandle();

    const canvas = getCanvasElement();
    if (canvas) canvas.innerHTML = "";
    currentLoadedDocument = null;
    activeSectionElement = null;
    const pathListing = adminContent?.querySelector("#pathListing");
    if (pathListing) pathListing.innerHTML = "<p>Connect root folder to manage routes.</p>";

    updateWorkspaceButtonsState();
    updateRootButtonsState(false);
    setConnectionStatus("Not connected");
    setSelectedRoute("");
    syncPageSettingsControlsFromDocument();
}

function initAdminCrudUI() {
    const connectRootBtn = adminContent?.querySelector("#connectRootBtn");
    const disconnectRootBtn = adminContent?.querySelector("#disconnectRootBtn");
    if (connectRootBtn) connectRootBtn.addEventListener("click", connectRootFolder);
    if (disconnectRootBtn) disconnectRootBtn.addEventListener("click", disconnectRootFolder);
    bindWorkspaceControls();
    setWorkspaceView("home");
    const canvas = getCanvasElement();
    if (canvas) canvas.innerHTML = "";
    bindEditPanelControls();
    bindSectionPanelControls();
    bindPageSettingsControls();
    bindCanvasSelectionHandlers();
    currentLoadedRoutePath = "";
    currentLoadedDocument = null;
    activeSectionElement = null;
    updateWorkspaceButtonsState();
    updateRootButtonsState(false);
    tryRestoreRootConnection();
}

async function showLoggedInView() {
    if (loginOverlay) loginOverlay.classList.add("hidden");
    if (welcomeText) welcomeText.textContent = "Welcome, demo admin.";
    setTopPanelActive(true);
    setConnectionStatus("Not connected");
    setSelectedRoute("");
    await loadAdminPage();
}

function showLoginView() {
    if (loginOverlay) loginOverlay.classList.remove("hidden");
    setTopPanelActive(false);
    setConnectionStatus("Not connected");
    setSelectedRoute("");
    if (adminContent) {
        adminContent.classList.add("hidden");
        adminContent.innerHTML = "";
    }
}

if (isLoggedIn()) {
    showLoggedInView();
} else {
    showLoginView();
}

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const numberValue = numberInput ? numberInput.value.trim() : "";
        const passwordValue = passwordInput ? passwordInput.value.trim() : "";
        if (numberValue === DEMO_NUMBER && passwordValue === DEMO_PASSWORD) {
            setLoggedInStatus(true);
            if (msg) {
                msg.textContent = "Login successful!";
                msg.className = "msg success";
            }
            await showLoggedInView();
            return;
        }
        if (msg) {
            msg.textContent = "Invalid number or password.";
            msg.className = "msg error";
        }
    });
}

if (saveGlobalBtn) {
    saveGlobalBtn.addEventListener("click", saveCanvasToCurrentFile);
}
