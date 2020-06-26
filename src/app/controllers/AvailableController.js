// ARQUIVO DE LISTAGEM DE HORÁRIOS DISPONÍVEIS NO DIA DO PRESTADOR DE SERVIÇO
import { startOfDay, endOfDay, setHours, setMinutes, setSeconds, format, isAfter } from 'date-fns';
import Appointment from '../models/Appointment';
import { Op } from 'sequelize';

class AvailableController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const searchDate = Number(date); //transformar em número inteiro, pode usar Number ou parseint

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    const schedule = [ //horários disponíveis, poderia ter uma tabela para salvar isso, mas daria trabalho
      '08:00', //2020-06-26 08:00
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
    ];


    const available = schedule.map(time => { //percore o schedule e transforma em uma variável time
      const [hour, minute] = time.split(':'); //divide hour:minute
      const value = setSeconds(setMinutes(setHours(searchDate, hour), minute), 0);
      //setSeconds sempre 0, setMinutes pega o minute que no caso é 0, setHours pega de searchDate

      return { //retornar para o front end
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"), //"2020-06-26T08:00:00-03:00"
        available:
          isAfter(value, new Date()) && //ver se o horário ja passou comparado com agora
          !appointments.find(a => format(a.date, 'HH:mm') === time),
          //ver se o horário está disponível, ver se está nos appointments e comparar com time do schedule
      };
    });

    return res.json(available);
  }
}

export default new AvailableController();
