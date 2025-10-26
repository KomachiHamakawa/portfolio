const mySwiper = new Swiper('.swiper', {
  slidesPerView: "auto",
  spaceBetween: 0,
  centeredSlides: true,
  loop: true,  // 無限ループさせる
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
    waitForTransition: false, 
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    type: 'bullets'
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});