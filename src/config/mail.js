// MANDAR EMAIL DE CANCELAMENTO PARA O PRESTADOR DE SERVIÇO - yarn add nodemailer
/*
Mailtrap para ambiente de desenvolvimento
criar conta e pegar as informações de host, port, auth (user e pass)
*/

export default {
  host: 'smtp.mailtrap.io', //endereço
  port: '2525', //porta
  secure: false, //se usa ssl ou não
  auth: { //autenticação do email
    user: "ab485ad579881c", //usuário
    pass: '796219bdeef935' //senha
  },
  default: { //configurações padrão
    from: 'Equipe GoBarber <noreply@gobaber.com>', //remetente do email
  },
};

/*
PLATAFORMAS DE ENVIO DE EMAIL REAL
Amazon SES - a rocketseat usa esse
Mailgun
Sparkpost
Mandril só pode usar usado pra quem usa Mailchimp
*/
