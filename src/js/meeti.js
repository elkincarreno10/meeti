(function() {
    document.addEventListener('DOMContentLoaded', () => {
        if(document.querySelector('#ubicacion-meeti')) {
            mostrarMapa()
        }
    })

    function mostrarMapa() {
        // Logical Or
        const lat = document.querySelector('#lat').value
        const lng = document.querySelector('#lng').value
        const direccion = document.querySelector('#direccion').value || ''
        const mapa = L.map('ubicacion-meeti').setView([lat, lng ], 16); 
        let marker;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapa);

        // EL Pin
        marker = new L.marker([lat, lng])
        .addTo(mapa)
        .bindPopup(direccion)
    }
})()