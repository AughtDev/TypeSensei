export interface TetrisSessionResults {
    completed: boolean;
    num_words: number;
    score: number
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
