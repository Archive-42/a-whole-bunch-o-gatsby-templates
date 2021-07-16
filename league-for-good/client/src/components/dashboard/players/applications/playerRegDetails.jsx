import React from 'react';
import PropTypes from 'prop-types';
import { cssContent, cssDashboard } from '../../../style';

import IconButton from 'material-ui/IconButton';
import BackArrow from 'material-ui/svg-icons/navigation/arrow-back';

const PlayerApplication = ({ location, history }) => {
	// Player application is loaded from state stored in react-router's
	// location property rather than from redux store
	/*
		As pending_player data grows perhaps its a better idea to fetch
		the info from the server rather than loading it all at once when
		the page initializes
	*/
	const { state: { player }} = location;
	if (!player) {
		return (
			<h2>...Loading</h2>
		);
	}

	return (
		<div style={cssContent.body}>
			<IconButton
				onTouchTap={() => history.goBack()}
				tooltip='Back'
				>
				<BackArrow />
			</IconButton>
			<h1 style={cssDashboard.title}>
				{player.fullName}
			</h1>
			<h4>Email: {player.email}</h4>
			<h4>Phone: {player.phoneNum}</h4>
			{
				player.address && <div>
					<h3 style={cssDashboard.title}>
						Address
					</h3>
					<h4>Street: {player.address.street}</h4>
					<h4>City: {player.address.city}</h4>
					<h4>State: {player.address.state}</h4>
					<h4>Country: {player.address.country}</h4>
				</div>
			}
			<hr/>
		</div>
	);
};

PlayerApplication.propTypes = {
	history: PropTypes.object,
	location: PropTypes.object
};

export default PlayerApplication;
