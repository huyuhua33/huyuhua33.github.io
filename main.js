// main.js

// === 設定區 ===
const IMAGE_BASE_PATH = "./imgs";

const CARD_BACKS = {
  classic_zh: `${IMAGE_BASE_PATH}/zh_cards_Back.png`,
  classic_jp: `${IMAGE_BASE_PATH}/jp_cards_Back.png`,
  hwLight: `${IMAGE_BASE_PATH}/HW_Cover_Light.png`,
  hwDark: `${IMAGE_BASE_PATH}/HW_Cover_Dark.png`
};

// === 多國語系字典 ===
const UI_TEXTS = {
  zh: {
    ui_title: "經典卡抽卡",
    ui_source_classic: "經典卡",
    ui_source_hidden: "隱言經",
    ui_source_questions: "反思提問",
    ui_mode_simple: "簡單模式",
    ui_mode_divination: "占卜模式",
    ui_draw_btn: "抽卡",
    ui_cardlist_summary: "卡牌清單",
    ui_divination_hint: "請憑直覺挑選 6 張卡片",
    ui_divination_result_title: "✦ 您的占卜結果 ✦",
    ui_divination_reset: "重新挑選",
    ui_status_init: "正在初始化...",
    ui_status_loading: "正在載入資料...",
    ui_status_error: "資料載入失敗，請稍後再試。",
    ui_image_toggle: "顯示卡牌圖片（若有）",
    ui_theme_light: "淺色",
    ui_theme_dark: "深色",
    question_deck_aria: "抽一個反思問題",
    question_deck_alt: "反思提問卡背面",
    question_card_title: "給自己一點思考的空間",
    question_prompt: "點擊上方卡組或下方按鈕，抽一個此刻值得思考的問題。",
    question_note: "不急著找到答案，先留意心裡浮現了什麼。",
    question_draw_btn: "抽問題",
    question_search_title: "搜尋問題",
    question_search_label: "依主題、來源或關鍵字尋找",
    question_search_placeholder: "例如：服務、社區、B13",
    question_category_fallback: "反思提問",
    question_unavailable: "這個問題正在整理中。",
    question_resource_prefix: "資料來源：",
    question_search_empty: "沒有符合的問題，試試其他關鍵字。",
    question_status_loaded: count => `已載入反思提問：共 ${count} 個問題。`,
    question_search_available: count => `可搜尋 ${count} 個問題。`,
    question_search_found: count => `找到 ${count} 個問題。`,
    question_search_limited: count => `找到 ${count} 個問題，顯示前 12 個。`,
    card_status_loaded: count => `已載入牌庫：共 ${count} 張。`
  },
  jp: {
    ui_title: "聖典カード",
    ui_source_classic: "聖典カード",
    ui_source_hidden: "隠言経",
    ui_source_questions: "振り返りの質問",
    ui_mode_simple: "シンプル",
    ui_mode_divination: "占いモード",
    ui_draw_btn: "カードを引く",
    ui_cardlist_summary: "カードリスト",
    ui_divination_hint: "直感で6枚のカードを選んでください",
    ui_divination_result_title: "✦ 占い結果 ✦",
    ui_divination_reset: "もう一度選ぶ",
    ui_status_init: "初期化中...",
    ui_status_loading: "データを読み込んでいます...",
    ui_status_error: "データを読み込めませんでした。しばらくしてからもう一度お試しください。",
    ui_image_toggle: "カード画像を表示（ある場合）",
    ui_theme_light: "ライト",
    ui_theme_dark: "ダーク",
    question_deck_aria: "振り返りの質問を引く",
    question_deck_alt: "振り返りの質問カードの裏面",
    question_card_title: "自分自身に考える余白を",
    question_prompt: "上のカードの山か下のボタンを押して、今向き合いたい問いを一つ引いてください。",
    question_note: "答えを急がず、心に浮かぶものにそっと気づいてみましょう。",
    question_draw_btn: "質問を引く",
    question_search_title: "質問を検索",
    question_search_label: "テーマ、出典、キーワードで検索",
    question_search_placeholder: "例：奉仕、共同体、B13",
    question_category_fallback: "振り返りの質問",
    question_unavailable: "この質問は準備中です。",
    question_resource_prefix: "出典：",
    question_search_empty: "一致する質問がありません。別のキーワードをお試しください。",
    question_status_loaded: count => `振り返りの質問を ${count} 件読み込みました。`,
    question_search_available: count => `${count} 件の質問を検索できます。`,
    question_search_found: count => `${count} 件の質問が見つかりました。`,
    question_search_limited: count => `${count} 件見つかりました。最初の12件を表示しています。`,
    card_status_loaded: count => `カードを ${count} 枚読み込みました。`
  },
  en: {
    ui_title: "Scripture Cards",
    ui_source_classic: "Scripture Cards",
    ui_source_hidden: "Hidden Words",
    ui_source_questions: "Reflection Questions",
    ui_mode_simple: "Simple",
    ui_mode_divination: "Divination",
    ui_draw_btn: "Draw Card",
    ui_cardlist_summary: "Card List",
    ui_divination_hint: "Follow your intuition and pick 6 cards",
    ui_divination_result_title: "✦ Your Reading ✦",
    ui_divination_reset: "Start Over",
    ui_status_init: "Initializing...",
    ui_status_loading: "Loading data...",
    ui_status_error: "The data could not be loaded. Please try again later.",
    ui_image_toggle: "Show card images when available",
    ui_theme_light: "Light",
    ui_theme_dark: "Dark",
    question_deck_aria: "Draw a reflection question",
    question_deck_alt: "Back of a reflection question card",
    question_card_title: "Give yourself space to reflect",
    question_prompt: "Tap the deck above or the button below to draw a question worth reflecting on now.",
    question_note: "There is no need to rush toward an answer. First notice what arises within you.",
    question_draw_btn: "Draw a Question",
    question_search_title: "Search Questions",
    question_search_label: "Search by theme, source, or keyword",
    question_search_placeholder: "For example: service, community, B13",
    question_category_fallback: "Reflection Question",
    question_unavailable: "This question is being prepared.",
    question_resource_prefix: "Source: ",
    question_search_empty: "No questions matched. Try another keyword.",
    question_status_loaded: count => `Loaded ${count} reflection questions.`,
    question_search_available: count => `${count} questions available to search.`,
    question_search_found: count => `Found ${count} questions.`,
    question_search_limited: count => `Found ${count} questions. Showing the first 12.`,
    card_status_loaded: count => `Loaded ${count} cards.`
  },
  kr: {
    ui_title: "클래식 카드 뽑기",
    ui_source_classic: "경전 카드",
    ui_source_hidden: "숨겨진 말씀",
    ui_source_questions: "성찰 질문",
    ui_mode_simple: "일반 모드",
    ui_mode_divination: "점술 모드",
    ui_draw_btn: "카드 뽑기",
    ui_cardlist_summary: "카드 목록",
    ui_divination_hint: "직감에 따라 6장의 카드를 선택하세요",
    ui_divination_result_title: "✦ 당신의 점술 결과 ✦",
    ui_divination_reset: "다시 선택하기",
    ui_status_init: "초기화 중...",
    ui_status_loading: "데이터를 불러오는 중...",
    ui_status_error: "데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
    ui_image_toggle: "카드 이미지 표시(있는 경우)",
    ui_theme_light: "라이트",
    ui_theme_dark: "다크",
    question_deck_aria: "성찰 질문 뽑기",
    question_deck_alt: "성찰 질문 카드 뒷면",
    question_card_title: "자신에게 생각할 여백을 주세요",
    question_prompt: "위의 카드 더미나 아래 버튼을 눌러 지금 성찰할 질문 하나를 뽑아 보세요.",
    question_note: "답을 서두르지 말고, 먼저 마음속에 떠오르는 것을 살펴보세요.",
    question_draw_btn: "질문 뽑기",
    question_search_title: "질문 검색",
    question_search_label: "주제, 출처 또는 키워드로 검색",
    question_search_placeholder: "예: 봉사, 공동체, B13",
    question_category_fallback: "성찰 질문",
    question_unavailable: "이 질문은 준비 중입니다.",
    question_resource_prefix: "출처: ",
    question_search_empty: "일치하는 질문이 없습니다. 다른 키워드로 검색해 보세요.",
    question_status_loaded: count => `성찰 질문 ${count} 개를 불러왔습니다.`,
    question_search_available: count => `${count} 개의 질문을 검색할 수 있습니다.`,
    question_search_found: count => `${count} 개의 질문을 찾았습니다.`,
    question_search_limited: count => `${count} 개를 찾았습니다. 처음 12개를 표시합니다.`,
    card_status_loaded: count => `카드 ${count} 장을 불러왔습니다.`
  }
};

