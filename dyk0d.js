#!/usr/bin/env node

/* ========= BANNER ========= */
if (process.argv.length === 2) {
  console.log("\x1b[36mdyk0d :: decode the unknown | -h for help\x1b[0m");
  process.exit(0);
}

/* ========= HELP ========= */
const helpText = `
dyk0d Decoder Toolkit
by dyak0xdb

Usage:
  dyk0d [options] <input>

Options:
  -e, --encode <type>    Encode input
  -d, --decode <type>    Decode input
  -h, --help             Show this help message

Types:
  hex        Hexadecimal
  base64     Base64
  url        URL Encode / Decode
  unicode    Unicode Escape (basic)
  binary     Binary
  ascii      ASCII (decimal)

Examples:
  dyk0d -e hex "Hello"
  dyk0d -d base64 "SGVsbG8="
  dyk0d -e url "xss payload"
`;

/* ========= ARGUMENTS ========= */
const args = process.argv.slice(2);

if (args.includes("-h")) {
  console.log(helpText);
  process.exit(0);
}

const mode   = args[0];           // -e | -d
const format = args[1];           // hex | base64 | url | unicode | binary | ascii
const data   = args.slice(2).join(" ");

if (!mode || !format || !data) {
  console.error('Usage: dyk0d -e|-d <type> "value"');
  process.exit(1);
}

let result = "";

/* ========= ENCODE ========= */
if (mode === "-e") {

  if (format === "binary") {
    for (const c of data) {
      result += c.charCodeAt(0).toString(2).padStart(8, "0") + " ";
    }
    console.log(result.trim());
    process.exit(0);
  }

  if (format === "hex") {
    for (const c of data) {
      result += c.charCodeAt(0).toString(16) + " ";
    }
    console.log(result.trim());
    process.exit(0);
  }

  if (format === "ascii") {
    for (const c of data) {
      result += c.charCodeAt(0) + " ";
    }
    console.log(result.trim());
    process.exit(0);
  }

  if (format === "base64") {
    console.log(Buffer.from(data, "utf8").toString("base64"));
    process.exit(0);
  }

  if (format === "url") {
    for (const char of data) {
      let hex = char.charCodeAt(0).toString(16);
      if (hex.length === 1) hex = "0" + hex;
      result += "%" + hex;
    }
    console.log(result);
    process.exit(0);
  }

  if (format === "html") {
    for (const char of data) {
      result += `&#x${char.charCodeAt(0).toString(16)};`;
    }
    console.log(result);
    process.exit(0);
  }

  if (format === "unicode") {
    for (const c of data) {
      let hex = c.charCodeAt(0).toString(16).padStart(4, "0"); 
      result += `\\u${hex}`;
    }
    console.log(result);
    process.exit(0);
  }

}

/* ========= DECODE ========= */
if (mode === "-d") {

  if (format === "binary") {
    for (const b of data.split(" ")) {
      result += String.fromCharCode(parseInt(b, 2));
    }
    console.log(result);
    process.exit(0);
  }

  if (format === "hex") {
    for (const h of data.split(" ")) {
      result += String.fromCharCode(parseInt(h, 16));
    }
    console.log(result);
    process.exit(0);
  }

  if (format === "ascii") {
    for (const d of data.split(" ")) {
      result += String.fromCharCode(parseInt(d, 10));
    }
    console.log(result);
    process.exit(0);
  }

  if (format === "base64") {
    console.log(Buffer.from(data, "base64").toString("utf8"));
    process.exit(0);
  }

  if (format === "url") {
    console.log(decodeURIComponent(data));
    process.exit(0);
  }

  if (format === "html") {
    result = data.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );
    console.log(result);
    process.exit(0);
  }

  if (format === "unicode") {
    result = data.replace(/\\?u([0-9a-fA-F]{4})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );
    console.log(result);
    process.exit(0);
  }

}

console.error("Unknown command. Use -h for help.");
process.exit(1);
