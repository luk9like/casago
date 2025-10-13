// FAQ Accordion Functionality
document.addEventListener("DOMContentLoaded", function () {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    if (!question) return;

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      // Optional: Close all other items (Accordion behavior)
      // faqItems.forEach(otherItem => {
      //     if (otherItem !== item) {
      //         otherItem.classList.remove('is-open');
      //         otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      //     }
      // });

      // Toggle current item
      if (isOpen) {
        item.classList.remove("is-open");
        question.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("is-open");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });

  // Optional: Keyboard navigation
  const questions = document.querySelectorAll(".faq-question");

  questions.forEach((question, index) => {
    question.addEventListener("keydown", (e) => {
      // Arrow Down - Next question
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextQuestion = questions[index + 1];
        if (nextQuestion) nextQuestion.focus();
      }

      // Arrow Up - Previous question
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevQuestion = questions[index - 1];
        if (prevQuestion) prevQuestion.focus();
      }

      // Home - First question
      if (e.key === "Home") {
        e.preventDefault();
        questions[0].focus();
      }

      // End - Last question
      if (e.key === "End") {
        e.preventDefault();
        questions[questions.length - 1].focus();
      }
    });
  });
});
