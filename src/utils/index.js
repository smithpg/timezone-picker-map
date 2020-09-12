export const alternate = (array1, array2) => {
    const shorterLength = Math.min(array1.length, array2.length);
    let result = [];
    for (let i = 0; i < shorterLength; i++) {
        result.push(array1[i], array2[i]);
    }
    result.push(...array1.slice(shorterLength), ...array2.slice(shorterLength));
    return result;
};

export const getDisplayName = timeZone => `${timeZone.timezone} (${timeZone.zonename})`;

// TODO: change name to...something. maybe splitBy?
export const splitIntoBoundedGroups = (text, matchRanges) => {
    const arr = [];

    if (matchRanges.length === 0) {
        return [{ matches: false, text }];
    }

    if (matchRanges[0][0] !== 0) {
        const firstNonMatchingSubstring = text.slice(0, matchRanges[0][0]);
        arr.push({ matches: false, text: firstNonMatchingSubstring });
    }

    matchRanges.forEach((indexPair, indexPairIndex) => {
        const start = indexPair[0];
        const end = indexPair[1] + 1;
        const matchingSubstring = text.slice(start, end);
        arr.push({ matches: true, text: matchingSubstring });

        const nextMatch = matchRanges[indexPairIndex + 1];
        if (!!nextMatch) {
            arr.push({ matches: false, text: text.slice(end, nextMatch[0]) });
        } else if (text.slice(end) !== '') {
            arr.push({ matches: false, text: text.slice(end) });
        }
    });

    return arr;

    // TODO: this happens later outside of this function
    // prob something like: matches.map(m => m.matches ? `<span className="match">${m}</span>` : m)
    // matching = matching.map(
    //     (substring) => `<span className="match">${substring}</span>`
    // );

    // const finalHtml = alternate(nonMatching, matching).join('');
    // const finalHtmlArray = alternate(nonMatching, matching);
    // return finalHtml;
};
