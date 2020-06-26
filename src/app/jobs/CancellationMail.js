import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  //get key() usa para retornar uma variável sem chamar o método, sem criar constructor
  //exemplo: import CancellationMail from '..', poderia usar CancellationMail.key()
  get key() {
    return 'CancellationMail'; //precisa retonar uma chave única
  }

  async handle({ data }) { //método que aplica a tarefa que precisa executar quando determinada fila
    const { appointment } = data; //data é a informação para o envio de email

    await Mail.senddMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`, //para quem vai enviar o email
      subject: 'Agendamento cancelado',
      template: 'cancellation', //arquivo do template
      context: { //enviar as variáveis que o template está esperando
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(parseISO(appointment.date), "'dia' dd 'de' MMMM', às' H:mm'h'", {
          locale: pt,
        }),
      },
    });
  }
}

export default new CancellationMail();
