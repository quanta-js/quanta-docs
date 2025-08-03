/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentProps } from "react";
import Copy from "./copy";

export default function Pre({
  children,
  raw,
  ...rest
}: ComponentProps<"pre"> & { raw?: string }) {
  // Check if this is a code block with enhanced features
  const codeElement = children as any;
  const codeProps = codeElement?.props || {};
  
  const filename = codeProps['data-filename'];
  const showLineNumbers = codeProps['data-line-numbers'] === 'true';
  const highlightLines = codeProps['data-highlight-lines']?.split(',').map(Number) || [];
  
  // If no enhanced features, render normally
  if (!filename && !showLineNumbers && highlightLines.length === 0) {
    return (
      <div className="my-5 relative">
        <div className="absolute top-3 right-2.5 z-10 sm:block hidden">
          <Copy content={raw!} />
        </div>
        <div className="relative">
          <pre {...rest}>{children}</pre>
        </div>
      </div>
    );
  }
  
  // Enhanced code block with filename, line numbers, and highlighting
  return (
    <div className="my-5 relative">
      <div className="absolute top-3 right-2.5 z-10 sm:block hidden">
        <Copy content={raw!} />
      </div>
      
      {/* Filename header */}
      {filename && (
        <div className="bg-muted px-4 py-2 border-b border-border rounded-t-lg font-mono text-sm">
          {filename}
        </div>
      )}
      
      <div className="relative">
        <pre {...rest} className={`${rest.className || ''} ${showLineNumbers ? 'line-numbers' : ''}`}>
          {showLineNumbers ? (
            <EnhancedCodeContent 
              content={raw!} 
              highlightLines={highlightLines}
            />
          ) : (
            children
          )}
        </pre>
      </div>
    </div>
  );
}

function EnhancedCodeContent({ 
  content, 
  highlightLines 
}: { 
  content: string; 
  highlightLines: number[] 
}) {
  const lines = content.split('\n');
  
  return (
    <code>
      {lines.map((line, index) => {
        const lineNumber = index + 1;
        const isHighlighted = highlightLines.includes(lineNumber);
        
        return (
          <div
            key={index}
            className={`code-line ${isHighlighted ? 'highlight-line' : ''}`}
            data-line={lineNumber}
          >
            {line}
          </div>
        );
      })}
    </code>
  );
}
