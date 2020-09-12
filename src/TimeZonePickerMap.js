import React, { useState } from 'react';
import Fuse from 'fuse.js';
import timeZones from './data/timezones.json';

import debounce from 'lodash.debounce';
import { useCombobox } from 'downshift';
import { splitIntoBoundedGroups, getDisplayName } from './utils';
/*

TODO: decide what to show/select when user mouses over areas associated with
multiple time zones. See README for details and example.

*/

// Spit timezone names into Region/Zone
for (let i in timeZones) {
    timeZones[i] = splitTimeZoneNameIntoRegionAndZone(timeZones[i]);
}

function splitTimeZoneNameIntoRegionAndZone(tz) {
    const modifiedTz = Object.assign({}, tz);

    const [region, zone] = tz.timezone.split('/');

    Object.assign(modifiedTz, { region, zone });
    return modifiedTz;
}

const timeZoneNames = timeZones.map((tz) => tz.timezone);
const fuseOptions = {
    includeMatches: true,
    ignoreLocation: true,
    threshold: 0.3,
    // NB: do not be misled by the similarity of zone and zonename.
    keys: ['region', 'zone', 'zonename'],
};
const fuse = new Fuse(timeZones, fuseOptions);

const timeZoneNameToPoints = timeZones.reduce((acc, tz) => {
    if (acc[tz.timezone]) {
        acc[tz.timezone].push(tz.points);
    } else {
        acc[tz.timezone] = [tz.points];
    }

    return acc;
}, {});

function createTimeZoneID(tz) {
    if (tz === null) return 'nothin';

    const name = `${tz.timezone}-${tz.country}-${tz.pin}`;
    return name;
}

const spliceString = (targetString, startIndex, endIndex, replacement) => {
    const deleteCount = endIndex - startIndex + 1;

    const asArray = Array.from(targetString);

    asArray.splice(startIndex, deleteCount, replacement);

    return asArray.join('');
};

const alternate = (array1, array2) => {
    const shorterLength = Math.min(array1.length, array2.length);
    let result = [];
    for (i = 0; i < shorterLength; i++) {
        result.push(array1[i], array2[i]);
    }
    result.push(...array1.slice(shorterLength), ...array2.slice(shorterLength));
    return result;
};

export const renderTextWithHighlights = (text, matchIndices) => {
    let nonMatching = [];
    let matching = [];

    nonMatching.push(text.slice[(0, matchIndices[0][0])]);
    matchIndices.forEach((indexPair, indexPairIndex) => {
        const nextPair = matchIndices[indexPairIndex + 1];
        const start = indexPair[0];
        const end = indexPair[1];

        matching.push(text.slice(start, end));

        !!nextPair && nonMatching.push(text.slice(end + 1, nextPair[0]));
    });

    matching = matching.map(
        (substring) => `<span className="match">${substring}</span>`
    );

    const finalHtml = alternate(nonMatching, matching).join('');
    return finalHtml;
};

const timezonesAsMockFuseResults = timeZones.map((tz) => {
    const modifiedTz = Object.assign({}, tz);

    const [region, zone] = tz.timezone.split('/');

    Object.assign(modifiedTz, { region, zone });

    return {
        item: modifiedTz,
        matches: null,
    };
});

