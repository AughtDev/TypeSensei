import json


def createWordListJSON(word_path: str = "en/clean_10k.txt", freq_path: str = "en/freq_50k.txt", save_dir: str = "en"):
    clean_words = []
    with open(word_path, 'r') as f:
        for line in f:
            clean_words.append(line.strip())

    frequencies = dict()
    with open(freq_path, 'r') as f:
        for line in f:
            word, freq = line.strip().split()
            frequencies[word] = int(freq)

    clean_freq_list = []
    for word in clean_words:
        freq = frequencies.get(word, 0)
        clean_freq_list.append({'word': word, 'frequency': freq})

    clean_freq_list.sort(key=lambda x: x['frequency'], reverse=True)

    with open(f"{save_dir}/clean_10k_freq.json", 'w') as f:
        json.dump(clean_freq_list, f, indent=4)

    return clean_freq_list


if __name__ == '__main__':
    ret = createWordListJSON()
    print("done")
