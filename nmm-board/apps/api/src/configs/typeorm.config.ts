import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import config from 'config';

interface DbConfig {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
}

const dbConfig = config.get<DbConfig>('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  ...dbConfig,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
};
