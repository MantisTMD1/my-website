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
document.querySelectorAll(".main-nav a").forEach((link) => link.addEventListener("click", closeMenu));
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

close.addEventListener("click", () => {
  modal_container.classList.remove("show");
});

window.onclick = function (event) {
  if (event.target == modal_container) {
    modal_container.classList.remove("show");
  }
};

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
