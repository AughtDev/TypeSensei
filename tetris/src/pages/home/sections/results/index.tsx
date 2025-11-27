import React from 'react';
import {TetrisSessionResults} from "@/components/engine/types";

interface ResultsSectionProps {
    results: TetrisSessionResults
    reload: () => void
}

export default function ResultsSection({results, reload}: ResultsSectionProps) {
    const btn_ref = React.useRef<HTMLButtonElement | null>(null);

    // focus on the button on mount
    React.useEffect(() => {
        btn_ref.current?.focus();
    }, []);

    console.log("results are ", results);

    return (
        <div className={"flex flex-col items-center justify-center"}>
            <p className={"text-5xl text-amber-300 pb-4"}>{results.score.score}</p>
            <p className={"text-lg"}>WPM: {results.score.wpm}</p>
            <p className={"text-lg"}>Accuracy: {results.score.accuracy}</p>
            <p className={"text-lg"}>Fails: {results.score.fails}</p>

            <p className={"text-lg"}>Completion: {Math.round((results.num_words_completed / (results.num_words_completed + results.num_words_failed)) * 100)}%</p>

            <button
                ref={btn_ref}
                className={"mt-4 px-4 py-2 bg-gray-200 font-semibold focus:border-0 focus:bg-white outline-0 text-black rounded"}
                onClick={reload}>
                Retry (Tab)
            </button>
        </div>
    )
}
