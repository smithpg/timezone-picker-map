import React, { useContext, useState } from "react";
import timeZones from "./data/timezones.json";

import { useCombobox } from "downshift";

const timeZoneNames = timeZones.map((tz) => tz.timezone);

const timeZoneNameToPoints = timeZones.reduce((acc, tz) => {
  if (acc[tz.timezone]) {
    acc[tz.timezone].push(tz.points);
  } else {
    acc[tz.timezone] = [tz.points];
  }

  return acc;
}, {});

console.log(timeZoneNameToPoints);

function createTimeZoneID(tz) {
  if (tz === null) return "nothin";

  const name = `${tz.timezone}-${tz.country}-${tz.pin}`;
  return name;
}

const TimeZonePickerMap = ({
  setTimeZone,
  selectedTimeZone,
  colorConfig = {},
}) => {
  const [selectedTimeZoneObj, setSelectedTimeZoneObj] = React.useState(
    selectedTimeZone
  );
  const {
    backgroundColor = "transparent",
    fillColor = "white",
    strokeColor = "black",
    hoverColor = "blue",
    selectedColor = "green",
    overlayStroke = "red",
  } = colorConfig;

  const [hoveredZone, setHoveredZone] = React.useState(null);
  const style = {
    height: 600,
    width: 1000,
    // display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
    position: "absolute",
    top: "calc(50vh - 150)",
    left: "calc(50vw - 250)",
    background: backgroundColor,
    padding: 10,
    boxShadow: "1px 1px 3px rgba(0,0,0,0.2)",
  };

  // Create the map
  const polygons = React.useMemo(() => {
    const polygons = timeZones.map((timeZone, index) => (
      <polygon
        key={timeZone.timezone + index}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={0.05}
        points={timeZone.points}
        onMouseEnter={(e) => setHoveredZone(timeZone)}
        onMouseOut={(e) => setHoveredZone(null)}
        onClick={(e) => {
          setSelectedTimeZoneObj(timeZone);
          setTimeZone(timeZone.timezone);
        }}
      ></polygon>
    ));
    return polygons;
  }, []);

  const [matchedTimeZones, setMatchedTimeZones] = useState(timeZoneNames);
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: matchedTimeZones,
    onInputValueChange: ({ inputValue }) => {
      // filter timezone using fuzzy matching
      setMatchedTimeZones(
        matchedTimeZones.filter((tz) =>
          tz.toLowerCase().startsWith(inputValue.toLowerCase())
        )
      );
    },
  });

  const createOverlay = (pointStringArray, fillColor, strokeColor) =>
    pointStringArray.map((pointString) => (
      <polygon
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={0.5}
        style={{ zIndex: 999, pointerEvents: "none" }}
        points={pointString}
      ></polygon>
    ));

  const overlays = [
    ...(hoveredZone
      ? createOverlay(
          timeZoneNameToPoints[hoveredZone.timezone],
          hoverColor,
          overlayStroke
        )
      : []),
    ...(selectedTimeZoneObj
      ? createOverlay(
          timeZoneNameToPoints[selectedTimeZoneObj.timezone],
          selectedColor,
          overlayStroke
        )
      : []),
  ];

  console.log(overlays);
  // if (!matchedTimeZones.length === timeZoneNames.length){
  //   matchedTimeZones.map()
  //   createOverlay
  // }

  const comboboxStyles = { border: "1px solid black" };
  const menuStyles = { border: "1px solid black" };
  const select = (
    <div>
      <label {...getLabelProps()}>Choose an element:</label>
      <div style={comboboxStyles} {...getComboboxProps()}>
        <input {...getInputProps()} />
        <button
          type="button"
          {...getToggleButtonProps()}
          aria-label="toggle menu"
        >
          &#8595;
        </button>
      </div>
      <ul {...getMenuProps()} style={menuStyles}>
        {isOpen &&
          matchedTimeZones.map((tz, index) => (
            <li
              style={
                highlightedIndex === index ? { backgroundColor: "#bde4ff" } : {}
              }
              key={`${tz}${index}`}
              {...getItemProps({ item: tz, index })}
            >
              {tz}
            </li>
          ))}
      </ul>
    </div>
  );

  return (
    <div id="timezone-picker-map-target" style={style}>
      <svg className="timezone-picker-map" viewBox="0 0 500 250">
        {polygons}
        {overlays}
      </svg>
      {select}
      <div>{selectedTimeZone}</div>
      <div>{hoveredZone && hoveredZone.timezone}</div>
    </div>
  );
};

export default TimeZonePickerMap;

/*

<polygon
    points="241,118,240,119,240,117,238,116,238,115,239,114,239,113,
        239,113,239,111,241,110,241,111,243,111,244,112,246,111,247,113,245,116,246,118,
        241,118"
    data-timezone="Africa/Abidjan"
    data-country="CI"
    data-pin="244,118"
    data-offset="0"
    data-zonename="GMT"
></polygon>

*/
