import { renderTextWithHighlights } from '../src/utils/';

describe('renderTextWithHighlights works correctly', () => {
    test('when the whole string matches', () => {
        // expect(2 + 2).toBe(4);
    });

    test('when the whole string does not match', () => {
        // expect(2 + 2).toBe(4);
    });

    describe('with all combinations of beginning/end does/does not match', () => {
        test('beginning matches, end matches', () => {
            // expect(2 + 2).toBe(4);
        });

        test('beginning matches, end does not match', () => {
            const text = `lorem ipsum dolor sit`;
            const indices = [
                [0, 0],
                [3, 5],
                [7, 7],
            ];
            // expected: <span className="match">l</span>or<span className="match">em </span>i<span className="match">p</span>sum dolor sit
            const result = renderTextWithHighlights(text, indices);
            const expectedResult = [
                { matching: false, text: '' },
                { matching: true, text: 'l' },
                { matching: false, text: 'or' },
                { matching: true, text: 'em ' },
                { matching: false, text: 'i' },
                { matching: true, text: 'p' },
                { matching: false, text: 'sum dolor sit' },
            ];
            expect(result).toEqual(expectedResult);
        });

        test('beginning does not match, end matches', () => {
            // expect(2 + 2).toBe(4);
        });

        test('beginning does not match, end does not match', () => {
            // expect(2 + 2).toBe(4);
        });
    });
});
