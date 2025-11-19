import {TypeLog, TypeSessionResults, TypeWriterStats} from "@/components/engine/types";

export function generateTypeSessionResults(type_log: TypeLog[], original_text: string): TypeSessionResults {
    // calculate stats
    const time_taken_minutes = (type_log[type_log.length - 1].timestamp_t - type_log[0].timestamp_t) / 60000;
    const total_words = original_text.split(" ").length;
    const typing_speed_wpm = total_words / time_taken_minutes;

    let total_errors = 0;
    let typed_text = "";
    // recreate the type actions, when doesn't match original text, count as error
    for (const entry of type_log) {
        typed_text = processTypedKey(typed_text, entry.typed_key)
        const current_index = typed_text.length - 1;
        if (current_index < original_text.length) {
            if (typed_text[current_index] !== original_text[current_index]) {
                total_errors++;
            }
        } else {
            total_errors++;
        }
    }

    const error_rate_percentage = (total_errors / type_log.length) * 100;

    const stats: TypeWriterStats = {
        typing_speed_wpm,
        error_rate_percentage
    };

    return {
        original_text,
        type_log,
        stats
    };
}

export function processTypedKey(current_text: string, key: string): string {
    let new_text = current_text;

    if (key === 'Backspace') {
        new_text = current_text.slice(0, -1);
    } else if (key.length === 1) { // only process single character keys
        new_text += key;
    }
    return new_text;
}
