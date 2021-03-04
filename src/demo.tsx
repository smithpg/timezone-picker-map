import ReactDOM from 'react-dom';
import React from 'react';
import TimeZonePickerMap from './index';
import type { ColorConfig } from './types';

const mountNode = document.querySelector('#root');

const Sandbox = () => {
	const [state, setState] = React.useState({
		selectedTimeZone: '',
	});

	const setTimezone = (tz) => {
		setState({ selectedTimeZone: tz });
	};

	const colorConfig: ColorConfig = {
		idle: {
			fill: 'gray',
			stroke: 'black',
		},
		hovered: {
			stroke: 'yellow',
		},
		matched: {
			fill: 'blue',
			stroke: 'purple',
		},
		selected: {
			fill: 'green',
			stroke: 'purple',
		},
		background: 'aquamarine',
	};

	return (
		<div style={{ display: 'flex' }}>
			<div style={{ width: '50vw', height: '100vh' }}>
				<TimeZonePickerMap
					selectedTimeZone={state.selectedTimeZone}
					setTimeZone={setTimezone}
					// colorConfig={colorConfig}
				/>
			</div>
		</div>
	);
};

ReactDOM.render(<Sandbox />, mountNode);
