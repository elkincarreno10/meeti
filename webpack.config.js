import path from 'path'

export default {
    mode: 'development',
    entry: {
        mapa: './src/js/mapa.js',
        meeti: './src/js/meeti.js',
        asistencia: './src/js/asistencia.js',
        eliminarComentario: './src/js/eliminarComentario.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve('public/js')
    }
}