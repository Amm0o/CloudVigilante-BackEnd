import dotenv from 'dotenv';
import mysql, { Pool } from 'mysql2/promise';

dotenv.config();

export async function connect(): Promise<Pool> {
    try {
        let connectionPool: Pool;

        connectionPool = await mysql.createPool({
            connectionLimit: 10,
            host: process.env.dbHost as string,
            user: process.env.dbUser as string,
            password: process.env.dbPass as string,
            database: process.env.dbName as string
        });

        return connectionPool;
    } catch (error) {
        console.error('Database connection failed!: ', error);
        throw error;
    }
}