// === 狀態管理 (核心) ===
let appState = {
  lang: "zh",      // zh | jp | en | kr
  source: "classic",// classic | hidden | questions
  mode: "simple"    // simple | divination
};

let currentCardPool = []; 
let dataCache = {};       
let isLoading = false;
let selectedIndices = [];
let lastQuestionId = null;
let dataRequestId = 0;

// === DOM 取得 ===
const drawButtonEl = document.getElementById("drawButton");
const statusTextEl = document.getElementById("statusText");
const toggleImageEl = document.getElementById("toggleImage");
const mainStatusSection = document.getElementById("mainStatusSection");
const imageToggleContainer = document.getElementById("imageToggleContainer");
const themeToggleCheckbox = document.getElementById("themeToggleCheckbox");

const simpleModeGroup = document.getElementById("simpleModeGroup");
const textOnlyModeGroup = document.getElementById("textOnlyModeGroup");
const divinationModeDisplay = document.getElementById("divinationModeDisplay");
const modeControl = document.getElementById("modeControl");

// 新增取得卡片顯示區塊容器
const cardDisplayEl = document.getElementById("cardDisplay");
const textCardDisplayEl = document.getElementById("textCardDisplay");

// 簡單版 (經典卡 - 有圖片) 元素
const cardNameEl = document.getElementById("cardName");
const cardDescriptionEl = document.getElementById("cardDescription");
const cardImageEl = document.getElementById("cardImage");
const cardImageWrapperEl = document.getElementById("cardImageWrapper");

