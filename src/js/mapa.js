
(function() {
    if(document.querySelector('#mapa')) {

        // Obtener valores de la base de datos

        // Logical Or
        const lat = document.querySelector('#lat').value || 8.2386949;
        const lng = document.querySelector('#lng').value ||  -73.3524963;
        const direccion = document.querySelector('#direccion').value || ''
        const mapa = L.map('mapa').setView([lat, lng ], 15); 
        let marker;

        // Utilizar Provider y Geocoder
        const geocodeService = L.esri.Geocoding.geocodeService()

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapa);

        // EL Pin
        marker = new L.marker([lat, lng], {
            draggable: true,
            autoPan: true
        })
        .addTo(mapa)
        .bindPopup(direccion)

        // Detecta el movimiento del pin
        marker.on('moveend', function(e) {
            marker = e.target

            const posicion = marker.getLatLng()

            mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))

            // Obtener la información de la calle al soltar el pin
            geocodeService.reverse().latlng(posicion, 13).run(function(error, resultado) {
                marker = e.target

                const posicion = marker.getLatLng()

                mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))

                // Obtener la información de la calle al soltar el pin
                geocodeService.reverse().latlng(posicion, 13).run(function(error, resultado) {

                    marker.bindPopup(resultado.address.LongLabel)

                    // Llenar los campos
                    document.querySelector('#direccion').value = resultado?.address?.Address ?? ''
                    document.querySelector('#ciudad').value = resultado?.address?.City ?? ''
                    document.querySelector('#departamento').value = resultado?.address?.Region ?? ''
                    document.querySelector('#pais').value = resultado?.address?.CntryName ?? ''
                    document.querySelector('#lat').value = resultado?.latlng?.lat ?? ''
                    document.querySelector('#lng').value = resultado?.latlng?.lng ?? ''
                })
            })
        })
    }
})()