const images = [
    {
        img: '/customTemplate/assets/img1.jpg',
        title: 'Image 1',
        description: 'Description 1',
        url: 'https://yashwantrao1.github.io/take_two_alpha/',
    },
    {
        img: '/customTemplate/assets/img2.jpg',
        title: 'Image 2',
        description: 'Description 2',
        url: 'https://yashwantrao1.github.io/take_two_alpha/',
    },  
    {
        img: '/customTemplate/assets/img3.jpg',
        title: 'Image 3',
        description: 'Description 3',
        url: 'https://yashwantrao1.github.io/take_two_alpha/',
    },
    {
        img: '/customTemplate/assets/img4.jpg',
        title: 'Image 4',
        description: 'Description 4',
        url: 'https://yashwantrao1.github.io/take_two_alpha/',
    },
    {
        img: '/customTemplate/assets/img5.jpg',
        title: 'Image 5',
        description: 'Description 5',
        url: 'https://yashwantrao1.github.io/take_two_alpha/',
    },
    {
        img: '/customTemplate/assets/img6.jpg',
        title: 'Image 6',
        description: 'Description 6',
        url: 'https://yashwantrao1.github.io/take_two_alpha/',
    },
    {
        img: '/customTemplate/assets/img7.jpg',
        title: 'Image 7',
        description: 'Description 7',
        url: 'https://yashwantrao1.github.io/take_two_alpha/',
    },
    {
        img: '/customTemplate/assets/img8.jpg',
        title: 'Image 8',
        description: 'Description 8',
        url: 'https://yashwantrao1.github.io/take_two_alpha/',
    },
    {
        img: '/customTemplate/assets/img9.jpg',
        title: 'Image 9',
        description: 'Description 9',
        url: 'https://yashwantrao1.github.io/take_two_alpha/',
    },
    {
        img: '/customTemplate/assets/img10.jpg',
        title: 'Image 10',
        description: 'Description 10',
        url: 'https://yashwantrao1.github.io/take_two_alpha/',
    },
    {
        img: '/customTemplate/assets/img11.jpg',
        title: 'Image 11',
        description: 'Description 11',
        url: 'https://yashwantrao1.github.io/take_two_alpha/',
    },
    {
        img: '/customTemplate/assets/img12.jpg',
        title: 'Image 12',  
        description: 'Description 12',
        url: 'https://yashwantrao1.github.io/take_two_alpha/',
    },
    {
        img: '/customTemplate/assets/img13.jpg',
        title: 'Image 13',
        description: 'Description 13',
        url: 'https://yashwantrao1.github.io/take_two_alpha/',
    },
    {
        img: '/customTemplate/assets/img14.jpg',
        title: 'Image 14',
        description: 'Description 14',
        url: 'https://yashwantrao1.github.io/take_two_alpha/',
    },
    {
        img: '/customTemplate/assets/img15.jpg',
        title: 'Image 15',
        description: 'Description 15',
        url: 'https://yashwantrao1.github.io/take_two_alpha/',
    },
    {
        img: '/customTemplate/assets/img16.jpg',
        title: 'Image 16',
        description: 'Description 16',
        url: 'https://yashwantrao1.github.io/take_two_alpha/',
    },
    {
        img: '/customTemplate/assets/img17.jpg',
        title: 'Image 17',
        description: 'Description 17',
        url: 'https://yashwantrao1.github.io/take_two_alpha/',
    },
    {
        img: '/customTemplate/assets/img18.jpg',
        title: 'Image 18',
        description: 'Description 18',
        url: 'https://yashwantrao1.github.io/take_two_alpha/',
    },
    {
        img: '/customTemplate/assets/img19.jpg',
        title: 'Image 19',
        description: 'Description 19',
        url: 'https://yashwantrao1.github.io/take_two_alpha/',
    },
    {
        img: '/customTemplate/assets/img20.jpg',
        title: 'Image 20',
        description: 'Description 20',
        url: 'https://yashwantrao1.github.io/take_two_alpha/',
    },
    {
        img: '/customTemplate/assets/img21.jpg',
        title: 'Image 21',
        description: 'Description 21',
        url: 'https://yashwantrao1.github.io/take_two_alpha/',
    },
    {
        img: '/customTemplate/assets/img22.jpg',
        title: 'Image 22',  
        description: 'Description 22',
        url: 'https://yashwantrao1.github.io/take_two_alpha/',
    },
    {
        img: '/customTemplate/assets/img23.jpg',
        title: 'Image 23',
        description: 'Description 23',
        url: 'https://yashwantrao1.github.io/take_two_alpha/',
    },
    {
        img: '/customTemplate/assets/img24.jpg',
        title: 'Image 24',
        description: 'Description 24',
        url: 'https://yashwantrao1.github.io/take_two_alpha/',
    },
    {
        img: '/customTemplate/assets/img25.jpg',
        title: 'Image 25',
        description: 'Description 25',
        url: 'https://yashwantrao1.github.io/take_two_alpha/',
    },
    {
        img: '/customTemplate/assets/img26.jpg',
        title: 'Image 26',
        description: 'Description 26',
        url: 'https://yashwantrao1.github.io/take_two_alpha/',
    },
];

