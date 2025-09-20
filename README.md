# envx - Cross‑runtime Environment Variable Helper (Node.js · Deno · Bun)

`envx` is a lightweight yet powerful ESM utility to **check**, **validate**, **sanitize**, and **load** environment variables across Node.js, Deno, and Bun - with **no external dependencies**.

## Features

* Validate types: `string`, `integer`, `number`, `boolean`
* Enforce constraints: min/max length, regex, enum array or function
* Retrieve sanitized values with trimming and coercion
* Provide optional defaults and optional/required semantics
* Load `.env` from the current working directory and `$HOME` (opt‑in), without dotenv
* Set global defaults once and apply them everywhere
* Enable Boolean strict mode (`true|false` only)
* Framework‑agnostic - works in CLIs and servers


## Installation

```bash
# Node.js / Bun (ESM project)
npm install @davidsneighbour/envx

# Deno: import directly from file path or hosted URL
import { getEnvVar } from "./src/envx.ts";
```


## Quick Start

### ▶ Node.js / Bun

```ts
import { configureDefaults, getEnvVar, validateEnvVar, checkEnvVar, loadEnv } from "@davidsneighbour/envx";

configureDefaults({
  verbose: true,
  envFilePaths: ["~/.env", ".env"],
});

await loadEnv();

const PORT = getEnvVar("PORT", { type: "int", default: 3000 });
const DEBUG = getEnvVar("DEBUG", { type: "boolean", default: false });

validateEnvVar("NODE_ENV", { pattern: /^(development|production|test)$/ });
checkEnvVar("API_KEY");
```

### ▶ Deno

```ts
// run with: deno run --allow-env --allow-read main.ts
import { configureDefaults, loadEnv, getEnvVar } from "./src/envx.ts";

configureDefaults({ verbose: true });

await loadEnv({ paths: [".env"] });

const port = getEnvVar("PORT", { type: "int", default: 8080 });
console.log("Running on port", port);
```


## API Reference

### `configureDefaults(options)`

Set global behaviour applied to all calls.

```ts
configureDefaults({
  verbose: false,
  exitOnError: false,
  envFilePaths: [".env"],
  trimValues: true,
  coerceTypes: true,
  booleanStrict: false,
});
```

### `checkEnvVar(name, options?)`

Ensure a variable exists (non‑empty unless `allowEmpty:true`). Throws on error.

```ts
checkEnvVar("API_URL", { allowEmpty: false, message: "API_URL missing" });
```

### `validateEnvVar(name, options?) => value`

Validate constraints and **return a coerced value** on success. Throws on failure.

Examples:

```ts
// integer
env.PORT = validateEnvVar("PORT", { type: "int" });

// regex enforced string
env.CODE = validateEnvVar("CODE", { pattern: /^[A-Z0-9]{8}$/ });

// strict boolean
env.DEBUG = validateEnvVar("DEBUG", { type: "boolean", booleanStrict: true });
```

### `getEnvVar(name, options?) => value | undefined`

Retrieve, trim, coerce, and validate. If missing and `default` provided (or `required:false`), return the default/undefined.

```ts
const token = getEnvVar("TOKEN", { pattern: /^[A-Za-z0-9_-]{20,}$/ });
const port  = getEnvVar("PORT", { type: "int", default: 8080 });
const debug = getEnvVar("DEBUG", { type: "boolean", required: false, default: false });
```

### `loadEnv(options?)`

Load `.env` files and populate the runtime environment.

```ts
await loadEnv({ paths: ["~/.env", ".env"], override: false });
```


## Boolean Strict Mode

By default, booleans accept flexible values: `true/false/1/0/yes/no/y/n/on/off`.

Enable strict mode to accept only `true` and `false` (case‑insensitive):

```ts
configureDefaults({ booleanStrict: true });

// or per call
getEnvVar("DEBUG", { type: "boolean", booleanStrict: true });
```

CLI example:

```bash
npx envx --var DEBUG --type boolean --boolean-strict
```


## CLI Usage

### ▶ Node.js / Bun

```bash
npx envx --var API_KEY --type string --pattern '^[A-Za-z0-9_-]{16,}$'

npx envx --var PORT --type int --default 8080

npx envx --var DEBUG --type boolean --boolean-strict
```

### ▶ Deno (no CLI binary)

Run directly via `deno run` with the envx module:

```bash
deno run --allow-env --allow-read main.ts
```


## Build & Publish (Node.js / Bun)

```bash
npm run build
npm test
npm publish --access public
```


## Cross‑Runtime Notes

* **Node.js**: uses `process.env`. Reads `.env` synchronously at startup. ESM only.
* **Deno**: uses `Deno.env`. Requires `--allow-env` and `--allow-read`. Import directly from file/URL.
* **Bun**: uses `process.env` or `Bun.env`. Bun automatically loads `.env*` files.
* **Browsers**: not supported.


## Testing

### ▶ Node.js

```bash
npm test
```

### ▶ Deno

```bash
deno test --allow-env --allow-read --allow-write
```

### ▶ Bun

```bash
bun test
```


## Security & Logging

* Errors include variable names but not values, preventing accidental leaks.
* `verbose:true` writes errors to stderr. Throwing remains the primary failure mechanism.


## License

MIT
