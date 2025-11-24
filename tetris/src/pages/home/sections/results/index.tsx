import React from 'react';
import {TetrisSessionResults} from "@/components/engine/types";

interface ResultsSectionProps {
    results: TetrisSessionResults
    reload: () => void
}

export default function ResultsSection({results,reload} : ResultsSectionProps) {
    const btn_ref = React.useRef<HTMLButtonElement | null>(null);

    // focus on the button on mount
    React.useEffect(() => {
        btn_ref.current?.focus();
    }, []);

    return (
        <div className={"flex flex-col items-center justify-center"}>
            <h2 className={"text-2xl font-bold mb-4"}>Session Results</h2>
            <p className={"text-lg"}>Number of Words: {results.num_words}</p>
            <p className={"text-lg"}>Completed: {results.completed ? "Yes" : "No"}</p>
            <button
                ref={btn_ref}
                className={"mt-4 px-4 py-2 bg-gray-200 font-semibold focus:border-0 focus:bg-white outline-0 text-black rounded"}
                onClick={reload}>
                Retry (Tab)
            </button>
        </div>
    )
 }
