import React from 'react';
import {TetrisSessionResults} from "@/components/engine/types";
import {Application} from "@pixi/react";

interface TetrisBoardProps {
    text: string
    onFinish: (results: TetrisSessionResults) => void
}

interface TetrisWord {
    text: string
    x: number
    speed: number
    delay: number
}

const SPEED_DELTA_PER_WORD = 0.5; // seconds per word

export default function TetrisBoard({text, onFinish}: TetrisBoardProps) {

    const words: TetrisWord[] = React.useMemo(() => {
        const word_list = text.split(" ");
        return word_list.map((word, index) => ({
            text: word,
            x: Math.random() * 80 + 10, // random x position between 10% and 90%
            speed: 2 + index * SPEED_DELTA_PER_WORD, // increase speed per word
            delay: index * 1000 // delay based on index
        }));
    }, [text]);

    return (
        <div className={"w-full h-full p-2"}>
            <Application width={500} height={800} backgroundColor={0x000000}>
                {words.map((word, index) => (
                    <div
                        id={"tetris-word-" + index}
                        key={index}
                        className={"absolute text-2xl"}
                        style={{
                            left: `${word.x}%`,
                            animation: `fall ${word.speed}s linear ${word.delay}ms forwards`
                        }}>
                        {word.text}
                    </div>
                ))}
            </Application>
        </div>
    )
}
