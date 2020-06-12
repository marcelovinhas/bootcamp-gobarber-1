module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('appointments', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER, // INTEGER pq vai referenciar apenas o id e não imagem em si e não todo conteúdo dela
        references: { model: 'users', key: 'id' }, // references é uma chave estrangeira (banco relacional)
        onUpdate: 'CASCADE', // se um dia o arquivo da tabela for alterado
        onDelete: 'SET NULL', // quando o usuário for deletado, todos os agendamentos ficaram no histórico
        allowNull: true,
      },
      provider_id: {
        type: Sequelize.INTEGER, // INTEGER pq vai referenciar apenas o id e não imagem em si e não todo conteúdo dela
        references: { model: 'users', key: 'id' }, // references é uma chave estrangeira (banco relacional)
        onUpdate: 'CASCADE', // se um dia o arquivo da tabela for alterado
        onDelete: 'SET NULL', // se um dia o arquivo da tabela for deletado
        allowNull: true,
      },
      canceled_at: {
        type: Sequelize.DATE,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('users');
  },
};
