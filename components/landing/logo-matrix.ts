/**
 * The QuantaJS mark as a 15×15 grid, read from `public/img/q_logo_dark.svg`:
 * `t` teal, `g` grey, `w` white, `.` an unlit cell.
 */
export const LOGO_MATRIX = [
    "...............",
    "...............",
    "...............",
    "....tttggg.....",
    "...ttttgggg....",
    "...tt....gg....",
    "...tt....gg....",
    "...tt....ww....",
    "...tt...www....",
    "...ttttwww.....",
    "....tttww.ww...",
    "..........ww...",
    "...............",
    "...............",
    "...............",
];

export const LOGO_COLORS: Record<string, [number, number, number]> = {
    t: [56, 178, 172],
    g: [132, 132, 132],
    w: [255, 255, 255],
};
