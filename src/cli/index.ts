import path from 'path';
import fs from 'fs';

export interface Cli {
  build(): void;
}

export const build: Cli['build'] = () => {
  const [, , , filePath, destinationPath = './dist'] = process.argv;
  const INIT_CWD: string | undefined = process.env.INIT_CWD;

  if (INIT_CWD) {
    const resolvedFilePath = path.resolve(INIT_CWD, filePath);
    const resolveDestinationPath = path.resolve(INIT_CWD, destinationPath);
    const app = require(resolvedFilePath);
    console.log(app.default);

    // створення js-файлу
    if (!fs.existsSync(resolveDestinationPath)){
        fs.mkdirSync(resolveDestinationPath);
    }
    fs.writeFileSync(path.resolve(resolveDestinationPath, './main.js'), `const myApp = ${JSON.stringify(app.default)}`);
  }
}
