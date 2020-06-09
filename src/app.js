/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
// DOCKER + POSTGRES
// instalar docker e fazer os passos do site https://www.optimadata.nl/blogs/3/n8dyr5-how-to-run-postgres-on-docker-part-1
// para conectar no postbird o local host deve ser o endereço do ip que aparece no cmd do docker 192.168.99.100
// sequelize serve para poder escrever banco de dados em js em vez de sql

/*
PASTAS
CONFIG - maioria das configurações da aplicação

DATABASE - tudo relativo a parte de database e a configuração de conexão

APP - maioria do código que envolve regra de negócio, lógica ou qualquer código, como controllers e models
*/

// ARQUIVO DA ESTRUTURA DA APLICAÇÃO
import express from 'express'; // para conseguir escrever como import em vez de const express = require('express');
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
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server; // só exporta o server
