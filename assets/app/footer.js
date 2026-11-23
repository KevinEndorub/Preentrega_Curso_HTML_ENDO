fetch("footer.html")
    .then(response => {
        if (!response.ok) {
            throw new Error("No se pudo cargar el footer");
        }
        return response.text();
    })
    .then(data => {
        document.getElementById("footer-container").innerHTML = data;
    })
    .catch(error => console.error(error));