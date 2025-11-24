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
    done: boolean
}

const SPEED_DELTA_PER_WORD = 0.5; // seconds per word

export default function Board({text, onFinish}: TetrisBoardProps) {
    const board_ref = React.useRef<HTMLDivElement | null>(null);

    const [written_text, setWrittenText] = React.useState<string>("")
    const [words, setWords] = React.useState<TetrisWord[]>([{
        text: "loading",
        position: 0,
        x: 100,
        y: 0,
        done: false
    }])
    const [score, setScore] = React.useState<number>(0)


    React.useEffect(() => {
        setWords(
            text.split(" ")
                // filter out punctuation and spaces or empty strings
                .filter(word => word.trim().length > 0)
                .map((word, index) => ({
                        text: word,
                        x: (Math.random() * 460) + 20, // random x position between 10% and 90%
                        position: index,
                        y: 0,
                        done: false
                    })
                ))
        setWrittenText("");

        // focus on board
        board_ref.current?.focus();
    }, [text]);

    // if any word falls below the bottom or there are no words left, finish the game
    React.useEffect(() => {
        if (words.every(word => word.done)) {
            onFinish({
                num_words: words.length,
                completed: true,
            });
        } else if (words.some(word => word.y > 600)) {
            onFinish({
                num_words: words.filter(w => w.done).length,
                completed: false,
            });
        }
    }, [onFinish, words]);

    // console.log("words are ",words)

    const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
        e.preventDefault();
        setWrittenText(prev => processTypedKey(prev, e.key))
    }, []);

    return (
        <div
            ref={board_ref}
            tabIndex={0} onKeyDown={handleKeyDown}
            className={"w-full h-full p-2 flex flex-row items-center justify-center border-0 outline-0"}>
            <div style={{height: 600, width: 500}} className={"border-2 border-white"}>
                <Application width={495} height={595} backgroundColor={0x000000} antialias>
                    <WordBlocks
                        words={words}
                        written_text={written_text}
                        completeWord={(position: number) => {
                            console.log("Completing word at index ", position);
                            // only if this is the first index with said word
                            const word = words.find(w => w.position === position);
                            if (!word) {
                                return;
                            }
                            if (words.find(w => w.text === word.text)?.position !== position) {
                                return;
                            }
                            setScore(prev => prev + word.text.length * 10);
                            setWords(prev => prev.map(w => {
                                if (w.position === position) {
                                    return {
                                        ...w,
                                        done: true,
                                    }
                                }
                                return w;
                            }));
                            setWrittenText("");
                        }} setWords={setWords}
                        og_text={text}
                    />
                </Application>
            </div>
            <div style={{height: 600, width: 200}}
                 className={"border-1 border-white flex flex-col items-center justify-center gap-8 px-2 text-center text-white"}>
                <p className={" text-sm"}>Type the words before they reach the bottom!</p>
                <p className={"text-sm"}>Words typed: {words.filter(w => w.done).length}</p>
                <p className={"text-md"}>Score: {score}</p>
            </div>
        </div>
    )
}

interface WordBlocksProps {
    words: TetrisWord[]
    og_text: string
    written_text: string
    setWords: React.Dispatch<React.SetStateAction<TetrisWord[]>>
    completeWord: (index: number) => void
}


function WordBlocks({words, og_text, written_text, setWords, completeWord}: WordBlocksProps) {
    const [speed, setSpeed] = React.useState<number>(1)
    const tt_time_ref = React.useRef<number>(0);
    const [dropping_words, setDroppingWords] = React.useState<{ idx: number, next_drop: number }>({
        idx: -1,
        next_drop: 0
    });

    React.useEffect(() => {
        // reset time and dropping words when og_text changes
        tt_time_ref.current = 0;
        setDroppingWords({idx: -1, next_drop: 0});
        setSpeed(1);
    }, [og_text]);

    useTick((delta) => {
        // Move words down based on speed
        setWords(prevWords => prevWords
            .map((word, i) => {
                if (i > dropping_words.idx || word.done) {
                    return word;
                }
                return ({
                    ...word,
                    y: word.y + (speed * delta.deltaTime)
                });
            }));

        const tgt_speed = 1.1 ** Math.floor(tt_time_ref.current / 1000)
        if (speed !== tgt_speed) {
            console.log("updating speed to ", tgt_speed)
            setSpeed(tgt_speed)
        }

        const drop_interval = 1 / Math.sqrt(Math.ceil(tt_time_ref.current / 500))
        if (tt_time_ref.current > dropping_words.next_drop) {
            setDroppingWords({
                idx: Math.min(dropping_words.idx + 1, words.length - 1),
                next_drop: dropping_words.next_drop + drop_interval * 100,
            })
        }

        tt_time_ref.current += delta.deltaTime
        // console.log("tt time is ", tt_time_ref.current)
    })

    return words
        .filter((w, i) => i <= dropping_words.idx && !w.done)
        .map((word, index) => {
            return (
                <WordBlock
                    key={index}
                    word={word.text}
                    typed_word={written_text}
                    x={word.x} y={word.y} rotation={0}
                    onDone={() => completeWord(word.position)}
                />
            );
        })
}
