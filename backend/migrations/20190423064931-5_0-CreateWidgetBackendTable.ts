import type { MigrationObject } from './common/types';

export const { up, down }: MigrationObject = {
    up: (queryInterface, Sequelize) => {
        return queryInterface
            .createTable('WidgetBackends', {
                id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },

                widgetId: { type: Sequelize.STRING, allowNull: false },
                serviceName: { type: Sequelize.STRING, allowNull: false },
                method: { type: Sequelize.STRING, allowNull: false },
                script: { type: Sequelize.JSONB, allowNull: true },

                createdAt: { type: Sequelize.DATE, allowNull: false },
                updatedAt: { type: Sequelize.DATE, allowNull: false }
            })
            .then(() =>
                queryInterface.addIndex('WidgetBackends', ['widgetId', 'serviceName', 'method'], {
                    type: 'UNIQUE'
                })
            );
    },

    down: (queryInterface, _Sequelize, logger) => {
        return queryInterface
            .dropTable('WidgetBackends', { cascade: true, logging: logger.info, benchmark: true })
            .then(() =>
                queryInterface.removeIndex('WidgetBackends', ['widgetId', 'serviceName', 'method'], {
                    type: 'UNIQUE'
                })
            );
    }
};
