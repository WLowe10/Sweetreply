import axios from "axios";
import { getAxiosScrapingProxy } from "@lib/utils";

export async function checkRedditBan(username: string): Promise<Boolean> {
	const response = await axios.get(`https://www.reddit.com/user/${username}`, {
		proxy: getAxiosScrapingProxy(),
	});

	return response.data.includes('<span slot="title">This account has been suspended</span>');
}