// 純文字版 (隱言經 - 無圖片) 元素
const deckTextOnlyImg = document.querySelector('#deckTextOnly img');
const textCardNameEl = document.getElementById("textCardName");
const textCardDescriptionEl = document.getElementById("textCardDescription");
const drawButtonTextOnlyEl = document.getElementById("drawButtonTextOnly");

// 占卜版元素
const cardSpread = document.getElementById("cardSpread");
const selectionCounter = document.getElementById("selectionCounter");

// 反思提問模式元素
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
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener("change", (e) => {
      const name = e.target.name; 
      const value = e.target.value;
      handleStateChange(name, value);
    });
  });

  if(drawButtonEl) drawButtonEl.addEventListener("click", onDrawCard);
  if(drawButtonTextOnlyEl) drawButtonTextOnlyEl.addEventListener("click", onDrawCard);
  document.getElementById("deck")?.addEventListener("click", onDrawCard);
  document.getElementById("deckTextOnly")?.addEventListener("click", onDrawCard);

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

  if(toggleImageEl) toggleImageEl.addEventListener("change", updateImageVisibility);
  if(themeToggleCheckbox) {
    themeToggleCheckbox.addEventListener("change", (e) => {
      if (e.target.checked) document.body.setAttribute("data-theme", "dark");
      else document.body.removeAttribute("data-theme");
      updateCardBackImage();
    });
  }

  validateAndApplyState();
});

