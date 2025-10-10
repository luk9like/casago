// Import all of Bootstrap's JS
import * as bootstrap from "bootstrap";

import Alert from "bootstrap/js/dist/alert";

// or, specify which plugins you need:
import { Tooltip, Toast, Popover } from "bootstrap";

// Scroll Effect für Header
document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".casago-header");

  if (header) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  // Active Link Highlighting
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (
      href === currentPage ||
      (currentPage === "index.html" && href === "/")
    ) {
      link.classList.add("active");
    }
  });
});

// Portfolio Grid Interactions
document.addEventListener("DOMContentLoaded", function () {
  const portfolioTiles = document.querySelectorAll(".portfolio-tile");

  // Intersection Observer für Scroll-Animationen
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = "running";
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  portfolioTiles.forEach((tile) => {
    observer.observe(tile);
  });

  // Optional: Parallax Effect on Scroll
  //   window.addEventListener("scroll", function () {
  //     const scrolled = window.pageYOffset;
  //     portfolioTiles.forEach((tile, index) => {
  //       const speed = 0.05 * ((index % 3) + 1);
  //       const yPos = -(scrolled * speed);
  //       tile.querySelector(
  //         ".portfolio-tile__image"
  //       ).style.transform = `translateY(${yPos}px) scale(1)`;
  //     });
  //   });
});

// CASAGO Slider Functionality
document.addEventListener("DOMContentLoaded", function () {
  const sliders = document.querySelectorAll(".casago-slider");

  sliders.forEach((slider) => {
    const track = slider.querySelector(".slider-track");
    const prevBtn = slider.querySelector(".slider-nav--prev");
    const nextBtn = slider.querySelector(".slider-nav--next");
    const items = slider.querySelectorAll(".slider-item");

    if (!track || items.length === 0) return;

    let currentIndex = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    // Get item width including gap
    const getItemWidth = () => {
      const item = items[0];
      const gap = parseFloat(getComputedStyle(track).gap) || 24;
      return item.offsetWidth + gap;
    };

    // Update slider position
    const updateSlider = (animate = true) => {
      const itemWidth = getItemWidth();
      const newTranslate = -currentIndex * itemWidth;

      if (animate) {
        track.style.transition = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
      } else {
        track.style.transition = "none";
      }

      track.style.transform = `translateX(${newTranslate}px)`;
      currentTranslate = newTranslate;
      prevTranslate = newTranslate;

      // Update button states
      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn)
        nextBtn.disabled = currentIndex >= items.length - getVisibleItems();
    };

    // Get number of visible items based on viewport
    const getVisibleItems = () => {
      const sliderWidth = slider.querySelector(".slider-wrapper").offsetWidth;
      const itemWidth = getItemWidth();
      return Math.floor(sliderWidth / itemWidth);
    };

    // Navigation
    const goToPrev = () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    };

    const goToNext = () => {
      const maxIndex = items.length - getVisibleItems();
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateSlider();
      }
    };

    // Event Listeners
    if (prevBtn) prevBtn.addEventListener("click", goToPrev);
    if (nextBtn) nextBtn.addEventListener("click", goToNext);

    // Touch/Mouse Drag
    const wrapper = slider.querySelector(".slider-wrapper");

    const dragStart = (e) => {
      isDragging = true;
      startPos = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
      wrapper.style.cursor = "grabbing";
    };

    const dragMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();

      const currentPosition = e.type.includes("mouse")
        ? e.pageX
        : e.touches[0].clientX;
      const diff = currentPosition - startPos;
      currentTranslate = prevTranslate + diff;

      track.style.transition = "none";
      track.style.transform = `translateX(${currentTranslate}px)`;
    };

    const dragEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      wrapper.style.cursor = "grab";

      const movedBy = currentTranslate - prevTranslate;
      const itemWidth = getItemWidth();

      // Determine direction
      if (
        movedBy < -itemWidth / 3 &&
        currentIndex < items.length - getVisibleItems()
      ) {
        currentIndex++;
      } else if (movedBy > itemWidth / 3 && currentIndex > 0) {
        currentIndex--;
      }

      updateSlider();
    };

    // Mouse events
    wrapper.addEventListener("mousedown", dragStart);
    wrapper.addEventListener("mousemove", dragMove);
    wrapper.addEventListener("mouseup", dragEnd);
    wrapper.addEventListener("mouseleave", dragEnd);

    // Touch events
    wrapper.addEventListener("touchstart", dragStart);
    wrapper.addEventListener("touchmove", dragMove);
    wrapper.addEventListener("touchend", dragEnd);

    // Keyboard navigation
    slider.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    });

    // Resize handler
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        currentIndex = Math.min(currentIndex, items.length - getVisibleItems());
        updateSlider(false);
      }, 250);
    });

    // Initialize
    updateSlider(false);
  });
});
