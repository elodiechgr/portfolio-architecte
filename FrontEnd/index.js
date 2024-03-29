document.addEventListener("DOMContentLoaded", function () {
  const gallery = document.querySelector(".gallery");
  const apiUrl = "http://localhost:5678/api/works";

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((work) => {
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        image.src = work.imageUrl;
        image.alt = work.title;
        const figcaption = document.createElement("figcaption");
        figcaption.textContent = work.title;

        // Ajoutez l'image et la légende à la figure
        figure.appendChild(image);
        figure.appendChild(figcaption);

        // Ajoutez la figure à la galerie
        gallery.appendChild(figure);

        // Ajoutez la catégorie en tant qu'attribut de données à la figure
        figure.dataset.category = work.category.name;

        // Code pour gérer la logique filtres
        const allCategory = document.getElementById("all");
        const objetsCategory = document.getElementById("Objets");
        const appartementsCategory = document.getElementById("Appartements");
        const hotelsCategory = document.getElementById("Hotels & restaurants");

        const categories = document.querySelectorAll(".gallery figure");

        allCategory.addEventListener("click", () => {
          categories.forEach((category) => {
            category.style.display = "block";
          });
        });

        objetsCategory.addEventListener("click", () => {
          categories.forEach((category) => {
            if (category.dataset.category !== "Objets") {
              category.style.display = "none";
            } else {
              category.style.display = "block";
            }
          });
        });

        appartementsCategory.addEventListener("click", () => {
          categories.forEach((category) => {
            if (category.dataset.category !== "Appartements") {
              category.style.display = "none";
            } else {
              category.style.display = "block";
            }
          });
        });

        hotelsCategory.addEventListener("click", () => {
          categories.forEach((category) => {
            if (category.dataset.category !== "Hotels & restaurants") {
              category.style.display = "none";
            } else {
              category.style.display = "block";
            }
          });
        });
      });
    })

    .catch((error) =>
      console.error("Erreur de récupération des données : ", error)
    );
});
