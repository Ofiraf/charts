import * as shelljs from 'shelljs';

shelljs.cp('-R', './.env.dev', 'dist/');