// === 設定區 ===
// 請將此 URL 改成你實際放置 cards.json 的 HTTP 路徑
// 若 cards.json 與此頁面放在同一個資料夾，可用 './cards.json'
const CARDS_URL = "./cards_filled.json";
const IMAGE_BASE_PATH = "./imgs"; // 👈 圖片資料夾位置
// === 狀態變數 ===
let cardPool = [];
let isLoading = false;
// ✨ AI 新增：占卜模式狀態變數
let currentMode = "simple"; // 預設為簡單版 (simple | divination)
let selectedIndices = [];

// === DOM 取得 ===
const cardNameEl = document.getElementById("cardName");
const cardDescriptionEl = document.getElementById("cardDescription");
const cardImageEl = document.getElementById("cardImage");
const cardImageWrapperEl = document.getElementById("cardImageWrapper");
const drawButtonEl = document.getElementById("drawButton");
// const reloadButtonEl = document.getElementById("reloadButton");
const statusTextEl = document.getElementById("statusText");
const toggleImageEl = document.getElementById("toggleImage");
const deckEl = document.getElementById("deck");
// const shuffleButtonEl = document.getElementById("shuffleButton");
const cardListEl = document.getElementById("cardList");
const cardListPanelEl = document.getElementById("cardListPanel");

const themeToggleBtn = document.getElementById("themeToggle");
// ✨ AI 新增：取得整個狀態區塊，以便隱藏
const mainStatusSection = document.getElementById("mainStatusSection");
// ✨ AI 新增：占卜模式相關 DOM
// 模式區塊 (ID 已更新)
const simpleModeGroup = document.getElementById("simpleModeGroup");
const divinationModeDisplay = document.getElementById("divinationModeDisplay");
// 占卜版專用
const cardSpread = document.getElementById("cardSpread");
const testCardDetail = document.getElementById("testCardDetail");
const selectionCounter = document.getElementById("selectionCounter");
// ✨ AI 新增 End

// === 初始化 ===
document.addEventListener("DOMContentLoaded", () => {
  loadCardPool();

  // 1. 綁定抽卡事件
  drawButtonEl.addEventListener("click", onDrawCard);
  deckEl.addEventListener("click", () => {
    if (currentMode === "simple") onDrawCard();
  });
  toggleImageEl.addEventListener("change", updateImageVisibility);

  // 2. 深色主題切換功能
  themeToggleBtn.addEventListener("click", () => {
    const body = document.body;
    const currentTheme = body.getAttribute("data-theme");
    
    if (currentTheme === "dark") {
      body.removeAttribute("data-theme");
      themeToggleBtn.textContent = "🌙"; // 切換回月亮圖示
    } else {
      body.setAttribute("data-theme", "dark");
      themeToggleBtn.textContent = "☀️"; // 切換為太陽圖示
    }
  });

  // 3. 模式切換 (監聽 Radio Button)
  const modeRadios = document.querySelectorAll('input[name="mode"]');
  modeRadios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      const selectedMode = e.target.value;
      switchMode(selectedMode);
    });
  });
});

// === 模式切換邏輯 ===
function switchMode(mode) {
  currentMode = mode;

  if (mode === "divination") {
    // --- 切換到 占卜版 (Divination) ---
    simpleModeGroup.style.display = "none";
    divinationModeDisplay.style.display = "block";
    mainStatusSection.style.display = "none"; // 隱藏底部狀態
    renderFullDeck(); // 初始化牌陣
  } else {
    // --- 切換到 簡單版 (Simple) ---
    simpleModeGroup.style.display = "flex";
    divinationModeDisplay.style.display = "none";
    mainStatusSection.style.display = "flex"; // 顯示底部狀態

    // 還原狀態文字
    if (cardPool.length > 0) {
      setStatus(`已載入最新卡池：共 ${cardPool.length} 張卡，可開始抽卡。`);
    } else {
      setStatus("卡池尚未載入。");
    }
  }
}

