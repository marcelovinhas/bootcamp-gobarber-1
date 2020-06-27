// DOCKER + POSTGRES
// instalar docker e fazer os passos do site https://www.optimadata.nl/blogs/3/n8dyr5-how-to-run-postgres-on-docker-part-1
// para conectar no postbird o local host deve ser o endereço do ip que aparece no cmd do docker 192.168.99.100
// sequelize serve para poder escrever banco de dados em js em vez de sql

// DOCKER + MONGODB
// no docker: docker run --name mongobarber -p 27017:27017 -d -t mongo
// não dá pra acessar por localhost:27017, não sei pq, não esquentar com isso
// para conectar no mondodb pass community usar 192.168.99.100
// mongodb é para utilizar banco não relacional
// banco relacional para dados que não vão ser estruturados e não vão ter relacionamentos
// para o postgres ou mysql usa o sequelize, para o mongodb usa mongoose, yarn add mongoose

// DOCKER + REDIS
// no docker: docker run --name redisbarber -p 6379:6379 -d -t redis:alpine
// é um banco não relacional que diferente do mongodb usa apenas chave valor, por isso é mais performático
// bee queue é mais performático mas não possui todas as funções de fila, para enviar email é o suficiente
// kue é menos performático mas tem mais funções
// yarn add bee-queue

// TRATAMENTO DE EXCEÇÕES
// quando a aplicação vai para produção, pode acontecer vários erros, na fila, nos querys dos bancos de dados
// para saber dos erros usar sentry ou bugsnag, prefere sentry.io
// criar projeto em express ou nodejs, yarn add @sentry/node@5.18.1
// como faz o async no AppointmentController o express não consegue pegar esses erros, por isso yarn add express-async-errors
// se houver algum erro aparece no sentry.io mostrando, também pode aparecer no próprio visual studio
// yarn add youch dá uma visualização melhor dos tratamentos de erro para o desenvolvedor para aparecer no Insomnia
// sentry consegue integrar com slack para envio de email, github

// VARIÁVEIS DE AMBIENTE
// informações escritas em .env


/*
PASTAS
CONFIG - maioria das configurações da aplicação

DATABASE - tudo relativo a parte de database e a configuração de conexão

APP - maioria do código que envolve regra de negócio, lógica ou qualquer código, como controllers e models

LIB - configuração de coisas adicionais da aplicação, como configuração de email por exemplo
*/

// ARQUIVO DA ESTRUTURA DA APLICAÇÃO
import 'dotenv/config'; //carrega as variáveis de ambiente e coloca em process.env

import express from 'express'; // para conseguir escrever como import em vez de const express = require('express');
import path from 'path';
import Youch from 'youch';
import * as Sentry from '@sentry/node'; // tratamento de erros para aplicação em produção
import 'express-async-errors'; // esse import deve vir antes das rotas

import routes from './routes'; // precisa dar yarn add sucrase nodemon -D, nodemon serve para atualizar as alterações
import sentryConfig from './config/sentry';

import './database';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig); //inicializa sentry

    this.middlewares(); // chama o método middlewares
    this.routes(); // chama o método routes
    this.exceptionHandler(); //chama método exceptionHandler para tratamento de erro
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler()); //necessário antes das rotas, documentação sentry
    this.server.use(express.json()); // receber requisição no formato json
    // recurso do express express.static serve para seguir arquivos estáticos como imagem, css, html
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..','tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler()); //necessário depois das rotas, documentação sentry
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => { //middleware de 4 parâmetros é para tratamento de exceções
      if(process.env.NODE_ENV === 'development') { //verifica se o ambiente é development
      const errors = await new Youch(err, req).toJSON();

      return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server; // só exporta o server
