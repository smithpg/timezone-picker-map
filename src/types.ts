export interface TimeZone {
    timezone: string;
    country: string;
    pin: string;
    offset: number;
    points: string;
    zonename: string;
    region?: string;
    zone?: string;
}

// TODO: make this a class with a toString method? () => `{$timezone} (${zonename})`

// TODO: rework timezones.json so we can make these types more explicit/specific
/* example timezone:

    "timezone": "Pacific/Guam", // split into region: string and zone: string
    "country": "GU", // all-caps string? is that possible?
    "pin": "451,106", // pair of ints - possible? specify length of array?
    "offset": 10, // int
    "points": "446,112,456,101", // array of ints
    "zonename": "ChST" // string. prob change name too.

*/
