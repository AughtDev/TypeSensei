export type LangCode = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'zh' | 'ja' | 'ko';

const SUPPORTED_LANGUAGES: LangCode[] = ['en']

interface WordJSONFormat {
    word: string;
    frequency: number;
}

export async function getWordsByIdx(
    n: number,
    lang: string,
    min_idx: number = 0,
    max_idx: number = 10000
): Promise<string[]> {
    // check if lang is supported
    if (!SUPPORTED_LANGUAGES.includes(lang as LangCode)) {
        return []
    }
    // open lang json and get the words as a list
    try {
        // convert to list, get a random sample of n between index min_idx and max_idx
        const words_list: WordJSONFormat[] = Array.from(await import(`./${lang}/words_10k.json`)) as WordJSONFormat[];
        console.log(words_list[0]);
        const sliced_words = words_list.slice(min_idx, max_idx);
        // shuffle the sliced words
        for (let i = sliced_words.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [sliced_words[i], sliced_words[j]] = [sliced_words[j], sliced_words[i]];
        }
        // get the first n words
        return sliced_words.slice(0, n).map(w => w.word);
    } catch (e) {
        console.error('Failed to load words json for language:', lang, e);
        return [];
    }
}