const contentSelect = document.getElementById('contentSelect');
const canvasHeightSelect = document.getElementById('canvasHeightSelect');
const textInput = document.getElementById('textInput');
const fontSizeInput = document.getElementById('fontSizeInput');
const fontWeightSelect = document.getElementById('fontWeightSelect');
const boldToggle = document.getElementById('boldToggle');
const italicToggle = document.getElementById('italicToggle');
const alignLeftBtn = document.getElementById('alignLeftBtn');
const alignCenterBtn = document.getElementById('alignCenterBtn');
const alignRightBtn = document.getElementById('alignRightBtn');
const alignJustifyBtn = document.getElementById('alignJustifyBtn');
const textMovableToggle = document.getElementById('textMovableToggle');
const imageControls = document.getElementById('imageControls');
const imageScaleRange = document.getElementById('imageScaleRange');
const imageMovableToggle = document.getElementById('imageMovableToggle');
const objectFitSelect = document.getElementById('objectFitSelect');
const objectPositionDragToggle = document.getElementById('objectPositionDragToggle');
const addContentBtn = document.getElementById('addContentBtn');
const addTextBtn = document.getElementById('addTextBtn');
const updateSelectedBtn = document.getElementById('updateSelectedBtn');
const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
const connectRootBtn = document.getElementById('connectRootBtn');
const connectionStatus = document.getElementById('connectionStatus');
const layoutFileSelect = document.getElementById('layoutFileSelect');
const parentFolderSelect = document.getElementById('parentFolderSelect');
const newFolderNameInput = document.getElementById('newFolderNameInput');
const createFolderBtn = document.getElementById('createFolderBtn');
const createIndexBtn = document.getElementById('createIndexBtn');
const saveLayoutBtn = document.getElementById('saveLayoutBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const builderTabBtn = document.getElementById('builderTabBtn');
const layersTabBtn = document.getElementById('layersTabBtn');
const editorTabBtn = document.getElementById('editorTabBtn');
const panelTabs = document.getElementById('panelTabs');
const closeEditorBtn = document.getElementById('closeEditorBtn');
const builderPanel = document.getElementById('builderPanel');
const layersPanel = document.getElementById('layersPanel');
const editorPanel = document.getElementById('editorPanel');
const textEditorControls = document.getElementById('textEditorControls');
const layersList = document.getElementById('layersList');
const createHome = document.getElementById('createHome');

const totalCols = 100;
const totalRows = 50;
let blockCounter = 0;
let dragOffset = { x: 0, y: 0 };
let selectedBlockId = null;
let rootDirHandle = null;
let selectedLayoutFileHandle = null;
let selectedLayoutFilePath = '';
let routeMode = '';
const routeFileHandleMap = new Map();
const routeFolderHandleMap = new Map();
let linksEnabled = false;
let imagePanState = null;
let draggingLayerId = null;
const ROUTE_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Saved Layout Preview</title>
</head>
<body>
    <main id="savedLayoutRoot"></main>
</body>
</html>`;

function setConnectionStatus(text) {
    if (connectionStatus) {
        connectionStatus.textContent = `Connection status: ${text}`;
    }
}

function populateContentDropdown() {
    images.forEach((item, index) => {
        const option = document.createElement('option');
        option.value = String(index);
        option.textContent = item.title;
        contentSelect.appendChild(option);
    });
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function parseGridStartLine(gridValue) {
    const part = gridValue.split('/')[0].trim();
    const n = Number(part);
    return Number.isFinite(n) ? n : 1;
}

function parseGridPlacement(gridValue, fallbackStart, fallbackSpan) {
    if (!gridValue) return { start: fallbackStart, span: fallbackSpan };
    const parts = gridValue.split('/').map((part) => part.trim());
    const start = Number(parts[0]);
    let span = fallbackSpan;
    if (parts[1] && parts[1].startsWith('span')) {
        const parsedSpan = Number(parts[1].replace('span', '').trim());
        if (Number.isFinite(parsedSpan)) span = parsedSpan;
    }
    return { start: Number.isFinite(start) ? start : fallbackStart, span };
}

function markEditing() {
    linksEnabled = false;
    createHome.classList.add('editing-mode');
}

function markPublished() {
    linksEnabled = true;
    createHome.classList.remove('editing-mode');
}

function showTab(tab) {
    builderTabBtn.classList.remove('active');
    layersTabBtn.classList.remove('active');
    editorTabBtn.classList.remove('active');
    builderPanel.classList.remove('active');
    layersPanel.classList.remove('active');
    editorPanel.classList.remove('active');

    if (tab === 'layers') {
        panelTabs.classList.remove('hidden');
        layersTabBtn.classList.add('active');
        layersPanel.classList.add('active');
        return;
    } 
    if (tab === 'editor') {
        panelTabs.classList.add('hidden');
        editorTabBtn.classList.remove('hidden');
        editorTabBtn.classList.add('active');
        editorPanel.classList.add('active');
        return;
    }
    panelTabs.classList.remove('hidden');
    builderTabBtn.classList.add('active');
    builderPanel.classList.add('active');
}

function updateLayersPanel() {
    const blocks = [...createHome.querySelectorAll('.content-block')];
    layersList.innerHTML = '';
    if (blocks.length === 0) {
        layersList.innerHTML = '<p class="layer-empty">No layers yet.</p>';
        return;
    }
    blocks
        .sort((a, b) => Number(b.dataset.zIndex || 0) - Number(a.dataset.zIndex || 0))
        .forEach((block) => {
            const row = document.createElement('div');
            row.className = 'layer-row';
            row.draggable = true;
            row.dataset.layer = block.dataset.blockId || '';
            const label = block.classList.contains('type-text') ? `Text: ${(block.dataset.textValue || '').slice(0, 20)}` : `Image: ${block.querySelector('img')?.getAttribute('alt') || 'Image'}`;
            row.innerHTML = `<span class="layer-label">${label}</span>`;
            layersList.appendChild(row);
        });
}

function normalizeZIndexes() {
    const blocks = [...createHome.querySelectorAll('.content-block')]
        .sort((a, b) => Number(a.dataset.zIndex || 0) - Number(b.dataset.zIndex || 0));
    blocks.forEach((block, index) => {
        block.dataset.zIndex = String(index + 1);
        block.style.zIndex = String(index + 1);
    });
    updateLayersPanel();
}

function moveLayer(blockId, dir) {
    const blocks = [...createHome.querySelectorAll('.content-block')]
        .sort((a, b) => Number(a.dataset.zIndex || 0) - Number(b.dataset.zIndex || 0));
    const idx = blocks.findIndex((b) => b.dataset.blockId === blockId);
    if (idx < 0) return;
    const target = dir === 'up' ? idx + 1 : idx - 1;
    if (target < 0 || target >= blocks.length) return;
    const a = Number(blocks[idx].dataset.zIndex || 0);
    const b = Number(blocks[target].dataset.zIndex || 0);
    blocks[idx].dataset.zIndex = String(b);
    blocks[idx].style.zIndex = String(b);
    blocks[target].dataset.zIndex = String(a);
    blocks[target].style.zIndex = String(a);
    normalizeZIndexes();
    markEditing();
}

function syncLayersOrderToCanvas() {
    const rows = [...layersList.querySelectorAll('.layer-row')];
    const total = rows.length;
    rows.forEach((row, index) => {
        const blockId = row.dataset.layer;
        const block = createHome.querySelector(`[data-block-id="${blockId}"]`);
        if (!block) return;
        const zIndex = total - index;
        block.dataset.zIndex = String(zIndex);
        block.style.zIndex = String(zIndex);
    });
    updateLayersPanel();
    markEditing();
}

function applyImageTransform(block) {
    const img = block.querySelector('img');
    if (!img) return;
    const scale = Number(block.dataset.imgScale || '1');
    const offsetX = Number(block.dataset.imgOffsetX || '0');
    const offsetY = Number(block.dataset.imgOffsetY || '0');
    const posX = Number(block.dataset.objPosX || '50');
    const posY = Number(block.dataset.objPosY || '50');
    img.style.objectPosition = `${posX}% ${posY}%`;
    img.style.objectFit = block.dataset.objectFit || 'cover';
    img.style.transformOrigin = 'center center';
    img.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
}

function initializeImageData(block) {
    if (block.dataset.imgScale) return;
    block.dataset.imgScale = '1';
    block.dataset.imgOffsetX = '0';
    block.dataset.imgOffsetY = '0';
    block.dataset.objPosX = '50';
    block.dataset.objPosY = '50';
    applyImageTransform(block);
}

function bindImagePan(block) {
    const img = block.querySelector('img');
    if (!img) return;
    img.addEventListener('pointerdown', (event) => {
        const selected = getSelectedBlock();
        if (!selected || selected !== block) return;
        if (block.dataset.enableObjectDrag !== 'true') return;
        event.preventDefault();
        event.stopPropagation();
        const scale = Number(block.dataset.imgScale || '1');
        imagePanState = {
            block,
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            startOffsetX: Number(block.dataset.imgOffsetX || '0'),
            startOffsetY: Number(block.dataset.imgOffsetY || '0'),
            scale,
        };
        img.setPointerCapture(event.pointerId);
    });
}

function updateImageControls(block) {
    if (!block || !block.classList.contains('type-content')) {
        imageControls.classList.add('hidden');
        return;
    }
    imageControls.classList.remove('hidden');
    textEditorControls.classList.add('hidden');
    initializeImageData(block);
    imageScaleRange.value = block.dataset.imgScale || '1';
    imageMovableToggle.checked = block.dataset.movable === 'true';
    objectFitSelect.value = block.dataset.objectFit || 'cover';
    objectPositionDragToggle.checked = block.dataset.enableObjectDrag === 'true';
}

function buildImageInner(item) {
    return `
        <a class="block-link" href="${item.url}" target="_blank" rel="noopener noreferrer">
            <img src="${item.img}" alt="${item.title}">
        </a>
        <button type="button" class="resize-handle" aria-label="Resize block"></button>
    `;
}

function buildTextInner(text, sizeVw, weight, align, isBold, isItalic) {
    const finalWeight = isBold ? '700' : weight;
    const finalStyle = isItalic ? 'italic' : 'normal';
    const paragraphs = text
        .split('\n')
        .filter((line) => line.trim() !== '')
        .map((line) => `<p>${escapeHtml(line)}</p>`)
        .join('');
    return `<div class="text-block-content" contenteditable="true" style="font-size:${sizeVw}vw;font-weight:${finalWeight};font-style:${finalStyle};text-align:${align};">${paragraphs || `<p>${escapeHtml(text)}</p>`}</div>
        <button type="button" class="resize-handle" aria-label="Resize block"></button>`;
}

function wireResize(block) {
    const handle = block.querySelector('.resize-handle');
    if (!handle) return;
    let resizing = false;
    let activePointerId = null;

    const onMove = (event) => {
        if (!resizing) return;
        event.preventDefault();
        const rect = createHome.getBoundingClientRect();
        const colWidth = rect.width / totalCols;
        const rowHeight = rect.height / totalRows;
        const startCol = parseGridStartLine(block.style.gridColumn);
        const startRow = parseGridStartLine(block.style.gridRow);
        const px = clamp(event.clientX, rect.left, rect.right) - rect.left;
        const py = clamp(event.clientY, rect.top, rect.bottom) - rect.top;
        const leftEdge = (startCol - 1) * colWidth;
        const topEdge = (startRow - 1) * rowHeight;
        let newColSpan = Math.ceil((px - leftEdge) / colWidth - 1e-6);
        let newRowSpan = Math.ceil((py - topEdge) / rowHeight - 1e-6);
        newColSpan = clamp(newColSpan, 1, totalCols - startCol + 1);
        newRowSpan = clamp(newRowSpan, 1, totalRows - startRow + 1);
        block.dataset.colSpan = String(newColSpan);
        block.dataset.rowSpan = String(newRowSpan);
        block.style.gridColumn = `${startCol} / span ${newColSpan}`;
        block.style.gridRow = `${startRow} / span ${newRowSpan}`;
        markEditing();
    };

    const stopResize = () => {
        if (!resizing) return;
        resizing = false;
        block.classList.remove('resizing');
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', stopResize);
        document.removeEventListener('pointercancel', stopResize);
        if (activePointerId != null) {
            try { handle.releasePointerCapture(activePointerId); } catch { /* ignore */ }
            activePointerId = null;
        }
    };

    handle.addEventListener('pointerdown', (event) => {
        if (block.dataset.movable !== 'true') return;
        event.preventDefault();
        event.stopPropagation();
        resizing = true;
        activePointerId = event.pointerId;
        block.classList.add('resizing');
        try { handle.setPointerCapture(event.pointerId); } catch { /* ignore */ }
        document.addEventListener('pointermove', onMove, { passive: false });
        document.addEventListener('pointerup', stopResize);
        document.addEventListener('pointercancel', stopResize);
    });
}

function createGridBlock(colSpan, rowSpan, innerHtml, className) {
    const block = document.createElement('article');
    block.className = `content-block ${className}`;
    block.draggable = true;
    block.dataset.blockId = `block-${blockCounter++}`;
    block.dataset.colSpan = String(colSpan);
    block.dataset.rowSpan = String(rowSpan);
    block.style.gridColumn = `1 / span ${colSpan}`;
    block.style.gridRow = `1 / span ${rowSpan}`;
    block.style.zIndex = String([...createHome.querySelectorAll('.content-block')].length + 1);
    block.dataset.zIndex = block.style.zIndex;
    block.innerHTML = innerHtml;
    block.addEventListener('click', () => setSelectedBlock(block));
    block.addEventListener('dragstart', (event) => {
        if (block.dataset.movable !== 'true') {
            event.preventDefault();
            return;
        }
        if (event.target instanceof HTMLElement && event.target.classList.contains('resize-handle')) return;
        const rect = block.getBoundingClientRect();
        dragOffset = { x: event.clientX - rect.left, y: event.clientY - rect.top };
        block.classList.add('dragging');
    });
    block.addEventListener('dragend', (event) => {
        block.classList.remove('dragging');
        if (event.clientX !== 0 || event.clientY !== 0) {
            placeBlockAtPointer(block, event.clientX, event.clientY);
        }
    });
    wireResize(block);
    return block;
}

function createImageBlock(item, itemIndex) {
    const block = createGridBlock(24, 12, buildImageInner(item), 'type-content');
    block.dataset.movable = 'false';
    block.classList.add('locked-block');
    block.dataset.itemIndex = String(itemIndex);
    initializeImageData(block);
    block.dataset.objectFit = 'cover';
    block.dataset.enableObjectDrag = 'false';
    bindImagePan(block);
    return block;
}

function createTextBlock(text, sizeVw, weight, align, isBold, isItalic) {
    const block = createGridBlock(24, 8, buildTextInner(text, sizeVw, weight, align, isBold, isItalic), 'type-text');
    block.dataset.movable = 'false';
    block.classList.add('locked-block');
    block.dataset.textValue = text;
    block.dataset.fontSizeVw = String(sizeVw);
    block.dataset.fontWeight = isBold ? '700' : weight;
    block.dataset.fontStyle = isItalic ? 'italic' : 'normal';
    block.dataset.textAlign = align;
    return block;
}

function setSelectedBlock(block) {
    [...createHome.querySelectorAll('.content-block')].forEach((el) => el.classList.remove('selected-block'));
    block.classList.add('selected-block');
    selectedBlockId = block.dataset.blockId || null;
    editorTabBtn.classList.remove('hidden');
    showTab('editor');
    updateImageControls(block);
    if (block.classList.contains('type-text')) {
        imageControls.classList.add('hidden');
        textEditorControls.classList.remove('hidden');
        textMovableToggle.checked = block.dataset.movable === 'true';
        fontSizeInput.value = block.dataset.fontSizeVw || '2.4';
        fontWeightSelect.value = block.dataset.fontWeight || '400';
        boldToggle.checked = (block.dataset.fontWeight || '400') === '700';
        italicToggle.checked = (block.dataset.fontStyle || 'normal') === 'italic';
    }
}

function getSelectedBlock() {
    if (!selectedBlockId) return null;
    return createHome.querySelector(`[data-block-id="${selectedBlockId}"]`);
}

function deselectCurrentBlock() {
    [...createHome.querySelectorAll('.content-block')].forEach((el) => el.classList.remove('selected-block'));
    selectedBlockId = null;
    imageControls.classList.add('hidden');
    textEditorControls.classList.add('hidden');
    editorTabBtn.classList.add('hidden');
    showTab('builder');
}

function applyParagraphAlignment(alignment) {
    const block = getSelectedBlock();
    if (!block || !block.classList.contains('type-text')) return;
    const content = block.querySelector('.text-block-content');
    if (!content) return;
    const selection = window.getSelection();
    let node = selection && selection.anchorNode ? selection.anchorNode : null;
    if (!node) return;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
    if (!(node instanceof HTMLElement)) return;
    const paragraph = node.closest('p');
    if (paragraph && content.contains(paragraph)) {
        paragraph.style.textAlign = alignment;
    } else {
        content.style.textAlign = alignment;
    }
    markEditing();
}

function placeBlockAtPointer(block, clientX, clientY) {
    const rect = createHome.getBoundingClientRect();
    const colWidth = rect.width / totalCols;
    const rowHeight = rect.height / totalRows;
    const colSpan = Number(block.dataset.colSpan);
    const rowSpan = Number(block.dataset.rowSpan);
    const pointerX = clamp(clientX, rect.left, rect.right);
    const pointerY = clamp(clientY, rect.top, rect.bottom);
    let x = pointerX - rect.left - dragOffset.x;
    let y = pointerY - rect.top - dragOffset.y;
    const maxX = Math.max(0, rect.width - colSpan * colWidth);
    const maxY = Math.max(0, rect.height - rowSpan * rowHeight);
    x = clamp(x, 0, maxX);
    y = clamp(y, 0, maxY);
    const targetCol = Math.min(totalCols - colSpan + 1, Math.max(1, Math.floor(x / colWidth) + 1));
    const targetRow = Math.min(totalRows - rowSpan + 1, Math.max(1, Math.floor(y / rowHeight) + 1));
    block.style.gridColumn = `${targetCol} / span ${colSpan}`;
    block.style.gridRow = `${targetRow} / span ${rowSpan}`;
    markEditing();
}

function setCanvasHeight() {
    const h = Number(canvasHeightSelect.value);
    if (!Number.isFinite(h) || h <= 0) return;
    // createHome.style.height = `${h}vh`;
    // createHome.style.width = `${(h * 16) / 9}vh`;
    // createHome.style.maxWidth = '100%';
}

function addSelectedContent() {
    const idx = contentSelect.value;
    if (idx === '') return window.alert('Please select content first.');
    const block = createImageBlock(images[Number(idx)], Number(idx));
    createHome.appendChild(block);
    normalizeZIndexes();
    setSelectedBlock(block);
    markEditing();
}

function addTextContent() {
    const text = textInput.value.trim();
    if (!text) return window.alert('Please enter text first.');
    const sizeVw = 2.4;
    const weight = '400';
    const align = 'left';
    const block = createTextBlock(text, sizeVw, weight, align, false, false);
    createHome.appendChild(block);
    normalizeZIndexes();
    setSelectedBlock(block);
    textInput.value = '';
    markEditing();
}

function updateSelectedBlock() {
    const block = getSelectedBlock();
    if (!block) return window.alert('Select a block first.');
    if (block.classList.contains('type-content')) {
        const idx = contentSelect.value;
        if (idx === '') return window.alert('Select content for image update.');
        const item = images[Number(idx)];
        const link = block.querySelector('.block-link');
        const img = block.querySelector('img');
        if (link && img) {
            link.setAttribute('href', item.url);
            img.setAttribute('src', item.img);
            img.setAttribute('alt', item.title);
            block.dataset.itemIndex = String(idx);
        }
    } else {
        const sizeVw = clamp(Number(fontSizeInput.value) || 2.4, 0.5, 20);
        const weight = boldToggle.checked ? '700' : fontWeightSelect.value;
        const style = italicToggle.checked ? 'italic' : 'normal';
        const content = block.querySelector('.text-block-content');
        if (content) {
            content.style.fontSize = `${sizeVw}vw`;
            content.style.fontWeight = weight;
            content.style.fontStyle = style;
            block.dataset.textValue = content.innerText;
            block.dataset.fontSizeVw = String(sizeVw);
            block.dataset.fontWeight = weight;
            block.dataset.fontStyle = style;
        }
    }
    markEditing();
}

function deleteSelectedBlock() {
    const block = getSelectedBlock();
    if (!block) return window.alert('Select a block first.');
    block.remove();
    selectedBlockId = null;
    updateImageControls(null);
    normalizeZIndexes();
    markEditing();
}

function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function buildSavedLayoutHtml() {
    const blocks = [...createHome.querySelectorAll('.content-block')]
        .sort((a, b) => Number(a.dataset.zIndex || 0) - Number(b.dataset.zIndex || 0));
    const markup = blocks.map((block) => {
        const gridColumn = block.style.gridColumn;
        const gridRow = block.style.gridRow;
        const zIndex = Number(block.dataset.zIndex || 1);
        if (block.classList.contains('type-text')) {
            const html = block.querySelector('.text-block-content')?.innerHTML || '';
            return `<article style="grid-column:${gridColumn};grid-row:${gridRow};z-index:${zIndex};overflow:hidden;width:100%;height:100%;"><div style="width:100%;height:100%;padding:10px;line-height:1.3;word-break:break-word;overflow:auto;font-size:${Number(block.dataset.fontSizeVw || '2.4')}vw;font-weight:${block.dataset.fontWeight || '400'};font-style:${block.dataset.fontStyle || 'normal'};">${html}</div></article>`;
        }
        const link = block.querySelector('.block-link');
        const img = block.querySelector('img');
        return `<article style="grid-column:${gridColumn};grid-row:${gridRow};z-index:${zIndex};overflow:hidden;width:100%;height:100%;"><a href="${escapeHtml(link?.getAttribute('href') || '#')}" target="_blank" rel="noopener noreferrer" style="display:block;width:100%;height:100%;"><img src="${escapeHtml(img?.getAttribute('src') || '')}" alt="${escapeHtml(img?.getAttribute('alt') || '')}" style="display:block;width:100%;height:100%;object-fit:cover;object-position:${block.dataset.objPosX || '50'}% ${block.dataset.objPosY || '50'}%;transform-origin:center center;transform:translate(${Number(block.dataset.imgOffsetX || 0)}px, ${Number(block.dataset.imgOffsetY || 0)}px) scale(${Number(block.dataset.imgScale || 1)});"></a></article>`;
    }).join('');
    return `<section style="width:100%;height:100vh;margin:0 auto;display:grid;grid-template-columns:repeat(100,minmax(0,1fr));grid-template-rows:repeat(50,minmax(0,1fr));background:#f5f6f8;position:relative;">${markup}</section>`;
}

function buildLayoutDocument(layoutHtml) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Saved Layout Preview</title>
    <style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,sans-serif;}</style>
</head>
<body>
    <main id="savedLayoutRoot">${layoutHtml}</main>
</body>
</html>`;
}

