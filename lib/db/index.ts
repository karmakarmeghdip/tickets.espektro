import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'

export const db = drizzle({
  connection: {
    url: process.env.TURSO_DB_URL || 'file:./db.sqlite',
    authToken: process.env.TURSO_DB_TOKEN,
  },
  schema: schema
})