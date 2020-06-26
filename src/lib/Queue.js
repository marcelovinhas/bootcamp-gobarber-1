// ARQUIVO DE CONFIGURAÇÃO DE FILA - yarn add bee-queue
import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

const jobs = [CancellationMail]; //sempre que tiver um novo job, importa para o vetor CancellationMail

class Queue {
  constructor() {
    this.queues = {};
    //cada tipo de serviço, background job tem sua própria fila
    //email de cancelamento é uma fila, de recuperação de senha usa outra fila

    this.init();
  }

  init() { //inicializa a fila
    //for each para percorrer o vetor, poderia ser map, mas como não vai retornar nada preferiu for each
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, { //key como primeiro parâmetro, segundo parâmetro passa as configurações
          redis: redisConfig,
         }),
        handle, //handle vai processar o job, e vai realizar a tarefa
      };
    });
  }

  add(queue, job) { //método para adicionar jobs dentro de cada fila
    //primeiro parâmetro = queue, no caso CancellationMail
    //segundo parâmetro = job, dados do appointment
    return this.queues[queue].bee.createJob(job).save();
    //[queue] é qual fila quer passar no caso CancellationMail
    //dentro de bee tem createJob e passa os dados que recebe pelo job
  }

  processQueue() { //método para processar a fila
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, error) { //método para mostrar erros na fila
    console.log(`Queue ${job.queue.name}: FAILED`, error);
  }
}

export default new Queue();
