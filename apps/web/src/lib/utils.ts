import { type ClassValue, clsx } from "clsx";
import { defineConfig } from "cva";
import { createEffect, createSignal, onCleanup } from "solid-js";
import { twMerge } from "tailwind-merge";

const MOBILE_BREAKPOINT = 768;

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const { cva, cx, compose } = defineConfig({
	hooks: {
		onComplete: (className) => twMerge(className),
	},
});

export function useIsMobile(fallback = false) {
	const [isMobile, setIsMobile] = createSignal(fallback);

	createEffect(() => {
		const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
		const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
			setIsMobile(e.matches);
		};
		mql.addEventListener("change", onChange);
		onChange(mql);
		onCleanup(() => mql.removeEventListener("change", onChange));
	});

	return isMobile;
}

/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified wait time has elapsed since the last time it was invoked.
 *
 * @param func The function to debounce
 * @param wait The number of milliseconds to delay
 * @returns A debounced version of the provided function that adopts the parameters of the original function.
 */
export function debounce<A extends unknown[], R>(
	func: (...args: A) => R,
	wait: number,
): (...args: A) => void {
	let timeout: ReturnType<typeof setTimeout> | null = null;
	return (...args: A) => {
		const later = () => {
			timeout = null;
			func(...args);
		};

		if (timeout !== null) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(later, wait);
	};
}
