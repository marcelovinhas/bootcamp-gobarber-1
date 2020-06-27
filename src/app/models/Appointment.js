import Sequelize, { Model } from 'sequelize';
import { isBefore, subHours } from 'date-fns';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        // super = Model, está chamando o método init da classe Model
        // os campos dentro do model, não precisam ser um reflexo dos campos da base de dados
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        past: { //agendamento passado para mostrar no front end
          type: Sequelize.VIRTUAL, //virtual não existe na tabela, apenas em js
          get() { //para retornar ao type
            return isBefore(this.date, new Date()); //retorna true se o horário já passou
          },
        },
        cancelable: { //retorna se o agendamento pode ser cancelado (no máximo até duas horas antes)
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore (new Date(), subHours(this.date, 2));
          },
        },
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
