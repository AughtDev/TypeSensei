"use client"
import React from 'react';
import {TetrisSessionResults, TetrisWordSpecs} from "@/components/engine/types";
import {Application, useTick} from "@pixi/react";
import WordBlock from "@/components/engine/board/WordBlock";
import {processTypedKey, updateWordsOnWrittenTextChange} from "@/components/engine/helpers";
import BoardStats from "@/components/engine/board/BoardStats";
import TetrisBoardContext, {TetrisBoardContextProps} from "@/components/engine/context";

interface TetrisBoardProps {
    text: string
    onFinish: (results: TetrisSessionResults) => void
}

const MONO_LETTER_WIDTH = 10; // approximate width of a monospace letter in pixels

export default function Board({text, onFinish}: TetrisBoardProps) {
    // if there is no text throw an error
    if (text.trim().length === 0) {
        throw new Error("No text provided to Tetris Board");
    }

    const board_ref = React.useRef<HTMLDivElement | null>(null);

    const [written_text, setWrittenText] = React.useState<string>("")
    const [words, setWords] = React.useState<TetrisWordSpecs[]>([])
    const [score, setScore] = React.useState<number>(0)

    // region INITIALIZE GAME AND SET KILL CONDITION
    // ? ........................

    // initialize words when text changes
    React.useEffect(() => {
        console.log("Initializing words for text: ", text);
        setWords(
            text.split(" ")
                // filter out punctuation and spaces or empty strings
                .filter(word => word.trim().length > 0)
                .map((word, index) => ({
                        text: word,
                        x: Math.floor(Math.random() * (500 - word.length * MONO_LETTER_WIDTH)), // random x position within board width
                        position: index,
                        color: 0xffffff,
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
        if (words.length === 0) {
            return
        }
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

    // when no word matches the written_text, clear it and flash red
    React.useEffect(() => {
        if (words.length === 0) {
            return
        }
        const {words: updated_words, text: updated_text} = updateWordsOnWrittenTextChange(written_text, words);
        setWords(updated_words);
        setWrittenText(updated_text);

        // update score based on completed words
        const completed_words = updated_words.filter(word => word.done).map(w => w.text.length).reduce((a, b) => a + b, 0);
        setScore(completed_words * 10); // each letter is worth 10 points

        // if the words have been set to red, reset after 1000ms
        if (updated_words.some(word => word.color === 0xff0000)) {
            console.log("setting timeout to reset colors from red")
            setTimeout(() => {
                console.log("reset colors from red")
                setWords(prevWords => prevWords.map(word => ({
                    ...word,
                    color: 0xffffff
                })));
            }, 500);
            // return () => clearTimeout(timeout);
        }

    }, [written_text]);


    // ? ........................
    // endregion ........................


    const context: TetrisBoardContextProps = React.useMemo(() => ({
        written_text,
        content: {
            text,
            words,
            completeWord: (position: number) => {
            }
        },
        graphics: {
            animateWordFall: (delta_y: number, last_drop_idx: number) => {
                // console.log("Animating word fall by ", delta_y, " for words up to index ", last_drop_idx);
                setWords(prevWords => prevWords
                    .map((word, i) => {
                        if (i > last_drop_idx || word.done) {
                            return word;
                        }
                        return ({
                            ...word,
                            y: word.y + delta_y
                        });
                    }));
            }
        },
        progress: {
            score
        }
    }), [score, text, words, written_text, setWords]);

    return (
        <div
            ref={board_ref}
            tabIndex={0} onKeyDown={(e) => {
            e.preventDefault();
            setWrittenText(prev => processTypedKey(prev, e.key))
        }}
            className={"w-full h-full p-2 flex flex-row items-center justify-center border-0 outline-0"}>
            <TetrisBoardContext.Provider value={context}>
                <div style={{height: 600, width: 500}} className={"border-2 border-white"}>
                    <Application width={495} height={595} backgroundColor={0x000000} antialias>
                        <WordBlocks/>
                    </Application>
                </div>
                <BoardStats/>
            </TetrisBoardContext.Provider>
        </div>
    )
}

function WordBlocks() {
    const {
        written_text,
        content: {words, text: og_text},
        graphics: {animateWordFall}
    } = React.useContext(TetrisBoardContext);

    const [speed, setSpeed] = React.useState<number>(1)

    const tt_time_ref = React.useRef<number>(0);
    const [dropping_words, setDroppingWords] = React.useState<{ idx: number, next_drop: number }>({
        idx: -1,
        next_drop: 0
    });

    React.useEffect(() => {
        console.log("resetting")
        // reset time and dropping words when og_text changes
        tt_time_ref.current = 0;
        setDroppingWords({idx: -1, next_drop: 0});
        setSpeed(1);
    }, [og_text]);

    useTick((delta) => {
        // Move words down based on speed
        animateWordFall(speed * delta.deltaTime, dropping_words.idx);

        const tgt_speed = 1.1 ** Math.floor(tt_time_ref.current / 1000)
        if (speed !== tgt_speed) {
            console.log("updating speed to ", tgt_speed)
            setSpeed(tgt_speed)
        }

        const drop_interval = 1 / Math.sqrt(Math.ceil(tt_time_ref.current / 500))
        if (tt_time_ref.current > dropping_words.next_drop) {
            console.log("dropping word index ", dropping_words.idx + 1, "out of ", words.length)
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
                    word={word}
                    typed_word={written_text}
                />
            );
        })
}
