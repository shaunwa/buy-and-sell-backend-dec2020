import Hapi from '@hapi/hapi';
import mysql from 'mysql';

export const listings = [{
    id: '123',
    name: 'Old Boat',
    description: 'A very old boat. Bargain price',
    price: 700,
    postedBy: '12345',
}, {
    id: '456',
    name: 'Basketball Hoop',
    description: 'Good condition, free delivery',
    price: 100,
    postedBy: '23456',
}];

const start = async () => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'hapi-server-dec2020',
        password: 'abc123!',
        database: 'buy-and-sell-dec2020',
    });

    const server = Hapi.server({
        port: 8000,
        host: 'localhost',
    });

    server.route({
        method: 'GET',
        path: '/api/listings',
        handler: async (req, h) => {
            const results = await new Promise((resolve, reject) => {
                connection.query('SELECT * FROM listings', (error, results) => {
                    if (error) return reject(error);
                    resolve(results);
                });
            });
            return results;
        },
    });

    server.route({
        method: 'GET',
        path: '/api/users/{id}/listings',
        handler: async (req, h) => {
            const { id } = req.params;
            const results = await new Promise((resolve, reject) => {
                connection.query('SELECT * FROM listings WHERE postedBy=?', [id], (error, results) => {
                    if (error) return reject(error);
                    resolve(results);
                });
            });
            return results;
        },
    });

    server.route({
        method: 'POST',
        path: '/api/listings',
        handler: async (req, h) => {
            const { name, price, description } = req.payload;
            const results = await new Promise((resolve, reject) => {
                const newId = '000';
                connection.query(
                    'INSERT INTO listings (id, name, price, description, postedBy) VALUES (?, ?, ?, ?, ?)',
                    [newId, name, price, description, '12345'],
                    (error, results) => {
                        if (error) return reject(error);
                        resolve(results);
                    }
                );
            });
            return results;
        }
    })

    await server.start();
    console.log(`Server is listening on ${server.info.uri}`);
}

process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(1);
});

start();