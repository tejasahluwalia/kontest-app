import { cn } from "./utils";

const typography = {
	h1: cn(
		"scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance",
	),
	h2: cn(
		"scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
	),
	h3: cn("scroll-m-20 text-2xl font-semibold tracking-tight"),
	h4: cn(),
	p: cn(),
	blockquote: cn(),
	table: {
		table: cn(),
		tr: cn(),
		th: cn(),
		td: cn(),
	},
	list: {
		ul: cn(),
	},
	code: cn(),
	lead: cn(),
	large: cn(),
	small: cn(),
	muted: cn(),
};