// === 核心：處理三層選單的變化 ===
function handleStateChange(category, value) {
  appState[category] = value;
  validateAndApplyState();
}

function updateUILanguage() {
  const lang = appState.lang;
  const texts = UI_TEXTS[lang] || UI_TEXTS.zh;
  const htmlLangs = { zh: "zh-Hant", jp: "ja", en: "en", kr: "ko" };

  document.documentElement.lang = htmlLangs[lang] || htmlLangs.zh;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (typeof texts[key] === "string") el.textContent = texts[key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (typeof texts[key] === "string") el.placeholder = texts[key];
  });

  document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria-label');
    if (typeof texts[key] === "string") el.setAttribute("aria-label", texts[key]);
  });

  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    const key = el.getAttribute('data-i18n-alt');
    if (typeof texts[key] === "string") el.alt = texts[key];
  });

  if (appState.mode === 'divination') updateSelectionUI(); 
  if (isLoading) setStatus(texts.ui_status_init);
}

// === 防呆機制與狀態套用 ===
function validateAndApplyState() {
  const { lang } = appState;

  const classicRadio = document.getElementById('source-classic');
  const hiddenRadio = document.getElementById('source-hidden');
  const questionRadio = document.getElementById('source-questions');
  const classicLabel = document.querySelector('label[for="source-classic"]');

  // 每次切換前，先還原經典卡標籤的顯示狀態
  if (classicLabel) classicLabel.style.display = "";

  if (lang === 'en' || lang === 'kr') {
    // 英文與韓文：無經典卡 (隱藏選項標籤，保留隱言經)
    classicRadio.disabled = true;
    if(classicLabel) classicLabel.style.display = "none";
    hiddenRadio.disabled = false;
    questionRadio.disabled = false;
    if (appState.source === 'classic') appState.source = 'hidden';
  } else {
    // 繁中和日文：皆有
    classicRadio.disabled = false;
    hiddenRadio.disabled = false;
    questionRadio.disabled = false;
  }

  // 反思提問是內容來源，不使用抽卡／占卜模式選項。
  if (appState.source === "questions") appState.mode = "simple";

  // 確保切換語系或來源時，重置卡片顯示區塊為隱藏狀態
  resetDisplays();

  document.getElementById(`source-${appState.source}`).checked = true;
  document.getElementById(`mode-${appState.mode}`).checked = true;

  updateUILanguage();
  updateLayout();
  loadData();
}

function updateLayout() {
  const { mode, source } = appState;
  selectedIndices = []; 

  if (modeControl) modeControl.hidden = source === "questions";

  simpleModeGroup.style.display = "none";
  textOnlyModeGroup.style.display = "none";
  divinationModeDisplay.style.display = "none";
  questionModeGroup.style.display = "none";

  if (source === "questions") {
    questionModeGroup.style.display = "flex";
    mainStatusSection.style.display = "flex";
    imageToggleContainer.style.display = "none";
  } else if (mode === "divination") {
    divinationModeDisplay.style.display = "block";
    mainStatusSection.style.display = "none";
  } else {
    mainStatusSection.style.display = "flex";
    
    if (source === "hidden") {
      textOnlyModeGroup.style.display = "flex";
      imageToggleContainer.style.display = "none"; 
    } else {
      simpleModeGroup.style.display = "flex";
      imageToggleContainer.style.display = "inline-flex";
    }
  }

  updateCardBackImage();
}

function getTargetJsonPath() {
  const { lang, source } = appState;
  if (source === 'questions') {
    const questionFiles = {
      zh: './questions.json',
      jp: './questions_jp.json',
      en: './questions_en.json',
      kr: './questions_kr.json'
    };
    return questionFiles[lang] || questionFiles.zh;
  }

  if (source === 'classic') {
    if (lang === 'zh') return './cards_filled.json';
    if (lang === 'jp') return './cards_jp.json';
  } else if (source === 'hidden') {
    if (lang === 'zh') return './hidden_words_zh.json';
    if (lang === 'jp') return './hidden_words_jp.json';
    if (lang === 'en') return './hidden_words_en.json';
    if (lang === 'kr') return './hidden_words_kr.json';
  }
  return './cards_filled.json'; 
}

