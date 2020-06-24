// arquivo para realizar a conexão do banco de dados postgres e carregar todos os models da aplicação
import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

import databaseConfig from '../config/database';

const models = [User, File, Appointment]; // array com os models da aplicação

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig); // conexão com a base de dados

    models
    .map(model => model.init(this.connection)) // percorre os arrays de models
    .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://192.168.99.100:27017/gobarber', //url de conexão do mongo
      { useNewUrlParser: true, useUnifiedTopology: true }
      //useNewUrlParser pq está usando um formato de url do mongodb mais nova, que não era usado antes
      //useUnifiedTopology era pra ser useFindAndModify configuração para encontrar e modificar registros
    );

  }
}

export default new Database();
