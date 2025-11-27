import React from "react";
import {TetrisSessionScore, TetrisWordSpecs} from "@/components/engine/types";

export enum BoardSignal {
    NONE,
    WORD_MISMATCH,
    WORD_COMPLETE,
    DONE
}

export interface TetrisBoardContextProps {
    written_text: string
    content: {
        text: string
        words: TetrisWordSpecs[]
    }
    graphics: {
        animateWordFall: (delta_y: number,last_drop_idx: number) => void
        signal: BoardSignal
        makeBoardSignal: (signal: BoardSignal, duration_ms: number) => void
    }
    progress: {
        score: TetrisSessionScore
    }
}

const TetrisBoardContext = React.createContext<TetrisBoardContextProps>({
    written_text: "",
    content: {
        text: "",
        words: [],
    },
    graphics: {
        animateWordFall: (delta_y: number,last_drop_idx: number) => {
            console.warn("animateWordFall not implemented", delta_y, last_drop_idx);
        },
        signal: BoardSignal.NONE,
        makeBoardSignal: (signal: BoardSignal, duration_ms: number) => {
            console.warn("makeBoardSignal not implemented", signal, duration_ms);
        }
    },
    progress: {
        score: {
            score: 0,
            wpm: 0,
            streak: 0,
            accuracy: 0
        }
    }
})

export default TetrisBoardContext;

