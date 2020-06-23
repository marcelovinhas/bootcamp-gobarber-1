// TODA A CONFIGURAÇÃO DA PARTE DE UPLOAD DE ARQUIVOS

import multer from 'multer';
import crypto from 'crypto'; // biblioteca que vem como padrão no node
import { extname, resolve } from 'path';
// extname retorna de acordo com o nome de uma imagem ou arquivo qual a extensão do arquivo
// resolve para percorrer um caminho dentro da aplicação

export default {
  storage: multer.diskStorage({
    // é como o multer vai guardar os arquivos de imagem
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'), // destino dos arquivos, a cada '..' ele volta uma pasta
    filename: (req, file, cb) => {
      // como vai formatar o nome de arquivo da imagem, adicionar um nome para cada imagem, para ser um arquivo único
      // file são os todos os dados do arquivo, tipo do arquivo, nome, tamanho, etc
      // cb = callback, usa formato de cb e não de async await (err, res) é o cb

      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        // senão der erro, null é o primeiro parâmetro pq se refere ao err, no segundo passa o res
        // transforma os 16 bytes aleatórios em uma string hexadecimal
        // concatena com a extensão do arquivo que o usuário fez upload
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
