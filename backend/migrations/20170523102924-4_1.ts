import type { DataTypes, MigrationObject, QueryInterface } from './common/types';

function createResourcesModel(queryInterface: QueryInterface, Sequelize: DataTypes) {
    return queryInterface
        .createTable('Resources', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },

            resourceId: { type: Sequelize.STRING, allowNull: false },
            type: { type: Sequelize.ENUM, values: ['widget', 'template'], allowNull: false },
            creator: { type: Sequelize.STRING, allowNull: true },

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        })
        .then(() =>
            queryInterface.addIndex('Resources', ['resourceId', 'type'], {
                type: 'UNIQUE'
            })
        );
}

export const { up, down }: MigrationObject = {
    up(queryInterface, Sequelize) {
        return createResourcesModel(queryInterface, Sequelize);
    },

    down(queryInterface) {
        return queryInterface.dropTable('Resources');
    }
};
