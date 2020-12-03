#!/usr/bin/env node

const [, , command, filePath] = process.argv;

if (command === 'build') {
  const path = require('path');
  const { INIT_CWD } = process.env;

  const resolvedFilePath = path.resolve(INIT_CWD, filePath);
  console.log(resolvedFilePath);
  // const app = require(resolvedFilePath);
  return;
}

console.log('this is bin', INIT_CWD, command, filePath);
