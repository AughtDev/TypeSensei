import React from 'react';
import TetrisBoardContext from "@/components/engine/context";

export default function BoardStats() {
    const {
        written_text,
        content: {words},
        progress: {score}
    } = React.useContext(TetrisBoardContext);

    return (
        <div style={{height: 600, width: 200}}
             className={"border-1 border-white flex flex-col items-center justify-center gap-8 px-2 text-center text-white"}>
            <p className={"text-sm"}>Type the words before they reach the bottom!</p>
            <p className={"text-md text-green-300"}>{written_text}</p>
            <p className={"text-sm"}>Words typed: {words.filter(w => w.done).length}</p>
            <p className={"text-md"}>Score: {score}</p>
        </div>
    )
}
