export function processTypedKey(current_text: string, key: string): string {
    let new_text = current_text;

    if (key === 'Backspace') {
        new_text = current_text.slice(0, -1);
    } else if (key.length === 1) { // only process single character keys
        new_text += key;
    }
    return new_text;
}
