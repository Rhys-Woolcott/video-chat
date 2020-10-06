const express = require('express');
const app = express();
const http = require('http');
const fs = require('fs');

const server = require('http').Server(app);
const sslserver = require('http').createServer(
	{
		key: fs.readFileSync('public/private.key'),
		cert: fs.readFileSync('public/certificate.crt'),
		ca: [ fs.readFileSync('public/ca_bundle.crt') ]
	},
	app
);
const io = require('socket.io')(server);
const pem = require('pem');
let port = 8080;
let ssl_port = 8443;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.render('index.ejs', {
		title: `GALACTIX Video Chat`,
		logo: '/img/PersonalLogo.svg'
	});
});

app.get('/call/:room', (req, res) => {
	let room_id = req.params.room;

	res.render('room', {
		roomID: room_id,
		title: `Room: ${room_id} | GALACTIX Video Chat`,
		logo: '/img/PersonalLogo.svg'
	});
});

app.use(async (req, res, next) => {
	res.status(404).send('Failed to find page/room');
});

io.on('connect', (socket) => {
	socket.on('join-room', (roomId, userId) => {
		socket.join(roomId);
		socket.to(roomId).broadcast.emit('user-connect', userId);

		socket.on('disconnect', () => {
			socket.to(roomId).broadcast.emit('user-disconnect', userId);
		});
	});
});

server.listen(port, () => {
	console.log(`Started port: ${port}`);
});
sslserver.listen(ssl_port, () => {
	console.log(`Started port: ${ssl_port}`);
});
