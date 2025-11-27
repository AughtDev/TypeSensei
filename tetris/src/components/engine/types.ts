export interface TetrisSessionResults {
    completed: boolean;
    num_words_completed: number;
    num_words_failed: number;
    score: TetrisSessionScore
}

export interface TetrisWordSpecs {
    id: string
    text: string
    position: number
    x: number
    y: number
    color: number // as hex
    done: boolean
}

export interface TetrisSessionPerformanceStats {
    key_log: {
        char: string;
        timestamp: number;
    }[]
    words_completed: {
        id: string
        word: string
        y_at_complete: number
        success: boolean
    }[]
}

export interface TetrisSessionScore {
    score: number
    wpm: number
    streak: number
    accuracy: number
    fails: number
}
