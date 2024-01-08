document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".form-contact");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const userToken = localStorage.getItem("userToken");
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const userData = {
      email: email,
      password: password,
    };

    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.userId) {
          localStorage.setItem("userToken", data.token);
          window.location.href = "index.html";
        } else {
          alert("Identifiants incorrects. Veuillez réessayer.");
        }
      })
      .catch((error) => {
        console.error("Une erreur s'est produite :", error);
      });
  });

  function validateForm() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var message = document.getElementById("message").value;

    if (name === "" || email === "" || message === "") {
      alert("Veuillez remplir tous les champs obligatoires.");
      return false; // Empêche la soumission du formulaire
    }

    return true; // Permet la soumission du formulaire
  }

  function checkUserLoggedIn() {
    // Récupérer l'élément à afficher ou masquer
    const blackContainer = document.querySelector(".black-container");

    // Récupérer le lien de connexion dans le menu
    const loginLink = document.querySelector(
      "nav ul li a[href='loginpage.html']"
    );

    // Vérifier si l'utilisateur est connecté
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      // Utilisateur connecté, afficher l'élément
      blackContainer.style.display = "block";

      // Modifier le texte du lien de connexion en "logout"
      if (loginLink) {
        loginLink.textContent = "logout";
      }
    } else {
      // Utilisateur non connecté, masquer l'élément
      blackContainer.style.display = "none";

      // Rétablir le texte du lien de connexion en "login"
      if (loginLink) {
        loginLink.textContent = "login";
      }
    }
  }

  // Appeler la fonction de vérification à chaque chargement de page
  checkUserLoggedIn();
});
