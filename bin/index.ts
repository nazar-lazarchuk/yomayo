#!/usr/bin/env ts-node
import { Cli } from '../src/cli';
import * as commands from '../src/cli';

const command: keyof Cli | string = process.argv[2];

if (commands[command as keyof Cli]) {
  commands[command as keyof Cli]();
} else {
  console.log(`Undefined task ${command}`);
}
