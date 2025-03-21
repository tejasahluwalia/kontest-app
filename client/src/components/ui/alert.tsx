import { splitProps, type Component, type JSX } from "solid-js";
import { cn } from "@client/lib/utils";

const Alert: Component<
  JSX.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "destructive";
  }
> = (props) => {
  const [local, others] = splitProps(props, ["class", "variant", "children"]);
  return (
    <div
      role="alert"
      class={cn(
        "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
        {
          "bg-background text-foreground": local.variant === "default",
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive":
            local.variant === "destructive",
        },
        local.class
      )}
      {...others}
    >
      {local.children}
    </div>
  );
};

const AlertTitle: Component<JSX.HTMLAttributes<HTMLHeadingElement>> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <h5
      class={cn("mb-1 font-medium leading-none tracking-tight", local.class)}
      {...others}
    >
      {local.children}
    </h5>
  );
};

const AlertDescription: Component<JSX.HTMLAttributes<HTMLParagraphElement>> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  return (
    <div
      class={cn("text-sm [&_p]:leading-relaxed", local.class)}
      {...others}
    >
      {local.children}
    </div>
  );
};

export { Alert, AlertTitle, AlertDescription };
