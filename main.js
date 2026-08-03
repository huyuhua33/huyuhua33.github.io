// main.js

// === 設定區 ===
// 不同模式對應的資料來源
const DATA_SOURCES = {
  simple: "./cards_filled.json",
  divination: "./cards_filled.json",
  hiddenen: "./hidden_words_en.json",
  hiddenzh: "./hidden_words_zh.json",
  questions: "./questions.json",
};

const IMAGE_BASE_PATH = "./imgs";

// ✨ 定義不同模式與主題下的牌背圖片路徑
const CARD_BACKS = {
  default: `${IMAGE_BASE_PATH}/Back.png`,
  hwLight: `${IMAGE_BASE_PATH}/HW_Cover_Light.png`, // 隱言經亮色封面
  hwDark: `${IMAGE_BASE_PATH}/HW_Cover_Dark.png`    // 隱言經深色封面
};

// === 狀態變數 ===
let currentCardPool = []; // 當前使用的牌組資料
let dataCache = {};       // 資料快取
let isLoading = false;
let currentMode = "simple"; // simple | divination | hiddenen | hiddenzh | questions
let selectedIndices = [];
let lastQuestionId = null;
let dataRequestId = 0;

// === DOM 取得 ===
const drawButtonEl = document.getElementById("drawButton");
const statusTextEl = document.getElementById("statusText");
const toggleImageEl = document.getElementById("toggleImage");
const mainStatusSection = document.getElementById("mainStatusSection");
const imageToggleContainer = document.getElementById("imageToggleContainer");

// 主題與模式切換
const themeToggleCheckbox = document.getElementById("themeToggleCheckbox");

// 1. 簡單版 (Simple Mode) 元素
const simpleModeGroup = document.getElementById("simpleModeGroup");
const deckEl = document.getElementById("deck");
const cardNameEl = document.getElementById("cardName");
const cardDescriptionEl = document.getElementById("cardDescription");
const cardImageEl = document.getElementById("cardImage");
const cardImageWrapperEl = document.getElementById("cardImageWrapper");
const cardListEl = document.getElementById("cardList");
const cardListPanelEl = document.getElementById("cardListPanel");

// 2. 占卜版 (Divination Mode) 元素
const divinationModeDisplay = document.getElementById("divinationModeDisplay");
const cardSpread = document.getElementById("cardSpread");
const testCardDetail = document.getElementById("testCardDetail");
const selectionCounter = document.getElementById("selectionCounter");

// 3. 純文字版 (Text Only Mode - hiddenen/zh) 元素
const textOnlyModeGroup = document.getElementById("textOnlyModeGroup");
const deckTextOnlyImg = document.querySelector('#deckTextOnly img');
const deckTextOnlyEl = document.getElementById("deckTextOnly");
const textCardNameEl = document.getElementById("textCardName");
const textCardDescriptionEl = document.getElementById("textCardDescription");
const drawButtonTextOnlyEl = document.getElementById("drawButtonTextOnly");

// 4. 反思提問模式元素
const questionModeGroup = document.getElementById("questionModeGroup");
const deckQuestionEl = document.getElementById("deckQuestion");
const questionCardDisplayEl = document.getElementById("questionCardDisplay");
const questionCardInnerEl = document.getElementById("questionCardInner");
const questionCategoryEl = document.getElementById("questionCategory");
const questionTextEl = document.getElementById("questionText");
const questionResourceEl = document.getElementById("questionResource");
const drawQuestionButtonEl = document.getElementById("drawQuestionButton");
const questionSearchInputEl = document.getElementById("questionSearchInput");
const questionSearchStatusEl = document.getElementById("questionSearchStatus");
const questionSearchResultsEl = document.getElementById("questionSearchResults");


