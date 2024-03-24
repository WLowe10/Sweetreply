import { Get, Req, Res } from "routing-controllers";
import { authService } from "@/services/auth";
import { buildFrontendUrl } from "@/lib/utils";
import { logger } from "@/lib/logger";
import type { Request, Response } from "express";

export class AuthController {
	@Get("/verify")
	async handleAccountVerification(@Req() req: Request, @Res() res: Response) {
		const token = req.query.token as string;

		if (!token || typeof token !== "string") {
			res.redirect(
				buildFrontendUrl({
					path: "/auth/verify",
					query: {
						error: "Invalid token. Please request a new verification email.",
					},
				})
			);

			return res;
		}

		const result = authService.validateEmailVerificationToken(token);

		if (!result.success) {
			res.redirect(
				buildFrontendUrl({
					path: "/auth/verify",
					query: {
						error: "Invalid token. Please request a new verification email.",
					},
				})
			);

			return res;
		}

		const updatedUser = await authService.verifyUser(result.data.user_id);

		if (updatedUser) {
			logger.info({
				id: updatedUser.id,
				email: updatedUser.email,
			});
		}

		res.redirect(
			buildFrontendUrl({
				path: "/auth/verify",
				query: {
					message: "Your account has been verified.",
				},
			})
		);

		return res;
	}
}
