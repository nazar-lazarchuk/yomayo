import path from 'path';
import fs from 'fs';
//
import { renderInitialDocumentLayout, Listener } from '../app/utils';

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

    // створення js-файлу
    if (!fs.existsSync(resolveDestinationPath)){
      fs.mkdirSync(resolveDestinationPath);
    }

    if (!app || !app.default) {
      throw new Error('App not found');
    }

    const { render, store } = app.default;
    if (!render) {
      throw new Error('Render not found');
    }
    if (!store) {
      throw new Error('Store not found');
    }

    const listeners: Listener[] = [];

    fs.writeFileSync(
      path.resolve(resolveDestinationPath, './index.html'),
      renderInitialDocumentLayout(render, store, (l) => void(listeners.push(l))),
    );

    console.log(listeners);

    fs.writeFileSync(
      path.resolve(resolveDestinationPath, './main.js'),
      `const myApp = ${JSON.stringify(app.default)}`,
    );
  }
}
