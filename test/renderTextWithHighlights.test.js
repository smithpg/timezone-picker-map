import { splitIntoBoundedGroups } from "../src/utils/";

describe("splitIntoBoundedGroups works correctly", () => {
  test("when the whole string matches", () => {
    // expect(2 + 2).toBe(4);
  });

  test("when the whole string does not match", () => {
    // expect(2 + 2).toBe(4);
  });

  describe("with all combinations of beginning/end does/does not match", () => {
    test("beginning matches, end matches", () => {
      const text = `01234567`;
      const indices = [
        [0, 0],
        [3, 5],
        [7, 7],
      ];
      // expected: <span className="match">l</span>or<span className="match">em </span>i<span className="match">p</span>sum dolor sit
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

    test("beginning matches, end does not match", () => {
      const text = `lorem ipsum dolor sit`;
      const indices = [
        [0, 0],
        [3, 5],
        [7, 7],
      ];
      // expected: <span className="match">l</span>or<span className="match">em </span>i<span className="match">p</span>sum dolor sit
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
      // expect(2 + 2).toBe(4);
    });

    test("beginning does not match, end does not match", () => {
      // expect(2 + 2).toBe(4);
    });
  });
});
