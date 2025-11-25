export interface TetrisSessionResults {
    completed: boolean;
    num_words: number;
}

export interface TetrisWordSpecs {
    text: string
    position: number
    x: number
    y: number
    color: number // as hex
    done: boolean
}