// === 初始化 ===
document.addEventListener("DOMContentLoaded", () => {
  // 預設載入簡單版資料
  loadDataForMode("simple");
  // 初始化牌背圖片
  updateCardBackImage();

  // --- 綁定事件 ---

  // 簡單版抽卡
  if(drawButtonEl) drawButtonEl.addEventListener("click", onDrawCardSimple);
  if(deckEl) deckEl.addEventListener("click", onDrawCardSimple);

  // 純文字版抽卡
  if(drawButtonTextOnlyEl) drawButtonTextOnlyEl.addEventListener("click", onDrawCardTextOnly);
  if(deckTextOnlyEl) deckTextOnlyEl.addEventListener("click", onDrawCardTextOnly);

  // 反思提問抽取與搜尋
  if(drawQuestionButtonEl) drawQuestionButtonEl.addEventListener("click", onDrawQuestion);
  if(deckQuestionEl) {
    deckQuestionEl.addEventListener("click", onDrawQuestion);
    deckQuestionEl.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onDrawQuestion();
      }
    });
  }
  if(questionSearchInputEl) questionSearchInputEl.addEventListener("input", renderQuestionSearchResults);

  // 圖片顯示切換
  if(toggleImageEl) toggleImageEl.addEventListener("change", updateImageVisibility);

  // 深色主題切換
  if(themeToggleCheckbox) {
    themeToggleCheckbox.addEventListener("change", (e) => {
      if (e.target.checked) {
        document.body.setAttribute("data-theme", "dark");
      } else {
        document.body.removeAttribute("data-theme");
      }
      // ✨ 主題切換時，同步更新牌背圖片
      updateCardBackImage();
    });
  }

  // 模式切換 (Segmented Control)
  const modeRadios = document.querySelectorAll('input[name="mode"]');
  modeRadios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      const selectedMode = e.target.value;
      switchMode(selectedMode);
    });
  });
});

// === ✨ 根據模式與主題更新牌背圖片 ===
function updateCardBackImage() {
  if (!deckTextOnlyImg) return;

  const isDarkTheme = document.body.getAttribute("data-theme") === "dark";
  
  // 判斷是否為隱言經系列模式
  if (currentMode === 'hiddenen' || currentMode === 'hiddenzh') {
    // 根據主題選擇對應的封面
    deckTextOnlyImg.src = isDarkTheme ? CARD_BACKS.hwDark : CARD_BACKS.hwLight;
  } else {
    // 其他模式 (如簡單版) 使用預設牌背
    deckTextOnlyImg.src = CARD_BACKS.default;
  }
}

// === 核心：模式切換邏輯 ===
function switchMode(mode) {
  currentMode = mode;
  selectedIndices = []; // 重置占卜選擇

  // ✨✨✨ 新增：切換模式時，先重置所有顯示內容，避免殘留上一張卡的內容 ✨✨✨
  resetDisplays();

  // 1. 介面顯示/隱藏
  if (mode === "divination") {
    simpleModeGroup.style.display = "none";
    textOnlyModeGroup.style.display = "none";
    questionModeGroup.style.display = "none";
    divinationModeDisplay.style.display = "block";

    mainStatusSection.style.display = "none";
    renderFullDeck();

  } else if (mode === "hiddenen" || mode === "hiddenzh") {
    // --- 隱言經 (英/中) 共用純文字介面 ---
    simpleModeGroup.style.display = "none";
    divinationModeDisplay.style.display = "none";
    questionModeGroup.style.display = "none";
    textOnlyModeGroup.style.display = "flex";

    mainStatusSection.style.display = "flex";
    imageToggleContainer.style.display = "none"; // 純文字模式不需要圖片開關

  } else if (mode === "questions") {
    simpleModeGroup.style.display = "none";
    divinationModeDisplay.style.display = "none";
    textOnlyModeGroup.style.display = "none";
    questionModeGroup.style.display = "flex";

    mainStatusSection.style.display = "flex";
    imageToggleContainer.style.display = "none";
  } else {
    // --- 簡單版 (預設) ---
    divinationModeDisplay.style.display = "none";
    textOnlyModeGroup.style.display = "none";
    questionModeGroup.style.display = "none";
    simpleModeGroup.style.display = "flex";

    mainStatusSection.style.display = "flex";
    imageToggleContainer.style.display = "inline-flex";
  }

  // 2. 切換資料來源
  loadDataForMode(mode);
  
  // 3. 切換模式時，同步更新牌背圖片
  updateCardBackImage();
}

