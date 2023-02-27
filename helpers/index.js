const formatearFecha = fecha => {
    const nuevaFecha = new Date(fecha).toISOString().slice(0, 10)

    const fechaFinal = nuevaFecha.split('-')

    const opciones = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    return new Date(fechaFinal).toLocaleDateString('es', opciones)
}

const fechaActual = () => {
    const nuevaFecha = new Date().toISOString().slice(0, 10)
    const fechaFinal = nuevaFecha.split('-')
    const fechaFinalisima = [fechaFinal[0], fechaFinal[1], String(+fechaFinal[2]-1)]

    return new Date(fechaFinalisima).toISOString().slice(0, 10)
}

const formatearHora = hora => {
    const nuevaHora = hora.slice(0, 5) + ' ' + 'Horas'

    return nuevaHora
}

export {
    formatearFecha,
    formatearHora,
    fechaActual
}