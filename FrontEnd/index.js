document.addEventListener("DOMContentLoaded", function () {
  const gallery = document.querySelector(".gallery");
  const apiUrl = "http://localhost:5678/api/works";

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      data.forEach((work) => {
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        image.src = work.imageUrl;
        image.alt = work.title;
        const figcaption = document.createElement("figcaption");
        figcaption.textContent = work.title;
        /*const id = document.createElement("categoryId");
              categoryId.category = work.categoryId;*/

        // Ajoutez l'image et la légende à la figure
        figure.appendChild(image);
        figure.appendChild(figcaption);

        // Ajoutez la figure à la galerie
        gallery.appendChild(figure);

        // Ajoutez la catégorie en tant qu'attribut de données à la figure
        figure.dataset.category = work.category.name;

        // Code pour gérer la logique filtres
        const allCategory =
          document.getElementById(
            "all"
          ); /* Pas d'id pour ça mais réunir les 3 autres */
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

  fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      data.forEach((category) => {
        const categoryElement = document.createElement("button");
        categoryElement.textContent = category.name;

        if (category.name === "all") {
          allCategory.appendChild(categoryElement);
        } else if (category.name === "Objets") {
          objetsCategory.appendChild(categoryElement);
        } else if (category.name === "Appartements") {
          appartementsCategory.appendChild(categoryElement);
        } else if (category.name === "Hotels & restaurants") {
          hotelsCategory.appendChild(categoryElement);
        }
      });
    })
    .catch((error) =>
      console.error("Erreur de récupération des catégories : ", error)
    );
});
