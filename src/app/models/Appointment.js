/* eslint-disable prettier/prettier */
import Sequelize, { Model } from 'sequelize';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        // super = Model, está chamando o método init da classe Model
        // os campos dentro do model, não precisam ser um reflexo dos campos da base de dados
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize, // o sequelize recebido no parâmetro static init (sequelize) precisa ser passado
      }
    );

    return this;
  }

  // relacionamento com a tabela
  static associate(models) {
    this.belongsTo(models.User, {foreignKey: 'user_id', as: 'user'});
    this.belongsTo(models.User, {foreignKey: 'provider_id', as: 'provider'});
  }
}

export default Appointment;
