const nodemailer = require('nodemailer');

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendResetLink(to, username, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Восстановление доступа к учетной записи GraphXplorers',
            text: '',
            html:
                `
                    <div>
                        <h1>Здравствуйте, ${username}!</h1>
                        <p>Мы получили запрос на сброс пароля от Вашей учетной записи. Перейдите по данной ссылке, чтобы установить новый пароль:  <a href="${link}">${link}</a></p>
                        <p>Ссылка действительна 15 минут</p>
                        <p><b>ВНИМАНИЕ:</b> Если Вы не делали запрос, проигнорируйте данное сообщение</p>
                        <br>
                        <i>С уважением, служба поддержки <a href="${process.env.CLIENT_URL}">GraphXplorers</a>!</i>
                    </div>
                `
        });
    }
}

module.exports = new MailService();