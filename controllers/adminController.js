import Sequelize from "sequelize"
import Categorias from "../models/Categorias.js"
import Grupos from "../models/Grupos.js"
import Meeti from "../models/Meeti.js"
import { formatearFecha, formatearHora, fechaActual } from "../helpers/index.js"
import multer from "multer"
import shortid from "shortid"
import { v4 as uuid } from "uuid";
import fs from 'fs'
import Usuarios from "../models/Usuarios.js"

const configuracionMulter = {
    limits : {fileSize : 100000},
    storage: multer.diskStorage({
        destination: (req, file, next) => {
            next(null, './public/uploads/grupos/')
        },
        filename: (req, file, next) => {
            const extension = file.mimetype.split('/')[1]
            next(null, `${shortid.generate()}.${extension}`)
        }
    }),
    fileFilter: ((req, file, next) => {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            // Formato es válido
            next(null, true)
        } else {
            // El formato no es válido
            next(new Error('Formato no válido'), false)
        }
    })
}

const upload = multer(configuracionMulter).single('imagen')

// Sube una imagen en el servidor
const subirImagen = (req, res, next) => {
    upload(req, res, function(error) {
        if(error) {
            if(error instanceof multer.MulterError) {
                if(error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El archivo es muy grande')
                } else {
                    req.flash('error', error.message)
                }
            } else if(error.hasOwnProperty('message')) {
                req.flash('error', error.message)
            }
            return res.redirect('back')
        } else {
            next()
        }
    })
}

const panelAdministracion = async (req, res) => {

    const [ grupos, meeti, anteriores ] = await Promise.all([
        Grupos.findAll({where : {usuarioId: req.usuario.id}}), 
        Meeti.findAll({
            where : {usuarioId: req.usuario.id, fecha: { [Sequelize.Op.gte] : fechaActual() }}, 
            order: [ ['fecha', 'ASC']] 
        }),
        Meeti.findAll({where : {usuarioId: req.usuario.id, fecha: { [Sequelize.Op.lt] : fechaActual() }}})
    ])

    res.render('administracion', {
        nombrePagina: 'Panel de Administracion',
        grupos,
        meeti,
        anteriores,
        formatearFecha,
        formatearHora
    })
}


const formNuevoGrupo = async (req, res) => {

    const categorias = await Categorias.findAll()

    res.render('nuevo-grupo', {
        nombrePagina: 'Crea un nuevo grupo',
        categorias
    })
}

const crearGrupo = async (req, res) => {
    const grupo = req.body

    // Almacena el usuario autenticado como el creador del grupo
    grupo.usuarioId = req.usuario.id
    grupo.categoriaId = req.body.categoria

    // Leer la imagen
    if(req.file) {
        grupo.imagen = req.file.filename
    }

    grupo.id = uuid();

    try {
        // Almacenar en la BD
        await Grupos.create(grupo)
        req.flash('exito', 'Se ha creado el grupo correctamente')
        res.redirect('/administracion')
    } catch (error) {
        console.log(error)
        req.flash('error', 'Todos los campos son obligatorios')
        res.redirect('/nuevo-grupo')
    }
}

const formEditarGrupo = async (req, res) => {

    const [ grupo, categorias ] = await Promise.all([
        Grupos.findByPk(req.params.grupoId), 
        Categorias.findAll()
    ])

    res.render('editar-grupo', {
        nombrePagina: `Editar Grupo : ${grupo.nombre}`,
        grupo,
        categorias
    })
}

const editarGrupo = async (req, res) => {
    const grupo = await Grupos.findOne({where : { id : req.params.grupoId, usuarioId: req.usuario.id }})

    if(!grupo) {
        req.flash('error', 'Operación no válida')
        req.redirect('/administracion')
        return next()
    }

    // Leer valores
    const { nombre, descripcion, categoria, url } = req.body

    // Asignar los valores
    grupo.nombre = nombre
    grupo.descripcion = descripcion
    grupo.categoriaId = categoria
    grupo.url = url

    // BD
    await grupo.save()
    req.flash('exito', 'Cambios Almacenados Correctamente')
    res.redirect('/administracion')
}

const formEditarImagen = async (req, res) => {
    const grupo = await Grupos.findOne({where : { id : req.params.grupoId, usuarioId: req.usuario.id }})

    res.render('imagen-grupo', {
        nombrePagina: `Editar Imagen Grupo: ${grupo.nombre}`,
        grupo
    })
}

