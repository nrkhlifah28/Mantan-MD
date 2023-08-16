import { watchFile, unwatchFile } from "fs";
import chalk from "chalk";
import { fileURLToPath } from "url";

const configs = {
  // Owner
  owner: [["628xxx", "Xyroinee", true]],
  mods: [],
  prems: [],
  // Info
  packname: "anu - MD by",
  author: "© Xyroinee",

  wm: "© anu By Xyroine",
  // Info Wait
  wait: "Sedang Di Proses, Mohon Tunggu....",
  eror: "Terjadi Kesalahan Coba Lagi Nanti!",
  multiplier: 69,
  APIs: {
    rose: "https:/api.itsrose.life"
  },

  APIKeys: {
    "https:/api.itsrose.life": "apikeymu",
  },
}

// Its should be ok, right?
Object.assign(global, {
  ...configs
});

const file = fileURLToPath(import.meta.url);
watchFile(file, () => {
	unwatchFile(file);
	console.log(chalk.redBright("Update 'config.js'"));
	import(`${file}?update=${Date.now()}`);
});
