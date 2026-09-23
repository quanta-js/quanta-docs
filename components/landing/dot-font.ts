/**
 * A 5×7 dot font for the landing page's matrix readouts, drawn on the same
 * grid as the QuantaJS mark: every glyph is a set of discrete cells that are
 * either on or off.
 */

const GLYPHS: Record<string, string[]> = {
    "0": [".###.", "#...#", "#..##", "#.#.#", "##..#", "#...#", ".###."],
    "1": ["..#..", ".##..", "..#..", "..#..", "..#..", "..#..", ".###."],
    "2": [".###.", "#...#", "....#", "...#.", "..#..", ".#...", "#####"],
    "3": ["#####", "...#.", "..#..", "...#.", "....#", "#...#", ".###."],
    "4": ["...#.", "..##.", ".#.#.", "#..#.", "#####", "...#.", "...#."],
    "5": ["#####", "#....", "####.", "....#", "....#", "#...#", ".###."],
    "6": ["..##.", ".#...", "#....", "####.", "#...#", "#...#", ".###."],
    "7": ["#####", "....#", "...#.", "..#..", ".#...", ".#...", ".#..."],
    "8": [".###.", "#...#", "#...#", ".###.", "#...#", "#...#", ".###."],
    "9": [".###.", "#...#", "#...#", ".####", "....#", "...#.", ".##.."],
    "+": [".....", "..#..", "..#..", "#####", "..#..", "..#..", "....."],
    "-": [".....", ".....", ".....", "#####", ".....", ".....", "....."],
    ".": [".", ".", ".", ".", ".", ".", "#"],
    " ": [".....", ".....", ".....", ".....", ".....", ".....", "....."],
};

export const ROWS = 7;

/**
 * Lay `text` out as columns of on/off cells, one blank column between glyphs,
 * right-aligned to `minChars` so a changing number keeps its width.
 */
export function layout(text: string, minChars = 0): boolean[][] {
    const chars = text.padStart(minChars, " ").split("");
    const columns: boolean[][] = [];
    chars.forEach((char, i) => {
        const glyph = GLYPHS[char] ?? GLYPHS[" "];
        const width = glyph[0].length;
        for (let x = 0; x < width; x++) {
            columns.push(glyph.map((row) => row[x] === "#"));
        }
        if (i < chars.length - 1) columns.push(new Array(ROWS).fill(false));
    });
    return columns;
}
