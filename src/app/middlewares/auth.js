// arquivo para verificar se o usuário está logado para editar os dados
// no Insomnia entrar no update, ir em Bearer e colocar o token adquirido do usuário

import jwt from 'jsonwebtoken';
import {promisify} from 'util'; // pega uma função callback e transforma em async await

import authConfig from '../../config/auth';

export default async (req, res, next) => { // next para continuar para o próximo middleware mesmo se der erro
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({error: 'Token not provided'});
  }

  // divide a header (Bearer token) para pegar apenas o token
  // para pegar apenas o token [, token]
  // o array é [bearer, token] com a , pega a apenas a posição 1 do array
  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({error: 'Token invalid'});
  }
};
