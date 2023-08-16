import axios from "axios";

const handler = async (m, { text, usedPrefix, command }) => {
	if (!text) {
		return m.reply(`Example: *${usedPrefix + command}* hai`);
	}
	const { data } = await axios
		.request({
			baseURL: APIs["rose"],
			url: "/others/simi",
			params: {
				message: text,
				level: 12,
				lc: "id",
				apikey: APIKeys[APIs["rose"]],
			},
		})
		.catch((e) => e?.response);
	const { status, result, message } = data;
	if (!status) {
		return m.reply(message);
	}
	const { sentence, original } = result["simi"];
	m.reply(original);
};

handler["help"] = ["simi"];
handler["command"] = ["simi"];
handler["tags"] = ["fun"];

export default handler;
