const alternate = (array1, array2) => {
  const shorterLength = Math.min(array1.length, array2.length);
  let result = [];
  for (i = 0; i < shorterLength; i++) {
    result.push(array1[i], array2[i]);
  }
  result.push(...array1.slice(shorterLength), ...array2.slice(shorterLength));
  return result;
};

const renderTextWithHighlights = (text, matchIndices) => {
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

  const finalHtml = alternate(nonMatching, matching).join("");
  return finalHtml;
};

const text = `lorem ipsum dolor sit`;
const indices = [
  [0, 0],
  [3, 5],
  [7, 7],
];

console.log(renderTextWithHighlights(text, indices));
