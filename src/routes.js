import { Router } from 'express'; // importa apenas o Router em vez do express inteiro
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController.js';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

// criação de usuários no Insomnia
routes.post('/users', UserController.store);

// rota para logar
routes.post('/sessions', SessionController.store);

// como está depois das duas rotas anteriores, só vai valer pras rotas que vem depois
routes.use(authMiddleware);

// rota para atualizar dados
routes.put('/users', UserController.update);

// rota para listagem dos prestadores de serviço
routes.get ('/providers', ProviderController.index);

//rota para listagem
routes.get('/appointments', AppointmentController.index);
// rota para agendamento -- TIMEZONE
routes.post('/appointments', AppointmentController.store);
// rota para cancelar agendamento, pode cancelar com até duas horas do horário
routes.delete('/appointments/:id', AppointmentController.delete);

// rota para listagem de agendamentos do dia para o prestador de serviço
routes.get('/schedule', ScheduleController.index);

// rota para lista de notificaçãos dos agendamentos para o prestador de serviço
routes.get('/notifications', NotificationController.index);
// rota para marcar uma notificação como lida, recebendo o id da notificação, precisa passar o id no Insomnia
routes.put('/notifications/:id', NotificationController.update);

// rota do multer - imagem, no Insomnia criar post em multipart em vez de JSON
// single para fazer um upload por vez e não vários e o nome do campo da requisição file
routes.post ('/files', upload.single('file'),FileController.store);



export default routes;
