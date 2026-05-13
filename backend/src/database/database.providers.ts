import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5433,
        username: 'myuser',
        password: 'mypassword',
        database: 'mydb',
        synchronize: true,
        logging: true,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        subscribers: [],
        migrations: [],
      });
      return dataSource.initialize();
    },
  },
];
