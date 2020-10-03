import ReactDOM from 'react-dom';
import React from 'react';
import TimeZonePickerMap from './TimeZonePickerMap';

const mountNode = document.querySelector('#root');

const Sandbox = () => {
	const [state, setState] = React.useState({
		selectedTimeZone: '',
	});

	const setTimezone = (tz) => {
		setState({ selectedTimeZone: tz });
	};

	return (
		<div style={{ display: 'flex' }}>
			<div style={{ width: '50vw', height: '100vh' }}>
				<TimeZonePickerMap
					selectedTimeZone={state.selectedTimeZone}
					setTimeZone={setTimezone}
				/>
			</div>
		</div>
	);
};

ReactDOM.render(<Sandbox />, mountNode);
