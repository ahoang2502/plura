import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
	// Routes that can be accessed while signed out
	publicRoutes: ["/site", "/api/uploadthing"],

	async beforeAuth(auth, req) {},

	async afterAuth(auth, req) {
		// Rewrite for domains
		const url = req.nextUrl;
		const searchParams = url.searchParams.toString();
		let hostname = req.headers;

		const pathWithSearchParams = `${url.pathname}${
			searchParams.length > 0 ? `${searchParams}` : ""
		}`;

		// If subdomain exists
		const customSubdomain = hostname
			.get("host")
			?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
			.filter(Boolean)[0];

		if (customSubdomain)
			return NextResponse.rewrite(
				new URL(`/${customSubdomain}${pathWithSearchParams}`, req.url)
			);

		if (url.pathname === "/sign-in" || url.pathname === "/sign-up")
			return NextResponse.redirect(new URL(`/agency/sign-in`, req.url));

		if (
			url.pathname === "/" ||
			(url.pathname === "/site" && url.host === process.env.NEXT_PUBLIC_DOMAIN)
		)
			return NextResponse.rewrite(new URL("/site", req.url));

		if (
			url.pathname.startsWith("/agency") ||
			url.pathname.startsWith("/subaccount")
		)
			return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url));
	},

	// Routes that can always be accessed, and have
	// no authentication information
	ignoredRoutes: ["/no-auth-in-this-route"],
});

export const config = {
	matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
