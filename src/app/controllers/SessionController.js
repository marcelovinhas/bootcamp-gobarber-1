/* eslint-disable prettier/prettier */
// arquivo para autenticação do usuário, para logar
// não usa o arquivo UserController.js pq nesse arquivo cria uma sessão e não um usuário
// e no UserController já tem o método store e só pode ter uma vez o mesmo método em uma classe
// e só pode ter 5 métodos: index, show, store, update e delete dentro de um controller
import jwt from 'jsonwebtoken'; // yarn add jsonwebtoken
import * as Yup from 'yup';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({ // object para validar o req.body, shape é o formato do objeto
      email: Yup.string().required(), // para logar precisa do email e senha
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) { // isValid é assíncrono por isso usa await, retorna true ou false
      return res.status(400).json({error: 'Validation fails'});
    }

    const { email, password } = req.body;

    // verifica se existe um usuário com o email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // verifica se a senhas NÃO estão batendo, precisa do await pq o bcrypt.compare é assíncrono
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    // retornar os dados do usuário
    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },

      /* PRIMEIRO PARÂMETRO
      no método sign envia o payload que são informações adicionais que quer incorporar no token
      coloca no token o id do usuário para ter acesso a essa informação depois que reutilizar o token
      na parte do texto precisa ser um texto único no mundo

      SEGUNDO PARÂMETRO
      entrar no site https://www.md5online.org/, digitar alguma coisa aleatória na barra que ngm nunca tenha escrito
      pega o código e coloca como segundo parâmetro

      TERCEIRO PARÂMETRO
      todo token jwt tem data de expiração, se deixa o token como infinito se o usuário tiver o token ele vai poder
      fazer o que quiser quando quiser, geralmente coloca 7 dias
      */

      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
