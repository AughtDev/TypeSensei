import React from 'react';
import {TypeLog, TypeSessionResults, TypeWriterStats, TypeWriterTheme} from "@/components/engine/types";

interface TypeWriterProps {
    text: string
    theme: TypeWriterTheme
    setStats: (stats: TypeWriterStats) => void
    onFinish: (result: TypeSessionResults) => void
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
     }
 }: TypeWriterProps) {
    const [type_log, setTypeLog] = React.useState<TypeLog[]>([])
    const [written_text, setWrittenText] = React.useState<string>("")

    const match_text_length = React.useMemo(() => {
        // check the extent to which the written text matches the original text
        let ln = 0;
        while (ln < written_text.length && ln < original_text.length && written_text[ln] === original_text[ln]) {
            ln++;
        }
        return ln;
    }, [original_text, written_text]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        e.preventDefault();

        if (e.key === 'Backspace') {
            setWrittenText(prev => prev.slice(0, -1));
        } else if (e.key === ' ') {
            setWrittenText(prev => prev + ' ');
        } else if (e.key.length === 1) {
            // Regular character (not special keys like Shift, Ctrl, etc.)
            setWrittenText(prev => prev + e.key);
        }

        setTypeLog(prev => [
            ...prev,
            {
                timestamp_t: Date.now(),
                char: e.key
            }
        ]);
    };

    return (
        <div
            className={"flex align-center justify-center p-2"}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            style={{outline: "none"}}>
            <p className={"text-md mb-4 text-center"}>
                {/* display the written text up to the match length with no transparency, then error text if any, then unwritten text in transp */}
                <span style={{color: written_color}}>
                    {original_text.slice(0, match_text_length)}
                </span>
                <span style={{color: error_color}}>
                    {original_text.slice(match_text_length, written_text.length)}
                </span>
                <span style={{color: unwritten_color, opacity: 0.5}}>
                    {original_text.slice(written_text.length)}
                </span>
            </p>
        </div>
    )
}
