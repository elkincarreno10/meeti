import Sequelize from "sequelize"
import Categorias from "../models/Categorias.js"
import Meeti from "../models/Meeti.js"
import Grupos from "../models/Grupos.js"
import Usuarios from "../models/Usuarios.js"
import { formatearFecha, formatearHora, fechaActual } from '../helpers/index.js'

const home = async (req, res) => {

    const [ categorias, meetis ] = await Promise.all([
        Categorias.findAll(),
        Meeti.findAll({
            attributes: ['slug', 'titulo', 'fecha', 'hora'],
            where: {
                fecha: { [Sequelize.Op.gte] : fechaActual() }
            },
            limit: 3,
            order: [ ['fecha', 'ASC'] ],
            include: [
                {
                    model: Grupos,
                    attributes: ['imagen']
                },
                {
                    model: Usuarios,
                    attributes: ['nombre', 'imagen']
                }
            ]
        })
    ])

    res.render('home', {
        nombrePagina: 'Inicio',
        categorias,
        meetis,
        formatearFecha,
        formatearHora
    })
}


export {
    home
}