function applyImportedGrid(block, article) {
    const c = parseGridPlacement(article.style.gridColumn, 1, Number(block.dataset.colSpan) || 1);
    const r = parseGridPlacement(article.style.gridRow, 1, Number(block.dataset.rowSpan) || 1);
    block.dataset.colSpan = String(c.span);
    block.dataset.rowSpan = String(r.span);
    block.style.gridColumn = `${c.start} / span ${c.span}`;
    block.style.gridRow = `${r.start} / span ${r.span}`;
    block.dataset.zIndex = article.style.zIndex || '1';
    block.style.zIndex = block.dataset.zIndex;
}

function importLayoutFromHtml(htmlText) {
    const doc = new DOMParser().parseFromString(htmlText, 'text/html');
    const root = doc.querySelector('#savedLayoutRoot');
    const section = root?.querySelector('section');
    if (!section) return false;
    createHome.innerHTML = '';
    selectedBlockId = null;
    [...section.querySelectorAll('article')].forEach((article) => {
        const imageElement = article.querySelector('img');
        if (imageElement) {
            const src = imageElement.getAttribute('src') || '';
            const href = article.querySelector('a')?.getAttribute('href') || '#';
            const alt = imageElement.getAttribute('alt') || 'Image';
            const itemIndex = images.findIndex((item) => item.img === src);
            const item = itemIndex >= 0 ? images[itemIndex] : { img: src, title: alt, description: '', url: href };
            const block = createImageBlock(item, itemIndex);
            block.dataset.objPosX = (imageElement.style.objectPosition.split(' ')[0] || '50%').replace('%', '');
            block.dataset.objPosY = (imageElement.style.objectPosition.split(' ')[1] || '50%').replace('%', '');
            const transform = imageElement.style.transform || '';
            const translateMatch = transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
            const scaleMatch = transform.match(/scale\(([-\d.]+)\)/);
            block.dataset.imgOffsetX = translateMatch ? translateMatch[1] : '0';
            block.dataset.imgOffsetY = translateMatch ? translateMatch[2] : '0';
            block.dataset.imgScale = scaleMatch ? scaleMatch[1] : '1';
            applyImageTransform(block);
            applyImportedGrid(block, article);
            createHome.appendChild(block);
        } else {
            const textElement = article.querySelector('div');
            if (!textElement) return;
            const text = textElement.textContent || '';
            const sizeVw = Number((textElement.style.fontSize || '2.4vw').replace('vw', '')) || 2.4;
            const weight = textElement.style.fontWeight || '400';
            const style = textElement.style.fontStyle || 'normal';
            const align = textElement.style.textAlign || 'left';
            const block = createTextBlock(text, sizeVw, weight, align, weight === '700', style === 'italic');
            applyImportedGrid(block, article);
            createHome.appendChild(block);
        }
    });
    normalizeZIndexes();
    markEditing();
    return true;
}

