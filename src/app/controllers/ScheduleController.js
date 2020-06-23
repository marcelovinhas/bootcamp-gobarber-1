//listagem para o prestador de serviço
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import User from '../models/User';
import Appointment from '../models/Appointment';


class ScheduleController {
  async index (req, res) {
    const checkUserProvider = await User.findOne({ //verifica se o usuário é prestador de serviço
      where: { id: req.userId, provider:true },
    });

    if (!checkUserProvider) { //se não for prestador de serviço dá erro
      return res.status(401).json({ error : 'User is not a provider' });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    //ver os agendamentos do dia
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
          //2020-07-22 00:00:00 até 2020-07-22 23:59:59
        },
      },
      order: ['date'],
    });

    return res.json({ appointments });

  }
}

export default new ScheduleController();
