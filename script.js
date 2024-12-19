document.addEventListener('DOMContentLoaded', function() {
    const startStreamingButton = document.getElementById('startStreaming');
    const liveStream = document.getElementById('liveStream');

    startStreamingButton.addEventListener('click', async () => {
        try {
            // Verifica se o navegador suporta mídia de captura
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true
            });

            liveStream.srcObject = stream;
            liveStream.play();

            startStreamingButton.disabled = true;
            startStreamingButton.textContent = 'Transmissão Iniciada';

            // Inicia a comunicação com o servidor
            connectToServer(stream);
        } catch (error) {
            console.error('Erro ao iniciar a transmissão:', error);
            alert('Não foi possível iniciar a transmissão. Verifique a câmera do seu dispositivo.');
        }
    });
});

// Conectar ao servidor para comunicação em tempo real
function connectToServer(stream) {
    const socket = new WebSocket('ws://your_server_address'); // Substitua "your_server_address" pelo endereço do seu servidor WebSocket

    socket.addEventListener('open', () => {
        console.log('Conexão com o servidor estabelecida.');

        // Envia a stream para o servidor
        const sendStream = (stream) => {
            const videoTrack = stream.getVideoTracks()[0];
            socket.send(videoTrack);
        };

        sendStream(stream);

        // Recebe as transmissões do servidor
        socket.addEventListener('message', (event) => {
            const incomingStream = new MediaStream([event.data]);
            liveStream.srcObject = incomingStream;
            liveStream.play();
        });
    });

    socket.addEventListener('error', (error) => {
        console.error('Erro na comunicação com o servidor:', error);
    });
}
