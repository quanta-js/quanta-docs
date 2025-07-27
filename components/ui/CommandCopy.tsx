"use client";

import { TerminalSquareIcon } from 'lucide-react';
import React from 'react'

const CommandCopy = () => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText("npm i @quantajs/core").then(
            () => {
                console.log("Text copied to clipboard");
            },
            (err) => {
                console.error("Could not copy text: ", err);
            }
        );
    };
    return (
        <span onClick={copyToClipboard} className="sm:flex hidden flex-row items-start sm:gap-2 gap-0.5 text-muted-foreground text-md mt-9 -mb-12 max-[800px]:mb-12 font-code sm:text-base text-sm font-medium border rounded-full p-2.5 px-5 bg-muted/55 cursor-copy active:scale-95">
            <TerminalSquareIcon className="w-5 h-5 sm:mr-1 mt-0.5 text-qteal" />
            {"npm i @quantajs/core"}
        </span>
    )
}

export default CommandCopy