const TimeZonePickerMap = ({
    setTimeZone,
    selectedTimeZone,
    colorConfig = {},
}) => {
    const [debouncing, setDebouncing] = React.useState(false);
    const [selectedTimeZoneObj, setSelectedTimeZoneObj] = React.useState(
        selectedTimeZone
    );
    const {
        backgroundColor = 'transparent',
        fillColor = 'white',
        strokeColor = 'black',
        hoverColor = 'blue',
        selectedColor = 'green',
        matchedColor = 'purple',
        overlayStroke = 'red',
    } = colorConfig;

    const [hoveredZone, setHoveredZone] = React.useState(null);
    const style = {
        height: 600,
        width: 1000,
        position: 'absolute',
        top: 'calc(50vh - 150)',
        left: 'calc(50vw - 250)',
        background: backgroundColor,
        padding: 10,
        boxShadow: '1px 1px 3px rgba(0,0,0,0.2)',
    };

    const setTimeZoneAll = (timeZoneObject) => {
        setSelectedTimeZoneObj(timeZoneObject);
        setTimeZone(timeZoneObject.timezone);
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
                onClick={() => {
                    setTimeZoneAll(timeZone);
                }}
            />
        ));
        return polygons;
    }, []);

    const [matchedTimeZones, setMatchedTimeZones] = useState(
        timezonesAsMockFuseResults
    );

    const fuseUpdater = (searchValue) => {
        const fuzzyMatches = fuse.search(searchValue);
        setMatchedTimeZones(fuzzyMatches);
    };

    const debouncedUpdater = debounce(fuseUpdater, 200);

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
            // TODO: filter timezone using fuzzy matching
            /*
            possible alternative to combobox:
            https://github.com/downshift-js/downshift
                https://codesandbox.io/s/pyq3v4o3j

            or, put combobox in separate component so matchedWhatever is its
            state, not the whole map's, as recommended here:
            https://stackoverflow.com/questions/50819260/react-input-onchange-lag
             */

            if (debouncing) {
                debouncedUpdater(inputValue);
            } else {
                fuseUpdater(inputValue);
            }
        },
        onSelectedItemChange: ({ selectedItem }) => {
            setTimeZoneAll(selectedItem.item);
        },
        selectedItem: selectedTimeZoneObj ? getDisplayName(selectedTimeZoneObj) : '',
    });

    const createOverlay = (
        pointStringArray,
        fillColor,
        strokeColor,
        overlayType
    ) => {
        return pointStringArray.map((pointString) => (
            <polygon
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={0.5}
                style={{ zIndex: 999, pointerEvents: 'none' }}
                points={pointString}
                key={`${overlayType}-${pointString}`}
            />
        ));
    };

    let overlays = [
        ...(hoveredZone
            ? createOverlay(
                  timeZoneNameToPoints[hoveredZone.timezone],
                  hoverColor,
                  overlayStroke,
                  'hovered'
              )
            : []),
        ...(selectedTimeZoneObj
            ? createOverlay(
                  timeZoneNameToPoints[selectedTimeZoneObj.timezone],
                  selectedColor,
                  overlayStroke,
                  'selected'
              )
            : []),
    ];

    if (matchedTimeZones) {
        overlays = matchedTimeZones
            .map((matchedTz) =>
                createOverlay(
                    [matchedTz.item.points],
                    matchedColor,
                    overlayStroke,
                    'matched'
                )
            )
            .concat(overlays);
    }

    // TODO: highlight matching zones as user types
    // if (!matchedTimeZones.length === timeZoneNames.length){
    //   matchedTimeZones.map()
    //   createOverlay
    // }
    const comboboxStyles = { border: '1px solid black' };
    const menuStyles = { border: '1px solid black' };
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
                    matchedTimeZones.map((matchedTimeZone, index) => {
                        const tz = matchedTimeZone.item;
                        let timeZoneName = tz.timezone;
                        let zoneName = tz.zonename;

                        if (matchedTimeZone.matches !== null) {
                            // if there are matches...
                            for (let match of matchedTimeZone.matches) {
                                if (match.key === 'timezone') {
                                    timeZoneName = splitIntoBoundedGroups(
                                        tz.timezone,
                                        match.indices
                                    ).map((substring, i) => {
                                        return substring.matches ? (
                                            <em
                                                key={substring.text + i}
                                                style={{ color: 'red' }}
                                            >
                                                {substring.text}
                                            </em>
                                        ) : (
                                            <span key={substring.text + i}>
                                                {substring.text}
                                            </span>
                                        );
                                    });
                                } else {
                                    zoneName = splitIntoBoundedGroups(
                                        tz.zonename,
                                        match.indices
                                    ).map((substring, i) =>
                                        substring.matches ? (
                                            <em key={substring.text + i}>
                                                {substring.text}
                                            </em>
                                        ) : (
                                            <span key={substring.text + i}>
                                                {substring.text}
                                            </span>
                                        )
                                    );
                                }
                            }
                        }
                        return (
                            <li
                                style={
                                    highlightedIndex === index
                                        ? { backgroundColor: '#bde4ff' }
                                        : {}
                                }
                                key={`${tz.timezone}${index}`}
                                {...getItemProps({ item: tz.timezone, index })}
                            >
                                {timeZoneName} ({zoneName})
                            </li>
                        );
                    })}
            </ul>
        </div>
    );

    return (
        <div id="timezone-picker-map-target" style={style}>
            <button onClick={() => setDebouncing((d) => !d)}>
                toggle debounce (current value = {debouncing ? 'true' : 'false'}
                )
            </button>
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

example of what one of the <polygon> elements should look like:

<polygon
    points="241,118,240,119,240,117,238,116,238,115,239,114,239,113,
        239,113,239,111,241,110,241,111,243,111,244,112,246,111,247,113,245,116,246,118,
        241,118"
    data-timezone="Africa/Abidjan"
    data-country="CI"
    data-pin="244,118"
    data-offset="0"
    data-zonename="GMT"
/>

*/
