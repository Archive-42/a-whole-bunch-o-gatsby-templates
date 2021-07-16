import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	Table,
	TableBody,
	TableHeader,
	TableHeaderColumn,
	TableRow,
	TableRowColumn
} from 'material-ui/Table';

import TextField from 'material-ui/TextField';
import SearchIcon from 'material-ui/svg-icons/action/search';
import ArrowUp from 'material-ui/svg-icons/navigation/arrow-drop-up';
import ArrowDown from 'material-ui/svg-icons/navigation/arrow-drop-down';
import { cssDashboard } from '../../../style';


// IMPORTED STYLES
const { table: {
	sortArrowActiveColor,
	sortArrowInactiveColor,
	colHeaderLabelStyle,
	colHeaderStyle
}} = cssDashboard;
// ///////////////////////


// A table template to easily render a table in the management panel
// Also allows the styling of each column to be specified or uses a default
// styling component, where each column is an equal width
//
// Table template component takes in three props
//
// @title(optional) - String: The title of the table at the top of the panel
//
// @headers - [Object]: An array of objects
//		Each object requires the following fields:
//			label(String) - Column name
//			style(Object) - a css object to style the column(optional)
//			sortable(Boolean) - true if column is sortable; false otherwise
//			searchable(Boolean) - true if column is searchable
//								  currently only allowed on one column
//								  if no searchable column is found, search will not render
//
// @rows - [[Object]]: An array of an array of objects
//		The rows array is an array containing each row in the table
//		Each row maps to the headers prop, so arrays must be the same length
//		Each row is an array of objects with each object being a cell value
//		Each row is passed in with the following values in the objects:
//			value - Value that will be displayed in the cell
//			style(Object) - a css object to style the cell(optional)


// Optional title for the table
const TableTitle = (props) => {
	return <h1 style={cssDashboard.title}>{props.title}</h1>;
};

TableTitle.propTypes = {
	title: PropTypes.string
};

// Optional search for the table
const SearchTable = (props) => {
	return (
		<TextField
			floatingLabelFixed={true}
			floatingLabelText={'Search ' + props.searchLabel}
			hintText={<SearchIcon />}
			onChange={props.onSearch}
			style={cssDashboard.table.search}
			underlineFocusStyle={cssDashboard.table.searchUnderline}
		/>
	);
};

SearchTable.propTypes = {
	onSearch: PropTypes.func,
	searchLabel: PropTypes.string
};

// Header row for the table containing column names
const Headers = (props) => {
	return (
		<TableRow>
			{
				props.headers.map(function(header, i) {
					return (
						<TableHeaderColumn
							colSpan={header.colSpan || 1}
							key={i}
							style={colHeaderStyle}
							>
							<ColumnHeaderChild
								colIndex={i}
								label={header.label}
								onClick={props.onSort}
								sortable={header.sortable}
								sortColumnIndex={props.sortColumnIndex}
								sortDirection={props.sortDirection}
							/>
						</TableHeaderColumn>
					);
				})
			}
		</TableRow>
	);
};

Headers.propTypes = {
	headers: PropTypes.arrayOf(PropTypes.object),
	onSort: PropTypes.func,
	sortColumnIndex: PropTypes.number,
	sortDirection: PropTypes.string
};

// Renders the TableRow components that will appear inside the TableBody
// Not a functional component. This returns an array rather than a component
const renderBody = (rows) => {
	return (
			rows.map(function(row, i) {
				return (
					<TableRow
						key={i}
						selectable={false}
						>
						{
							row.map(function(rowData, i) {
								return (
									<TableRowColumn
										colSpan={rowData.colSpan}
										key={i}
										>
										{ i === 0 ? <strong>{rowData.value}</strong>
												: <span>{rowData.value}</span>
										}
									</TableRowColumn>
								);
							})
						}
					</TableRow>
				);
			})
	);
};

// column header with sorting icons
// when clicked will sort columns with asc, desc, or no order
const ColumnHeaderChild = props => {
	let arrowIcon = <noScript />;

	// Return early if column is not sortable
	if (!props.sortable) {
		return (
			<div style={colHeaderLabelStyle}>
				{props.label}
			</div>
		);
	}


	let columnSorted = props.colIndex === props.sortColumnIndex;
	let iconColor = columnSorted ? sortArrowActiveColor : sortArrowInactiveColor;

	// Determine appropriate icon and icon color
	if (props.sortDirection === 'asc') {
		if (columnSorted) {
			arrowIcon = <ArrowDown color={iconColor} />;
		} else {
			arrowIcon = <ArrowUp color={iconColor} />;
		}
	}	else if (props.sortDirection === 'desc') {
		arrowIcon = <ArrowUp color={iconColor} />;
	} else {
		// else, no sorting
		arrowIcon = <ArrowUp color={iconColor} />;
	}


	return (
		<div
			onClick={() => { props.onClick(props.colIndex); }}
			style={{...colHeaderLabelStyle, cursor: 'pointer'}}
			>
			{props.label}
			{arrowIcon}
		</div>
	);
};

