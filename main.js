// === 設定區 ===
// 請將此 URL 改成你實際放置 cards.json 的 HTTP 路徑
// 若 cards.json 與此頁面放在同一個資料夾，可用 './cards.json'
const CARDS_URL = "./cards_filled.json";
const IMAGE_BASE_PATH = "./imgs"; // 👈 圖片資料夾位置
// === 狀態變數 ===
let cardPool = [];
let isLoading = false;
// ✨ AI 新增：占卜模式狀態變數
let isTestMode = false;
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

// ✨ AI 新增：取得整個狀態區塊，以便隱藏
const mainStatusSection = document.getElementById("mainStatusSection");
// ✨ AI 新增：占卜模式相關 DOM
const modeToggle = document.getElementById("modeToggle");
const stableModeGroup = document.getElementById("stableModeGroup");
const testModeDisplay = document.getElementById("testModeDisplay");
const cardSpread = document.getElementById("cardSpread");
const testCardDetail = document.getElementById("testCardDetail");
const selectionCounter = document.getElementById("selectionCounter");
// ✨ AI 新增 End

// === 初始化 ===
document.addEventListener("DOMContentLoaded", () => {
  // 一進頁面先嘗試載入卡池
  loadCardPool();

  // 原本的按鈕
  drawButtonEl.addEventListener("click", onDrawCard);
  // reloadButtonEl.addEventListener("click", () => loadCardPool(true));
  // loadCardPool(true);
  toggleImageEl.addEventListener("change", updateImageVisibility);

// 新增：點擊卡組抽卡
  deckEl.addEventListener("click", () => {
    // 只有在穩定模式下，點擊大卡堆才有反應
    if (!isTestMode) onDrawCard();
  });

  // 新增：洗牌按鈕
  // shuffleButtonEl.addEventListener("click", onShuffle);

  // ✨ AI 新增：模式切換監聽器
  modeToggle.addEventListener("change", (e) => {
    isTestMode = e.target.checked;
    
    if (isTestMode) {
      // --- 進入 測試版/占卜模式 ---
      stableModeGroup.style.display = "none";
      testModeDisplay.style.display = "block";
      
      // 隱藏下方的狀態列與打勾選項 (因為測試版不需要)
      mainStatusSection.style.display = "none";
      
      renderFullDeck(); 
    } else {
      // --- 回到 穩定版/簡單模式 ---
      stableModeGroup.style.display = "flex"; // 確保用 flex 恢復間距
      testModeDisplay.style.display = "none";
      
      // 顯示回下方的狀態列
      mainStatusSection.style.display = "flex";
      
      // 🚨 關鍵修正：切換回來時，把狀態文字還原成「已載入...」
      if (cardPool.length > 0) {
        setStatus(`已載入最新卡池：共 ${cardPool.length} 張卡，可開始抽卡。`);
      } else {
        setStatus("載入失敗，請確認 cards_filled.json 是否正確。");
      }
    }
  });
});
  // ✨ AI 新增 End

// === 透過 HTTP 載入卡池 ===
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

// === 抽卡（共用邏輯） ===
function onDrawCard() {
  if (isLoading || cardPool.length === 0) return;
  // 穩定版維持單張抽卡
  if (!isTestMode) {
    const randomIndex = Math.floor(Math.random() * cardPool.length);
    renderCard(cardPool[randomIndex]);
  }
}

// === 點擊卡組抽卡 ===
function onDeckClick() {
  if (!cardPool || cardPool.length === 0) {
    setStatus("尚未載入卡池，請稍後或檢查 cards.json 路徑。");
    return;
  }
  onDrawCard(); // 重用抽卡流程
}

// ✨ AI 新增：占卜模式 - 在桌面上鋪開所有卡片背面
function renderFullDeck() {
  cardSpread.innerHTML = "";
  selectedIndices = [];
  
  // 重置顯示區域
  document.getElementById("divinationFullResults").style.display = "none";
  testCardDetail.style.display = "block";
  
  updateSelectionUI();

  const shuffledIndices = [...Array(cardPool.length).keys()].sort(() => Math.random() - 0.5);

  shuffledIndices.forEach((poolIndex) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "mini-card";
    cardDiv.onclick = () => handleSelect(poolIndex, cardDiv);
    cardSpread.appendChild(cardDiv);
  });
  
  // 這裡不需要 setStatus 了，因為底下的狀態列已經被隱藏
  // 提示文字由 updateSelectionUI 控制上方的 selectionCounter
}

// ✨ AI 新增：占卜模式 - 處理卡片點選邏輯
function handleSelect(poolIndex, element) {
  // 如果已經選過，再次點擊就取消
  if (selectedIndices.includes(poolIndex)) {
    selectedIndices = selectedIndices.filter(i => i !== poolIndex);
    element.classList.remove("selected");
  } 
  // 如果還沒選滿 6 張
  else if (selectedIndices.length < 6) {
    selectedIndices.push(poolIndex);
    element.classList.add("selected");
  }
  updateSelectionUI();
}

