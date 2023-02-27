import express from 'express'
import dotenv from 'dotenv'
import expressLayouts from 'express-ejs-layouts'
import flash from 'connect-flash'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import db from './config/db.js'

import homeRoutes from './routes/homeRoutes.js'
import usuariosRoutes from './routes/usuariosRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import frontendRoutes from './routes/frontendRoutes.js'
import checkLogin from './middleware/identificarAuth.js'

const app = express()
dotenv.config()

// Base de datos
db.sync()

// Body parser, leer formularios
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Habilitar EJS como template engine
app.use(expressLayouts)
app.set('view engine', 'ejs')

// Ubicación de las vistas
app.set('views', './views')

// Archivos estáticos
app.use(express.static('public'))

// Habilitar cookie parser
app.use(cookieParser())

// Crear la sesión
app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false
}))

// Agrega flash messages
app.use(flash())

// Middelware (usuario logueado, flash messages, fecha actual)
app.use(checkLogin)
app.use((req, res, next) => {
    res.locals.usuario = req.usuario || null
    res.locals.mensajes = req.flash()
    const fecha = new Date()
    res.locals.year = fecha.getFullYear()
    next()
})

// Routing
app.use('/', homeRoutes)
app.use('/', usuariosRoutes)
app.use('/', adminRoutes)
app.use('/', frontendRoutes)

const puerto = process.env.PORT || 5000

// Agrega el puerto
app.listen(puerto, () => {
    console.log(`El servidor está funcionando en el puerto: ${puerto}`)
})