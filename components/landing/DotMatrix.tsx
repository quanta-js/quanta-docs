import { layout, ROWS } from "./dot-font";
import styles from "./landing.module.css";

interface DotMatrixProps {
    /** What to draw: digits, `.`, `+` or `-`. */
    text: string;
    /** Pad to this many characters so the width does not jump. */
    minChars?: number;
    /** Cell size: pixels, or any CSS length such as a clamp(). */
    cell?: number | string;
    /** Colour of lit cells. */
    tone?: "teal" | "white";
    /** Read by screen readers in place of the dots. */
    label: string;
}

/**
 * Text drawn as a grid of dots, like the QuantaJS mark: unlit cells are faint
 * rounded squares, lit cells are circles. A cell that changes state morphs
 * between the two, so an update is visible cell by cell.
 */
export default function DotMatrix({
    text,
    minChars = 0,
    cell = 8,
    tone = "teal",
    label,
}: DotMatrixProps) {
    const columns = layout(text, minChars);

    return (
        <div
            role="img"
            aria-label={label}
            className={styles.matrix}
            data-tone={tone}
            style={
                {
                    "--cell": typeof cell === "number" ? `${cell}px` : cell,
                    gridTemplateColumns: `repeat(${columns.length}, var(--cell))`,
                    gridTemplateRows: `repeat(${ROWS}, var(--cell))`,
                } as React.CSSProperties
            }
        >
            {Array.from({ length: ROWS }, (_, y) =>
                columns.map((column, x) => (
                    <span
                        key={`${x}-${y}`}
                        className={styles.cell}
                        data-on={column[y] || undefined}
                    />
                )),
            )}
        </div>
    );
}
