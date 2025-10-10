// Contact Form Handler
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const successMessage = document.getElementById("successMessage");
  const errorMessage = document.getElementById("errorMessage");

  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Hide previous messages
    successMessage.style.display = "none";
    errorMessage.style.display = "none";

    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Disable submit button
    const submitButton = form.querySelector(".form-submit");
    const originalText =
      submitButton.querySelector(".form-submit-text").textContent;
    submitButton.disabled = true;
    submitButton.querySelector(".form-submit-text").textContent =
      "Wird gesendet...";

    try {
      const response = await fetch("/api/contact.php", {
        // ← Pfad angepasst
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json(); // ← Response parsen

      if (response.ok && result.success) {
        // Success
        successMessage.style.display = "flex";
        form.reset();
        successMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else {
        throw new Error(result.error || "Server error");
      }
    } catch (error) {
      errorMessage.style.display = "flex";
      console.error("Form submission error:", error);
    } finally {
      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.querySelector(".form-submit-text").textContent =
        originalText;
    }

    /* 
        // OPTION 2: Alternative - mailto: fallback (für Test/Development)
        // Uncomment this and comment out the fetch above
        
        const mailtoLink = `mailto:info@casago.de?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(
            `Name: ${data.name}\n` +
            `Email: ${data.email}\n` +
            `Telefon: ${data.phone || 'Nicht angegeben'}\n\n` +
            `Nachricht:\n${data.message}`
        )}`;
        
        window.location.href = mailtoLink;
        successMessage.style.display = 'flex';
        form.reset();
        submitButton.disabled = false;
        submitButton.querySelector('.form-submit-text').textContent = originalText;
        */
  });

  // Real-time validation feedback
  const inputs = form.querySelectorAll(
    ".form-input, .form-select, .form-textarea"
  );
  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      if (this.hasAttribute("required") && !this.value.trim()) {
        this.style.borderColor = "rgba(239, 68, 68, 0.5)";
      } else if (
        this.type === "email" &&
        this.value &&
        !isValidEmail(this.value)
      ) {
        this.style.borderColor = "rgba(239, 68, 68, 0.5)";
      } else {
        this.style.borderColor = "";
      }
    });

    input.addEventListener("input", function () {
      this.style.borderColor = "";
    });
  });

  // Email validation helper
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
});