async function loadData() {
  const requestId = ++dataRequestId;
  isLoading = true;
  const texts = UI_TEXTS[appState.lang] || UI_TEXTS.zh;
  setStatus(texts.ui_status_loading);
  setDrawEnabled(false);
  if (questionSearchInputEl) questionSearchInputEl.disabled = true;

  const targetUrl = getTargetJsonPath();

  if (dataCache[targetUrl]) {
    if (requestId !== dataRequestId) return;
    currentCardPool = dataCache[targetUrl];
    onDataLoaded();
    isLoading = false;
    return;
  }

  try {
    const res = await fetch(targetUrl, { cache: "no-store" });
    if (!res.ok) throw new Error("Fetch failed");
    const data = await res.json();
    dataCache[targetUrl] = data;
    if (requestId !== dataRequestId) return;
    currentCardPool = data;
    onDataLoaded();
  } catch (e) {
    console.error(e);
    if (requestId === dataRequestId) {
      setStatus(texts.ui_status_error);
    }
  } finally {
    if (requestId === dataRequestId) isLoading = false;
  }
}

function onDataLoaded() {
  const count = currentCardPool.length;
  const texts = UI_TEXTS[appState.lang] || UI_TEXTS.zh;
  setDrawEnabled(true);

  if (appState.source === "questions") {
    setStatus(texts.question_status_loaded(count));
    if (questionSearchInputEl) questionSearchInputEl.disabled = false;
    renderQuestionSearchResults();
  } else {
    setStatus(texts.card_status_loaded(count));
    renderCardList();
  }

  if (appState.mode === "divination") {
    renderFullDeck();
  }
}

function renderCardList() {
  const cardListContainer = document.getElementById("cardList");
  if (!cardListContainer) return;

  cardListContainer.innerHTML = ""; 

  currentCardPool.forEach((card, index) => {
    const item = document.createElement("div");
    item.className = "cardlist-item";
    item.textContent = card.name || `Card ${index + 1}`;
    
    item.onclick = () => {
      if (appState.source === "hidden") {
        renderCardTextOnly(card);
      } else {
        renderCardWithImage(card);
      }
      // 確保點擊清單時也會顯示卡片區塊
      document.getElementById(appState.source === "hidden" ? "textCardDisplay" : "cardDisplay")?.scrollIntoView({ behavior: 'smooth' });
    };
    
    cardListContainer.appendChild(item);
  });
}

function onDrawCard() {
  if (isLoading || !currentCardPool.length) return;
  const randomIndex = Math.floor(Math.random() * currentCardPool.length);
  const card = currentCardPool[randomIndex];

  if (appState.source === "hidden") {
    renderCardTextOnly(card);
  } else {
    renderCardWithImage(card);
  }
}

function renderCardWithImage(card) {
  // 顯示卡片區塊
  if(cardDisplayEl) cardDisplayEl.style.display = "flex";

  const name = card.name || "未命名卡牌";
  cardNameEl.textContent = name;
  cardDescriptionEl.textContent = card.description || "";

  if (card.image && toggleImageEl.checked) {
    cardImageEl.src = `${IMAGE_BASE_PATH}/${card.image}`;
    cardImageEl.alt = name;
    cardImageWrapperEl.style.display = "block";
  } else {
    cardImageWrapperEl.style.display = "none";
    cardImageEl.removeAttribute("src");
  }

  triggerAnimation(cardNameEl.parentElement);
}