async function collectIndexFiles(dirHandle, basePath = '') {
    const collected = [];
    for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file' && entry.name.toLowerCase() === 'index.html') {
            const routePath = basePath ? `${basePath}/index.html` : 'index.html';
            collected.push({ path: routePath, handle: entry });
        } else if (entry.kind === 'directory') {
            const nextPath = basePath ? `${basePath}/${entry.name}` : entry.name;
            const nested = await collectIndexFiles(entry, nextPath);
            collected.push(...nested);
        }
    }
    return collected;
}

async function collectFolders(dirHandle, basePath = '') {
    const folders = [basePath];
    for await (const entry of dirHandle.values()) {
        if (entry.kind === 'directory') {
            const nextPath = basePath ? `${basePath}/${entry.name}` : entry.name;
            const nested = await collectFolders(entry, nextPath);
            folders.push(...nested);
        }
    }
    return folders;
}

function populateLayoutFileDropdown(files) {
    layoutFileSelect.innerHTML = '<option value="">Select route index file</option>';
    routeFileHandleMap.clear();
    files
        .sort((a, b) => a.path.localeCompare(b.path))
        .forEach((file) => {
            const option = document.createElement('option');
            option.value = file.path;
            option.textContent = file.path;
            layoutFileSelect.appendChild(option);
            routeFileHandleMap.set(file.path, file.handle || file.path);
        });
}

