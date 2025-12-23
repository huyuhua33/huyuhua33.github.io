// === 設定區 ===
// 請將此 URL 改成你實際放置 cards.json 的 HTTP 路徑
// 若 cards.json 與此頁面放在同一個資料夾，可用 './cards.json'
const CARDS_URL = "./cards_filled.json";

// === 狀態變數 ===
let cardPool = [];
let isLoading = false;

// === DOM 取得 ===
const cardNameEl = document.getElementById("cardName");
const cardDescriptionEl = document.getElementById("cardDescription");
const cardImageEl = document.getElementById("cardImage");
const cardImageWrapperEl = document.getElementById("cardImageWrapper");
const drawButtonEl = document.getElementById("drawButton");
const reloadButtonEl = document.getElementById("reloadButton");
const statusTextEl = document.getElementById("statusText");
const toggleImageEl = document.getElementById("toggleImage");
const deckEl = document.getElementById("deck");
const shuffleButtonEl = document.getElementById("shuffleButton");

// === 初始化 ===
document.addEventListener("DOMContentLoaded", () => {
  // 一進頁面先嘗試載入卡池
  loadCardPool();

  // 原本的按鈕
  drawButtonEl.addEventListener("click", onDrawCard);
  reloadButtonEl.addEventListener("click", () => loadCardPool(true));
  toggleImageEl.addEventListener("change", updateImageVisibility);

  // 新增：點擊卡組抽卡
  deckEl.addEventListener("click", onDeckClick);

  // 新增：洗牌按鈕
  shuffleButtonEl.addEventListener("click", onShuffle);
});

// === 透過 HTTP 載入卡池 ===
async function loadCardPool(force = false) {
  if (isLoading) return;

  isLoading = true;
  setStatus("正在透過 HTTP 載入最新卡池...");
  setDrawEnabled(false);

  try {
    const res = await fetch(CARDS_URL, {
      cache: "no-store" // 避免用快取，確保每次拿到最新檔案
    });

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      throw new Error("cards.json 格式錯誤：最外層應為陣列");
    }

    cardPool = data;

    if (cardPool.length === 0) {
      setStatus("卡池載入成功，但卡片數量為 0，請確認 cards.json 內容。");
      setDrawEnabled(false);
    } else {
      setStatus(`已載入最新卡池：共 ${cardPool.length} 張卡，可開始抽卡。`);
      setDrawEnabled(true);
    }
  } catch (error) {
    console.error(error);
    setStatus("載入卡池失敗，請檢查 cards.json 路徑或伺服器設定。");
    setDrawEnabled(false);
  } finally {
    isLoading = false;
  }
}

// === 抽卡（共用邏輯） ===
function onDrawCard() {
  if (!cardPool || cardPool.length === 0) {
    setStatus("尚未載入到有效卡池，請先確認 cards.json 是否可被存取。");
    return;
  }

  const randomIndex = Math.floor(Math.random() * cardPool.length);
  const card = cardPool[randomIndex];

  renderCard(card);
}

// === 點擊卡組抽卡 ===
function onDeckClick() {
  if (!cardPool || cardPool.length === 0) {
    setStatus("尚未載入卡池，請稍後或檢查 cards.json 路徑。");
    return;
  }
  onDrawCard(); // 重用抽卡流程
}

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
  const description =
    card.description || "這張卡目前沒有設定說明內容。";
  const imageUrl = card.image || card.imageUrl || null;

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

  // 翻牌動畫（搭配 CSS .card-inner.flip）
  const container = cardNameEl.parentElement;
  container.classList.remove("fade-in", "flip");
  void container.offsetWidth; // reset 動畫
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
