/* eslint-disable prettier/prettier */
import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs'; // gerar o hash da senha - yarn add bcryptjs

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        // super = Model, está chamando o método init da classe Model
        // os campos dentro do model, não precisam ser um reflexo dos campos da base de dados
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // VIRTUAl é um campo que não vai existir na base de dados, apenas no código
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize, // o sequelize recebido no parâmetro static init (sequelize) precisa ser passado
      }
    );

    // Hooks são trechos de código executados de forma automática de acordo com as ações do model
    // beforeSave antes de qualquer usuário ser editado ou criado, o treco de código abaixo vai se executado automaticamente
    this.addHook('beforeSave', async (user) => {
      // ver se está cadastrando um novo usuário ou editando um usuário gerar um o hash da senha
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash); // compara a senha que o usuário tenta logar com a senha do banco de dados
  }
}

export default User;