function populateFolderDropdown(folders) {
    parentFolderSelect.innerHTML = '<option value="">Select parent folder</option>';
    routeFolderHandleMap.clear();
    folders
        .sort((a, b) => a.path.localeCompare(b.path))
        .forEach((folder) => {
            const option = document.createElement('option');
            option.value = folder.path;
            option.textContent = folder.path || '.';
            parentFolderSelect.appendChild(option);
            routeFolderHandleMap.set(folder.path, folder.handle || folder.path);
        });
    if (folders.length > 0) {
        parentFolderSelect.value = folders[0].path;
    }
}

async function refreshRemoteRoutes() {
    const response = await fetch('/api/layout-routes?action=list');
    if (!response.ok) throw new Error('list failed');
    const data = await response.json();
    const files = (data.files || []).map((path) => ({ path, handle: path }));
    const folders = (data.folders || ['']).map((path) => ({ path, handle: path }));
    populateLayoutFileDropdown(files);
    populateFolderDropdown(folders);
    return { files, folders };
}

async function refreshLocalRoutes() {
    const files = await collectIndexFiles(rootDirHandle);
    const folderPaths = await collectFolders(rootDirHandle);
    const folders = folderPaths.map((path) => ({ path, handle: path }));
    populateLayoutFileDropdown(files);
    populateFolderDropdown(folders);
    return { files, folders };
}

