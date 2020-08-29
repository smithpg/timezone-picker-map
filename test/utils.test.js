import { splitIntoBoundedGroups } from "../src/utils";

describe("splitIntoBoundedGroups works correctly", () => {
  test("when the whole string matches", () => {
    const text = "I am a perfect match";
    const indices = [[0, 19]]
    const result = splitIntoBoundedGroups(text, indices);
    const expectedResult = [ { matches: true, text } ];
    expect(result).toEqual(expectedResult);
  });

  test("when the whole string does not match", () => {
    const text = "I don't match at all";
    const indices = [];
    const result = splitIntoBoundedGroups(text, indices);
    const expectedResult = [ { matches: false, text } ];
    expect(result).toEqual(expectedResult);
  });

  describe("with all combinations of beginning/end does/does not match", () => {
    test("beginning matches, end matches", () => {
      const text = `01234567`;
      const indices = [
        [0, 0],
        [3, 5],
        [7, 7],
      ];

      const result = splitIntoBoundedGroups(text, indices);
      const expectedResult = [
        { matches: true, text: "0" },
        { matches: false, text: "12" },
        { matches: true, text: "345" },
        { matches: false, text: "6" },
        { matches: true, text: "7" },
      ];
      expect(result).toEqual(expectedResult);
    });

    test("beginning matches, end does not match", () => {
      const text = `lorem ipsum dolor sit`;
      const indices = [
        [0, 0],
        [3, 5],
        [7, 7],
      ];

      const result = splitIntoBoundedGroups(text, indices);
      const expectedResult = [
        { matches: true, text: "l" },
        { matches: false, text: "or" },
        { matches: true, text: "em " },
        { matches: false, text: "i" },
        { matches: true, text: "p" },
        { matches: false, text: "sum dolor sit" },
      ];
      expect(result).toEqual(expectedResult);
    });

    test("beginning does not match, end matches", () => {
      const text = `lorem ipsum dolor sit`;
      const indices = [
        [3, 5],
        [19, 20],
      ];

      const result = splitIntoBoundedGroups(text, indices);
      const expectedResult = [
        { matches: false, text: "lor" },
        { matches: true, text: "em " },
        { matches: false, text: "ipsum dolor s" },
        { matches: true, text: "it" },
      ];
      expect(result).toEqual(expectedResult);
    });

    test("beginning does not match, end does not match", () => {
      const text = `lorem ipsum dolor sit`;
      const indices = [
        [3, 5],
        [7, 7],
      ];

      const result = splitIntoBoundedGroups(text, indices);
      const expectedResult = [
        { matches: false, text: "lor" },
        { matches: true, text: "em " },
        { matches: false, text: "i" },
        { matches: true, text: "p" },
        { matches: false, text: "sum dolor sit" },
      ];
      expect(result).toEqual(expectedResult);
    });
  });
});
