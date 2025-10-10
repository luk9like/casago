// Hero Slider Functionality
document.addEventListener("DOMContentLoaded", function () {
  const sliders = document.querySelectorAll(".hero-slider");

  sliders.forEach((slider) => {
    const slides = slider.querySelectorAll(".hero-slide");
    const dots = slider.querySelectorAll(".hero-slider__dot");
    const prevBtn = slider.querySelector(".hero-slider__arrow--prev");
    const nextBtn = slider.querySelector(".hero-slider__arrow--next");
    const progressBar = slider.querySelector(".hero-slider__progress-bar");

    if (slides.length === 0) return;

    let currentSlide = 0;
    let autoplayInterval;
    let progressInterval;
    const autoplayDelay = 6000; // 6 seconds
    const progressStep = 100 / (autoplayDelay / 100);

    // Show slide
    function showSlide(index) {
      // Remove active class from all
      slides.forEach((slide) => slide.classList.remove("hero-slide--active"));
      dots.forEach((dot) => dot.classList.remove("hero-slider__dot--active"));

      // Add active class to current
      slides[index].classList.add("hero-slide--active");
      dots[index].classList.add("hero-slider__dot--active");

      currentSlide = index;
      resetProgress();
    }

    // Next slide
    function nextSlide() {
      let next = currentSlide + 1;
      if (next >= slides.length) next = 0;
      showSlide(next);
    }

    // Previous slide
    function prevSlide() {
      let prev = currentSlide - 1;
      if (prev < 0) prev = slides.length - 1;
      showSlide(prev);
    }

    // Progress bar animation
    function animateProgress() {
      if (!progressBar) return;

      let progress = 0;
      progressBar.style.width = "0%";

      progressInterval = setInterval(() => {
        progress += progressStep;
        progressBar.style.width = progress + "%";

        if (progress >= 100) {
          clearInterval(progressInterval);
        }
      }, 100);
    }

    function resetProgress() {
      if (!progressBar) return;
      clearInterval(progressInterval);
      progressBar.style.width = "0%";
      animateProgress();
    }

    // Autoplay
    function startAutoplay() {
      stopAutoplay(); // Clear any existing interval
      autoplayInterval = setInterval(nextSlide, autoplayDelay);
      animateProgress();
    }

    function stopAutoplay() {
      clearInterval(autoplayInterval);
      clearInterval(progressInterval);
    }

    // Event Listeners - Dots
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        showSlide(index);
        stopAutoplay();
        startAutoplay();
      });
    });

    // Event Listeners - Arrows
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        prevSlide();
        stopAutoplay();
        startAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        nextSlide();
        stopAutoplay();
        startAutoplay();
      });
    }

    // Keyboard navigation
    slider.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    });

    // Pause on hover
    slider.addEventListener("mouseenter", stopAutoplay);
    slider.addEventListener("mouseleave", startAutoplay);

    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
      },
      { passive: true }
    );

    slider.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoplay();
      },
      { passive: true }
    );

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }

    // Pause when tab is not visible
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });

    // Initialize
    startAutoplay();
  });
});