ColumnHeaderChild.propTypes = {
	colIndex: PropTypes.number,
	label: PropTypes.string,
	onClick: PropTypes.func,
	sortColumnIndex: PropTypes.number,
	sortDirection: PropTypes.string,
	sortable: PropTypes.bool
};


// Table that lists all the teams and the ability to edit or delete each team
class TableTemplate extends Component {
	constructor(props) {
		super(props);
		let searchableColumnIndex = -1;
		let searchableColumnLabel = '';

		this.props.headers.forEach((header, i) => {
			if (header.searchable) {
				searchableColumnIndex = i;
				searchableColumnLabel = header.label;
			}
		});

		this.state = {
			rows: Array.from(this.props.rows),
			sortDirection: 'none',
			searchableColumnIndex: searchableColumnIndex,
			searchableColumnLabel: searchableColumnLabel,
			sortColumnIndex: null,
			searchTerm: '',
			searchRows: []
		};
	}

	// Change state of teams based on panel rendered
	componentWillReceiveProps(nextProps) {
		if (this.props.rows !== nextProps.rows) {
			let searchableColumnIndex = -1;
			let searchableColumnLabel = '';

			this.props.headers.forEach((header, i) => {
				if (header.searchable) {
					searchableColumnIndex = i;
					searchableColumnLabel = header.label;
				}
			});

			this.setState({
				rows: Array.from(nextProps.rows),
				sortDirection: 'none',
				searchableColumnIndex: searchableColumnIndex,
				searchableColumnLabel: searchableColumnLabel,
				sortColumnIndex: null
			});
		}
	}

	// Search for rows passed in to the table as a searchable column
	// Only one column is currently allowed to be searchable
	onSearch = (event, newValue) => {
		newValue = newValue.trim();
		let rowValue = '';
		let searchRows = this.props.rows.filter((row) => {
			rowValue = row[this.state.searchableColumnIndex].value.toLowerCase();
			return rowValue.indexOf(newValue.toLowerCase()) === 0;
		}, this);

		this.setState({
			searchTerm: newValue,
			searchRows: Array.from(searchRows),
			rows: searchRows
		});
	}

	// Sort when clicked
	// @colProp: which column to sort by
	onSort(colIndex) {
		// Add sort state for each column
		// Sort state should only update if the column selected is the same
		let sortDirection = colIndex === this.state.sortColumnIndex ?
			this.sortMap[this.state.sortDirection] :
			'asc';
		let sortedRows;

		// Changing sort from asc to desc or desc to none
		// if a different column has been sorted, sort to default(asc)
		if (colIndex !== this.state.sortColumnIndex) {
			sortedRows = this.state.rows.sort(
				this.sortColumn(colIndex)
			);
		} else if (sortDirection !== 'none') {
			// If the same column is being sorted (i.e. asc -> desc)

			// if sorting using asc
			if (sortDirection === 'asc') {
				sortedRows = this.state.rows.sort(
					this.sortColumn(colIndex)
				);
			} else {
				// it is desc and can just reverse current state of rows
				sortedRows = this.state.rows.reverse();
			}
		} else {
		// else, the sorting has been reset to the original state

			// if the user is searching, return to the original state of searched rows
			if (this.state.searchTerm) {
				sortedRows = Array.from(this.state.searchRows);
			}			else {
				sortedRows = Array.from(this.props.rows);
			}
			colIndex = null;
		}

		this.setState({
			rows: sortedRows,
			sortDirection: sortDirection,
			sortColumnIndex: colIndex
		});
	}

	sortMap = {
		none: 'asc',
		asc: 'desc',
		desc: 'none'
	}

	// sort column based on a direction
	// @direction: direction in which to sort the column
	// @colIndex: column index of the table
	sortColumn(colIndex) {
		return function(a, b) {
			if (a[colIndex].value < b[colIndex].value) {
				return -1;
			}
			if (a[colIndex].value > b[colIndex].value) {
				return 1;
			}
			return 0;
		};
	}


	render() {
		return (
			<div>
				{
					this.props.title ?
					<TableTitle title={this.props.title} /> :
					''
				}
				{
					this.state.searchableColumnIndex !== -1 ?
					<SearchTable
						onSearch={this.onSearch.bind(this)}
						searchLabel={this.state.searchableColumnLabel}
					/> : ''
				}
				<Table style={cssDashboard.table.style}>
					<TableHeader
						adjustForCheckbox={false}
						displaySelectAll={false}
						selectable={false}
						>
						<Headers
							headers={this.props.headers}
							onSort={this.onSort.bind(this)}
							sortColumnIndex={this.state.sortColumnIndex}
							sortDirection={this.state.sortDirection}
						/>
					</TableHeader>
					<TableBody
						displayRowCheckbox={false}
						preScanRows={false}
						>
						{renderBody(this.state.rows)}
					</TableBody>
				</Table>
			</div>
		);
	}
}

TableTemplate.propTypes = {
	headers: PropTypes.arrayOf(PropTypes.object),
	rows: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)),
	title: PropTypes.string
};

export default TableTemplate;
