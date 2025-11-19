import React from 'react';
import {TypeSessionResults} from "@/components/engine/types";

interface ResultsSectionProps {
    results: TypeSessionResults
    reload: () => void
}

export default function ResultsSection({results,reload}: ResultsSectionProps) {
    const btn_ref = React.useRef<HTMLButtonElement | null>(null);

    React.useEffect(() => {
        // focus on the retry button when the component mounts
        btn_ref.current?.focus();
    }, []);

    return (
        <div className={"w-2/3 h-full flex flex-row items-center justify-center"}>
            <div className={"w-1/4 p-2 h-full"}>
                <div className={"p-4"}>
                    <h2 className={"text-lg font-bold mb-2"}>Results</h2>
                    <p>Speed: {results.stats.typing_speed_wpm.toFixed(2)} WPM</p>
                    <p>Error Rate: {results.stats.error_rate_percentage.toFixed(2)}%</p>
                    <button
                        ref={btn_ref}
                        className={"mt-4 px-4 py-2 bg-gray-200 font-semibold focus:border-0 focus:bg-white outline-0 text-black rounded"}
                        onClick={reload}>
                        Retry (Tab)
                    </button>
                </div>
            </div>
            <div className={"w-3/4 h-full rounded-xl bg-purple-200"}>
            </div>
        </div>
    )
}
