import axios from 'axios';
import { CLOSE_MODAL, REMOVE_PLAYER } from '../types';
import { ROOT_URL } from '../../../globals';

export function deletePlayerRegistration({ player }) {
	return dispatch =>
		axios.delete(`${ROOT_URL}/register/delete/${player._id}`)
			.then(() =>
				dispatch({type: REMOVE_PLAYER, playerId: player._id})
			)
			.then(() => dispatch({type: CLOSE_MODAL}));
}
