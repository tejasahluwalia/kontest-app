// Temporary bridge for Solid 1-only dependencies while their Solid 2 releases
// are unavailable. Application code should import store APIs from `solid-js`.
import {
	createStore as createStoreV2,
	reconcile,
	snapshot,
	storePath,
} from "@solidjs-core-v2";

export { reconcile, snapshot };

export type SetStoreFunction<T> = (...args: unknown[]) => void;

export function createStore<T>(initialValue: T) {
	const [store, setStore] = createStoreV2(initialValue);
	const setStoreCompat = (...args: unknown[]) =>
		setStore(args.length === 1 ? args[0] : storePath(...args));
	return [store, setStoreCompat] as const;
}

export function produce<T>(callback: (draft: T) => void) {
	return callback;
}

export const unwrap = snapshot;
