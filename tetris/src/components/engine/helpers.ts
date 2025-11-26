
export function processTypedKey(current_text: string, key: string): string {
    let new_text = current_text;

    if (key === 'Backspace') {
        new_text = current_text.slice(0, -1);
    } else if (key.length === 1) { // only process single character keys
        new_text += key;
    }
    if (new_text.trim().length === 0) {
        new_text = "";
    }
    return new_text.toLowerCase();
}

export function generateRandomID(): string {
    // generate a 16 character random string
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