// Modifica la imagen en la BD y eliminar la anterior
const editarImagen = async (req, res) => {
    const grupo = await Grupos.findOne({where : { id : req.params.grupoId, usuarioId: req.usuario.id }})

    if(!grupo) {
        req.flash('error', 'Operación no válida')
        res.redirect('/administracion')
    }

    // Si hay imagen anterior y nueva borramos la anterior
    if(req.file && grupo.imagen) {
        const imagenAnteriorPath = `./public/uploads/grupos/${grupo.imagen}`

        // Eliminar archivo con filesystem
        fs.unlink(imagenAnteriorPath, (error) => {
            if(error) {
                console.log(error)
            }
            return
        })
    }

    // Si hay una imagen nueva
    if(req.file) {
        grupo.imagen = req.file.filename
    }

    await grupo.save()
    req.flash('exito', 'Cambios Almacenados Correctamente')
    res.redirect('/administracion')
}

// Muestra el formulario para eliminar un grupo
const formEliminarGrupo = async (req, res, next) => {
    const grupo = await Grupos.findOne({where : { id : req.params.grupoId, usuarioId: req.usuario.id }})

    if(!grupo) {
        req.flash('error', 'Operación no válida')
        res.redirect('/administracion')
        return next()
    }

    res.render('eliminar-grupo', {
        nombrePagina: `Eliminar Grupo: ${grupo.nombre}`
    })
}

const eliminarGrupo = async (req, res) => {
    const grupo = await Grupos.findOne({where : { id : req.params.grupoId, usuarioId: req.usuario.id }})

    if(!grupo) {
        req.flash('error', 'Operación no válida')
        res.redirect('/administracion')
        return next()
    }

    if(grupo.imagen) {
        const imagenAnteriorPath = `./public/uploads/grupos/${grupo.imagen}`

        // Eliminar archivo con filesystem
        fs.unlink(imagenAnteriorPath, (error) => {
            if(error) {
                console.log(error)
            }
            return
        })
    }

    await Grupos.destroy({
        where: {
            id: req.params.grupoId
        }
    })

    req.flash('exito', 'Grupo Eliminado')
    res.redirect('/administracion')
}

const formNuevoMeeti = async (req, res) => {
    const grupos = await Grupos.findAll({ where: {usuarioId : req.usuario.id}})

    res.render('nuevo-meeti', {
        nombrePagina: 'Crear Nuevo Meeti',
        grupos
    })
}

const crearMeeti = async (req, res) => {
    const meeti = req.body

    // Asignar el usuario
    meeti.usuarioId = req.usuario.id

    // Almacenar la ubicación
    meeti.ubicacion = [ req.body.lat, req.body.lng ]

    if(req.body.cupo === '') {
        meeti.cupo = 0
    }

    meeti.id = uuid();

    // Almacenar en la BD
    try {
        await Meeti.create(meeti)
        req.flash('exito', 'Se ha creado el meeti correctamente')
        res.redirect('/administracion')
    } catch (error) {
        const erroresSequelize = error.errors.map(err => err.message)
        req.flash('error', erroresSequelize)
        res.redirect('/nuevo-meeti')
    }
}

const formEditarMeeti = async (req, res) => {
    const [ grupos, meeti ] = await Promise.all([
        Grupos.findAll({ where: {usuarioId: req.usuario.id} }),
        Meeti.findByPk(req.params.id)
    ])

    if(!grupos || !meeti) {
        req.flash('error', 'Operación no válida')
        return res.redirect('/administracion')
    }

    res.render('editar-meeti', {
        nombrePagina: `Editar Meeti : ${meeti.titulo}`,
        grupos,
        meeti
    })
}

const editarMeeti = async (req, res) => {
    const meeti = await Meeti.findOne({ where: { id: req.params.id, usuarioId: req.usuario.id }})
    if(!meeti) {
        req.flash('error', 'Operación no válida')
        return res.redirect('/administracion')
    }

    // Asignar los valores
    const { grupoId, titulo, invitado, fecha, hora, cupo, descripcion, direccion, ciudad, departamento, pais, lat, lng } = req.body

    meeti.grupoId = grupoId
    meeti.titulo = titulo
    meeti.invitado = invitado
    meeti.fecha = fecha
    meeti.hora = hora
    meeti.cupo = cupo
    meeti.descripcion = descripcion
    meeti.direccion = direccion
    meeti.ciudad = ciudad
    meeti.departamento = departamento
    meeti.pais = pais
    meeti.ubicacion = [lat, lng]

    // Almacenar en la BD
    await meeti.save()
    req.flash('exito', 'Cambios Guardados Correctamente')
    res.redirect('/administracion')
}

const formEliminarMeeti = async (req, res) => {
    const meeti = await Meeti.findOne({ where: { id: req.params.id, usuarioId: req.usuario.id }})

    if(!meeti) {
        req.flash('error', 'Operación no válida')
        return res.redirect('/administracion')
    }

    res.render('eliminar-meeti', {
        nombrePagina: `Eliminar Meeti : ${meeti.titulo}`
    })
}

