import Sequelize from "sequelize";
import db from "../config/db.js";
import Usuarios from "./Usuarios.js";
import Meeti from "./Meeti.js";


const Comentarios = db.define('comentario', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    mensaje: Sequelize.TEXT
}, {
    timestamps: false
})

Comentarios.belongsTo(Usuarios)
Comentarios.belongsTo(Meeti)

export default  Comentarios