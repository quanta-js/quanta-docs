import styles from "./landing.module.css";

const KEYWORDS = new Set([
    "import", "from", "export", "default", "const", "let", "function", "return",
    "async", "await", "new", "this", "true", "false", "null", "if",
]);

const TOKEN =
    /(\/\/.*$)|('(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*")|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_$][\w$]*)\b(?=\s*\()|\b([A-Z][\w$]*)\b|\b([A-Za-z_$][\w$]*)\b/g;

/** Minimal highlighting for one line of the landing page's snippets. */
function highlight(line: string) {
    const out: React.ReactNode[] = [];
    let last = 0;
    let key = 0;
    for (const match of line.matchAll(TOKEN)) {
        const [text, comment, string, number, call, type, word] = match;
        const index = match.index ?? 0;
        if (index > last) out.push(line.slice(last, index));
        const name = call ?? word;
        const className = comment
            ? styles.cmt
            : string
              ? styles.str
              : number
                ? styles.num
                : name && KEYWORDS.has(name)
                  ? styles.kw
                  : call
                    ? styles.fn
                    : type
                      ? styles.type
                      : undefined;
        out.push(
            className ? (
                <span key={key++} className={className}>
                    {text}
                </span>
            ) : (
                text
            ),
        );
        last = index + text.length;
    }
    if (last < line.length) out.push(line.slice(last));
    return out;
}

export type LineMark = "run" | "read";

interface CodeWindowProps {
    code: string;
    /** Shown in the title bar. */
    filename: string;
    /** 1-based line numbers to mark. */
    marks?: ReadonlyMap<number, LineMark>;
    /** Change it to replay the flash on marked lines. */
    pulse?: number;
    className?: string;
}

/**
 * A code block with a title bar and line numbers. Lines are plain elements
 * rather than a `<pre>`, so the docs' global code-block styles do not apply.
 */
export default function CodeWindow({
    code,
    filename,
    marks,
    pulse = 0,
    className = "",
}: CodeWindowProps) {
    const lines = code.replace(/\n+$/, "").split("\n");
    const gutter = String(lines.length).length;

    return (
        <figure className={`${styles.window} ${className}`}>
            <figcaption className={styles.windowBar}>
                <span className={styles.windowDots} aria-hidden>
                    <span />
                    <span />
                    <span />
                </span>
                <span className="truncate">{filename}</span>
            </figcaption>
            <div className={styles.windowBody}>
                <code
                    className={styles.lines}
                    style={{ "--gutter": `${gutter}ch` } as React.CSSProperties}
                >
                    {lines.map((line, i) => {
                        const mark = marks?.get(i + 1);
                        return (
                            <span
                                key={mark ? `${i}-${pulse}` : i}
                                className={styles.line}
                                data-mark={mark}
                            >
                                <span className={styles.lineNo} aria-hidden>
                                    {i + 1}
                                </span>
                                <span className={styles.lineText}>
                                    {line ? highlight(line) : " "}
                                </span>
                            </span>
                        );
                    })}
                </code>
            </div>
        </figure>
    );
}
