import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class RemoveEmailAndOtp1781347200000 implements MigrationInterface {
  name = 'RemoveEmailAndOtp1781347200000';

  async up(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('otps')) {
      await queryRunner.dropTable('otps', true, true, true);
    }

    if (await queryRunner.hasColumn('users', 'email')) {
      await queryRunner.dropColumn('users', 'email');
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasColumn('users', 'email'))) {
      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'email',
          type: 'varchar',
          length: '64',
          isNullable: true,
        }),
      );
    }

    if (!(await queryRunner.hasTable('otps'))) {
      await queryRunner.createTable(
        new Table({
          name: 'otps',
          columns: [
            {
              name: 'id',
              type: 'int',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'userId', type: 'int' },
            { name: 'token', type: 'varchar', length: '64' },
            {
              name: 'type',
              type: 'enum',
              enum: ['register', 'login'],
            },
            { name: 'attempts', type: 'int', default: 0 },
            { name: 'isUsed', type: 'boolean', default: false },
            { name: 'expiresAt', type: 'timestamp' },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'now()',
            },
          ],
        }),
      );
      await queryRunner.createForeignKey(
        'otps',
        new TableForeignKey({
          columnNames: ['userId'],
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
    }
  }
}
