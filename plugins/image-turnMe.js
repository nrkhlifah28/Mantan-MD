import axios from "axios";
import uploadImage from "../lib/uploadImage.js";

const handler = async (m, { conn, usedPrefix, command, args }) => {
	const q = m.quoted ? m.quoted : m;
	const mime = (q.msg || q).mimetype || q.mediaType || "";
	if (!/image\/(jpe?g|png)/.test(mime)) {
		return m.reply(
			`Example: reply/send image with caption *${usedPrefix + command}*`,
		);
	}
	const [style = "anime", skin = "default"] = args;
	const configs = {
		init_image: await uploadImage(await q.download()),
		style,
		skin,
		image_num: 1,
	};
	await conn.sendMessage(
		m.chat,
		{
			text: `_Turning you, style ${configs["style"]}, skin ${configs["skin"]}_`,
		},
		{ quoted: m },
	);
	const { data } = await axios
		.request({
			baseURL: APIs["rose"],
			url: "/image/turnMe",
			method: "POST",
			params: { apikey: APIKeys[APIs["rose"]] },
			data: { ...configs },
		})
		.catch((e) => e?.response);
	const { status, message, result, styles, skins } = data;
	if (!status) {
		let count = 1,
			extra_msg = "";
		const _obj_key = styles || skins;
		if (_obj_key && Array.isArray(_obj_key)) {
			extra_msg += " Here available styles\n\n";
			for (const id of _obj_key) {
				extra_msg += `${count}. ${id}\n`;
				count += 1;
			}
		}
		return m.reply(message + extra_msg);
	}
	for (const url of result["images"]) {
		await conn.sendMessage(m.chat, { image: { url } }, { quoted: m });
	}
};
handler["help"] = ["turnme"];
handler["command"] = ["turnme"];
handler["tags"] = ["ai"];
export default handler;
