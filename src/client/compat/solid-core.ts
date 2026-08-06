// Temporary adapter for Solid 1-only dependencies while their Solid 2 releases
// are unavailable. Application code imports the Solid 2 APIs directly.
export * from "@solidjs-core-v2";
export {
	getObserver as getListener,
	isEqual as equalFn,
	merge as mergeProps,
	onSettled as onMount,
} from "@solidjs-core-v2";

export function on<T, U>(
	dependencies: (() => T) | Array<() => unknown>,
	callback: (value: T | unknown[], previous: U | undefined) => U,
	options?: { defer?: boolean },
) {
	let previous: U | undefined;
	let deferred = options?.defer;

	return () => {
		const value = Array.isArray(dependencies)
			? dependencies.map((dependency) => dependency())
			: dependencies();
		if (deferred) {
			deferred = false;
			return previous;
		}
		previous = callback(value, previous);
		return previous;
	};
}

// Solid 2 batches signal writes automatically until the microtask flush.
export function batch<T>(callback: () => T): T {
	return callback();
}

export function createComputed<T>(callback: () => T) {
	return createEffectV2(callback, () => undefined);
}

export function splitProps<T extends object>(
	props: T,
	...groups: Array<Array<PropertyKey>>
): Array<Partial<T>> {
	const makeView = (keys: Set<PropertyKey>) =>
		new Proxy(props, {
			get: (target, key) =>
				keys.has(key) ? Reflect.get(target, key) : undefined,
			has: (_target, key) => keys.has(key),
			ownKeys: () => Reflect.ownKeys(props).filter((key) => keys.has(key)),
			getOwnPropertyDescriptor: (_target, key) =>
				keys.has(key)
					? {
							configurable: true,
							enumerable: true,
							value: Reflect.get(props, key),
						}
					: undefined,
		});
	const groupedKeys = groups.map((group) => new Set(group));
	const selectedKeys = new Set(groupedKeys.flatMap((group) => [...group]));
	return [
		...groupedKeys.map(makeView),
		makeView(
			new Set(Reflect.ownKeys(props).filter((key) => !selectedKeys.has(key))),
		),
	];
}

import { createEffect as createEffectV2 } from "@solidjs-core-v2";
