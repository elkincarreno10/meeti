import nodemailer from 'nodemailer'

export const emailRegistro = async (datos) => {

    const { email, nombre, token } = datos

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    // Informacion del email
    const info = await transport.sendMail({
        from: '"Meeti" <noreply@meeti.com>',
        to: email,
        subject: 'Meeti - Comprueba tu cuenta',
        text: 'Comprueba tu cuenta en Meeti',
        html: `<p>Hola: ${nombre} Comprueba tu cuenta en Meeti</p>
        <p>Tu cuenta ya está casi lista, solo debes comprobarla en el siguiente enlace:
        <a href="${process.env.URL}/confirmar/${token}">Comprobar Cuenta</a>
        <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
    })
}