function renderCardTextOnly(card) {
  // 顯示卡片區塊
  if(textCardDisplayEl) textCardDisplayEl.style.display = "flex";

  let prefix = "";
  let suffix = "";
  if (appState.lang === "en") {
    prefix = "Hidden Words No. ";
  } else if (appState.lang === "zh") {
    prefix = "隱言經 第 ";
    suffix = " 條";
  } else if (appState.lang === "jp") {
    prefix = "かくされたる言葉 第 ";
    suffix = " 条";
  } else if (appState.lang === "kr") {
    prefix = "숨겨진 말씀 제 ";
    suffix = " 번";
  }

  let title = `${prefix}${card.name || card.id}${suffix}`;

  textCardNameEl.textContent = title;
  textCardDescriptionEl.textContent = card.description || "";

  triggerAnimation(textCardNameEl.parentElement);
}
function getCurrentBackImage() {
  const { lang, source } = appState;
  const isDarkTheme = document.body.getAttribute("data-theme") === "dark";

  if (source === 'hidden') {
    return isDarkTheme ? CARD_BACKS.hwDark : CARD_BACKS.hwLight;
  } else {
    return (lang === 'jp') ? CARD_BACKS.classic_jp : CARD_BACKS.classic_zh;
  }
}

function updateCardBackImage() {
  const currentBackImg = getCurrentBackImage();
  
  const deckTextOnlyImg = document.querySelector('#deckTextOnly img');
  if (deckTextOnlyImg) deckTextOnlyImg.src = currentBackImg;

  const deckImg = document.querySelector('#deck img');
  if (deckImg) deckImg.src = currentBackImg;

  const questionDeckImg = document.querySelector('#deckQuestion img');
  if (questionDeckImg) questionDeckImg.src = currentBackImg;

  const divinationCards = document.querySelectorAll('#cardSpread .mini-card img');
  divinationCards.forEach(img => {
    img.src = currentBackImg;
  });
}

// ==========================================
// 邏輯 C: 反思提問 (Draw + Search)
// ==========================================
function onDrawQuestion() {
  if (isLoading || !currentCardPool.length || appState.source !== "questions") return;

  const availableQuestions = currentCardPool.length > 1
    ? currentCardPool.filter(question => question.id !== lastQuestionId)
    : currentCardPool;
  const randomIndex = Math.floor(Math.random() * availableQuestions.length);
  renderQuestionCard(availableQuestions[randomIndex]);
}

