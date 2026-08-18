import { createElement, Fragment, type VNode } from "./jsx";

export function jsxDEV(
	type: any,
	props: any,
	key?: any,
	_isStaticChildren?: boolean,
	_source?: any,
	_self?: any,
): VNode {
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
