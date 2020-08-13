import ReactDOM from "react-dom";
import React from "react";
import TimeZonePickerMap from "./TimeZonePickerMap";

const mountNode = document.querySelector("#root");

const Sandbox = () => {
  const [state, setState] = React.useState({
    selectedTimezone: "",
  });

  const setTimezone = (tz) => {
    setState({ selectedTimezone: tz });
  };
  console.log(state);
  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "50vw", height: "100vh" }}>
        <TimeZonePickerMap setTimeZone={setTimezone} />
      </div>
      <div style={{ width: "50vw", height: "100vh" }}>
        ;laksdjf;laksjfd
        {JSON.stringify(state)}
      </div>
    </div>
  );
};

ReactDOM.render(<Sandbox />, document.querySelector("#root"));
