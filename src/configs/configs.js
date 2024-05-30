require('dotenv').config()

const development = {
    app:{
        port: process.env.PORT || 3000
    },
    db: {
        client: 'mysql2',
        connection: {
          host: process.env.DB_HOST || 'localhost',
          port: process.env.DB_PORT || 3306,
          user: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || "",
          database: process.env.DB_NAME,
        },
        pool: { min: 0, max: 10 },
        migrations: {
          directory: 'src/database/migrations', 
        },
        seeds: {
          directory: 'src/database/seeders'
        }
      },
}
const production = {
    app:{
        port: process.env.PORT || 3000
    },
    db: {
        client: 'mysql2',
        connection: {
          host: process.env.DB_HOST || 'localhost',
          port: process.env.DB_PORT || 3306,
          user: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || "",
          database: process.env.DB_NAME,
        },
        pool: { min: 0, max: 10 },
        migrations: {
          directory: 'src/database/migrations', 
        },
        seeds: {
          directory: 'src/database/seeders'
        }
      },
}
const config = { development, production}
const env = process.env.NODE_ENV || 'development'
module.exports = config[env]