async function connectRootFolder() {
    try {
        const response = await fetch('/api/layout-routes?action=list');
        if (!response.ok) {
            let details = `${response.status}`;
            try {
                const data = await response.json();
                if (data?.error) details = `${response.status} - ${data.error}`;
            } catch {
                /* ignore */
            }
            setConnectionStatus(`GitHub error (${details})`);
            window.alert(`Unable to connect GitHub repository. ${details}`);
            return;
        }

        routeMode = 'remote';
        selectedLayoutFileHandle = null;
        rootDirHandle = null;
        const { files } = await refreshRemoteRoutes();
        if (files.length > 0) {
            layoutFileSelect.value = files[0].path;
            await loadSelectedLayoutFile();
            setConnectionStatus(`GitHub Connected (${files.length} route file(s))`);
        } else {
            setConnectionStatus('GitHub Connected (no route files found)');
            window.alert('No route index.html files found in GitHub repo.');
        }
    } catch {
        setConnectionStatus('GitHub API unreachable (check Vercel deploy/env)');
        window.alert('Unable to connect GitHub repository API. Check Vercel deployment and environment variables.');
    }
}

async function loadSelectedLayoutFile() {
    const selectedPath = layoutFileSelect.value;
    if (!selectedPath) return;

    if (routeMode === 'remote') {
        selectedLayoutFilePath = selectedPath;
        try {
            const response = await fetch(`/api/layout-routes?action=read&file=${encodeURIComponent(selectedPath)}`);
            if (!response.ok) throw new Error('read failed');
            const data = await response.json();
            if (importLayoutFromHtml(data.content || '')) {
                window.alert(`Loaded: ${selectedPath}`);
                setConnectionStatus(`GitHub Connected (loaded ${selectedPath})`);
            } else {
                window.alert(`Selected file has no saved layout section: ${selectedPath}`);
            }
        } catch {
            setConnectionStatus(`GitHub read failed (${selectedPath})`);
            window.alert('Unable to read selected file from GitHub.');
        }
        return;
    }

    selectedLayoutFileHandle = routeFileHandleMap.get(selectedPath) || null;
    if (!selectedLayoutFileHandle) return;
    try {
        const htmlText = await (await selectedLayoutFileHandle.getFile()).text();
        if (importLayoutFromHtml(htmlText)) {
            window.alert(`Loaded: ${selectedPath}`);
        } else {
            window.alert(`Selected file has no saved layout section: ${selectedPath}`);
        }
    } catch {
        window.alert('Unable to read selected file.');
    }
}

