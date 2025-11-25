import {TetrisWordSpecs} from "@/components/engine/types";

export function processTypedKey(current_text: string, key: string): string {
    let new_text = current_text;

    if (key === 'Backspace') {
        new_text = current_text.slice(0, -1);
    } else if (key.length === 1) { // only process single character keys
        new_text += key;
    }
    return new_text;
}

interface UpdateWordsResult {
    words: TetrisWordSpecs[],
    text: string
}

export function updateWordsOnWrittenTextChange(
    text: string,
    words: TetrisWordSpecs[]
): UpdateWordsResult {

    const matches_word = words.some(word => word.text.startsWith(text.trim()) && !word.done && word.y > 0);
    // if there is no matching word, clear the text and flash the words red
    if (!matches_word && text.length > 0) {
        return {
            words: words.map(word => ({
                ...word,
                color: 0xff0000
            })),
            text: ""
        };
    } else {
        if (text.length !== 0) {
            // check if the text is any word + space, if so, that word is done, mark as done and clear text
            const completed_word = words.find(word => (word.text + ' ') === text && !word.done && word.y > 0);
            if (completed_word) {
                return {
                    words: words.map(word => word.position === completed_word.position ? {
                        ...word,
                        done: true,
                    } : word),
                    text: ""
                };
            }
        }
    }
    return {words, text};
}
