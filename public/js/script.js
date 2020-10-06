const socket = io('/');
const videoGrid = document.getElementById('video_grid');
const myPeer = new Peer(undefined, {
	host: 'localhost',
	port: '8118',
	path: '/'
});
let egg = { video: true, audio: true };

const myVideo = document.createElement('video');
myVideo.muted = true;

var join = new Audio('https://vps.galactix.xyz/audio/join.mp3');
var leave = new Audio('https://vps.galactix.xyz/audio/leave.mp3');
var mute = new Audio('https://vps.galactix.xyz/audio/mute.mp3');

const peers = {};
navigator.mediaDevices.getUserMedia(egg).then((stream) => {
	addVideoStream(myVideo, stream);

	myPeer.on('call', (call) => {
		call.answer(stream);
		const video = document.createElement('video');
		call.on('stream', (userVideoStream) => {
			addVideoStream(video, userVideoStream);
		});
	});

	socket.on('user-connect', (userId) => {
		connectToNewUser(userId, stream);
		join.play();
	});
});

socket.on('user-disconnect', (userId) => {
	if (peers[userId]) peers[userId].close();
	leave.play();
});

myPeer.on('open', (id) => {
	socket.emit('join-room', ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
	const call = myPeer.call(userId, stream);
	const video = document.createElement('video');
	call.on('stream', (userVideoStream) => {
		addVideoStream(video, userVideoStream);
	});
	call.on('close', () => {
		video.remove();
	});

	peers[userId] = call;
}

function addVideoStream(video, stream) {
	video.srcObject = stream;
	video.addEventListener('loadedmetadata', () => {
		video.play();
	});
	videoGrid.append(video);
}

console.log(
	'%cDO NOT COPY AND PASTE ANYTHING HERE, ANYONE ASKING YOU TO IS TRYING TO STEAL YOUR INFORMATION!',
	'color: red; font-size: 50px;'
);
