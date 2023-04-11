// navbar disappear on scroll
var prevScrollpos = window.pageYOffset;
window.onscroll = function () {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("header").style.top = "0";
  } else {
    document.getElementById("header").style.top = "-160px";
  }

  prevScrollpos = currentScrollPos;
};

// modal function
const contact_button = document.getElementById("contact_button");
const close = document.getElementById("close");
const modal_container = document.getElementById("modal_container");

contact_button.addEventListener("click", () => {
  modal_container.classList.add("show");
});

close.addEventListener("click", () => {
  modal_container.classList.remove("show");
});

window.onclick = function (event) {
  if (event.target == modal_container) {
    modal_container.classList.remove("show");
  }
};
