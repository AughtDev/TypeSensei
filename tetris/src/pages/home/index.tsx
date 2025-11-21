"use client"
import React from "react";
import SAMPLE_TEXTS from "@/data/text";
import {TetrisSessionResults} from "@/components/engine/types";
import Board from "@/components/engine/Board";
import ResultsSection from "@/pages/home/sections/results";
import {Application} from "@pixi/react";

export default function TetrisModule() {
    const tr_ref = React.useRef<HTMLDivElement | null>(null);
    const [type_text, setTypeText] = React.useState<string>(
        // eslint-disable-next-line react-hooks/purity
        SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)]
    )
    const [results, setResults] = React.useState<TetrisSessionResults | null>(null)

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
            style={{height: "80vh"}}
            className={"w-full flex flex-row items-center justify-center"}
            onKeyDown={handleReloadOnTab}>
            {results !== null ? (
                <ResultsSection results={results}/>
            ) : (
                <Board text={"testing testing hello world everybody"} onFinish={(results) => {
                    setResults(results)
                }}/>
            )}
        </div>
    )
}