function renderQuestionCard(question) {
  if (!question) return;

  const texts = UI_TEXTS[appState.lang] || UI_TEXTS.zh;

  lastQuestionId = question.id;
  questionCategoryEl.textContent = question.category || texts.question_category_fallback;
  questionCategoryEl.hidden = false;
  questionTextEl.textContent = question.question || texts.question_unavailable;
  if (question.resource) {
    questionResourceEl.textContent = `${texts.question_resource_prefix}${question.resource}`;
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
  if (!questionSearchInputEl || !questionSearchResultsEl || appState.source !== "questions") return;

  const texts = UI_TEXTS[appState.lang] || UI_TEXTS.zh;
  const searchLocales = { zh: "zh-Hant", jp: "ja", en: "en", kr: "ko" };
  const searchLocale = searchLocales[appState.lang] || searchLocales.zh;
  const query = questionSearchInputEl.value.trim().toLocaleLowerCase(searchLocale);
  questionSearchResultsEl.innerHTML = "";

  if (!query) {
    questionSearchStatusEl.textContent = texts.question_search_available(currentCardPool.length);
    return;
  }

  const terms = query.split(/\s+/).filter(Boolean);
  const matches = currentCardPool.filter(question => {
    const searchableText = [
      question.category,
      question.question,
      question.resource,
      ...(question.keywords || [])
    ].filter(Boolean).join(" ").toLocaleLowerCase(searchLocale);

    return terms.every(term => searchableText.includes(term));
  });

  const visibleMatches = matches.slice(0, 12);
  questionSearchStatusEl.textContent = matches.length > 12
    ? texts.question_search_limited(matches.length)
    : texts.question_search_found(matches.length);

  if (!matches.length) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "question-search-empty";
    emptyMessage.textContent = texts.question_search_empty;
    questionSearchResultsEl.appendChild(emptyMessage);
    return;
  }

  visibleMatches.forEach(question => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "question-result-item";

    const category = document.createElement("span");
    category.className = "question-result-category";
    category.textContent = question.category || texts.question_category_fallback;

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
  if (!cardSpread) return;

  cardSpread.innerHTML = "";
  selectedIndices = [];

  const results = document.getElementById("divinationFullResults");
  if (results) results.style.display = "none";

  updateSelectionUI();

  const currentBackImg = getCurrentBackImage();

  const shuffledIndices = [...Array(currentCardPool.length).keys()]
    .sort(() => Math.random() - 0.5);

  shuffledIndices.forEach((poolIndex) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "mini-card";

    const img = document.createElement("img");
    img.src = currentBackImg;
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
  const lang = appState.lang;
  const texts = UI_TEXTS[lang] || UI_TEXTS.zh;
  
  if(selectionCounter) {
    if (count < 6) {
      selectionCounter.textContent = `${texts.ui_divination_hint} (${count} / 6)`;
    } else {
      selectionCounter.textContent = "✦ Done ✦"; 
    }
  }

  const resultsArea = document.getElementById("divinationFullResults");
  const container = document.getElementById("resultsContainer");

  if (count === 6) {
    resultsArea.style.display = "block";
    resultsArea.querySelector('h3').textContent = texts.ui_divination_result_title;
    resultsArea.querySelector('button').textContent = texts.ui_divination_reset;
    container.innerHTML = "";

selectedIndices.forEach((cardIdx, i) => {
      const card = currentCardPool[cardIdx];
      const cardDiv = document.createElement("div");
      cardDiv.className = "result-card-unit";

      let orderText = `Card ${i + 1}`;
      if(lang === 'zh') orderText = `第 ${i + 1} 張`;
      if(lang === 'jp') orderText = `第 ${i + 1} 枚`;
      if(lang === 'kr') orderText = `제 ${i + 1} 장`;
      
      cardDiv.innerHTML = `
        <h4>${orderText}：${card.name || ""}</h4>
        <p class="result-text">${card.description || ""}</p>
      `;
      container.appendChild(cardDiv);
    });
    
    resultsArea.scrollIntoView({ behavior: 'smooth' });
  } else {
    resultsArea.style.display = "none";
  }
}

function resetDisplays() {
  // 隱藏卡片顯示區塊直到實際抽卡
  if (cardDisplayEl) cardDisplayEl.style.display = "none";
  if (textCardDisplayEl) textCardDisplayEl.style.display = "none";

  if (cardNameEl) cardNameEl.textContent = "";
  if (cardDescriptionEl) cardDescriptionEl.textContent = "";
  if (cardImageWrapperEl) cardImageWrapperEl.style.display = "none";
  if (cardImageEl) cardImageEl.removeAttribute("src");

  if (textCardNameEl) textCardNameEl.textContent = "";
  if (textCardDescriptionEl) textCardDescriptionEl.textContent = "";

  lastQuestionId = null;
  if (questionCategoryEl) {
    questionCategoryEl.textContent = "";
    questionCategoryEl.hidden = true;
  }
  if (questionTextEl) {
    const texts = UI_TEXTS[appState.lang] || UI_TEXTS.zh;
    questionTextEl.textContent = texts.question_prompt;
  }
  if (questionResourceEl) {
    questionResourceEl.textContent = "";
    questionResourceEl.hidden = true;
  }
  if (questionSearchInputEl) questionSearchInputEl.value = "";
  if (questionSearchStatusEl) questionSearchStatusEl.textContent = "";
  if (questionSearchResultsEl) questionSearchResultsEl.innerHTML = "";
  if (questionCardInnerEl) questionCardInnerEl.classList.remove("flip");
}

function triggerAnimation(element) {
  if (!element) return;
  element.classList.remove("flip");
  void element.offsetWidth; 
  element.classList.add("flip");
}

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
