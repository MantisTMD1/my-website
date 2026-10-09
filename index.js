// // navbar disappear on scroll
// var prevScrollpos = window.pageYOffset;
// window.onscroll = function () {
//   var currentScrollPos = window.pageYOffset;
//   if (prevScrollpos > currentScrollPos) {
//     document.getElementById("header").style.top = "0";
//   } else {
//     document.getElementById("header").style.top = "-160px";
//   }

//   prevScrollpos = currentScrollPos;
// };

// mobile hamburger menu
const navToggle = document.getElementById("nav_toggle");
const headerEl = document.getElementById("header");

const closeMenu = () => {
  headerEl.classList.remove("menu-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open menu");
};

navToggle.addEventListener("click", () => {
  const open = headerEl.classList.toggle("menu-open");
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

// close after picking a link, tapping outside, or pressing Escape
document.querySelectorAll(".main-nav a, .nav-brand").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("click", (event) => {
  if (!headerEl.contains(event.target)) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

// modal function
const contact_button = document.getElementById("contact_button");
const close = document.getElementById("close");
const modal_container = document.getElementById("modal_container");

const openModal = (event) => {
  event.preventDefault();
  closeMenu();
  modal_container.classList.add("show");
};

contact_button.addEventListener("click", openModal);
document.getElementById("nav_contact").addEventListener("click", openModal);
document.getElementById("hero_contact").addEventListener("click", openModal);

close.addEventListener("click", () => {
  modal_container.classList.remove("show");
});

window.onclick = function (event) {
  if (event.target == modal_container) {
    modal_container.classList.remove("show");
  }
};

// contact form: send through EmailJS (https://dashboard.emailjs.com)
// These IDs are safe to publish; EmailJS restricts sending to your allowed domains.
const EMAILJS_PUBLIC_KEY = "cA4H0KyRX1ynWGzRz";
const EMAILJS_SERVICE_ID = "service_meiipo8";
const EMAILJS_TEMPLATE_ID = "template_1992";

const contactForm = document.getElementById("contact_form");
const formStatus = document.getElementById("form_status");
const submitButton = document.getElementById("submit-button");

const setStatus = (message, type) => {
  formStatus.textContent = message;
  formStatus.className = `form-status ${type || ""}`;
};

if (window.emailjs && EMAILJS_PUBLIC_KEY) {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!window.emailjs || !EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
    setStatus("Sorry, the form isn't working right now. Please email me directly instead.", "error");
    return;
  }

  submitButton.disabled = true;
  submitButton.value = "Sending...";
  setStatus("", "");

  emailjs
    .sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm)
    .then(() => {
      contactForm.reset();
      setStatus("Thanks for reaching out! I'll get back to you soon.", "success");
    })
    .catch((error) => {
      console.error("EmailJS error:", error);
      setStatus("Sorry, your message couldn't be sent. Please try again or email me directly.", "error");
    })
    .finally(() => {
      submitButton.disabled = false;
      submitButton.value = "Send";
    });
});

// navbar: darken once the page is scrolled
const updateHeader = () => headerEl.classList.toggle("scrolled", window.scrollY > 10);
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

// navbar: highlight the link for the section currently in view
const navLinks = document.querySelectorAll('.main-nav a[href^="#"]:not(#nav_contact)');
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) =>
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`)
      );
    });
  },
  { rootMargin: "-50% 0px -50% 0px" }
);
["home", "about-me__container", "tech-sect__container", "projects-sect__container"].forEach((id) => {
  const section = document.getElementById(id);
  if (section) sectionObserver.observe(section);
});

// footer: keep the copyright year current
document.getElementById("footer_year").textContent = new Date().getFullYear();
