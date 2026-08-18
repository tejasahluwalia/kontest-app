import { getTreaty } from "../routes/api/$";

const server = {
	get api() {
		return getTreaty();
	},
};

export default server;
