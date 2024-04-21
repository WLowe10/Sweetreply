import axios, { type Axios } from "axios";
import { CHROME_USER_AGENT } from "../../constants";

export class RedditPublic {
	private axios: Axios;

	constructor() {
		this.axios = axios.create({
			headers: {
				"User-Agent": CHROME_USER_AGENT,
			},
		});
	}
}
