"use client"

import React from 'react';
import {TypeLog, TypeSessionResults, TypeWriterStats, TypeWriterTheme} from "@/components/engine/types";
import {generateTypeSessionResults, processTypedKey} from "@/components/engine/helpers";

interface TypeWriterProps {
    text: string
    theme: TypeWriterTheme
    onFinish?: (result: TypeSessionResults) => void
}

export default function TypeWriter
({
     text: original_text,
     theme: {
         text: {
             written_color,
             error_color,
             unwritten_color
         }
     }, onFinish
 }: TypeWriterProps) {
    const tr_ref = React.useRef<HTMLDivElement | null>(null);

    const [type_log, setTypeLog] = React.useState<TypeLog[]>([])
    const [written_text, setWrittenText] = React.useState<string>("")
    const [completed, setCompleted] = React.useState<boolean>(false)
    const [is_focused, setIsFocused] = React.useState<boolean>(false);

    const audio = React.useMemo(() => {
        return new Audio('audio/keypresses/click.wav');
    }, []);

    // if the original text changes, reset the state
    React.useEffect(() => {
        tr_ref.current?.focus()
        setTypeLog([]);
        setCompleted(false)
        setWrittenText("");
    }, [original_text]);

    const match_text_length = React.useMemo(() => {
        // check the extent to which the written text matches the original text
        let ln = 0;
        while (ln < written_text.length && ln < original_text.length && written_text[ln] === original_text[ln]) {
            ln++;
        }
        return ln;
    }, [original_text, written_text]);

    React.useEffect(() => {
        // if the written text matches the original text, calculate the stats and call onFinish
        if (!completed && written_text === original_text) {
            onFinish?.(generateTypeSessionResults(type_log, original_text));
            setCompleted(true);
        }
    }, [completed, match_text_length, onFinish, original_text, type_log, written_text]);


    // console.log({is_focused});
    const handleKeyDown = (e: React.KeyboardEvent) => {
        e.preventDefault();

        setWrittenText(prev => processTypedKey(prev, e.key))
        audio.play().then()

        setTypeLog(prev => [
            ...prev,
            {
                timestamp_t: Date.now(),
                typed_key: e.key
            }
        ]);
    };

    return (
        <div
            ref={tr_ref}
            className={"relative flex align-center justify-center p-4"}
            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
            tabIndex={0} onKeyDown={handleKeyDown}
            style={{outline: "none"}}>
            {!is_focused && <div className={"absolute w-full h-full z-30 backdrop-blur-xs"}/>}
            <p className={"text-lg font-mono mb-4 text-center"}>
                {/* display the written text up to the match length with no transparency, then error text if any, then unwritten text in transp */}
                <span style={{color: written_color}}>
                    {original_text.slice(0, match_text_length)}
                </span>
                <span style={{color: error_color}}>
                    {written_text.slice(match_text_length, written_text.length).replaceAll(" ", "_")}
                </span>
                <span style={{color: unwritten_color, opacity: 0.5}}>
                    {original_text.slice(written_text.length)}
                </span>
            </p>
        </div>
    )
}




