import express from 'express'
import checkAuth from '../middleware/checkAuth.js'
import { formCrearCuenta, crearNuevaCuenta, formIniciarSesion, confirmar, autenticarUsuario, cerrarSesion } from '../controllers/usuariosController.js'

const router = express.Router()

router.get('/crear-cuenta', formCrearCuenta)
router.post('/crear-cuenta', crearNuevaCuenta)

// Iniciar Sesión
router.get('/iniciar-sesion', formIniciarSesion)
router.post('/iniciar-sesion', autenticarUsuario)

// Cerrar sesión
router.get('/cerrar-sesion', checkAuth, cerrarSesion)

// Confirmar
router.get('/confirmar/:token', confirmar)


export default router