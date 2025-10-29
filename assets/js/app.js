// ================================
// Swiper設定
// ================================
const mySwiper = new Swiper('.swiper', {
  slidesPerView: "auto",
  spaceBetween: 0,
  centeredSlides: true,
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
    waitForTransition: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

// ================================
// 定数・変数
// ================================
const header = document.getElementById('header');
const openBtn = document.getElementById('js-header_openBtn');
const closeBtn = document.getElementById('js-header_closeBtn');
const scrollTriggers = document.querySelectorAll('.js-scrollTrigger');
const breakpoint = 768;
const body = document.body;

let scrollPosition = 0;
let isLocked = false;

// ================================
// スクロールロック制御（iOS対応）
// ================================
function preventTouchMove(e) {
  e.preventDefault();
}

function lockScroll() {
  if (isLocked) return;
  isLocked = true;

  body.classList.add('add-scrollLock');
  scrollPosition = window.scrollY;

  Object.assign(body.style, {
    position: 'fixed',
    top: `-${scrollPosition}px`,
    width: '100%',
  });

  document.addEventListener('touchmove', preventTouchMove, { passive: false });
}

function unlockScroll(restore = true) {
  if (!isLocked) return;
  isLocked = false;

  body.classList.remove('add-scrollLock');
  Object.assign(body.style, { position: '', top: '', width: '' });

  if (restore) window.scrollTo(0, scrollPosition);

  document.removeEventListener('touchmove', preventTouchMove);
}

// ================================
// ヘッダー開閉制御
// ================================
function openHeader() {
  if (window.innerWidth < breakpoint) {
    header.classList.add('add-active');
    lockScroll();
  }
}

function closeHeader() {
  header.classList.remove('add-active');
  unlockScroll();
}

// ウィンドウ幅に応じたヘッダー状態更新
function updateHeaderState() {
  const isPC = window.innerWidth >= breakpoint;

  if (isPC) {
    header.classList.add('add-active');
    unlockScroll(false); // ページ位置を維持したまま解除
  } else {
    header.classList.remove('add-active');
    unlockScroll(false);
  }
}

// ================================
// スムーススクロール
// ================================
function smoothScrollTo(targetY, duration = 600) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  function step(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const ease = 0.5 - Math.cos(progress * Math.PI) / 2; // イージング
    window.scrollTo(0, startY + distance * ease);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function scrollToSection(targetId) {
  const targetEl = document.querySelector(targetId);
  if (!targetEl) return;

  const headerHeight = header?.offsetHeight || 0;
  const targetY = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;

  smoothScrollTo(targetY, 700);
}

function onScrollTriggerClick(e) {
  const targetId = e.currentTarget.getAttribute('href');
  if (!targetId?.startsWith('#')) return;
  e.preventDefault();

  if (window.innerWidth < breakpoint) closeHeader();

  // iOS Safari対策で少し遅延
  setTimeout(() => scrollToSection(targetId), 100);
}

// ================================
// イベント登録
// ================================
function addEventListeners() {
  window.addEventListener('resize', updateHeaderState);
  openBtn?.addEventListener('click', openHeader);
  closeBtn?.addEventListener('click', closeHeader);
  scrollTriggers.forEach(trigger =>
    trigger.addEventListener('click', onScrollTriggerClick)
  );
}

// ================================
// 初期化
// ================================
function initHeader() {
  updateHeaderState();
  addEventListeners();
}

initHeader();


// ================================
// フェードイン制御
// ================================
const fadeTargets = document.querySelectorAll('.js-fadeTarget');

function handleIntersection(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add('add-visible');
    observer.unobserve(entry.target); // 一度だけ発火
  });
}

function initFadeInObserver() {
  if (!fadeTargets.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px', // 正確な発火位置
    threshold: 0,
  };

  const observer = new IntersectionObserver(handleIntersection, observerOptions);
  fadeTargets.forEach(target => observer.observe(target));
}

initFadeInObserver();

window.addEventListener('load', () => {
  const kvFadeEl = document.querySelector('.js-kvFade');
  if (kvFadeEl) {
    kvFadeEl.classList.add('add-visible');
  }
});