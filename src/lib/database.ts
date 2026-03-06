import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Calculation } from '@/entities/Calculation';
import { SharedCalculation } from '@/entities/SharedCalculation';
import path from 'path';
import fs from 'fs';

const DATABASE_PATH = process.env.DATABASE_PATH || './data/newbie.sqlite';

// Ensure the data directory exists
const dataDir = path.dirname(path.resolve(DATABASE_PATH));
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: path.resolve(DATABASE_PATH),
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  entities: [Calculation, SharedCalculation],
});

let initialized = false;
let initPromise: Promise<DataSource> | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (initialized && AppDataSource.isInitialized) {
    return AppDataSource;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = AppDataSource.initialize()
    .then((ds) => {
      initialized = true;
      return ds;
    })
    .catch((err) => {
      initPromise = null;
      throw err;
    });

  return initPromise;
}

export default AppDataSource;
