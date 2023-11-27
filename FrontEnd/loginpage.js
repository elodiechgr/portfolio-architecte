/* 
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY5ODY1Mzk5NCwiZXhwIjoxNjk4NzQwMzk0fQ.qfArxget87Sn96T3qfhApoPgGgw67lsIIls5i7X_yJk";

faire une requete POST avec email et mdp
+ creer message d'erreur si erreur */

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
