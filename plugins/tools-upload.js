import uploadImage from "../lib/uploadImage.js";

const handler = async (m, {}) => {
	const q = m.quoted ? m.quoted : m;
	const mime = (q.msg || q).mimetype || "";
	if (!mime) {
		return m.reply("where the media?");
	}

	if (!/image\/(png|jpe?g)||video\/(mp4|3gp|mp3)/.test(mime)) {
		return m.reply("Unsupported file");
	}
	const url = await uploadImage(await q.download());
	m.reply(url);
};
handler["help"] = ["tourl"];
handler["command"] = ["tourl"];
handler["tags"] = ["tools"];

export default handler;
