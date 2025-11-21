import React from 'react';

import {extend} from '@pixi/react';
import {Text, SplitText, Container} from 'pixi.js';

extend({
    Text, SplitText, Container
})

interface WordBlockProps {
    word: string;
    typed_word: string;
    x: number;
    y: number;
    rotation: number;
    onDone: () => void
}

export default function WordBlock
({
     word,
     typed_word,
     x, y, rotation, onDone
 }: WordBlockProps) {
    const written_ref = React.useRef<Text>(null);
    const [written_width, setWrittenWidth] = React.useState<number>(0)

    React.useEffect(() => {
        // if the words match except for the last letter which is space, call onDone
        if (typed_word === word + ' ') {
            onDone();
        }
    }, [onDone, typed_word, word]);

    React.useEffect(() => {
        if (written_ref.current) {
            const width = written_ref.current.width as number;
            setWrittenWidth(width);
        }
    }, [word,typed_word]);

    const num_written_letters = React.useMemo(() => {
        if (typed_word.trim().length > word.length) {
            return 0
        }
        let ln = 0;
        while (ln < typed_word.length && ln < word.length && typed_word[ln] === word[ln]) {
            ln++;
        }
        return ln;
    }, [typed_word, word]);

    return (
        <pixiContainer x={x} y={y} rotation={rotation}>
            {/*{num_written_letters > 0 && (*/}
            <pixiText
                ref={written_ref}
                text={word.slice(0, num_written_letters)}
                style={{fontSize: 14, fill: 0x00ff00}}
                x={0}
                anchor={{x: 0, y: 0.5}}/>
            {/*)}*/}
            <pixiText
                text={word.slice(num_written_letters)}
                style={{fontSize: 14}}
                x={written_width}
                anchor={{x: 0, y: 0.5}}/>
        </pixiContainer>
    )
}
