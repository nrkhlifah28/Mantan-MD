import { watchFile, unwatchFile } from "fs";
import axios from "axios";
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

	// Info Wait
	wait: "Sedang Di Proses, Mohon Tunggu....",
	eror: "Terjadi Kesalahan Coba Lagi Nanti!",
	APIs: {
		rose: "https:/api.itsrose.life",
	},

	APIKeys: {
		"https:/api.itsrose.life": "memek",
	},
};

// Its should be ok, right?
Object.assign(global, {
	...configs,
});

const file = fileURLToPath(import.meta.url);
watchFile(file, () => {
	unwatchFile(file);
	console.log(chalk.redBright("Update 'config.js'"));
	import(`${file}?update=${Date.now()}`);
});
