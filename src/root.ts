import { existsSync } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';

const cwd = process.cwd();

const devEnv = join(cwd, '.env.development');
const prodEnv = join(cwd, '.env.production');

console.log('📁 Current directory:', cwd);
console.log('🔍 Checking for files:');
console.log('   →', devEnv, existsSync(devEnv) ? '✅ Found' : '❌ Missing');
console.log('   →', prodEnv, existsSync(prodEnv) ? '✅ Found' : '❌ Missing');

const dev = existsSync(devEnv);
const prod = existsSync(prodEnv);

if (dev && prod) {
  console.error('❌ Both .env.development and .env.production exist — keep only one!');
  process.exit(1);
}
if (!dev && !prod) {
  console.error('❌ Missing env file — expected .env.development or .env.production');
  process.exit(1);
}

const env = prod ? 'production' : 'development';
console.log(`🚀 Starting in ${env.toUpperCase()} mode...`);

const [cmd, args]: [string, string[]] = prod
  ? ['node', ['dist/main.js']]
  : ['nest', ['start', '--no-source-maps']];

const child = spawn(cmd, args, {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, NODE_ENV: env },
});

child.on('error', (err) => {
  console.error('💥 Startup failed:', err.message);
  process.exit(1);
});

child.on('exit', (code) => process.exit(code || 0));
