import { Fragment, type VNode } from "./jsx";

export function jsx(
	type: string | ((props: Record<string, unknown>) => VNode),
	props: Record<string, unknown> | null,
	key?: string | number,
): VNode {
	const { children, ...rest } = props || {};
	const elementProps: Record<string, unknown> = {
		...rest,
		...(key !== undefined ? { key } : {}),
	};
	if (children !== undefined) {
		elementProps.children = children;
	}
	return {
		type,
		props: elementProps,
	};
}

export const jsxs = jsx;
export { Fragment };

export namespace JSX {
	export type Element = VNode;
	export interface IntrinsicElements {
		[elemName: string]: Record<string, unknown>;
	}
}
