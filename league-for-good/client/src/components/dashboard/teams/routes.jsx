import React from 'react';
import { Route } from 'react-router-dom';

import * as Links from '../../routes';

import TeamTable from './team_list/teamList.jsx';
import TeamRoster from './team_roster_list/rosterList.jsx';
import Player from '../players/player_list/playerDetails.jsx';
import AddTeamForm from './forms/addTeamForm.jsx';

const TeamRoutes = () => (
	<div>
		<Route component={TeamTable} exact={true} path={Links.TEAM_LIST} />
		<Route component={TeamRoster} path={Links.TEAM_ROSTER} />
		<Route component={Player} path={Links.TEAM_ROSTER_PLAYER_DETAIL} />
		<Route component={AddTeamForm} path={Links.TEAM_ADD_FORM} />
	</div>
);

export default TeamRoutes;
