const app = require('./src/app');
require('dotenv').config()
const config = require('./src/configs/configs');
const PORT = config.app.port || 3000;


const server = app.listen(PORT, () => {
    console.log(`Server running on port : ${PORT}`,);
})

process.on('SIGINT', () => {
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    })
})