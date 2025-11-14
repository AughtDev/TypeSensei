export interface TypeWriterTheme {
    text: {
        written_color: string;
        error_color: string;
        unwritten_color: string;
    }
}

export interface TypeWriterStats {
    typing_speed_wpm: number;
    error_rate_percentage: number;
}

export interface TypeLog {
    timestamp_t: number
    char: string
}

export interface TypeSessionResults {
    original_text: string;
    type_log: TypeLog[]

    stats: TypeWriterStats;
}
