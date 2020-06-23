// ARQUIVO DE LISTAGEM DE PRESTADOR DE SERVIÇO

import User from '../models/User';
import File from '../models/File';

class ProviderController {
  async index(req, res) {
    const providers = await User.findAll({
      where: { provider: true }, // ve no banco de dados se a coluna provider do usuário é true
      attributes: ['id','name','email','avatar_id'], // retorna apenas esses atributos no Insomnia
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ], // pega os dados de file
    });
    return res.json(providers);
  }
}

export default new ProviderController();
