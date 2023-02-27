import axios from "axios";
import Swal from "sweetalert2";

(function() {
    const formsEliminar = document.querySelectorAll('.eliminar-comentario')

    // Revisar que existan lños formularios
    if(formsEliminar.length > 0) {
        formsEliminar.forEach(form => {
            form.addEventListener('submit', eliminarComentario)
        })
    }

    function eliminarComentario(e) {
        e.preventDefault()

        Swal.fire({
            title: 'Eliminar Comentario?',
            text: "Un comentario eliminado no se puede recuperar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
                // Tomar el id del comentario
                const comentarioId = this.children[0].value

                // Crear el objeto
                const datos = {
                    comentarioId
                }

                // Ejecutar axios
                axios.post(this.action, datos)
                    .then(respuesta => {
                        Swal.fire(
                            'Eliminado!',
                            respuesta.data,
                            'success'
                        )
                        // Eliminar del DOM
                        this.parentElement.parentElement.remove()
                    })
                    .catch(error => {
                        if(error.response.status === 403 || error.response.status === 404) {
                            Swal.fire(
                                'Error',
                                error.response.data,
                                'error'
                            )
                        } 
                    })
            }
          })
    }
})()