async function createRouteFile() {
    const parent = parentFolderSelect.value;
    if (parent === '') return window.alert('Select parent folder first.');
    const createdPath = parent ? `${parent}/index.html` : 'index.html';

    if (routeMode === 'remote') {
        try {
            const response = await fetch('/api/layout-routes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'createIndex', folderPath: parent }),
            });
            if (!response.ok) throw new Error('create failed');
            await refreshRemoteRoutes();
            layoutFileSelect.value = createdPath;
            await loadSelectedLayoutFile();
            window.alert(`Route created: ${createdPath}`);
            setConnectionStatus(`GitHub Connected (created ${createdPath})`);
        } catch {
            setConnectionStatus('GitHub create index failed');
            window.alert('Unable to create route in GitHub.');
        }
        return;
    }

    if (!rootDirHandle) {
        await connectRootFolder();
        if (!rootDirHandle) return;
    }
    try {
        let current = rootDirHandle;
        const segments = parent ? parent.split('/').filter(Boolean) : [];
        for (const segment of segments) {
            current = await current.getDirectoryHandle(segment, { create: true });
        }
        const fileHandle = await current.getFileHandle('index.html', { create: true });
        const file = await fileHandle.getFile();
        if (file.size === 0) {
            const writable = await fileHandle.createWritable();
            await writable.write(ROUTE_TEMPLATE);
            await writable.close();
        }
        await refreshLocalRoutes();
        if (routeFileHandleMap.has(createdPath)) {
            layoutFileSelect.value = createdPath;
            await loadSelectedLayoutFile();
        }
        window.alert(`Route created: ${createdPath}`);
    } catch {
        window.alert('Unable to create route file.');
    }
}

async function createFolderInSelectedParent() {
    const parent = parentFolderSelect.value;
    const folderName = newFolderNameInput.value.trim();
    if (parent === '') return window.alert('Select parent folder first.');
    if (!folderName) return window.alert('Enter folder name first.');
    if (folderName.includes('/') || folderName.includes('\\')) return window.alert('Folder name should not include / or \\.');
    const createdPath = parent ? `${parent}/${folderName}` : folderName;

    if (routeMode === 'remote') {
        try {
            const response = await fetch('/api/layout-routes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'createFolder', parentFolder: parent, folderName }),
            });
            if (!response.ok) throw new Error('create folder failed');
            await refreshRemoteRoutes();
            parentFolderSelect.value = createdPath;
            newFolderNameInput.value = '';
            window.alert(`Folder created: ${createdPath}`);
            setConnectionStatus(`GitHub Connected (created folder ${createdPath})`);
        } catch {
            setConnectionStatus('GitHub create folder failed');
            window.alert('Unable to create folder in GitHub.');
        }
        return;
    }

    if (!rootDirHandle) {
        await connectRootFolder();
        if (!rootDirHandle) return;
    }
    try {
        let current = rootDirHandle;
        const parentSegments = parent ? parent.split('/').filter(Boolean) : [];
        for (const segment of parentSegments) {
            current = await current.getDirectoryHandle(segment, { create: true });
        }
        await current.getDirectoryHandle(folderName, { create: true });
        await refreshLocalRoutes();
        parentFolderSelect.value = createdPath;
        newFolderNameInput.value = '';
        window.alert(`Folder created: ${createdPath}`);
    } catch {
        window.alert('Unable to create folder.');
    }
}

async function saveLayoutToFile() {
    const html = buildLayoutDocument(buildSavedLayoutHtml());

    if (routeMode === 'remote') {
        if (!selectedLayoutFilePath && layoutFileSelect.value) {
            selectedLayoutFilePath = layoutFileSelect.value;
        }
        if (!selectedLayoutFilePath) return window.alert('Select a route index.html file first.');
        try {
            const response = await fetch('/api/layout-routes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'save',
                    file: selectedLayoutFilePath,
                    html,
                }),
            });
            if (!response.ok) throw new Error('save failed');
            markPublished();
            window.alert('Selected route file updated in GitHub.');
            setConnectionStatus(`GitHub Connected (saved ${selectedLayoutFilePath})`);
        } catch {
            setConnectionStatus('GitHub save failed');
            window.alert('Unable to update selected file in GitHub.');
        }
        return;
    }

    if (!selectedLayoutFileHandle) {
        await loadSelectedLayoutFile();
    }
    if (!selectedLayoutFileHandle) {
        window.alert('Select a route index.html file first.');
        return;
    }
    try {
        const writable = await selectedLayoutFileHandle.createWritable();
        await writable.write(html);
        await writable.close();
        markPublished();
        window.alert('Selected route file updated.');
    } catch {
        window.alert('Unable to update selected file.');
    }
}

createHome.addEventListener('dragover', (event) => {
    event.preventDefault();
    const dragging = createHome.querySelector('.content-block.dragging');
    if (dragging) placeBlockAtPointer(dragging, event.clientX, event.clientY);
});

