"use client"
import React, {KeyboardEvent} from 'react';
import TypeWriter from "@/components/engine/Typewriter";
import {TypeSessionResults, TypeWriterTheme} from "@/components/engine/types";
import SAMPLE_TEXTS from "@/data/text";
import ResultsSection from "@/pages/home/sections/ResultsSection";


const TYPEWRITER_DEFAULT_THEME: TypeWriterTheme = {
    text: {
        written_color: "#4ade80", // green-400
        error_color: "#f87171",   // red-400
        unwritten_color: "#9ca3af" // gray-400
    }
}

export default function TypewriteModule() {
    const tr_ref = React.useRef<HTMLDivElement | null>(null);
    const [type_text, setTypeText] = React.useState<string>(
        SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)]
    )
    const [results, setResults] = React.useState<TypeSessionResults | null>(null)

    const reload = React.useCallback(() => {
        setTypeText(
            SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)]
        )
        setResults(null)
        if (tr_ref.current) {
            console.log("Focusing on typewriter")
            tr_ref.current.focus();
        }
    }, []);

    const handleReloadOnTab = React.useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            reload();
            // focus on the typewriter div
        }
    }, [reload]);

    return (
        <div
            ref={tr_ref}
            style={{height: "50vh"}}
            className={"w-full flex flex-row items-center justify-center"}
            onKeyDown={handleReloadOnTab}>
            {results ? (
                <ResultsSection results={results} reload={reload}/>
            ) : (
                <div className={"w-2/3"}>
                    <TypeWriter
                        text={type_text}
                        theme={TYPEWRITER_DEFAULT_THEME}
                        onFinish={(results) => {
                            setResults(results)
                            console.log("Typing session finished:", results)
                        }}
                    />
                </div>
            )}
        </div>
    )
}
