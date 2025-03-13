import { IconBrandGithub, IconLoader } from "~/components/icons";
import { Button } from "~/components/ui/button";
import {
  TextField,
  TextFieldInput,
  TextFieldLabel,
} from "~/components/ui/text-field";
import { createForm } from "@tanstack/solid-form";
import { authClient } from "@client/lib/auth-client";
import {
  OTPField,
  OTPFieldGroup,
  OTPFieldInput,
  OTPFieldSeparator,
  OTPFieldSlot,
} from "~/components/ui/otp-field";
import { REGEXP_ONLY_DIGITS } from "~/components/ui/otp-field";
import { z } from "zod";
import { createSignal } from "solid-js";
import { useNavigate } from "@tanstack/solid-router";

export default function OtpAuthForm() {
  const [stage, setStage] = createSignal<"email" | "otp">("email");
  const [email, setEmail] = createSignal<string>("");

  return (
    <div>
      {stage() === "email" && (
        <EmailForm email={email()} setEmail={setEmail} setStage={setStage} />
      )}
      {stage() === "otp" && <OtpForm email={email()} />}
    </div>
  );
}

function EmailForm({
  email,
  setEmail,
  setStage,
}: {
  email: string;
  setEmail: (email: string) => void;
  setStage: (stage: "email" | "otp") => void;
}) {
  const form = createForm(() => ({
    defaultValues: {
      email: email,
    },
    onSubmit: async (data) => {
      setEmail(data.value.email);
      const { data: res, error } =
        await authClient.emailOtp.sendVerificationOtp(
          {
            email: data.value.email,
            type: "sign-in",
          },
          {
            onSuccess: () => {
              setStage("otp");
            },
            // TODO: handle error
          },
        );
    },
  }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div class="grid gap-4">
        <form.Field
          name="email"
          validators={{
            onChange: z.string().email(),
          }}
        >
          {(field) => (
            <TextField class="gap-1">
              <TextFieldLabel class="sr-only">Email</TextFieldLabel>
              <TextFieldInput
                name={field().name}
                value={field().state.value}
                onBlur={field().handleBlur}
                onInput={(e) => field().handleChange(e.currentTarget.value)}
                type="email"
                placeholder="me@email.com"
              />
            </TextField>
          )}
        </form.Field>
        <form.Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
        >
          {(state) => (
            <Button type="submit" disabled={state().isSubmitting}>
              {state().isSubmitting && (
                <IconLoader class="mr-2 size-4 animate-spin" />
              )}
              Send OTP
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}

export function OtpForm({ email }: { email: string }) {
  const navigate = useNavigate({
    from: "/login",
  });
  const form = createForm(() => ({
    defaultValues: {
      email: email,
      otp: "",
    },
    onSubmit: async (data) => {
      const { data: res, error } = await authClient.signIn.emailOtp(
        {
          email: data.value.email,
          otp: data.value.otp,
        },
        {
          onSuccess: () => {
            navigate({ to: "/host" });
          },
          // TODO: handle error
        },
      );
    },
  }));

  return (
    <div class="grid gap-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div class="grid gap-4">
          <form.Field name="otp">
            {(field) => (
              <OTPField
                maxLength={6}
                value={field().state.value}
                onValueChange={field().handleChange}
              >
                <OTPFieldInput
                  pattern={REGEXP_ONLY_DIGITS}
                  name={field().name}
                  onBlur={field().handleBlur}
                />
                <OTPFieldGroup>
                  <OTPFieldSlot index={0} />
                  <OTPFieldSlot index={1} />
                  <OTPFieldSlot index={2} />
                </OTPFieldGroup>
                <OTPFieldSeparator />
                <OTPFieldGroup>
                  <OTPFieldSlot index={3} />
                  <OTPFieldSlot index={4} />
                  <OTPFieldSlot index={5} />
                </OTPFieldGroup>
              </OTPField>
            )}
          </form.Field>
          <form.Subscribe
            selector={(state) => ({
              canSubmit: state.canSubmit,
              isSubmitting: state.isSubmitting,
            })}
          >
            {(state) => (
              <Button type="submit" disabled={state().isSubmitting}>
                {state().isSubmitting && (
                  <IconLoader class="mr-2 size-4 animate-spin" />
                )}
                Enter OTP
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  );
}
