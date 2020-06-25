// CONFIGURAÇÕES DE EMAIL
import nodemailer from 'nodemailer';
import mailConfig from "../config/mail";

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;

    //transporter para conexão com serviço externo para enviar email
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null //se não houver usuário dentro do auth passa nulo, se houver passa usuário e senha
      //há estratégias de envio de email que não possui autenticação
    });
  }

  sendMail(message) { //cria um novo método para somar as informações de default em mail.js com a mensagem do controller
    return this.transporter.sendMail({
      ...mailConfig.default, //tudo que estiver dentro de mailConfig.default
      ...message, //tudo que estiver dentro de message
    });
  }
}

export default new Mail();
