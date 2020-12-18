import path from 'path';

export interface Cli {
  build(): void;
}

export const build: Cli['build'] = () => {
  const filePath = process.argv[3];
  const INIT_CWD: string | undefined = process.env.INIT_CWD;

  if (INIT_CWD) {
    const resolvedFilePath = path.resolve(INIT_CWD, filePath);
    const app = require(resolvedFilePath);
    console.log(app);
  }
}
