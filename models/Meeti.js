import Sequelize from "sequelize";
import db from "../config/db.js";
import { v4 as uuid } from "uuid";
import slug from "slug";
import shortid from "shortid";

import Usuarios from "./Usuarios.js";
import Grupos from "./Grupos.js";

const Meeti = db.define('meeti', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: uuid()
    },
    titulo: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty : {
                msg: 'Agrega un Título'
            }
        }
    },
    slug: {
        type: Sequelize.STRING
    },
    invitado: Sequelize.STRING,
    cupo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    descripcion : {
        type: Sequelize.TEXT,
        allowNull: false,
        validate : {
            notEmpty: {
                msg: 'Agrega una Descripción'
            }
        }
    },
    fecha : {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate : {
            notEmpty: {
                msg: 'Agrega una Fecha'
            }
        }
    },
    hora : {
        type: Sequelize.TIME,
        allowNull: false,
        validate : {
            notEmpty: {
                msg: 'Agrega una hora para el Meeti'
            }
        }
    },
    direccion : {
        type: Sequelize.STRING,
        allowNull: false,
        validate : {
            notEmpty: {
                msg: 'Agrega una Direccion'
            }
        }
    },
    ciudad : {
        type: Sequelize.STRING,
        allowNull: false,
        validate : {
            notEmpty: {
                msg: 'Agrega una Ciudad'
            }
        }
    },
    departamento : {
        type: Sequelize.STRING,
        allowNull: false,
        validate : {
            notEmpty: {
                msg: 'Agrega un Departamento'
            }
        }
    },
    pais : {
        type: Sequelize.STRING,
        allowNull: false,
        validate : {
            notEmpty: {
                msg: 'Agrega una Pais'
            }
        }
    },
    ubicacion : {
        type: Sequelize.ARRAY(Sequelize.FLOAT)
    },
    interesados: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        defaultValue: []
    }
}, {
    hooks: {
        async beforeCreate(meeti) {
            const url = slug(meeti.titulo).toLowerCase()
            meeti.slug = `${url}-${shortid.generate()}`
        }
    }
})

Meeti.belongsTo(Usuarios)
Meeti.belongsTo(Grupos)

export default Meeti