// === ✨✨✨ 新增：重置畫面顯示函式 ✨✨✨
function resetDisplays() {
  // 1. 重置簡單版 (有圖片的)
  if (cardNameEl) cardNameEl.textContent = "請抽經典卡";
  if (cardDescriptionEl) cardDescriptionEl.textContent = "點擊上方卡組或下方按鈕抽卡。";
  if (cardImageWrapperEl) cardImageWrapperEl.style.display = "none";
  if (cardImageEl) cardImageEl.removeAttribute("src");

  // 2. 重置純文字版 (隱言經)
  if (textCardNameEl) textCardNameEl.textContent = "請抽隱言經";
  if (textCardDescriptionEl) textCardDescriptionEl.textContent = "點擊上方卡組或下方按鈕抽卡。";

  // 3. 重置反思提問
  if (questionCategoryEl) {
    questionCategoryEl.textContent = "";
    questionCategoryEl.hidden = true;
  }
  if (questionTextEl) questionTextEl.textContent = "點擊上方卡組或下方按鈕，抽一個此刻值得思考的問題。";
  if (questionResourceEl) {
    questionResourceEl.textContent = "";
    questionResourceEl.hidden = true;
  }
  if (questionSearchInputEl) questionSearchInputEl.value = "";
  if (questionSearchStatusEl) questionSearchStatusEl.textContent = "";
  if (questionSearchResultsEl) questionSearchResultsEl.innerHTML = "";

  // 4. 移除翻轉動畫 class (確保下次抽卡時動畫能重新觸發)
  if (cardNameEl && cardNameEl.parentElement) {
    cardNameEl.parentElement.classList.remove("flip");
  }
  if (textCardNameEl && textCardNameEl.parentElement) {
    textCardNameEl.parentElement.classList.remove("flip");
  }
  if (questionCardInnerEl) questionCardInnerEl.classList.remove("flip");
}

// === 資料載入與快取機制 ===
async function loadDataForMode(mode) {
  const requestId = ++dataRequestId;
  isLoading = true;
  setStatus("正在載入資料...");
  setDrawEnabled(false);
  if (questionSearchInputEl) questionSearchInputEl.disabled = true;

  const targetUrl = DATA_SOURCES[mode] || DATA_SOURCES["simple"];

  if (dataCache[targetUrl]) {
    if (requestId !== dataRequestId || mode !== currentMode) return;
    currentCardPool = dataCache[targetUrl];
    onDataLoaded(mode);
    isLoading = false;
    return;
  }

  try {
    const res = await fetch(targetUrl, { cache: "no-store" });
    if (!res.ok) throw new Error("Fetch failed: " + targetUrl);
    const data = await res.json();

    dataCache[targetUrl] = data;
    if (requestId !== dataRequestId || mode !== currentMode) return;
    currentCardPool = data;

    onDataLoaded(mode);
  } catch (e) {
    console.error(e);
    if (requestId === dataRequestId && mode === currentMode) {
      setStatus("資料載入失敗，請確認網頁目錄下是否有 " + targetUrl);
    }
  } finally {
    if (requestId === dataRequestId) isLoading = false;
  }
}

// 資料載入完成後的處理
function onDataLoaded(mode) {
  const count = currentCardPool.length;

  if (mode === "simple") {
    renderCardList(currentCardPool);
    setStatus(`已載入卡池：共 ${count} 張卡。`);
    setDrawEnabled(true);
  } else if (mode === "divination") {
    renderFullDeck();
  } else if (mode === "hiddenen") {
    setStatus(`已載入隱言經(英)：共 ${count} 條聖言。`);
    setDrawEnabled(true);
  } else if (mode === "hiddenzh") {
    setStatus(`已載入隱言經(中)：共 ${count} 條聖言。`);
    setDrawEnabled(true);
  } else if (mode === "questions") {
    setStatus(`已載入反思提問：共 ${count} 個問題。`);
    setDrawEnabled(true);
    questionSearchInputEl.disabled = false;
    renderQuestionSearchResults();
  }
}

