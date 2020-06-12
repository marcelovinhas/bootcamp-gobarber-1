/* eslint-disable prettier/prettier */
import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        // super = Model, está chamando o método init da classe Model
        // os campos dentro do model, não precisam ser um reflexo dos campos da base de dados
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3333/files/${this.path}`;
          }
        }
      },
      {
        sequelize, // o sequelize recebido no parâmetro static init (sequelize) precisa ser passado
      }
    );


    return this;
  }
}

export default File;
