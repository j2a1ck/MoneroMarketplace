import { DataSource } from 'typeorm';
import { Order } from './order.entity';

export const orderPrivders = [
  {
    provide: 'ORDER_REPOSITORY',
    useFactory: (datasource: DataSource) => datasource.getRepository(Order),
    inject: ['DATA_SOURCE'],
  },
];
