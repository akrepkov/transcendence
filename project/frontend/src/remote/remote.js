
import { setupSocketEvents} from './socket.js';
import * as network from "./network.js"
// const socket  = new WebSocket('wss://localhost:3000/ws/game');
let socket = null;
export async function openRemoteTab() {
    // const socket = new WebSocket('wss://congenial-system-x76557wwgx93px46-3000.app.github.dev/ws/game');
    
	if (socket === null)
		socket  = new WebSocket('wss://localhost:3000/ws/game');
	console.log("connected to socket", socket);	
    setupSocketEvents(socket);
}







/******************Extra functions *****************/
export function showSection(divToShow) {
    /*
el.classList.toggle(className, force) is a DOM method that toggles a class on the element:
If force is true, it adds the class.
If force is false, it removes the class.
    */
    const sections = ['waitingRoom', 'invitation', 'rejection', 'gameContainer'];
    sections.forEach(section => {
        const el = document.getElementById(section);
        if (el) {
            el.classList.toggle('hidden', section !== divToShow);
        }
    });
}

export function handleStatusUpdate({ status }) {
    switch (status) {
        case 'waiting':
            showSection('waitingRoom');
			network.stopGame();
            break;
        case 'invited':
            showSection('invitation');
            break;
        case 'playing':
            showSection('gameContainer');
            break;
		case 'rejection':
			showSection('rejection');
			break;
    }
}

export function clearAllInvitationTimeouts(inviterTimeout, opponentTimeout) {
	clearTimeout(inviterTimeout);
	clearTimeout(opponentTimeout);
	inviterTimeout = null;
	opponentTimeout = null;
}