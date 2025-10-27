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

// ================================
// スクロールロック制御（iOS対応）
// ================================
function preventTouchMove(e) {
  e.preventDefault();
}

function lockScroll() {
  body.classList.add('add-scrollLock');
  scrollPosition = window.scrollY;
  Object.assign(body.style, {
    position: 'fixed',
    top: `-${scrollPosition}px`,
    width: '100%',
  });
  document.addEventListener('touchmove', preventTouchMove, { passive: false });
}

function unlockScroll() {
  body.classList.remove('add-scrollLock');
  Object.assign(body.style, { position: '', top: '', width: '' });
  window.scrollTo(0, scrollPosition);
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

function updateHeaderState() {
  if (window.innerWidth >= breakpoint) {
    header.classList.add('add-active');
    unlockScroll();
  } else {
    header.classList.remove('add-active');
    unlockScroll();
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
    const ease = 0.5 - Math.cos(progress * Math.PI) / 2;
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

  setTimeout(() => scrollToSection(targetId), 100);
}

function addEventListeners() {
  window.addEventListener('resize', updateHeaderState);
  openBtn?.addEventListener('click', openHeader);
  closeBtn?.addEventListener('click', closeHeader);
  scrollTriggers.forEach((trigger) =>
    trigger.addEventListener('click', onScrollTriggerClick)
  );
}

function initHeader() {
  updateHeaderState();
  addEventListeners();
}

initHeader();
