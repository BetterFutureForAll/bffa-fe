import neatCsv from 'neat-csv';
import fs from 'node:fs';
import { writeFile } from 'node:fs/promises';

const spi = {
    src: './data/2024/2024_social_progress_index_dataset-1704469332.xlsx-data-2011-2023.csv',
    dest: './src/assets/spi.json',
}
const def = {
    src: './data/2024/2024_social_progress_index_dataset-1704469332.xlsx-indicators-definitions.csv',
    dest: './src/assets/definitions.json',
}

await Promise.all([csvToJSON(spi), csvToJSON(def)]);

async function csvToJSON({ src, dest }) {
    const result = await neatCsv(fs.createReadStream(src), {
        skipLines: 1,
        strict: true,
        mapHeaders: ({ header }) => header.toLowerCase().replaceAll(' ', '_'),
    })
    console.log(dest, 'Columns: ', Object.keys(result[0]).length, 'Rows: ', result.length)
    await writeFile(dest, JSON.stringify(result, null, 4));
}