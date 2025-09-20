// deno test --allow-env --allow-read
import { checkEnvVar, validateEnvVar, getEnvVar, loadEnv } from './src/envx.ts';

Deno.test({
  name: "basic deno presence",
  permissions: { env: true },
  fn() {
    Deno.env.set("DENO_T", "ok");
    checkEnvVar("DENO_T");
  }
});

Deno.test({
  name: "deno loadEnv",
  permissions: { env: true, read: true, write: true },
  async fn() {
    const p = ".env.deno.test";
    await Deno.writeTextFile(p, "A=1\n");
    try {
      const out = await loadEnv({ paths: p });
      if (out.A !== "1") throw new Error("A not loaded");
    } finally {
      await Deno.remove(p).catch(() => {});
    }
  }
});

Deno.test('basic deno presence', () => {
  Deno.env.set('DENO_T', 'ok');
  checkEnvVar('DENO_T');
});

Deno.test('deno loadEnv', async () => {
  const p = '.env.deno.test';
  await Deno.writeTextFile(p, 'A=1\n');
  try {
    const out = await loadEnv({ paths: p });
    if (out.A !== '1') throw new Error('not loaded');
  } finally {
    await Deno.remove(p);
  }
});
