// ARQUIVO PARA PROCESSAR FILA
//criou esse arquivo pq não vai executar a aplicação no mesmo node da fila
//a fila pode estar rodando em um servidor, e a aplicação em outro lugar, dessa forma a fila não atrapalha a aplicação
import Queue from './lib/Queue';

Queue.processQueue();

//em um cmd yarn dev, em outro cmd digitar yarn queue, para rodar em dois nodes
