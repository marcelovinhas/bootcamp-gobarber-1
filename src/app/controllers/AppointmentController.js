// agendamento de serviço, para o usuário comum
import * as Yup from 'yup'; //para fazer validação do schema
import {startOfHour, parseISO, isBefore, format} from 'date-fns'; //biblioteca de datas yarn add date-fns@next
import pt from 'date-fns/locale/pt'; //data em português
import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification'; //enviar notificação para o prestador de serviço com os agendamentos

class AppointmentController {
  async index(req,res) { //listagem de provedores de serviço
    const { page = 1 } = req.query; //query é o parâmetro anexado na url (olocado no query do Insomnia)

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null}, //lista os agendamentos que não foram cancelados
      order: ['date'], //ordernar por data

      limit: 20, //no máximo 20 agendamentos por página
      offset: (page - 1) * 20, //se estiver na primeira página (1-1)*20 = 0 não pula registros
      //se estiver na segunda página (2-1)*20 = 20 pula 20 registros
      attributes: ['id','date'], //para retornar para o Imsomnia apenas id e data do agendamento
      include: [ //incluir os dados do prestador de serviço
        {
          model: User,
          as: 'provider', //como em Appointment.js relaciona com User duas vezes, precisa especificar
          attributes: ['id', 'name'], //para retornar para o Imsomnia apenas id e name do usuário
          include: [ //para retornar o avatar
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'], //path é obrigatório pois File.js depende de path
            }
          ]
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) { //se o schema for valido
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body; //pega provider_id e date

    const checkisProvider = await User.findOne({ //verifica se o usuário é um provedor de serviço
      where: { id: provider_id, provider: true },
    });

    if (!checkisProvider) {  //se não for provedor de serviço dá erro
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
      user_id: req.userId, //pega o user de autenticação em auth.js
      provider_id,
      date: hourStart, //verifica se a data digitada não é quebrada
    });

    const user = await User.findByPk(req.userId); //variável para colocar na notificação ${user.name}

    const formattedDate = format( //para definir formato de data
      hourStart, //data que quer formatar
      "'dia' dd 'de' MMMM', às' H:mm'h'", //formatação o que está em aspas simples '' sairá escrito literalmente
      //"dia 23 de julho, às 16:00" vai ficar assim no mongodb
      { locale: pt } //para o mês ficar em português
    );

    //notificação de agendamento para o prestador de serviço
    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id, //colocar qual usuário vai receber a notificação
    });


    return res.json(appointment);
  }
}

export default new AppointmentController();
