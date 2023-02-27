import Sequelize from "sequelize";
import bcrypt from 'bcrypt'
import db from "../config/db.js";


const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: Sequelize.STRING(60),
    imagen: Sequelize.STRING(60),
    descripcion: Sequelize.TEXT,
    email: {
        type: Sequelize.STRING(30),
        allowNull: false,
        validate: {
            isEmail: { msg: 'Agrega un correo Válido'}
        },
        unique: {
            args: true,
            msg: 'Usuario ya registrado'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty : {
                msg: 'El password no puede ir vacio'
            }
        }
    },
    activo : {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    token : Sequelize.STRING(30),
    expiraToken: Sequelize.DATE
}, {
    hooks: {
        async beforeCreate(usuario) {
            const salt = await bcrypt.genSalt(10)
            return usuario.password = await bcrypt.hash(usuario.password, salt);
        }
    }
})

// Método para comparar los passwords
Usuarios.prototype.validarPassword = async function (password) {
    return await bcrypt.compareSync(password, this.password)
};

Usuarios.prototype.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt);
};

export default Usuarios