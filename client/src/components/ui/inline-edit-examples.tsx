import type { Component } from "solid-js";
import { CardTitle, CardDescription } from "./card";

export const TitleDisplay: Component<{ value: string; onClick: () => void; class?: string }> = (props) => (
  <CardTitle class={props.class} onClick={props.onClick}>
    {props.value}
  </CardTitle>
);

export const DescriptionDisplay: Component<{ value: string; onClick: () => void; class?: string }> = (props) => (
  <CardDescription class={props.class} onClick={props.onClick}>
    {props.value}
  </CardDescription>
);

export const TextDisplay: Component<{ value: string; onClick: () => void; class?: string }> = (props) => (
  <span class={props.class} onClick={props.onClick}>
    {props.value}
  </span>
);

export const ParagraphDisplay: Component<{ value: string; onClick: () => void; class?: string }> = (props) => (
  <p class={props.class} onClick={props.onClick}>
    {props.value}
  </p>
);
