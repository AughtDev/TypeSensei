import React from 'react';

import {extend} from '@pixi/react';
import {Text, SplitText, Container} from 'pixi.js';
import {TetrisWordSpecs} from "@/components/engine/types";

extend({
    Text, SplitText, Container
})

interface WordBlockProps {
    // word: string;
    // x: number;
    // y: number;
    // rotation: number;
    // onDone: () => void
    word: TetrisWordSpecs
    typed_word: string;
}

export default function WordBlock
({
     word: {text: word, x,color, y},
     typed_word,
 }: WordBlockProps) {
    const written_ref = React.useRef<Text>(null);
    const [written_width, setWrittenWidth] = React.useState<number>(0)

    React.useEffect(() => {
        if (written_ref.current) {
            const width = written_ref.current.width as number;
            setWrittenWidth(width);
        }
    }, [word, typed_word]);

    const num_written_letters = React.useMemo(() => {
        if (word.startsWith(typed_word)) {
            return typed_word.trim().length;
        }
        return 0
    }, [typed_word, word]);

    const {font_size, written_color, unwritten_color} = React.useMemo(() => {
        return {font_size: 18, written_color: 0x00ff00, unwritten_color: 0xffffff};
    }, []);

    return (
        <pixiContainer x={x} y={y} rotation={0}>
            <pixiText
                ref={written_ref}
                text={word.slice(0, num_written_letters)}
                style={{fontSize: font_size, fill: written_color, fontFamily: 'monospace'}}
                x={0}
                anchor={{x: 0, y: 0.5}}/>
            <pixiText
                text={word.slice(num_written_letters)}
                style={{fontSize: font_size, fill: color, fontFamily: "monospace"}}
                x={written_width}
                anchor={{x: 0, y: 0.5}}/>
        </pixiContainer>
    )
}
