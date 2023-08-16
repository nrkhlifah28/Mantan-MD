import { generateWAMessage, getContentType } from "@whiskeysockets/baileys";

const defaultMenu = {
	before: ``,
	header: `\`\`\`- %category \`\`\``,
	body: "%cmd",
	footer: "",
	after: ``,
};

const handler = async (m, { conn, usedPrefix: _P, isOwner }) => {
	const Help = Object.values(global.plugins)
		.filter((p) => (isOwner ? !p?.disabled : !p?.disabled && !p?.owner))
		.map((p) => {
			return {
				help: Array.isArray(p?.help) ? p?.help : p?.help ? [p?.help] : "",
				tags: Array.isArray(p?.tags) ? p?.tags[0] : p?.tags ? [p?.tags] : "",
				prefix: p?.customPrefix ? true : false,
				limit: p?.limit,
				premium: p?.premium,
				enabled: !p?.disabled,
				owner: isOwner ? p.owner : false,
			};
		});
	let tags = {};
	Help.forEach((p) => {
		if (p.tags && p.tags.length) {
			Object.assign(tags, {
				[p.tags]: Array.isArray(p.tags)
					? p.tags.map(
							(v) =>
								v.charAt(v.length >= 1 ? 0 : v.length).toUpperCase() +
								v.slice(1)
					  )
					: [p.tags][0],
			});
		}
	});
	conn.menu = conn.menu ? conn.menu : {};
	const before = conn.before || defaultMenu.before;
	const header = conn.header || defaultMenu.header;
	const body = conn.body || defaultMenu.body;
	const footer = conn.footer || defaultMenu.footer;
	const after = conn.after || defaultMenu.after;

	let text = [
		before,
		...Object.keys(tags)
			.sort()
			.map((tag) => {
				return header.replace(
					/%category/g,
					`${tags[tag]}` +
						"\n" +
						[
							...Help.filter(
								(menu) =>
									menu.tags &&
									menu.tags.includes(tag) &&
									menu.help &&
									!menu.owner
							).map((menu) => {
								return menu.help
									.map((help) => {
										return body
											.replace(/%cmd/g, menu.prefix ? help : "%P" + help)
											.replace(/%isLimit/g, menu.limit ? "(Limit)" : "")
											.replace(/%isPremium/g, menu.premium ? "(Premium)" : "")
											.trim();
									})
									.join("\n");
							}),
							// footer,
						].join("\n")
				);
			}),
		after,
	].join("\n\n");
	text =
		typeof conn.menu === "string"
			? conn.menu
			: typeof conn.menu === "object"
			? text
			: "";
	const name = await conn.getName(m.sender);
	const replace = {
		"%": "%",
		P: _P,
		name,
		readMore,
		who: "@" + m.sender.replace(/[^0-9]/g, ""),
	};
	text = text.replace(
		new RegExp(
			`%(${Object.keys(replace)
				.sort((a, b) => b.length - a.length)
				.join("|")})`,
			"g"
		),
		(_, name) => "" + replace[name]
	);
  
	await conn.sendMessage(
		m.chat,
		{
			text,
			mentions: [m.sender],
		},
		{ quoted: m }
	);
};
handler.help = ["menu", "help"];
handler.command = ["menu", "help"];
export default handler;
