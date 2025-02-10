const WebSocket = require('ws');
const mysql = require('mysql2');

// Create WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

console.log("WebSocket Server started on port 8080");

// Database connection (replace with your cPanel MySQL details)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'data_task'
});

wss.on('connection', (ws) => {
    console.log('Client connected');

    // Send initial data
    db.query('SELECT * FROM infomation', (err, results) => {
        if (!err) ws.send(JSON.stringify(results));
    });

    ws.on('message', (message) => {
        console.log('Received: ${message}');
        // console.log(Received: ${message});
    });

    ws.on('close', () => console.log('Client disconnected'));
});

// Broadcast updates every 5 seconds
setInterval(() => {
    db.query('SELECT * FROM infomation', (err, results) => {
        if (!err) {
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(results));
                }
            });
        }
    });
}, 5000);

 const socket = new WebSocket('ws://localhost:8080');
//  your-vps-ip

socket.onopen = () => console.log('Connected to WebSocket');
socket.onmessage = (event) => console.log('Received:', event.data);
socket.onerror = (error) => console.error('WebSocket Error:', error);
socket.onclose = () => console.log('WebSocket closed');