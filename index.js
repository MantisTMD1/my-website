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

// modal function
const contact_button = document.getElementById("contact_button");
const close = document.getElementById("close");
const modal_container = document.getElementById("modal_container");

const openModal = (event) => {
  event.preventDefault();
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
const header = document.getElementById("header");
const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 10);
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
