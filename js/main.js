document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initActivePage();
  initRegistrationForm();
  initCommunityForm();
});

function initNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen);
    toggle.textContent = isOpen ? "✕" : "☰";
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "☰";
    });
  });
}

function initActivePage() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

function initRegistrationForm() {
  const form = document.getElementById("registration-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateRegistrationForm(form)) return;

    const success = document.getElementById("form-success");
    if (success) {
      success.classList.add("show");
      success.textContent =
        "Registration successful! Welcome to DoBu Martial Arts. Check your email for account confirmation.";
    }
    form.reset();
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      const group = field.closest(".form-group");
      if (group?.classList.contains("invalid")) validateField(field);
    });
  });
}

function initCommunityForm() {
  const form = document.getElementById("community-post-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = form.querySelector("#post-title");
    const content = form.querySelector("#post-content");

    let valid = true;
    if (!title.value.trim()) {
      showError(title, "Please enter a post title.");
      valid = false;
    }
    if (!content.value.trim()) {
      showError(content, "Please enter your message.");
      valid = false;
    }
    if (!valid) return;

    const forumList = document.getElementById("forum-posts");
    if (forumList) {
      const post = document.createElement("article");
      post.className = "forum-post";
      post.innerHTML = `
        <span class="forum-tag">New</span>
        <h4>${escapeHtml(title.value.trim())}</h4>
        <p class="forum-meta">Posted by You · Just now</p>
        <p>${escapeHtml(content.value.trim())}</p>
      `;
      forumList.prepend(post);
    }

    form.reset();
    alert("Your post has been published to the community forum!");
  });
}

function validateRegistrationForm(form) {
  let valid = true;
  const fields = form.querySelectorAll("[required]");
  fields.forEach((field) => {
    if (!validateField(field)) valid = false;
  });

  const password = form.querySelector("#password");
  const confirm = form.querySelector("#confirm-password");
  if (password && confirm && password.value !== confirm.value) {
    showError(confirm, "Passwords do not match.");
    valid = false;
  }

  const email = form.querySelector("#email");
  if (email && email.value && !isValidEmail(email.value)) {
    showError(email, "Please enter a valid email address.");
    valid = false;
  }

  return valid;
}

function validateField(field) {
  const group = field.closest(".form-group");
  if (!group) return true;

  group.classList.remove("invalid");

  if (field.hasAttribute("required") && !field.value.trim()) {
    showError(field, "This field is required.");
    return false;
  }

  if (field.type === "email" && field.value && !isValidEmail(field.value)) {
    showError(field, "Please enter a valid email address.");
    return false;
  }

  return true;
}

function showError(field, message) {
  const group = field.closest(".form-group");
  if (!group) return;
  group.classList.add("invalid");
  const errorEl = group.querySelector(".form-error");
  if (errorEl) errorEl.textContent = message;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
