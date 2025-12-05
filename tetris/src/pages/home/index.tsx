"use client"
import React from "react";
import {TetrisSessionResults} from "@/components/engine/types";
import Board from "@/components/engine/board/Board";
import ResultsSection from "@/pages/home/sections/results";
import {getWordsByIdx} from "@/data/helpers";
import { Play } from "lucide-react";

interface DifficultyOption {
    label: string;
    min_index: number;
    max_index: number;
}

const DIFFICULTY_OPTIONS: DifficultyOption[] = [
    {label: "Easy", min_index: 0, max_index: 1000},
    {label: "Medium", min_index: 1001, max_index: 5000},
    {label: "Hard", min_index: 5001, max_index: 10000},
];
const NUM_WORD_OPTIONS: number[] = [10, 25, 50, 100, 250, 500];

export default function TetrisModule() {
    const tr_ref = React.useRef<HTMLDivElement | null>(null);

    const [game_started, setGameStarted] = React.useState<boolean>(false)
    const [type_text, setTypeText] = React.useState<string>("")
    const [results, setResults] = React.useState<TetrisSessionResults | null>(null)

    // game config
    const [difficulty, setDifficulty] = React.useState<DifficultyOption>(DIFFICULTY_OPTIONS[0])
    const [num_words, setNumWords] = React.useState<number>(NUM_WORD_OPTIONS[0])

    const reload = React.useCallback(async () => {
        const words = await getWordsByIdx(num_words, "en", difficulty.min_index, difficulty.max_index);
        setTypeText(words.join(" "))
        setResults(null)
        if (tr_ref.current) {
            console.log("Focusing on typewriter")
            tr_ref.current.focus();
        }
    }, [difficulty.max_index, difficulty.min_index, num_words]);

    const handleReloadOnTab = React.useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            reload().then();
            // focus on the typewriter div
        }
    }, [reload]);

    React.useEffect(() => {
        reload().then()
    }, [difficulty, num_words]);

    return (
        <div
            ref={tr_ref}
            style={{height: "100%"}}
            className={"w-full flex flex-col items-center justify-center"}
            onKeyDown={handleReloadOnTab}>
            <div className="flex flex-row items-center justify-center gap-8 pt-2">
                {/* Difficulty selector */}
                <div className="flex flex-row items-center justify-center gap-2">
                    {DIFFICULTY_OPTIONS.map((option, index) => (
                        <button
                            key={`d-${index}`}
                            className={`
                            mx-2 px-3 py-1.5 rounded-lg
                             ${difficulty.label === option.label ? 'bg-white text-black' : 'bg-black text-white border-2 border-white'}`}
                            onClick={() => setDifficulty(option)}>
                            {option.label}
                        </button>
                    ))}
                </div>
                {/* vertical divider */}
                <div className="w-0.5 h-12 bg-white opacity-50"/>

                {/* Number of words selector */}
                <div className="flex flex-row items-center justify-center gap-2">
                    {NUM_WORD_OPTIONS.map((num, index) => (
                        <button
                            key={`n-${index}`}
                            className={`
                            mx-2 px-3 py-1.5 rounded-lg
                             ${num_words === num ? 'bg-white text-black' : 'bg-black text-white border-2 border-white'}`}
                            onClick={() => setNumWords(num)}>
                            {num}
                        </button>
                    ))}
                </div>
            </div>

            <div className={"flex grow  w-full items-center justify-center"}>
                {!game_started ? (
                    <button
                        className={`hover:text-green-300 text-white`}
                        onClick={() => {
                            reload().then(() => setGameStarted(true))
                        }}>
                        <div className="flex flex-col items-center justify-center gap-2">
                            <Play size={84}/>
                            <p className={"text-4xl"}>
                                Start Game
                            </p>
                        </div>
                    </button>
                ) : results !== null ? (
                    <ResultsSection results={results} reload={reload}/>
                ) : (
                    <Board text={type_text} onFinish={(results) => {
                        setResults(results)
                    }}/>
                )}
            </div>
        </div>
    )
}
