// CONFIGURAÇÕES DE EMAIL
import nodemailer from 'nodemailer';
import { resolve } from 'path'; //precisa indicar o diretório onde está os templates de email
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
//configuração de template engine de email com handlebars, template engine são arquivos html podem receber variáveis do node
//yarn add express-handlebars nodemailer-express-handlebars
import mailConfig from "../config/mail";

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;

    //transporter para conexão com serviço externo para enviar email
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null, //se não houver usuário dentro do auth passa nulo, se houver passa usuário e senha
      //há estratégias de envio de email que não possui autenticação
    });

    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails'); //resolve para navegar para pasta emails

    this.transporter.use('compile', nodemailerhbs({ //compile é como formata a mensagem do email
      viewEngine: exphbs.create({
        layoutsDir: resolve(viewPath, 'layouts'),
        partialsDir: resolve(viewPath, 'partials'),
        defaultLayout: 'default',
        extname: '.hbs',
      }),
      viewPath,
      extname: '.hbs',
    })
    );
  }

  sendMail(message) { //cria um novo método para somar as informações de default em mail.js com a mensagem do controller
    return this.transporter.sendMail({
      ...mailConfig.default, //tudo que estiver dentro de mailConfig.default
      ...message, //tudo que estiver dentro de message
    });
  }
}

export default new Mail();
