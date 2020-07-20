const button = document.querySelector(".modal-button");
const overlay = document.querySelector(".modal-overlay");

const toggleModal = () => {
  const modal = document.querySelector(".modal");
  modal.classList.toggle("opacity-0");
  modal.classList.toggle("pointer-events-none");
};

button.addEventListener("click", toggleModal);
overlay.addEventListener("click", toggleModal);
