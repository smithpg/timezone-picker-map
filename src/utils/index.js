export const alternate = (array1, array2) => {
    const shorterLength = Math.min(array1.length, array2.length);
    let result = [];
    for (let i = 0; i < shorterLength; i++) {
        result.push(array1[i], array2[i]);
    }
    result.push(...array1.slice(shorterLength), ...array2.slice(shorterLength));
    return result;
};

// TODO: change name to...something. maybe splitBy?
export const renderTextWithHighlights = (text, matchIndices) => {
    let nonMatching = [];
    let matching = [];

    // TODO: change to the below, no need for initial empty match
    // if (matchIndices[0][0] !== 0) {
    //     const firstNonMatchingSubstring = text.slice(0, matchIndices[0][0]);
    //     nonMatching.push(firstNonMatchingSubstring);
    // }

    const firstNonMatchingSubstring = text.slice(0, matchIndices[0][0]);
    nonMatching.push(firstNonMatchingSubstring);
    matchIndices.forEach((indexPair, indexPairIndex) => {
        const nextPair = matchIndices[indexPairIndex + 1];
        const start = indexPair[0];
        const end = indexPair[1] + 1;

        matching.push(text.slice(start, end));

        if (!!nextPair) {
            nonMatching.push(text.slice(end, nextPair[0]));
        } else {
            nonMatching.push(text.slice(end));
        }
    });

    // TODO: this happens later outside of this function
    // prob something like: matches.map(m => m.matches ? `<span className="match">${m}</span>` : m)
    // matching = matching.map(
    //     (substring) => `<span className="match">${substring}</span>`
    // );

    const arr = alternate(nonMatching.map(nm => ({ matches: false, text: nm})), matching.map(m => ({matches: true, text: m})));
    return arr;
    // const finalHtml = alternate(nonMatching, matching).join('');
    // const finalHtmlArray = alternate(nonMatching, matching);
    // return finalHtml;
};
