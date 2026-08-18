/**
 * Lightweight, zero-dependency JSX-to-HTML serializer for Bun static site generator.
 */

export type VNode =
	| string
	| number
	| boolean
	| null
	| undefined
	| RawHtmlNode
	| JSXElement
	| VNode[];

export interface JSXElement {
	type: string | ((props: any) => VNode);
	props: Record<string, any>;
	children?: VNode[];
}

export class RawHtmlNode {
	constructor(public html: string) {}
}

export function raw(html: string): RawHtmlNode {
	return new RawHtmlNode(html);
}

export function RawHtml({ html }: { html: string }): RawHtmlNode {
	return new RawHtmlNode(html);
}

export function Fragment({ children }: { children?: VNode }): VNode {
	return children;
}

const VOID_ELEMENTS = new Set([
	"area",
	"base",
	"br",
	"col",
	"embed",
	"hr",
	"img",
	"input",
	"link",
	"meta",
	"param",
	"source",
	"track",
	"wbr",
]);

const BOOLEAN_ATTRIBUTES = new Set([
	"allowfullscreen",
	"async",
	"autofocus",
	"autoplay",
	"checked",
	"controls",
	"default",
	"defer",
	"disabled",
	"formnovalidate",
	"hidden",
	"ismap",
	"itemscope",
	"loop",
	"multiple",
	"muted",
	"nomodule",
	"novalidate",
	"open",
	"playsinline",
	"readonly",
	"required",
	"reversed",
	"selected",
]);

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function styleObjectToString(style: Record<string, string | number>): string {
	return Object.entries(style)
		.map(([key, val]) => {
			const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
			return `${cssKey}:${val}`;
		})
		.join(";");
}

export function renderToString(node: VNode): string {
	if (node === null || node === undefined || typeof node === "boolean") {
		return "";
	}

	if (typeof node === "string") {
		return escapeHtml(node);
	}

	if (typeof node === "number") {
		return String(node);
	}

	if (node instanceof RawHtmlNode) {
		return node.html;
	}

	if (Array.isArray(node)) {
		return node.map(renderToString).join("");
	}

	if (typeof node === "object" && "type" in node) {
		const { type, props } = node;

		if (typeof type === "function") {
			return renderToString(type(props || {}));
		}

		if (typeof type === "string") {
			const tag = type.toLowerCase();
			const attrs: string[] = [];
			let innerHtml = "";

			for (const [key, value] of Object.entries(props || {})) {
				if (key === "children") {
					continue;
				}

				if (
					key === "dangerouslySetInnerHTML" &&
					value &&
					typeof value === "object" &&
					"__html" in value
				) {
					innerHtml = value.__html;
					continue;
				}

				if (key === "className" || key === "class") {
					if (value) attrs.push(`class="${escapeHtml(String(value))}"`);
					continue;
				}

				if (key === "style") {
					if (typeof value === "object" && value !== null) {
						attrs.push(`style="${escapeHtml(styleObjectToString(value))}"`);
					} else if (typeof value === "string" && value.length > 0) {
						attrs.push(`style="${escapeHtml(value)}"`);
					}
					continue;
				}

				if (BOOLEAN_ATTRIBUTES.has(key.toLowerCase())) {
					if (value) attrs.push(key);
					continue;
				}

				if (
					value !== null &&
					value !== undefined &&
					typeof value !== "function"
				) {
					attrs.push(`${key}="${escapeHtml(String(value))}"`);
				}
			}

			const attrString = attrs.length > 0 ? ` ${attrs.join(" ")}` : "";

			if (VOID_ELEMENTS.has(tag)) {
				return `<${tag}${attrString} />`;
			}

			const childrenHtml =
				innerHtml || (props?.children ? renderToString(props.children) : "");
			return `<${tag}${attrString}>${childrenHtml}</${tag}>`;
		}
	}

	return "";
}

export function createElement(
	type: string | ((props: any) => VNode),
	props: Record<string, any> | null,
	...children: VNode[]
): JSXElement {
	const normalizedProps = { ...(props || {}) };
	if (children.length === 1) {
		normalizedProps.children = children[0];
	} else if (children.length > 1) {
		normalizedProps.children = children;
	}
	return {
		type,
		props: normalizedProps,
	};
}

export const h = createElement;

declare global {
	namespace JSX {
		type Element = VNode;
		interface IntrinsicElements {
			[elemName: string]: any;
		}
	}
}
