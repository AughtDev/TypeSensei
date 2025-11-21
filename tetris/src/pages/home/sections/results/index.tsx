import React from 'react';
import {TetrisSessionResults} from "@/components/engine/types";

interface ResultsSectionProps {
    results: TetrisSessionResults
}

export default function ResultsSection({results} : ResultsSectionProps) {
    return (
        <div className={"flex flex-col items-center justify-center"}>
            <h2 className={"text-2xl font-bold mb-4"}>Session Results</h2>
            <p className={"text-lg"}>Number of Words: {results.num_words}</p>
            <p className={"text-lg"}>Completed: {results.completed ? "Yes" : "No"}</p>
        </div>
    )
 }
