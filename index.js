// lets CSS hide .reveal elements only when JS is running to show them again
document.documentElement.classList.add("js");

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
  document.body.classList.remove("menu-locked");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open menu");
};

navToggle.addEventListener("click", () => {
  const open = headerEl.classList.toggle("menu-open");
  document.body.classList.toggle("menu-locked", open);
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

// buttons that open the contact form with a message already written
const contactPrefills = {
  "beta-tester":
    "Hi Evan, I'd like to beta test Recipe Rescue on iPhone. Please send a TestFlight invite to the email above.",
};

// if the form is closed without editing a pre-written message, clear it so the next open starts fresh
const clearUnusedPrefill = () => {
  const message = document.getElementById("message");
  if (Object.values(contactPrefills).includes(message.value)) message.value = "";
};

document.querySelectorAll("[data-contact-prefill]").forEach((button) => {
  button.addEventListener("click", (event) => {
    const message = document.getElementById("message");
    message.value = contactPrefills[button.dataset.contactPrefill] || "";
    openModal(event);
    document.getElementById("name").focus();
  });
});

contact_button.addEventListener("click", openModal);
document.getElementById("nav_contact").addEventListener("click", openModal);
document.getElementById("hero_contact").addEventListener("click", openModal);
document.getElementById("about_contact").addEventListener("click", openModal);

close.addEventListener("click", () => {
  modal_container.classList.remove("show");
  clearUnusedPrefill();
});

window.onclick = function (event) {
  if (event.target == modal_container) {
    modal_container.classList.remove("show");
    clearUnusedPrefill();
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

// reveal elements as they scroll into view
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// in-page links: scroll smoothly without adding #section to the URL
document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.defaultPrevented) return;

  event.preventDefault();
  const id = link.getAttribute("href").slice(1);
  const target = id && id !== "home" ? document.getElementById(id) : null;

  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

// arriving with an old #section link still lands there, then the URL is cleaned up
if (window.location.hash) {
  const landing = document.getElementById(window.location.hash.slice(1));
  history.replaceState(null, "", window.location.pathname + window.location.search);
  if (landing) {
    // jump once on load, then again after late fonts and images have shifted the layout
    const jump = () => landing.scrollIntoView({ behavior: "instant" });
    window.addEventListener("load", () => {
      jump();
      setTimeout(jump, 400);
    });
  }
}
