// agendamento de serviço
import * as Yup from 'yup'; //para fazer validação do schema
import {startOfHour, parseISO, isBefore} from 'date-fns'; //biblioteca de datas yarn add date-fns@next
import Appointment from '../models/Appointment';
import User from '../models/User';

class AppointmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) { //se o schema for valido
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body; //pega provider_id e date

    const isProvider = await User.findOne({ //verifica se o usuário é um provedor de serviço
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {  //se não for provedor de serviço dá erro
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }


    //startOfHour pega o início da hora, se colocar 19:30 ele transforma em 19:00
    //parseIso transforma a string de data do Insomnia objeto date para o js
    const hourStart = startOfHour(parseISO(date));

    //verifica se a data do agendamento desejado com a data atual, ve se a data já passou, é antiga
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted'});
    }

    //verifica se a data que o usuário deseja marcar está livre, com intervalo de 1h
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id, //verifica se já tem um provedor de serviço no horário digitado
        canceled_at: null, //verifica se o agendamento estiver cancelado
        date: hourStart, //verifica se a data digitada não é quebrada
      },
    })

    //se a data não estiver vaga
    if (checkAvailability) {
      return res.status(400).json({ error: 'Appointment date is not available' });
    }

    const appointment = await Appointment.create({ //se passou pela verificação cria o agendamento
      user_id: req.user_id, //pega o user de autenticação em auth.js
      provider_id,
      date: hourStart, //verifica se a data digitada não é quebrada
    })

    return res.json(appointment);
  }
}

export default new AppointmentController();
