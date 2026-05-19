import { DataSource } from 'typeorm';
import { Product } from './product.entity';

export const productProvider = [
  {
    provide: 'PRODUCT_REPOSITORY',
    useFactory: (datasource: DataSource) => datasource.getRepository(Product),
    inject: ['DATA_SOURCE'],
  },
];
