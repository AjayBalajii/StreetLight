const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

// Set up serial port communication with Arduino over Bluetooth
const portName = '/dev/cu.usbserial-10'; // Change this to match your Arduino's serial port
//const portName = '/dev/cu.Bluetooth-Incoming-Port';
const serialPort = new SerialPort.SerialPort({ baudRate: 9600,
path: portName});
const parser = new Readline.ReadlineParser("\n");
serialPort.pipe(parser);

// Serve HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Forward data from serial port to WebSocket clients
parser.on('data', function(data) {
  io.emit('arduinoData', data);
});

// Start server
const PORT = 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
