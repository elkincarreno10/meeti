import Meeti from "../models/Meeti.js"
import Grupos from "../models/Grupos.js"
import Usuarios from "../models/Usuarios.js"
import { formatearFecha, formatearHora, fechaActual } from "../helpers/index.js"
import Sequelize from "sequelize"
import Categorias from "../models/Categorias.js"
import Comentarios from "../models/Comentarios.js"

const mostrarMeeti = async (req, res) => {

    const meeti = await Meeti.findOne({ 
        where: { slug: req.params.slug },
        include: [
            {
                model: Grupos
            },
            {
                model: Usuarios,
                attributes: ['id', 'nombre', 'imagen']
            }
        ]
    })

    if(!meeti) {
        res.redirect('/')
    }

    const comentarios = await Comentarios.findAll({
        where: { meetiId: meeti.id},
        include: [
            {
                model: Usuarios,
                attributes: ['id', 'nombre', 'imagen']
            }
        ]
    })

    res.render('mostrar-meeti', {
        nombrePagina: meeti.titulo,
        meeti,
        comentarios,
        formatearFecha,
        formatearHora
    })
}

const agregarComentario = async (req, res) => {

    const { comentario: mensaje } = req.body

    await Comentarios.create({
        mensaje,
        usuarioId: req.usuario.id,
        meetiId: req.params.id
    })

    return res.redirect('back')
}

const eliminarComentario = async (req, res) => {
    // Tomar el id del comentario
    const { comentarioId } = req.body

    // Consultar el comentario
    const comentario = await Comentarios.findOne({ where : { id: comentarioId } })

    // Verificar si existe el comentario
    if(!comentario) {
        return res.status(404).send('Acción no válida')
    }

    // Consultar el meeti al que pertenece el comentario
    const meeti = await Meeti.findOne({ where: { id: comentario.meetiId } })

    // Verificar que quien lo borra es el creador
    if(comentario.usuarioId === req.usuario.id || meeti.usuarioId === req.usuario.id) {
        await Comentarios.destroy({
            where : { id: comentario.id }
        })
        return res.status(200).send('Eliminado Correctamente')
    } else {
        return res.status(403).send('Acción no válida')
    }

}

const confirmarAsistencia = async (req, res) => {

    const { accion } = req.body

    if(accion === 'confirmar') {
        Meeti.update(
            {'interesados': Sequelize.fn('array_append', Sequelize.col('interesados'), req.usuario.id)},
            { where: { 'slug': req.params.slug }}
        )
        res.send('Has confirmado tu asistencia')
    } else {
        Meeti.update(
            {'interesados': Sequelize.fn('array_remove', Sequelize.col('interesados'), req.usuario.id)},
            { where: { 'slug': req.params.slug }}
        )
        res.send('Has cancelado tu asistencia')
    }

}

const mostrarAsistentes = async (req, res) => {
    const meeti = await Meeti.findOne({ 
        where: { slug : req.params.slug },
        attributes: ['interesados']
    })

    const { interesados } = meeti

    const asistentes = await Usuarios.findAll({
        attributes: ['nombre', 'imagen'],
        where: { id: interesados }
    })

    res.render('asistentes-meeti', {
        nombrePagina: 'Listado Asistentes Meeti',
        asistentes
    })
}

const mostrarUsuario = async (req, res) => {
    const [ usuario, grupos ] = await Promise.all([
        Usuarios.findOne({ where: {id: req.params.id } }),
        Grupos.findAll({ where: { usuarioId : req.params.id} })
    ])
    if(!usuario) {
        return res.redirect('/')
    }

    res.render('mostrar-perfil', {
        nombrePagina: `Perfil Usuario: ${usuario.nombre}`,
        usuario,
        grupos
    })
}

const mostrarGrupo = async (req, res) => {
    const [ grupo, meetis ] = await Promise.all([
        Grupos.findOne({ where: { id: req.params.id } }),
        Meeti.findAll({ 
            where: { grupoId: req.params.id },
            order: [
                ['fecha', 'ASC']
            ]
        })
    ])

    if(!grupo) {
        return res.redirect('/')
    }

    res.render('mostrar-grupo', {
        nombrePagina: `Información Grupo: ${grupo.nombre}`,
        grupo,
        meetis,
        formatearFecha,
        formatearHora,
        fechaActual
    })
}

const mostrarCategoria = async (req, res) => {
    const categoria = await Categorias.findOne({ 
        where: {slug: req.params.categoria },
        attributes: ['id', 'nombre']
    })

    const meetis = await Meeti.findAll({
        order: [
            ['fecha', 'ASC'],
            ['hora', 'ASC']
        ],
        include: [
            {
                model: Grupos,
                where: { categoriaId: categoria.id}
            }, 
            {
                model: Usuarios 
            }
        ]
    })


    res.render('categoria', {
        nombrePagina: `Categoria: ${categoria.nombre}`,
        meetis,
        formatearFecha,
        formatearHora,
        fechaActual
    })
}

const resultadosBusqueda = async (req, res) => {

    const { categoria, titulo, ciudad, pais } = req.query

    // Si la categoría está vacia
    let query
    if(categoria === '') {
        query = ''
    } else {
        query = `where: {
            categoriaId: { [Op.eq]: ${categoria}}
        }`
    }

    // Filtrar los meetis
    const meetis = await Meeti.findAll({
        where: {
            titulo: { [Sequelize.Op.iLike]: '%' + titulo + '%'},
            ciudad: { [Sequelize.Op.iLike]: '%' + ciudad + '%'},
            pais: { [Sequelize.Op.iLike]: '%' + pais + '%'}
        },
        include: [
            {
                model: Grupos,
                query
            },
            {
                model: Usuarios,
                attributes: ['id', 'nombre', 'imagen']
            }
        ]
    })

    res.render('busqueda', {
        nombrePagina: 'Resultados Búsqueda',
        meetis,
        formatearFecha,
        formatearHora
    })
}

export {
    mostrarMeeti,
    agregarComentario,
    eliminarComentario,
    confirmarAsistencia,
    mostrarAsistentes,
    mostrarUsuario,
    mostrarGrupo,
    mostrarCategoria,
    resultadosBusqueda
}