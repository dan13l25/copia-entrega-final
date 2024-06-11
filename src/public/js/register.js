const form = document.getElementById("registerForm");
const errorMessage = document.getElementById("errorMessage"); 

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  
  fetch("/api/users/register", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then(response => {
    if (response.status === 200) {
        return response.json();
    } else {
        errorMessage.textContent = 'Este email ya es un usuario. Logueate'; 
        errorMessage.style.display = 'block';
        throw new Error('Error al registrarse');
    }
  })
  .then(data => {
    const token = data.access_token; 
    localStorage.setItem('token', token); 
    console.log("Token:", token);
    console.log("Registro exitoso!");
    window.location.href = "http://localhost:8080/api/products/"; 
  })
  .catch(error => {
    console.error('Error en el registro:', error);
  });
});