createHome.addEventListener('drop', (event) => {
    event.preventDefault();
    const dragging = createHome.querySelector('.content-block.dragging');
    if (dragging) placeBlockAtPointer(dragging, event.clientX, event.clientY);
});

document.addEventListener('pointermove', (event) => {
    if (!imagePanState) return;
    event.preventDefault();
    const block = imagePanState.block;
    const scale = Number(block.dataset.imgScale || '1');
    const blockRect = block.getBoundingClientRect();
    const maxX = ((scale - 1) * blockRect.width) / 2;
    const maxY = ((scale - 1) * blockRect.height) / 2;
    const dx = event.clientX - imagePanState.startX;
    const dy = event.clientY - imagePanState.startY;
    block.dataset.imgOffsetX = String(clamp(imagePanState.startOffsetX + dx, -maxX, maxX));
    block.dataset.imgOffsetY = String(clamp(imagePanState.startOffsetY + dy, -maxY, maxY));
    applyImageTransform(block);
    markEditing();
});

document.addEventListener('pointerup', () => {
    imagePanState = null;
});

imageScaleRange.addEventListener('input', () => {
    const block = getSelectedBlock();
    if (!block || !block.classList.contains('type-content')) return;
    block.dataset.imgScale = imageScaleRange.value;
    applyImageTransform(block);
    markEditing();
});

objectFitSelect.addEventListener('change', () => {
    const block = getSelectedBlock();
    if (!block || !block.classList.contains('type-content')) return;
    block.dataset.objectFit = objectFitSelect.value;
    applyImageTransform(block);
    markEditing();
});

imageMovableToggle.addEventListener('change', () => {
    const block = getSelectedBlock();
    if (!block) return;
    block.dataset.movable = imageMovableToggle.checked ? 'true' : 'false';
    block.classList.toggle('locked-block', !imageMovableToggle.checked);
    markEditing();
});

textMovableToggle.addEventListener('change', () => {
    const block = getSelectedBlock();
    if (!block) return;
    block.dataset.movable = textMovableToggle.checked ? 'true' : 'false';
    block.classList.toggle('locked-block', !textMovableToggle.checked);
    markEditing();
});

objectPositionDragToggle.addEventListener('change', () => {
    const block = getSelectedBlock();
    if (!block || !block.classList.contains('type-content')) return;
    block.dataset.enableObjectDrag = objectPositionDragToggle.checked ? 'true' : 'false';
    markEditing();
});

layersList.addEventListener('dragstart', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const row = target.closest('.layer-row');
    if (!row) return;
    draggingLayerId = row.dataset.layer || null;
    row.classList.add('dragging-layer');
});

layersList.addEventListener('dragover', (event) => {
    event.preventDefault();
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const overRow = target.closest('.layer-row');
    if (!overRow || !draggingLayerId) return;
    const draggingRow = layersList.querySelector(`.layer-row[data-layer="${draggingLayerId}"]`);
    if (!draggingRow || draggingRow === overRow) return;
    const rect = overRow.getBoundingClientRect();
    const before = event.clientY < rect.top + rect.height / 2;
    if (before) {
        layersList.insertBefore(draggingRow, overRow);
    } else {
        layersList.insertBefore(draggingRow, overRow.nextElementSibling);
    }
});

layersList.addEventListener('drop', (event) => {
    event.preventDefault();
    if (!draggingLayerId) return;
    syncLayersOrderToCanvas();
});

layersList.addEventListener('dragend', () => {
    const row = layersList.querySelector('.dragging-layer');
    if (row) row.classList.remove('dragging-layer');
    draggingLayerId = null;
});

layersList.addEventListener('mouseover', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const row = target.closest('.layer-row');
    if (!row) return;
    const blockId = row.dataset.layer;
    if (!blockId) return;
    const block = createHome.querySelector(`[data-block-id="${blockId}"]`);
    if (!block) return;
    block.classList.add('layer-hover');
});

layersList.addEventListener('mouseout', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const row = target.closest('.layer-row');
    if (!row) return;
    const toElement = event.relatedTarget;
    if (toElement instanceof Node && row.contains(toElement)) return;
    const blockId = row.dataset.layer;
    if (!blockId) return;
    const block = createHome.querySelector(`[data-block-id="${blockId}"]`);
    if (!block) return;
    block.classList.remove('layer-hover');
});

builderTabBtn.addEventListener('click', () => showTab('builder'));
layersTabBtn.addEventListener('click', () => {
    showTab('layers');
    updateLayersPanel();
});
editorTabBtn.addEventListener('click', () => showTab('editor'));
closeEditorBtn.addEventListener('click', () => deselectCurrentBlock());

alignLeftBtn.addEventListener('click', () => applyParagraphAlignment('left'));
alignCenterBtn.addEventListener('click', () => applyParagraphAlignment('center'));
alignRightBtn.addEventListener('click', () => applyParagraphAlignment('right'));
alignJustifyBtn.addEventListener('click', () => applyParagraphAlignment('justify'));

addContentBtn.addEventListener('click', addSelectedContent);
addTextBtn.addEventListener('click', addTextContent);
updateSelectedBtn.addEventListener('click', updateSelectedBlock);
deleteSelectedBtn.addEventListener('click', deleteSelectedBlock);
connectRootBtn.addEventListener('click', connectRootFolder);
layoutFileSelect.addEventListener('change', loadSelectedLayoutFile);
createFolderBtn.addEventListener('click', createFolderInSelectedParent);
createIndexBtn.addEventListener('click', createRouteFile);
saveLayoutBtn.addEventListener('click', saveLayoutToFile);
clearAllBtn.addEventListener('click', () => {
    createHome.innerHTML = '';
    selectedBlockId = null;
    updateLayersPanel();
    updateImageControls(null);
    markEditing();
});
canvasHeightSelect.addEventListener('change', setCanvasHeight);

populateContentDropdown();
setCanvasHeight();
markEditing();
setConnectionStatus('Not connected');