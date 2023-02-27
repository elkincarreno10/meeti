import { emailRegistro } from "../helpers/emails.js"
import generarId from "../helpers/generarId.js"
import generarJWT from '../helpers/generarJWT.js'
import Usuarios from "../models/Usuarios.js"

const formCrearCuenta = (req, res) => {

    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu Cuenta'
    })
}

const crearNuevaCuenta = async (req, res) => {

    try {
        const usuario = new Usuarios(req.body)
        usuario.token = generarId()
        await usuario.save()

        // Enviar email de confirmación
        await emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        //Flash Message y redireccionar
        req.flash('exito', 'Hemos enviado un E-mail, confirma tu cuenta')
        res.redirect('/iniciar-sesion')
    } catch (error) {

        // Extraer el message de los errores
        const erroresSequelize = error?.errors.map(err => err.message) || []

        // Unirlos
        const listaErrores = [...erroresSequelize]

        req.flash('error', listaErrores)
        res.redirect('/crear-cuenta')
    }
}

const confirmar = async (req, res, next) => {

    // Verificar si el usuario existe
    const usuario = await Usuarios.findOne({ where: { tokenPassword: req.params.token }})

    if(!usuario) {
        req.flash('error', 'No existe esa cuenta')
        res.redirect('/crear-cuenta')
        return next()
    }

    // Si existe confirmar y redireccionar
    usuario.activo = 1
    usuario.tokenPassword = null
    await usuario.save()

    req.flash('exito', 'La cuenta se ha confirmado, ya puedes iniciar sesión')
    res.redirect('/iniciar-sesion')
}

const formIniciarSesion = async (req, res) => {

    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar Sesión'
    })
}

const autenticarUsuario = async (req, res) => {
    const { email, password } = req.body

    const usuario = await Usuarios.findOne({where: { email }})

    if(!usuario) {
        req.flash('error', 'El usuario no existe') 
        return res.redirect('/iniciar-sesion')
    }


    if(!usuario.activo) {
        req.flash('error', 'El usuario no ha sido confirmado')
        return res.redirect('/iniciar-sesion')
    }

    if(await usuario.validarPassword(password)) {
        res.cookie('token', generarJWT(usuario.id)).redirect('/administracion')
    } else {
        req.flash('error', 'Password Incorrecto')
        return res.redirect('/iniciar-sesion')
    }
}

const cerrarSesion = (req, res) => {
    req.flash('exito', 'Cerraste Sesión Correctamente')
    return res.clearCookie('token').status(200).redirect('/iniciar-sesion')
}

export {
    formCrearCuenta,
    crearNuevaCuenta,
    formIniciarSesion,
    confirmar,
    autenticarUsuario,
    cerrarSesion
}