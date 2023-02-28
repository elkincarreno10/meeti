import Sequelize from "sequelize";
import db from "../config/db.js";
import Categorias from "./Categorias.js";
import Usuarios from "./Usuarios.js";

const Grupos = db.define('grupos', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
    },
    nombre: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El grupo debe tener un nombre'
            }
        }
    },
    descripcion: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Coloca una descripción'
            }
        }
    },
    url: Sequelize.TEXT,
    imagen: Sequelize.TEXT
})

Grupos.belongsTo(Categorias)
Grupos.belongsTo(Usuarios)

export default Grupos