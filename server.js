const WebSocket = require('ws');

// Cria o servidor WebSocket
const server = new WebSocket.Server({ port: 8080 });

console.log('Servidor WebSocket iniciado na porta 8080');

server.on('connection', (socket) => {
    console.log('Nova conexão estabelecida.');

    socket.on('message', (data) => {
        // Envia a transmissão recebida para todos os outros clientes conectados
        server.clients.forEach(client => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });

    socket.on('close', () => {
        console.log('Conexão fechada.');
    });

    socket.on('error', (error) => {
        console.error('Erro na conexão:', error);
    });
});
