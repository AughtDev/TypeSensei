"use client"
import React from 'react';
import {TetrisSessionResults} from "@/components/engine/types";
import {Application, useTick} from "@pixi/react";
import WordBlock from "@/components/engine/WordBlock";
import {processTypedKey} from "@/components/engine/helpers";

interface TetrisBoardProps {
    text: string
    onFinish: (results: TetrisSessionResults) => void
}

interface TetrisWord {
    text: string
    position: number
    x: number
    y: number
}

const SPEED_DELTA_PER_WORD = 0.5; // seconds per word

export default function Board({text, onFinish}: TetrisBoardProps) {
    const [written_text, setWrittenText] = React.useState<string>("")
    const [words, setWords] = React.useState<TetrisWord[]>([{
        text: "loading",
        position: 0,
        x: 100,
        y: 0,
    }])

    const original_words = React.useMemo(() => {
        return text.split(" ")
            // filter out punctuation and spaces or empty strings
            .filter(word => word.trim().length > 0);
    }, [text]);


    React.useEffect(() => {
        setWords(
            original_words
                .map((word, index) => ({
                        text: word,
                        x: (Math.random() * 360) + 20, // random x position between 10% and 90%
                        position: index,
                        y: 0,
                    })
                ))
        setWrittenText("");
    }, [text]);

    // if any word falls below the bottom or there are no words left, finish the game
    React.useEffect(() => {
        if (words.length === 0) {
            onFinish({
                num_words: original_words.length,
                completed: true,
            });
        } else if (words.some(word => word.y > 600)) {
            onFinish({
                num_words: original_words.length - words.length,
                completed: false,
            });
        }
    }, [onFinish, original_words.length, words]);

    // console.log("words are ",words)

    const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
        e.preventDefault();
        setWrittenText(prev => processTypedKey(prev, e.key))
    }, []);

    return (
        <div
            tabIndex={0} onKeyDown={handleKeyDown}
            className={"w-full h-full p-2 flex items-center justify-center border-0 outline-0"}>
            <Application width={400} height={600} backgroundColor={0xff0000}>
                <WordBlocks
                    words={words}
                    written_text={written_text}
                    completeWord={(index: number) => {
                        setWords(prevWords => prevWords.filter((_, i) => i !== index));
                        setWrittenText("");
                    }} setWords={setWords}
                />
            </Application>
        </div>
    )
}

interface WordBlocksProps {
    words: TetrisWord[]
    written_text: string
    setWords: React.Dispatch<React.SetStateAction<TetrisWord[]>>
    completeWord: (index: number) => void
}

function WordBlocks({words, written_text, setWords, completeWord}: WordBlocksProps) {
    useTick((delta) => {
        // Move words down based on speed
        setWords(prevWords => prevWords.map((word, index) => ({
            ...word,
            y: word.y + 0.09
        })));
    })

    return words.map((word, index) => {
        return (
            <WordBlock
                key={index}
                word={word.text}
                typed_word={written_text}
                x={word.x} y={word.y} rotation={0}
                onDone={() => completeWord(index)}
            />
        );
    })
}
