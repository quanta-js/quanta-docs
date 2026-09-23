import styles from "./landing.module.css";

const KEYWORDS = new Set([
    "import", "from", "export", "const", "let", "function", "return", "async",
    "await", "new", "this", "true", "false", "null", "if",
]);

const TOKEN =
    /(\/\/[^\n]*)|('(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|"(?:[^"\\]|\\.)*")|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_$][\w$]*)\b/g;

/** Minimal highlighting for the short snippets on the landing page. */
function highlight(code: string) {
    const out: React.ReactNode[] = [];
    let last = 0;
    let key = 0;
    for (const match of code.matchAll(TOKEN)) {
        const [text, comment, string, number, word] = match;
        const index = match.index ?? 0;
        if (index > last) out.push(code.slice(last, index));
        const className = comment
            ? styles.cmt
            : string
              ? styles.str
              : number
                ? styles.num
                : word && KEYWORDS.has(word)
                  ? styles.kw
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
    if (last < code.length) out.push(code.slice(last));
    return out;
}

export default function Code({ code, className = "" }: { code: string; className?: string }) {
    return (
        <pre className={`${styles.code} ${className}`}>
            <code>{highlight(code.trim())}</code>
        </pre>
    );
}
