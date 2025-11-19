import {TypeLog, TypeSessionResults, TypeWriterStats} from "@/components/engine/types";

export function generateTypeSessionResults(type_log: TypeLog[], original_text: string): TypeSessionResults {
    // calculate stats
    const time_taken_minutes = (type_log[type_log.length - 1].timestamp_t - type_log[0].timestamp_t) / 60000;
    const total_words = original_text.split(" ").length;
    const typing_speed_wpm = total_words / time_taken_minutes;

    const total_errors = type_log.filter((log, index) => {
        // count errors as characters that do not match the original text at the same position
        return log.char !== original_text[index];
    }).length;
    const error_rate_percentage = (total_errors / original_text.length) * 100;

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
