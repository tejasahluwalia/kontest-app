import { createElement, Fragment, type VNode } from "./jsx";

export function jsx(type: any, props: any, key?: any): VNode {
	const { children, ...rest } = props || {};
	const elementProps = { ...rest, ...(key !== undefined ? { key } : {}) };
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
	export interface Element {
		type: any;
		props: any;
		children?: any;
	}
	export interface IntrinsicElements {
		[elemName: string]: any;
	}
}
