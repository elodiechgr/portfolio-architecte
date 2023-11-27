let modal = null;
const focusableSelector = "button, a, input, textarea";
let focusables = [];
const addPhotoButton = document.getElementById("addPhotoButton");
const uploadButton = document.getElementById("uploadButton");
let userToken = localStorage.getItem("userToken");

const projectsContainerModal = document.getElementById(
  "projects-container-modal"
);

fetch("http://localhost:5678/api/works")
  .then((response) => {
    return response.json();
  })
  .then((works) => {
    console.log(works);
    for (const work of works) {
      const liElement = document.createElement("div");
      liElement.innerHTML = `
      <div class="gallery-item">
      <img src="${work.imageUrl}" alt="Image">
      <i class="fa-solid fa-trash-can delete-icon" style="color: #ffffff;" data-id="${work.id}"></i>
      </div>
  `;
      projectsContainerModal.appendChild(liElement);
      const deleteIcon = liElement.querySelector(".delete-icon");
      deleteIcon.addEventListener("click", () => deletePhoto(work.id));
    }

    //getCategories();
  });

const openModal = function (e) {
  e.preventDefault();
  modal = document.querySelector(e.target.getAttribute("href"));
  focusables = Array.from(modal.querySelectorAll(focusableSelector));
  modal.style.display = null;
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-close-modal").addEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);
};

const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal
    .querySelector(".js-close-modal")
    .removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .removeEventListener("click", stopPropagation);
  modal = null;
};

const stopPropagation = function (e) {
  e.stopPropagation();
  document.querySelector(".step1").addEventListener("click", stopPropagation);
  document.querySelector(".step2").addEventListener("click", stopPropagation);
};

const focusInModal = function (e) {
  e.preventDefault();
  let index = focusables.findIndex((f) => f === modal.querySelector(":focus"));
  index++;
  if (index >= focusables.length) {
    index = 0;
  }
  focusables[index].focus();
};

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
  if (e.key === "Tab" && modal !== null) {
    focusInModal(e);
  }
});

addPhotoButton.addEventListener("click", () => {
  // Masquer l'étape 1 et afficher l'étape 2
  document.querySelector(".step1").style.display = "none";
  document.querySelector(".step2").style.display = "block";
});

// Icon trash + suppression photo

const deletePhoto = (id) => {
  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de la photo");
      }
      return response.json();
    })
    .then(() => {
      // Supprimer l'élément de la galerie modal
      const deletedElement = projectsContainerModal.querySelector(
        `[data-id="${id}"]`
      );
      if (deletedElement) {
        deletedElement.remove();
      }
    })
    .catch((error) => console.error(error));
};

// Envoi travaux

document.addEventListener("DOMContentLoaded", function () {
  const uploadButton = document.getElementById("uploadButton");
  const projectPhotoInput = document.getElementById("project-photo");
  const projectTitleInput = document.getElementById("project-title");
  const projectCategorySelect = document.getElementById("project-category");

  // Fonction de validation du formulaire
  const validateForm = () => {
    const isPhotoSelected = projectPhotoInput.files.length > 0;
    const isTitleFilled = projectTitleInput.value.trim() !== "";
    const isCategorySelected = projectCategorySelect.value !== "";

    const isFormValid = isPhotoSelected && isTitleFilled && isCategorySelected;

    // Activer ou désactiver le bouton "Valider" en fonction de la validité du formulaire
    uploadButton.disabled = !isFormValid;
    uploadButton.style.backgroundColor = isFormValid ? "#1d6154" : "#a7a7a7";
  };

  // Mettre à jour la validation à chaque changement dans le formulaire
  projectPhotoInput.addEventListener("change", validateForm);
  projectTitleInput.addEventListener("input", validateForm);
  projectCategorySelect.addEventListener("change", validateForm);

  // Appeler la fonction pour mettre à jour l'état initial du bouton
  validateForm();

  const form = document.querySelector(".form-contact");
  const imageInput = document.getElementById("project-photo");

  imageInput.addEventListener("change", previewImage);

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const userToken = localStorage.getItem("userToken");
    const projectTitle = document.getElementById("project-title").value; //(récupération du titre du projet)
    const projectPhoto = document.getElementById("project-photo").files[0]; //(récupération de la photo du projet)
    const projectCategory = parseInt(
      document.getElementById("project-category").value
    ); //(récupération de la catégorie du projet : on convertit l'id en int c'est à dire en nombre)

    const projectData = new FormData();

    projectData.append("image", projectPhoto); //(ajout de la photo du projet dans FormData)

    projectData.append("title", projectTitle); //(ajout du titre du projet dans FormData)

    projectData.append("category", projectCategory); //(ajout de la catégorie du projet dans FormData)

    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userToken}`,
        Accept: "application/json",
      },
      body: projectData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Erreur lors de l'ajout du projet");
        }
      })
      .then((data) => {
        console.log("Projet ajouté avec succès :", data);
        // Réinitialiser le formulaire ou effectuer d'autres actions après l'ajout du projet
        // form.reset();
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout du projet :", error);
        // Gérer l'erreur en conséquence (afficher un message à l'utilisateur, etc.)
      });
  });
});

// Preview image avant envoi

function previewImage() {
  var input = document.getElementById("project-photo");
  var preview = document.getElementById("preview");
  var imagePreview = document.getElementById("imagePreview");
  var iconElement = document.querySelector(".fa-regular.fa-image");
  var formElement = document.getElementById("imageForm");
  var textElement = document.querySelector(".text-ajouter");

  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      preview.src = e.target.result;
      imagePreview.classList.remove("hidden");

      iconElement.style.display = "none";
      formElement.style.display = "none";
      textElement.style.display = "none";
    };

    reader.readAsDataURL(input.files[0]);
  }
}
