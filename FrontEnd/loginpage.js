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
      return false;
    }

    return true;
  }

  function checkUserLoggedIn() {
    const blackContainer = document.querySelector(".black-container");

    const loginLink = document.querySelector(
      "nav ul li a[href='loginpage.html']"
    );

    // Vérifier si l'utilisateur est connecté
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      blackContainer.style.display = "block";

      if (loginLink) {
        loginLink.textContent = "logout";
        loginLink.addEventListener("click", function (event) {
          event.preventDefault(); // Empêcher la propagation de l'événement
          logoutUser();
        });
      }
    } else {
      blackContainer.style.display = "none";

      if (loginLink) {
        loginLink.textContent = "login";
      }
    }
  }

  // Appeler la fonction de vérification à chaque chargement de page
  checkUserLoggedIn();
});

function logoutUser() {
  localStorage.removeItem("userToken");

  window.location.href = "index.html";
}
