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
  });

const openModal = function (e) {
  e.preventDefault();
  modal = document.querySelector(e.target.getAttribute("href"));

  // Réinitialiser la modal au "step 1"
  document.querySelector(".step1").style.display = "block";
  document.querySelector(".step2").style.display = "none";

  focusables = Array.from(modal.querySelectorAll(focusableSelector));
  modal.style.display = null;
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-close-modal").addEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);

  updateModal();
};

const closeModal = function (e) {
  if (modal === null) return;
  if (e) {
    e.preventDefault();
  }

  // Supprimer les écouteurs d'événements
  modal.removeEventListener("click", closeModal);
  modal
    .querySelector(".js-close-modal")
    .removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .removeEventListener("click", stopPropagation);

  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");

  // Affecter null à modal après avoir fermé la modale
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

function updateHomeGallery() {
  const homeGallery = document.querySelector(".gallery");

  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((works) => {
      homeGallery.innerHTML = "";

      for (const work of works) {
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        image.src = work.imageUrl;
        image.alt = work.title;
        const figcaption = document.createElement("figcaption");
        figcaption.textContent = work.title;

        figure.appendChild(image);
        figure.appendChild(figcaption);

        homeGallery.appendChild(figure);
        figure.dataset.category = work.category.name;
      }
    })
    .catch((error) =>
      console.error(
        "Erreur lors de la mise à jour de la galerie sur la page d'accueil :",
        error
      )
    );
}

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
      return response.text();
    })
    .then(() => {
      const deletedElement = projectsContainerModal.querySelector(
        `[data-id="${id}"]`
      );
      if (deletedElement) {
        deletedElement.remove();
        updateFocusables();
      }

      // Mise à jour de la galerie sur la page d'accueil
      updateHomeGallery();

      // Mise à jour de la modale
      updateModal();

      closeModal();
    })
    .catch((error) => console.error(error));
};

// Appel la fonction pour mettre à jour la modale
function updateModal() {
  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((works) => {
      projectsContainerModal.innerHTML = ""; // Efface le contenu actuel de la modale

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
    })
    .catch((error) =>
      console.error("Erreur lors de la mise à jour de la modale :", error)
    );
}

const updateFocusables = function () {
  focusables = Array.from(modal.querySelectorAll(focusableSelector));
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
    const projectTitle = document.getElementById("project-title").value;
    const projectPhoto = document.getElementById("project-photo").files[0];
    const projectCategory = parseInt(
      document.getElementById("project-category").value
    );

    const projectData = new FormData();

    projectData.append("image", projectPhoto);
    projectData.append("title", projectTitle);
    projectData.append("category", projectCategory);

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
        // Fermer la modal après l'envoi réussi
        closeModal();

        // Ajouter la nouvelle photo à la galerie sans recharger la page
        const gallery = document.querySelector(".gallery");
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        image.src = data.imageUrl;
        image.alt = data.title;
        const figcaption = document.createElement("figcaption");
        figcaption.textContent = data.title;

        // Ajouter l'image et la légende à la figure
        figure.appendChild(image);
        figure.appendChild(figcaption);

        // Ajouter la figure à la galerie
        gallery.appendChild(figure);

        // Ajouter la catégorie en tant qu'attribut de données à la figure
        figure.dataset.category = data.category.name;
      })

      .catch((error) => {
        console.error("Erreur lors de l'ajout du projet :", error);
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
