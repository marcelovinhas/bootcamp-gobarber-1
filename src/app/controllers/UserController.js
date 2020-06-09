/* eslint-disable prettier/prettier */
// ARQUIVO DE CRIAÇÃO DE USUÁRIOS

// YUP para validar dados de entrada, ver se o usuário enviou todos os dados - yarn add yup
// YUP é uma biblioteca de schema validation
// não aceita import Yup from 'yup' pq não possui export default dentro dele
import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({ // object para validar o req.body, shape é o formato do objeto
      name: Yup.string().required(),
      email: Yup.string().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) { // isValid é assíncrono por isso usa await, retorna true ou false
      return res.status(400).json({error: 'Validation fails'});
    }

    const userExists = await User.findOne({where:{email: req.body.email}});
    // verificar se já existe um usuário com o email informado

    if (userExists){ // caso exista informa erro
      return res.status(400).json({error: 'User already exists'});
    }

    // retornar para o front-end apenas id, name, email e provider
    const {id, name, email, provider} = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  // edição dos dados do usuário
  async update (req, res) {
    const schema = Yup.object().shape({ // object para validar o req.body, shape é o formato do objeto
      // no update não precisa do required para o usuário não ser obrigado a alterar se não quiser
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      // se o usuário preencher a senha antiga, ele deseja alterar, então a nova senha é obrigatória
      password: Yup.string().min(6)
      .when('oldPassword', (oldPassword, field) =>
        oldPassword ? field.required() : field // se oldPassword for preenchida o campo Password é obrigatório
      ),
      // para confirmar a nova senha
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
        // oneOf e ref para comparar com o campo password
      )
    });

    if (!(await schema.isValid(req.body))) { // isValid é assíncrono por isso usa await, retorna true ou false
      return res.status(400).json({error: 'Validation fails'});
    }

    const {email, oldPassword} = req.body;

    const user = await User.findByPk(req.userId); // findByPk = find by primary key

    if (email !== user.email) { // se o email que for alterar for diferente do email que já tem
    const userExists = await User.findOne({where:{email}});

    if (userExists) { // caso email ja exista informa erro
      return res.status(400).json({error: 'User already exists'});
    }
  }
    // se o usuário informou a senha antiga que significa que ele quer alterar, e a senha bater
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({error: 'Password does not match'});
    }

    const {id, name, provider} = await user.update(req.body);

    // retorna os dados pro front-end
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
