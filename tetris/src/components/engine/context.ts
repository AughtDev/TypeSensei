import React from "react";
import {TetrisWordSpecs} from "@/components/engine/types";


export interface TetrisBoardContextProps {
    written_text: string
    content: {
        text: string
        words: TetrisWordSpecs[]
        completeWord: (position: number) => void
    }
    graphics: {
        animateWordFall: (delta_y: number,last_drop_idx: number) => void
    }
    progress: {
        score: number
    }
}

const TetrisBoardContext = React.createContext<TetrisBoardContextProps>({
    written_text: "",
    content: {
        text: "",
        words: [],
        completeWord: (position: number) => {
            console.warn("completeWord not implemented", position);
        },
    },
    graphics: {
        animateWordFall: (delta_y: number,last_drop_idx: number) => {
            console.warn("animateWordFall not implemented", delta_y, last_drop_idx);
        },
    },
    progress: {
        score: 0
    }
})

export default TetrisBoardContext;
