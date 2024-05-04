import { Controller, Get, Req, Res } from "routing-controllers";
import type { Response } from "express";

// Use this controller to handle routes that shouldn't be their own feature

@Controller()
export class CommonController {
	@Get("/health")
	handleHealthCheck(@Res() res: Response) {
		return res.sendStatus(200);
	}
}
