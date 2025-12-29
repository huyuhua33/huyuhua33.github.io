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
      stableModeGroup.style.display = "none";
      testModeDisplay.style.display = "block";
      renderFullDeck(); // 切換時自動鋪開整疊牌
    } else {
      stableModeGroup.style.display = "block";
      testModeDisplay.style.display = "none";
    }
  });
  // ✨ AI 新增 End
});

// === 透過 HTTP 載入卡池 ===
async function loadCardPool() {
  isLoading = true;
  setStatus("載入卡池中...");
  try {
    const res = await fetch(CARDS_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Fetch failed");
    cardPool = await res.json();
    renderCardList();
    setStatus(`已載入 ${cardPool.length} 張卡。`);
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
  updateSelectionUI();

  // 為了增加占卜感，我們先將索引隨機打亂，讓使用者不知道哪張是哪張
  const shuffledIndices = [...Array(cardPool.length).keys()].sort(() => Math.random() - 0.5);

  shuffledIndices.forEach((poolIndex) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "mini-card";
    
    cardDiv.onclick = () => {
      handleSelect(poolIndex, cardDiv);
    };

    cardSpread.appendChild(cardDiv);
  });
  
  setStatus("請從上方牌陣中，憑直覺挑選 6 張卡片。");
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

  if (count < 6) {
    testCardDetail.innerHTML = "<p>請繼續挑選，感受卡片的訊息...</p>";
  } else {
    // 選滿 6 張，顯示結果列表
    let html = `<div class="divination-results">`;
    selectedIndices.forEach((cardIdx, i) => {
      const card = cardPool[cardIdx];
      html += `
        <div class="result-item" onclick="viewDetail(${cardIdx})">
          <strong>第 ${i + 1} 點：${card.name || "未命名"}</strong><br>
          <small>點擊查看全文</small>
        </div>
      `;
    });
    html += `</div><button class="btn secondary small" style="margin-top:15px;" onclick="renderFullDeck()">重抽一次</button>`;
    testCardDetail.innerHTML = html;
  }
}

// ✨ AI 新增：點擊結果後跳轉到穩定版看全文
window.viewDetail = function(index) {
  renderCard(cardPool[index]);
  stableModeGroup.style.display = "block";
  document.getElementById("cardDisplay").scrollIntoView({ behavior: 'smooth' });
};
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
