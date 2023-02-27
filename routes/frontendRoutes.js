import express from 'express'
import { mostrarMeeti, agregarComentario, eliminarComentario, confirmarAsistencia, mostrarAsistentes, mostrarUsuario, mostrarGrupo, mostrarCategoria, resultadosBusqueda } from '../controllers/frontendControllers.js'

const router = express.Router()


router.get('/meeti/:slug', mostrarMeeti)
router.post('/meeti/:id', agregarComentario)
router.post('/eliminar-comentario', eliminarComentario)

router.post('/confirmar-asistencia/:slug', confirmarAsistencia)

router.get('/asistentes/:slug', mostrarAsistentes)

router.get('/usuarios/:id', mostrarUsuario)

router.get('/grupos/:id', mostrarGrupo)

router.get('/categoria/:categoria', mostrarCategoria)

router.get('/busqueda', resultadosBusqueda)


export default router