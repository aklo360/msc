#!/usr/bin/env node
// Nano Banana (Gemini) image generation for the Dark Room visual deck.
// Mirrors the animatic workflow (prompt file in, versioned output dir out).
// Usage:
//   node scripts/darkroom-nb2.mjs --out <dir> --prompt-file <path> \
//     [--model flash|pro|<full-id>] [--image-size 1K|2K|4K] [--aspect-ratio 16:9] \
//     [--ref <image path>]... (up to 6 reference images, prepended in order)
// Env: GEMINI_API_KEY must be set.
import fs from 'node:fs';
import path from 'node:path';

const MODELS = {
  flash: 'gemini-3.1-flash-image-preview',
  pro: 'gemini-3-pro-image-preview',
};

function parseArgs(argv) {
  const args = {imageSize: '1K', aspectRatio: '16:9', model: MODELS.flash, refs: []};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      i += 1;
      if (i >= argv.length) throw new Error(`Missing value for ${arg}`);
      return argv[i];
    };
    switch (arg) {
      case '--out': args.out = next(); break;
      case '--prompt-file': args.promptFile = next(); break;
      case '--image-size': args.imageSize = next(); break;
      case '--aspect-ratio': args.aspectRatio = next(); break;
      case '--model': { const m = next(); args.model = MODELS[m] ?? m; break; }
      case '--ref': args.refs.push(next()); break;
      default: throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!args.out || !args.promptFile) throw new Error('Missing --out or --prompt-file');
  return args;
}

function mimeFor(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  return 'image/png';
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set');

  const outDir = path.resolve(args.out);
  fs.mkdirSync(outDir, {recursive: true});
  const prompt = fs.readFileSync(args.promptFile, 'utf8').trim();
  fs.writeFileSync(path.join(outDir, 'prompt.txt'), `${prompt}\n`);
  fs.writeFileSync(
    path.join(outDir, 'request.json'),
    `${JSON.stringify({model: args.model, imageSize: args.imageSize, aspectRatio: args.aspectRatio, refs: args.refs}, null, 2)}\n`,
  );

  const parts = [];
  for (const ref of args.refs) {
    parts.push({inlineData: {mimeType: mimeFor(ref), data: fs.readFileSync(ref).toString('base64')}});
  }
  parts.push({text: prompt});

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${args.model}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      contents: [{role: 'user', parts}],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
        imageConfig: {imageSize: args.imageSize, aspectRatio: args.aspectRatio},
      },
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 500)}`);
  const json = await res.json();

  const respParts = json?.candidates?.[0]?.content?.parts ?? [];
  let saved = null;
  for (const part of respParts) {
    const inline = part.inlineData ?? part.inline_data;
    if (inline?.data) {
      const mime = inline.mimeType ?? inline.mime_type ?? 'image/png';
      const ext = mime.includes('jpeg') ? 'jpg' : mime.includes('webp') ? 'webp' : 'png';
      saved = path.join(outDir, `output.${ext}`);
      fs.writeFileSync(saved, Buffer.from(inline.data, 'base64'));
    } else if (part.text) {
      fs.appendFileSync(path.join(outDir, 'model-text.txt'), `${part.text}\n`);
    }
  }
  if (!saved) throw new Error(`No inline image in response: ${JSON.stringify(json).slice(0, 400)}`);
  console.log(`Wrote ${saved}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
