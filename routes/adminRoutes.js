import express from 'express'
import checkAuth from '../middleware/checkAuth.js'
import { panelAdministracion, formNuevoGrupo, crearGrupo, subirImagen, formEditarGrupo, editarGrupo, formEditarImagen, editarImagen, formEliminarGrupo, eliminarGrupo, formNuevoMeeti, crearMeeti, formEditarMeeti, editarMeeti, formEliminarMeeti, eliminarMeeti, formEditarPerfil, editarPerfil, formCambiarPassword, cambiarPassword, formSubirImagenPerfil, subirFotoPerfil, guardarImagenPerfil } from '../controllers/adminController.js'

const router = express.Router()


router.get('/administracion', checkAuth, panelAdministracion)

router.get('/nuevo-grupo', checkAuth, formNuevoGrupo)
router.post('/nuevo-grupo', checkAuth, subirImagen, crearGrupo)

//Editar grupo
router.get('/editar-grupo/:grupoId', checkAuth, formEditarGrupo)
router.post('/editar-grupo/:grupoId', checkAuth, editarGrupo)

// Editar imagen del grupo
router.get('/imagen-grupo/:grupoId', checkAuth, formEditarImagen)
router.post('/imagen-grupo/:grupoId', checkAuth, subirImagen, editarImagen)

// Eliminar grupos
router.get('/eliminar-grupo/:grupoId', checkAuth, formEliminarGrupo)
router.post('/eliminar-grupo/:grupoId', checkAuth, eliminarGrupo)

// Nuevos meeti
router.get('/nuevo-meeti', checkAuth, formNuevoMeeti)
router.post('/nuevo-meeti', checkAuth, crearMeeti)

// Editar Meeti
router.get('/editar-meeti/:id', checkAuth, formEditarMeeti)
router.post('/editar-meeti/:id', checkAuth, editarMeeti)

// Eliminar Meeti
router.get('/eliminar-meeti/:id', checkAuth, formEliminarMeeti)
router.post('/eliminar-meeti/:id', checkAuth, eliminarMeeti)

// Editar Perfil
router.get('/editar-perfil', checkAuth, formEditarPerfil)
router.post('/editar-perfil', checkAuth, editarPerfil)

// Modifica el password
router.get('/cambiar-password', checkAuth, formCambiarPassword)
router.post('/cambiar-password', checkAuth, cambiarPassword)

// Imagenes de perfil
router.get('/imagen-perfil', checkAuth, formSubirImagenPerfil)
router.post('/imagen-perfil', checkAuth, subirFotoPerfil, guardarImagenPerfil)




export default router