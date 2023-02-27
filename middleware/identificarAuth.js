import jwt from 'jsonwebtoken'
import Usuarios from '../models/Usuarios.js'

const checkLogin = async (req, res, next) => {
    const { token } = req.cookies 
    if(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            const usuario = await Usuarios.findOne(
                {where: {id: decoded.id}}
            )
            
            if(usuario) {
                req.usuario = {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    descripcion: usuario.descripcion
                }
            }
            
            return next()
        } catch (error) {
            console.log(error)
            return res.clearCookie('token').redirect('/iniciar-sesion')
        }
    }

    if(!token) {
        req.usuario = null
        return next()
    }
}

export default checkLogin