// === 載入卡池 ===
async function loadCardPool() {
  isLoading = true;
  setStatus("載入卡池中...");
  try {
    const res = await fetch(CARDS_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Fetch failed");
    cardPool = await res.json();
    renderCardList();
    setStatus(`已載入最新卡池：共 ${cardPool.length} 張卡，可開始抽卡。`);
    setDrawEnabled(true);
  } catch (e) {
    console.error(e);
    setStatus("載入失敗，請確認 cards_filled.json 是否正確。");
  } finally {
    isLoading = false;
  }
}

// === 簡單版：抽卡 ===
function onDrawCard() {
  if (isLoading || cardPool.length === 0) return;
  // 只有在簡單模式下才執行單張抽卡
  if (currentMode === "simple") {
    const randomIndex = Math.floor(Math.random() * cardPool.length);
    renderCard(cardPool[randomIndex]);
  }
}

// === 占卜版：渲染完整牌陣 ===
function renderFullDeck() {
  cardSpread.innerHTML = "";
  selectedIndices = [];
  
  // 重置顯示區域
  document.getElementById("divinationFullResults").style.display = "none";
  testCardDetail.style.display = "block";
  testCardDetail.innerHTML = "<p>準備中...</p>";
  
  updateSelectionUI();

  const shuffledIndices = [...Array(cardPool.length).keys()].sort(() => Math.random() - 0.5);

  shuffledIndices.forEach((poolIndex) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "mini-card";
    // 點擊事件
    cardDiv.onclick = () => handleSelect(poolIndex, cardDiv);
    cardSpread.appendChild(cardDiv);
  });
}

// === 占卜版：處理卡片點選 ===
function handleSelect(poolIndex, element) {
  if (selectedIndices.includes(poolIndex)) {
    // 取消選取
    selectedIndices = selectedIndices.filter(i => i !== poolIndex);
    element.classList.remove("selected");
  } else if (selectedIndices.length < 6) {
    // 新增選取
    selectedIndices.push(poolIndex);
    element.classList.add("selected");
  }
  updateSelectionUI();
}

// === 占卜版：更新介面 ===
function updateSelectionUI() {
  const count = selectedIndices.length;
  selectionCounter.textContent = count < 6 ? `請繼續挑選 (${count} / 6)` : "✦ 挑選完成 ✦";

  const resultsArea = document.getElementById("divinationFullResults");
  const container = document.getElementById("resultsContainer");

  if (count < 6) {
    testCardDetail.style.display = "block";
    resultsArea.style.display = "none";
    testCardDetail.innerHTML = "<p>請繼續挑選，感受卡片的訊息...</p>";
  } else {
    testCardDetail.style.display = "none";
    resultsArea.style.display = "block";
    container.innerHTML = ""; 

    selectedIndices.forEach((cardIdx, i) => {
      const card = cardPool[cardIdx];
      const cardDiv = document.createElement("div");
      cardDiv.className = "result-card-unit";
      
      const imageUrl = card.image 
        ? (card.image.startsWith("http") ? card.image : `${IMAGE_BASE_PATH}/${card.image}`) 
        : null;
      
      const imgHtml = imageUrl 
        ? `<div class="card-image-wrapper" style="display:block"><img src="${imageUrl}" style="width:100%; border-radius:8px;"></div>` 
        : "";

      cardDiv.innerHTML = `
        <h4>第 ${i + 1} 張：${card.name || "未命名"}</h4>
        ${imgHtml}
        <p>${card.description || ""}</p>
      `;
      container.appendChild(cardDiv);
    });

    resultsArea.scrollIntoView({ behavior: 'smooth' });
  }
}

// === 簡單版：顯示卡片 ===
function renderCard(card) {
  const name = card.name || "未命名卡牌";
  const description = card.description || "這張卡目前沒有設定說明內容。";
  const imageUrl = card.image ? `${IMAGE_BASE_PATH}/${card.image}` : null;

  cardNameEl.textContent = name;
  cardDescriptionEl.textContent = description;

  if (imageUrl && toggleImageEl.checked) {
    cardImageEl.src = imageUrl;
    cardImageEl.alt = name;
    cardImageWrapperEl.style.display = "block";
  } else {
    cardImageWrapperEl.style.display = "none";
    cardImageEl.removeAttribute("src");
  }

  const container = cardNameEl.parentElement;
  container.classList.remove("flip");
  void container.offsetWidth;
  container.classList.add("flip");
}

function setStatus(message) {
  statusTextEl.textContent = message;
}

function setDrawEnabled(enabled) {
  drawButtonEl.disabled = !enabled;
}

function updateImageVisibility() {
  if (!cardImageEl.src) return;
  cardImageWrapperEl.style.display = toggleImageEl.checked ? "block" : "none";
}

function renderCardList() {
  if (!cardListEl) return;
  cardListEl.innerHTML = "";
  cardPool.forEach((card, idx) => {
    const btn = document.createElement("button");
    btn.className = "cardlist-item";
    btn.type = "button";
    btn.textContent = card.name ? card.name : `未命名卡牌 #${idx + 1}`;
    btn.addEventListener("click", () => {
      renderCard(card);              
      if (cardListPanelEl) cardListPanelEl.open = false;
    });
    cardListEl.appendChild(btn);
  });
}
