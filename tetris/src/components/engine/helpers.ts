import {TetrisSessionPerformanceStats, TetrisSessionScore} from "@/components/engine/types";

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

export function calculateTetrisScore(stats: TetrisSessionPerformanceStats): TetrisSessionScore {
    if (stats.words_completed.length === 0 || stats.key_log.length === 0) {
        return {
            score: 0,
            wpm: 0,
            streak: 0,
            accuracy: 0,
            fails: 0
        };
    }

    const base_score_per_letter = 10;
    const height_from_bottom_multiplier_per_unit = 0.01
    const streak_multiplier_per_word = 0.2

    // calculate the score
    let score = 0;
    let current_streak = 0;

    for (const word of stats.words_completed) {
        if (word.success) {
            current_streak += 1;
            const height_bonus = word.y_at_complete * height_from_bottom_multiplier_per_unit;
            const streak_bonus = 1 + (current_streak - 1) * streak_multiplier_per_word;
            score += word.word.length * base_score_per_letter * (1 + height_bonus) * streak_bonus;
        } else {
            current_streak = 0; // reset streak on failure
        }
    }

    // calculate WPM
    const total_time_minutes = (stats.key_log[stats.key_log.length - 1].timestamp - stats.key_log[0].timestamp) / 60000;
    const total_words_typed = stats.words_completed.filter(word => word.success).length;
    const wpm = total_time_minutes > 0 ? total_words_typed / total_time_minutes : 0;

    // calculate accuracy
    const total_chars_typed = stats.key_log.length;
    const correct_chars = stats.words_completed.reduce((acc, word) => {
        return acc + (word.success ? word.word.length : 0);
    }, 0);
    const accuracy = total_chars_typed > 0 ? (correct_chars / total_chars_typed) * 100 : 0;
    const fails = stats.words_completed.filter(word => !word.success).length;

    return {
        score: Math.round(score),
        wpm: Math.round(wpm),
        streak: current_streak,
        accuracy: Math.round(accuracy),
        fails: fails
    };

}
