// === 設定區 ===
// 請將此 URL 改成你實際放置 cards.json 的 HTTP 路徑
// 若 cards.json 與此頁面放在同一個資料夾，可用 './cards.json'
const CARDS_URL = "./cards.json";

// === 變數 ===
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

// === 初始化 ===
document.addEventListener("DOMContentLoaded", () => {
  // 一進頁面先嘗試載入卡池
  loadCardPool();

  // 綁定事件
  drawButtonEl.addEventListener("click", onDrawCard);
  reloadButtonEl.addEventListener("click", () => loadCardPool(true));
  toggleImageEl.addEventListener("change", updateImageVisibility);
});

// === 載入卡池（透過 HTTP / fetch）===
async function loadCardPool(force = false) {
  if (isLoading) return;

  isLoading = true;
  setStatus("正在透過 HTTP 載入最新卡池...");
  setDrawEnabled(false);

  try {
    const res = await fetch(CARDS_URL, {
      cache: "no-store" // 每次請求都避免使用瀏覽器快取，確保拿到最新檔案
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

// === 抽卡事件 ===
function onDrawCard() {
  if (!cardPool || cardPool.length === 0) {
    setStatus("尚未載入到有效卡池，請先確認 cards.json 是否可被存取。");
    return;
  }

  const randomIndex = Math.floor(Math.random() * cardPool.length);
  const card = cardPool[randomIndex];

  renderCard(card);
}

// === 將抽到的卡顯示在畫面上 ===
function renderCard(card) {
  // 基本安全處理
  const name = card.name || "未命名卡牌";
  const description =
    card.description || "這張卡目前沒有設定說明內容。";
  const imageUrl = card.image || card.imageUrl || null;

  cardNameEl.textContent = name;
  cardDescriptionEl.textContent = description;

  // 控制圖片顯示
  if (imageUrl && toggleImageEl.checked) {
    cardImageEl.src = imageUrl;
    cardImageEl.alt = name;
    cardImageWrapperEl.style.display = "block";
  } else {
    cardImageWrapperEl.style.display = "none";
    cardImageEl.removeAttribute("src");
  }

  // 小動畫效果
  cardNameEl.parentElement.classList.remove("fade-in");
  // 觸發 reflow 以重啟動畫
  void cardNameEl.parentElement.offsetWidth;
  cardNameEl.parentElement.classList.add("fade-in");
}

// === 狀態列顯示 ===
function setStatus(message) {
  statusTextEl.textContent = message;
}

// === 控制「抽卡」按鈕狀態 ===
function setDrawEnabled(enabled) {
  drawButtonEl.disabled = !enabled;
}

// === 切換是否顯示圖片 ===
function updateImageVisibility() {
  // 如果目前卡有圖片，根據 checkbox 狀態顯示/隱藏
  if (!cardImageEl.src) return;

  if (toggleImageEl.checked) {
    cardImageWrapperEl.style.display = "block";
  } else {
    cardImageWrapperEl.style.display = "none";
  }
}
