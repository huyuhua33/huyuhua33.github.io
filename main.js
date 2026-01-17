// === 設定區 ===
const CARDS_URL = "./cards_filled.json";
const IMAGE_BASE_PATH = "./imgs"; 

// === 狀態變數 ===
let cardPool = [];
let isLoading = false;
let currentMode = "simple"; // simple | divination
let selectedIndices = [];

// === DOM 取得 ===
// 共用區
const cardNameEl = document.getElementById("cardName");
const cardDescriptionEl = document.getElementById("cardDescription");
const cardImageEl = document.getElementById("cardImage");
const cardImageWrapperEl = document.getElementById("cardImageWrapper");
const drawButtonEl = document.getElementById("drawButton");
const statusTextEl = document.getElementById("statusText");
const toggleImageEl = document.getElementById("toggleImage");
const deckEl = document.getElementById("deck");
const cardListEl = document.getElementById("cardList");
const cardListPanelEl = document.getElementById("cardListPanel");
const mainStatusSection = document.getElementById("mainStatusSection");

// 主題與模式切換
const themeToggleCheckbox = document.getElementById("themeToggleCheckbox");

// 模式區塊
const simpleModeGroup = document.getElementById("simpleModeGroup");
const divinationModeDisplay = document.getElementById("divinationModeDisplay");

// 占卜版專用
const cardSpread = document.getElementById("cardSpread");
const testCardDetail = document.getElementById("testCardDetail");
const selectionCounter = document.getElementById("selectionCounter");

// === 初始化 ===
document.addEventListener("DOMContentLoaded", () => {
  loadCardPool();

  // 1. 綁定抽卡事件
  if(drawButtonEl) drawButtonEl.addEventListener("click", onDrawCard);
  if(deckEl) {
    deckEl.addEventListener("click", () => {
      if (currentMode === "simple") onDrawCard();
    });
  }
  if(toggleImageEl) toggleImageEl.addEventListener("change", updateImageVisibility);

  // 2. 深色主題切換 (Toggle Switch)
  if(themeToggleCheckbox) {
    themeToggleCheckbox.addEventListener("change", (e) => {
      if (e.target.checked) {
        document.body.setAttribute("data-theme", "dark");
      } else {
        document.body.removeAttribute("data-theme");
      }
    });
  }

  // 3. 模式切換 (Segmented Control)
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
    // --- 切換到 占卜版 ---
    simpleModeGroup.style.display = "none";
    divinationModeDisplay.style.display = "block";
    mainStatusSection.style.display = "none"; 
    renderFullDeck(); 
  } else {
    // --- 切換到 簡單版 ---
    // 修正：使用 flex 顯示，確保 CSS 中的 flex-direction 生效
    simpleModeGroup.style.display = "flex"; 
    divinationModeDisplay.style.display = "none";
    mainStatusSection.style.display = "flex";

    // 更新一下文字狀態
    if (cardPool.length > 0) {
      setStatus(`已載入最新卡池：共 ${cardPool.length} 張卡，可開始抽卡。`);
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
  
  if (currentMode === "simple") {
    const randomIndex = Math.floor(Math.random() * cardPool.length);
    renderCard(cardPool[randomIndex]);
  }
}

// === 占卜版：渲染完整牌陣 ===
function renderFullDeck() {
  if(!cardSpread) return;
  cardSpread.innerHTML = "";
  selectedIndices = [];
  
  // 重置顯示區域
  document.getElementById("divinationFullResults").style.display = "none";
  testCardDetail.style.display = "block";
  testCardDetail.innerHTML = "<p>準備中...</p>";
  
  updateSelectionUI();

  // 產生亂數排序的 index 陣列
  const shuffledIndices = [...Array(cardPool.length).keys()].sort(() => Math.random() - 0.5);

  shuffledIndices.forEach((poolIndex) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "mini-card";
    
    // 修正：加入卡背圖片
    const img = document.createElement("img");
    img.src = `${IMAGE_BASE_PATH}/Back.png`; 
    img.alt = "Card Back";
    img.ondragstart = () => false; // 防止拖拉圖片
    cardDiv.appendChild(img);

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

// === 占卜版：更新介面 (結果顯示) ===
function updateSelectionUI() {
  const count = selectedIndices.length;
  if(selectionCounter) {
    selectionCounter.textContent = count < 6 ? `請繼續挑選 (${count} / 6)` : "✦ 挑選完成 ✦";
  }

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
      
      // 修正：不顯示圖片，僅顯示標題與格式化後的內文
      // 使用 pre-wrap 確保 JSON 內的 \n\n 和格式正確顯示
      cardDiv.innerHTML = `
        <h4>第 ${i + 1} 張：${card.name || "未命名"}</h4>
        <p class="result-text">${card.description || ""}</p>
      `;
      container.appendChild(cardDiv);
    });

    // 平滑捲動到結果區
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

  // 觸發翻牌動畫
  const container = cardNameEl.parentElement;
  container.classList.remove("flip");
  void container.offsetWidth; // Trigger reflow
  container.classList.add("flip");
}

function setStatus(message) {
  if(statusTextEl) statusTextEl.textContent = message;
}

function setDrawEnabled(enabled) {
  if(drawButtonEl) drawButtonEl.disabled = !enabled;
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