// ==========================================
// 邏輯 A: 簡單版 (Simple)
// ==========================================
function onDrawCardSimple() {
  if (isLoading || !currentCardPool.length) return;
  const randomIndex = Math.floor(Math.random() * currentCardPool.length);
  renderCardSimple(currentCardPool[randomIndex]);
}

function renderCardSimple(card) {
  const name = card.name || "未命名卡牌";
  const description = card.description || "";
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

  // 重置動畫
  const container = cardNameEl.parentElement;
  container.classList.remove("flip");
  void container.offsetWidth; // 觸發 reflow
  container.classList.add("flip");
}

// ==========================================
// 邏輯 B: 純文字版 (Text Only - hiddenen/zh)
// ==========================================
function onDrawCardTextOnly() {
  if (isLoading || !currentCardPool.length) return;
  const randomIndex = Math.floor(Math.random() * currentCardPool.length);
  renderTextOnlyCard(currentCardPool[randomIndex]);
}

function renderTextOnlyCard(card) {
  // 根據模式決定標題前綴
  let prefix = "No.";
  if (currentMode === "hiddenen") prefix = "Hidden Words No. ";
  if (currentMode === "hiddenzh") prefix = "隱言經 第 ";

  // 如果 json 有 name 就用 name，沒有就用 id
  let title = "";
  if (card.name) {
      title = `${prefix}${card.name}${(currentMode === "hiddenzh" ? " 條" : "")}`;
  } else {
      title = `${prefix}${card.id}${(currentMode === "hiddenzh" ? " 條" : "")}`;
  }

  const description = card.description || "";

  textCardNameEl.textContent = title;
  textCardDescriptionEl.textContent = description;

  // 重置動畫
  const container = textCardNameEl.parentElement;
  container.classList.remove("flip");
  void container.offsetWidth; // 觸發 reflow
  container.classList.add("flip");
}

// ==========================================
// 邏輯 C: 反思提問 (Draw + Search)
// ==========================================
function onDrawQuestion() {
  if (isLoading || !currentCardPool.length || currentMode !== "questions") return;

  const availableQuestions = currentCardPool.length > 1
    ? currentCardPool.filter(question => question.id !== lastQuestionId)
    : currentCardPool;
  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  renderQuestionCard(availableQuestions[randomIndex]);
}

function renderQuestionCard(question) {
  if (!question) return;

  lastQuestionId = question.id;
  questionCategoryEl.textContent = question.category || "反思提問";
  questionCategoryEl.hidden = false;
  questionTextEl.textContent = question.question || "這個問題正在整理中。";
  if (question.resource) {
    questionResourceEl.textContent = `資料來源：${question.resource}`;
    questionResourceEl.hidden = false;
  } else {
    questionResourceEl.textContent = "";
    questionResourceEl.hidden = true;
  }

  questionCardInnerEl.classList.remove("flip");
  void questionCardInnerEl.offsetWidth;
  questionCardInnerEl.classList.add("flip");
}

