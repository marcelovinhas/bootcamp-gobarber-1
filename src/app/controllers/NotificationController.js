// ARQUIVO DE NOTIFICAÇÃO DE AGENDAMENTO PARA O PRESTADOR DE SERVIÇO

import User from '../models/User';
import Notification from '../schemas/Notification';

class NotificationController {
  async index (req, res) {
    const checkisProvider = await User.findOne({
      where: { id: req.userId, provider: true }, //verifica se o usuário logado é um prestador de serviço
    });

    if (!checkisProvider) {  //se não for prestador de serviço dá erro
      return res
        .status(401)
        .json({ error: 'Only providers can load notifications' });
    }

    const notifications = await Notification.find({
      user: req.userId, //usuário logado
    }).sort({ createdAt: 'desc' }) //ordena por createdAt por ordem decrescente, a ultima criada fica em cima
    .limit(20);  //limita 20 itens por página
    return res.json(notifications);
  }

  async update (req, res) {
    const notification = await Notification.findByIdAndUpdate( //encontra o registro e atualiza ao mesmo tempo
      req.params.id, //primeiro parâmetro id que vem da rota
      { read: true }, //segundo parâmetro é o que deseja atualizar dentro do objeto
      { new: true} //depois de atualizar retorna a nova notificação atualizada para listar o usuário
    );

    return res.json(notification);
  }
}

export default new NotificationController();
