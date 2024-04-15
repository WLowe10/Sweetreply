export function generateDescendingRedditIds(startId: string, amount: number, prefix: string) {
	let id = parseInt(startId, 36);
	let ids: string[] = [];

	for (let i = 0; i < amount; i++) {
		ids.push(`${prefix}_${id.toString(36)}`);

		id = id - 1;
	}

	return ids;
}

export function generateBatchedRedditInfoUrls(ids: string[], groupSize = 100) {
	let urls: string[] = [];

	for (let i = 0; i < ids.length; i += groupSize) {
		const chunk = ids.slice(i, i + groupSize);

		urls.push("https://api.reddit.com/api/info.json?id=" + chunk.join(","));
	}

	return urls;
}
