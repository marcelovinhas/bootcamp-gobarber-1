/* eslint-disable prettier/prettier */
import { Router } from 'express'; // importa apenas o Router em vez do express inteiro

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// criação de usuários no Insomnia
routes.post('/users', UserController.store);

// rota para logar
routes.post('/sessions', SessionController.store);

// como está depois das duas rotas anteriores, só vai valer pras rotas que vem depois
routes.use(authMiddleware);

// rota para atualizar dados
routes.put('/users', UserController.update);


export default routes;
