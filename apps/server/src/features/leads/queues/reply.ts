import Queue from "bull";

const replyQueue = new Queue<any>("reply", {
	redis: {},
});

replyQueue.process(async (job) => {});

export { replyQueue };
