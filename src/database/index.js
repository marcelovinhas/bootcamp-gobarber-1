/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
// arquivo para realizar a conexão do banco de dados postgres e carregar todos os models da aplicação
import Sequelize from 'sequelize';

import User from '../app/models/User';
import File from '../app/models/File';

import databaseConfig from '../config/database';

const models = [User, File]; // array com os models da aplicação

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig); // conexão com a base de dados

    models
    .map(model => model.init(this.connection)) // percorre os arrays de models
    .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
