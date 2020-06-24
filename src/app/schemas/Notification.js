/*
armazenar as notificações dos agendamentos para o prestador de serviço dentro do mongo
schema é equivalente ao model que representa a tabela
no mongo não usa tabela, usa schema, a diferença é que nas tabelas os dados são estruturados
nas tabelas, as colunas das tabelas são iguais para todos os dados
no mongodb usa "schema free", os dados podem ter campos diferentes, no mongo não tem migration
quando altera algum campo no schema, não dá mais pra pegar esse campo, tem que fazer um "backup"
*/

import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  content: { //conteúdo da notificação
    type: String,
    required: true,
  },
  user: { //id do usuário
    type: Number,
    required: true,
  },
  read: { //se a notificação foi lida ou não
    type: Boolean,
    required: true,
    default: false,
  },
},
{
  timestamps: true, //campos created_at e updated_at
}
);

export default mongoose.model('Notification', NotificationSchema);
