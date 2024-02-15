
export function analyze(rawKeys, rawLabels, defs) {
    const keys = rawKeys.split(/\s+/);
    const labels = rawLabels.split(',');

    for(let i = 0; i < keys.length; i++) {
        const def = defs[i - 6];
        console.log(i, keys[i], labels[i], def)
    }

}