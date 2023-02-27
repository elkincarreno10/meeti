import Sequelize from "sequelize";
import db from "../config/db.js";

const Categorias = db.define('categorias', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: Sequelize.TEXT,
    slug: Sequelize.TEXT
}, {
    timestamps: false
})

export default Categorias