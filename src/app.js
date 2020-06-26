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


/*
PASTAS
CONFIG - maioria das configurações da aplicação

DATABASE - tudo relativo a parte de database e a configuração de conexão

APP - maioria do código que envolve regra de negócio, lógica ou qualquer código, como controllers e models

LIB - configuração de coisas adicionais da aplicação, como configuração de email por exemplo
*/

// ARQUIVO DA ESTRUTURA DA APLICAÇÃO
import express from 'express'; // para conseguir escrever como import em vez de const express = require('express');
import path from 'path';
import routes from './routes'; // precisa dar yarn add sucrase nodemon -D, nodemon serve para atualizar as alterações

import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares(); // chama o método middlewares
    this.routes(); // chama o método routes
  }

  middlewares() {
    this.server.use(express.json()); // receber requisição no formato json
    // recurso do express express.static serve para seguir arquivos estáticos como imagem, css, html
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..','tmp', 'uploads'))
      );
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server; // só exporta o server
