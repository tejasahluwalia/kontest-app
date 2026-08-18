import {
	ColorModeScript,
	createLocalStorageManager,
} from "@kobalte/core/color-mode";
import { HydrationScript } from "@solidjs/web";
import type { ParentProps } from "solid-js";

export default function Document(props: ParentProps) {
	const storageManager = createLocalStorageManager("vite-ui-theme");
	return (
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
				<title>Kontest</title>
				<ColorModeScript storageType={storageManager.type} />
				<HydrationScript />
			</head>
			<body>{props.children}</body>
		</html>
	);
}