const eliminarMeeti = async (req, res) => {
    const meeti = await Meeti.destroy({ 
        where: { 
            id: req.params.id, 
            usuarioId: req.usuario.id 
        }
    })

    req.flash('exito', 'Meeti Eliminado Correctamente')
    res.redirect('/administracion')
}

const formEditarPerfil = async (req, res) => {
    const usuario = await Usuarios.findByPk(req.usuario.id)

    res.render('editar-perfil', {
        nombrePagina: 'Editar Perfil',
        usuario
    })
}

const editarPerfil = async (req, res) => {
    const usuario = await Usuarios.findByPk(req.usuario.id)

    const { nombre, descripcion, email } = req.body

    usuario.nombre = nombre
    usuario.descripcion = descripcion
    usuario.email = email

    await usuario.save()
    req.flash('exito', 'Cambios Guardados Correctamente')
    res.redirect('/administracion')
}

const formCambiarPassword = async (req, res) => {

    res.render('cambiar-password', {
        nombrePagina: 'Cambiar Password'
    })
}

const cambiarPassword = async (req, res) => {
    const usuario = await Usuarios.findByPk(req.usuario.id)

    // Verificar que el password anterior es correcto
    if(!(await usuario.validarPassword(req.body.anterior))) {
        req.flash('error', 'El apssword actual es incorrecto')
        return res.redirect('/administracion')
    }

    
    // Si el password es correcto, hashear el nuevo
    const hash = await usuario.hashPassword(req.body.nuevo)

    // Asignar el password hasheado
    usuario.password = hash
    await usuario.save()

    req.flash('exito', 'Password Modificado Correctamente, vuelve a iniciar sesión')
    res.clearCookie('token').status(200).redirect('/iniciar-sesion')
}

const formSubirImagenPerfil = async (req, res) => {

    const usuario = await Usuarios.findByPk(req.usuario.id)

    res.render('imagen-perfil', {
        nombrePagina: 'Subir Imagen Perfil',
        usuario
    })
}

const configuracionMulterPerfil = {
    limits : {fileSize : 100000},
    storage: multer.diskStorage({
        destination: (req, file, next) => {
            next(null, './public/uploads/perfiles/')
        },
        filename: (req, file, next) => {
            const extension = file.mimetype.split('/')[1]
            next(null, `${shortid.generate()}.${extension}`)
        }
    }),
    fileFilter: ((req, file, next) => {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            // Formato es válido
            next(null, true)
        } else {
            // El formato no es válido
            next(new Error('Formato no válido'), false)
        }
    })
}

const uploadPerfil = multer(configuracionMulterPerfil).single('imagen')

// Sube una imagen en el servidor
const subirFotoPerfil = (req, res, next) => {
    uploadPerfil(req, res, function(error) {
        if(error) {
            if(error instanceof multer.MulterError) {
                if(error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El archivo es muy grande')
                } else {
                    req.flash('error', error.message)
                }
            } else if(error.hasOwnProperty('message')) {
                req.flash('error', error.message)
            }
            return res.redirect('back')
        } else {
            next()
        }
    })
}

const guardarImagenPerfil = async (req, res) => {
    const usuario = await Usuarios.findByPk(req.usuario.id)

    // Si hay imagen anterior eliminarla
    if(req.file && usuario.imagen) {
        const imagenAnteriorPath = `./public/uploads/perfiles/${usuario.imagen}`

        // Eliminar archivo con filesystem
        fs.unlink(imagenAnteriorPath, (error) => {
            if(error) {
                console.log(error)
            }
            return
        })
    }

    // Almacenar la nueva imagen
    if(req.file) {
        usuario.imagen = req.file.filename
    }

    // Almacenar en la base de datos  y redireccionar
    await usuario.save()
    req.flash('exito', 'Cambios Almacenados Correctamente')
    res.redirect('/administracion')
}

export {
    panelAdministracion,
    formNuevoGrupo,
    crearGrupo,
    subirImagen,
    formEditarGrupo,
    editarGrupo,
    formEditarImagen,
    editarImagen,
    formEliminarGrupo,
    eliminarGrupo,
    formNuevoMeeti,
    crearMeeti,
    formEditarMeeti,
    editarMeeti,
    formEliminarMeeti,
    eliminarMeeti,
    formEditarPerfil,
    editarPerfil,
    formCambiarPassword,
    cambiarPassword,
    formSubirImagenPerfil,
    subirFotoPerfil,
    guardarImagenPerfil
}