// ✨ AI 新增：占卜模式 - 更新選取進度介面
function updateSelectionUI() {
  const count = selectedIndices.length;
  selectionCounter.textContent = count < 6 ? `已挑選 ${count} / 6 張` : "✦ 挑選完成 ✦";

  const resultsArea = document.getElementById("divinationFullResults");
  const container = document.getElementById("resultsContainer");

  if (count < 6) {
    testCardDetail.style.display = "block";
    resultsArea.style.display = "none";
    testCardDetail.innerHTML = "<p>請繼續挑選，感受卡片的訊息...</p>";
  } else {
    // ✨ 選滿 6 張，直接在原地渲染詳細結果
    testCardDetail.style.display = "none";
    resultsArea.style.display = "block";
    container.innerHTML = ""; // 清空舊結果

    selectedIndices.forEach((cardIdx, i) => {
      const card = cardPool[cardIdx];
      const cardDiv = document.createElement("div");
      cardDiv.className = "result-card-unit";
      
      // 處理圖片路徑
      const imageUrl = card.image 
        ? (card.image.startsWith("http") ? card.image : `${IMAGE_BASE_PATH}/${card.image}`) 
        : null;
      
      const imgHtml = (imageUrl && toggleImageEl.checked) 
        ? `<div class="card-image-wrapper"><img src="${imageUrl}" style="width:100%; border-radius:8px;"></div>` 
        : "";

      // 組合 HTML 結構 (使用你原本要求的「第 X 張」)
      cardDiv.innerHTML = `
        <h4>第 ${i + 1} 張：${card.name || "未命名"}</h4>
        ${imgHtml}
        <p>${card.description || ""}</p>
      `;
      
      container.appendChild(cardDiv);
    });

    // 自動捲動到結果區開頭
    resultsArea.scrollIntoView({ behavior: 'smooth' });
  }
}

// ✨ AI 修改：原本的 renderFullDeck 也要重置顯示狀態
function renderFullDeck() {
  cardSpread.innerHTML = "";
  selectedIndices = [];
  
  // 重置顯示區域
  document.getElementById("divinationFullResults").style.display = "none";
  testCardDetail.style.display = "block";
  
  updateSelectionUI();

  // 打亂索引並鋪牌
  const shuffledIndices = [...Array(cardPool.length).keys()].sort(() => Math.random() - 0.5);
  shuffledIndices.forEach((poolIndex) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "mini-card";
    cardDiv.onclick = () => handleSelect(poolIndex, cardDiv);
    cardSpread.appendChild(cardDiv);
  });
  
  setStatus("請從上方牌陣中挑選 6 張卡片。");
}
// ✨ AI 新增 End

// === 洗牌動畫 ===
function onShuffle() {
  if (!cardPool || cardPool.length === 0) {
    setStatus("還沒有卡池，無法洗牌。請先確認 cards.json 是否載入成功。");
    return;
  }

  // 加入 CSS class 啟動動畫
  deckEl.classList.remove("shuffling");
  void deckEl.offsetWidth; // 觸發 reflow 讓動畫可重播
  deckEl.classList.add("shuffling");

  setStatus("正在洗牌中...");

  // 動畫約 0.6 秒，之後提示已完成
  setTimeout(() => {
    setStatus("洗牌完成，可以點擊卡組抽卡。");
  }, 600);
}

// === 顯示抽到的卡 ===
function renderCard(card) {
  const name = card.name || "未命名卡牌";
  const description = card.description || "這張卡目前沒有設定說明內容。";

  // 👇 關鍵在這
  const imageUrl = card.image
    ? `${IMAGE_BASE_PATH}/${card.image}`
    : null;

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
// === 狀態列顯示 ===
function setStatus(message) {
  statusTextEl.textContent = message;
}

// === 控制「抽卡」按鈕是否可按 ===
function setDrawEnabled(enabled) {
  drawButtonEl.disabled = !enabled;
}

// === 切換是否顯示圖片 ===
function updateImageVisibility() {
  if (!cardImageEl.src) return;

  if (toggleImageEl.checked) {
    cardImageWrapperEl.style.display = "block";
  } else {
    cardImageWrapperEl.style.display = "none";
  }
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
      renderCard(card);              // ✅ 主頁 card view 切換到該卡
      // setStatus(`已切換顯示：${btn.textContent}`);

      // ✅（可選）自動收起 list
      if (cardListPanelEl) cardListPanelEl.open = false;
    });

    cardListEl.appendChild(btn);
  });
}