function renderQuestionSearchResults() {
  if (!questionSearchInputEl || !questionSearchResultsEl || currentMode !== "questions") return;

  const query = questionSearchInputEl.value.trim().toLocaleLowerCase("zh-Hant");
  questionSearchResultsEl.innerHTML = "";

  if (!query) {
    questionSearchStatusEl.textContent = `可搜尋 ${currentCardPool.length} 個問題。`;
    return;
  }

  const terms = query.split(/\s+/).filter(Boolean);
  const matches = currentCardPool.filter(question => {
    const searchableText = [
      question.category,
      question.question,
      question.resource,
      ...(question.keywords || [])
    ].filter(Boolean).join(" ").toLocaleLowerCase("zh-Hant");

    return terms.every(term => searchableText.includes(term));
  });

  const visibleMatches = matches.slice(0, 12);
  questionSearchStatusEl.textContent = matches.length > 12
    ? `找到 ${matches.length} 個問題，顯示前 12 個。`
    : `找到 ${matches.length} 個問題。`;

  if (!matches.length) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "question-search-empty";
    emptyMessage.textContent = "沒有符合的問題，試試其他關鍵字。";
    questionSearchResultsEl.appendChild(emptyMessage);
    return;
  }

  visibleMatches.forEach(question => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "question-result-item";

    const category = document.createElement("span");
    category.className = "question-result-category";
    category.textContent = question.category || "反思提問";

    const text = document.createElement("span");
    text.className = "question-result-text";
    text.textContent = question.question;

    const content = document.createElement("span");
    content.className = "question-result-content";
    content.appendChild(text);

    if (question.resource) {
      const resource = document.createElement("span");
      resource.className = "question-result-resource";
      resource.textContent = question.resource;
      content.appendChild(resource);
    }

    button.append(category, content);
    button.addEventListener("click", () => {
      renderQuestionCard(question);
      questionCardDisplayEl.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    questionSearchResultsEl.appendChild(button);
  });
}

// ==========================================
// 邏輯 D: 占卜版 (Divination)
// ==========================================
function renderFullDeck() {
  if(!cardSpread) return;
  cardSpread.innerHTML = "";
  selectedIndices = [];

  document.getElementById("divinationFullResults").style.display = "none";
  testCardDetail.style.display = "block";
  testCardDetail.innerHTML = "<p>準備中...</p>";

  updateSelectionUI();

  const shuffledIndices = [...Array(currentCardPool.length).keys()].sort(() => Math.random() - 0.5);

  shuffledIndices.forEach((poolIndex) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "mini-card";

    const img = document.createElement("img");
    img.src = CARD_BACKS.default; // 占卜版使用預設牌背
    img.alt = "Card Back";
    img.ondragstart = () => false;
    cardDiv.appendChild(img);

    cardDiv.onclick = () => handleSelect(poolIndex, cardDiv);
    cardSpread.appendChild(cardDiv);
  });
}

function handleSelect(poolIndex, element) {
  if (selectedIndices.includes(poolIndex)) {
    selectedIndices = selectedIndices.filter(i => i !== poolIndex);
    element.classList.remove("selected");
  } else if (selectedIndices.length < 6) {
    selectedIndices.push(poolIndex);
    element.classList.add("selected");
  }
  updateSelectionUI();
}

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
      const card = currentCardPool[cardIdx];
      const cardDiv = document.createElement("div");
      cardDiv.className = "result-card-unit";

      cardDiv.innerHTML = `
        <h4>第 ${i + 1} 張：${card.name || "未命名"}</h4>
        <p class="result-text">${card.description || ""}</p>
      `;
      container.appendChild(cardDiv);
    });

    resultsArea.scrollIntoView({ behavior: 'smooth' });
  }
}

// ==========================================
// 共用輔助函式
// ==========================================
function setStatus(message) {
  if(statusTextEl) statusTextEl.textContent = message;
}

function setDrawEnabled(enabled) {
  if(drawButtonEl) drawButtonEl.disabled = !enabled;
  if(drawButtonTextOnlyEl) drawButtonTextOnlyEl.disabled = !enabled;
  if(drawQuestionButtonEl) drawQuestionButtonEl.disabled = !enabled;
}

function updateImageVisibility() {
  if (!cardImageEl.src) return;
  cardImageWrapperEl.style.display = toggleImageEl.checked ? "block" : "none";
}

function renderCardList(pool) {
  if (!cardListEl) return;
  cardListEl.innerHTML = "";
  pool.forEach((card, idx) => {
    const btn = document.createElement("button");
    btn.className = "cardlist-item";
    btn.type = "button";
    btn.textContent = card.name ? card.name : `未命名卡牌 #${idx + 1}`;
    btn.addEventListener("click", () => {
      renderCardSimple(card);
      if (cardListPanelEl) cardListPanelEl.open = false;
    });
    cardListEl.appendChild(btn);
  });
}
