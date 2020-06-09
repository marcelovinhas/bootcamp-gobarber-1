/* eslint-disable prettier/prettier */
import { Router } from 'express'; // importa apenas o Router em vez do express inteiro
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

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


// rota do multer - imagem, no Insomnia criar post em multipart em vez de JSON
// single para fazer um upload por vez e não vários e o nome do campo da requisição file
routes.post ('/files', upload.single('file'), (req, res) => {
  return res.json({ ok: true});
});


export default routes;
