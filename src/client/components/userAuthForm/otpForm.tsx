import { createForm, Field, Form, type SubmitHandler } from "@formisch/solid";
import { useNavigate } from "@tanstack/solid-router";
import { createSignal } from "solid-js";
import * as v from "valibot";
import { IconLoader } from "~/components/icons";
import { Button } from "~/components/ui/button";
import {
	OTPField,
	OTPFieldGroup,
	OTPFieldInput,
	OTPFieldSeparator,
	OTPFieldSlot,
	REGEXP_ONLY_DIGITS,
} from "~/components/ui/otp-field";
import {
	TextField,
	TextFieldInput,
	TextFieldLabel,
} from "~/components/ui/text-field";
import { authClient } from "~/lib/auth-client";
import server from "~/lib/server-api";

export default function OtpAuthForm() {
	const [stage, setStage] = createSignal<"email" | "otp">("email");
	const [email, setEmail] = createSignal<string>("");
	const [name, setName] = createSignal<string>("");

	return (
		<div>
			{stage() === "email" && (
				<EmailForm
					name={name()}
					setName={setName}
					email={email()}
					setEmail={setEmail}
					setStage={setStage}
				/>
			)}
			{stage() === "otp" && <OtpForm name={name()} email={email()} />}
		</div>
	);
}

const EmailSchema = v.object({
	name: v.string(),
	email: v.pipe(v.string(), v.email()),
});

function EmailForm({
	name,
	setName,
	email,
	setEmail,
	setStage,
}: {
	name: string;
	setName: (name: string) => void;
	email: string;
	setEmail: (email: string) => void;
	setStage: (stage: "email" | "otp") => void;
}) {
	const form = createForm({
		schema: EmailSchema,
		initialInput: {
			name: name,
			email: email,
		},
	});

	const handleSubmit: SubmitHandler<typeof EmailSchema> = async (output) => {
		setName(output.name);
		setEmail(output.email);
		await authClient.emailOtp.sendVerificationOtp(
			{
				email: output.email,
				type: "sign-in",
			},
			{
				onSuccess: () => {
					setStage("otp");
				},
				// TODO: handle error
			},
		);
	};

	return (
		<Form of={form} onSubmit={handleSubmit}>
			<div class="grid gap-4">
				<Field of={form} path={["name"]}>
					{(field) => (
						<TextField class="gap-1">
							<TextFieldLabel class="sr-only">Name</TextFieldLabel>
							<TextFieldInput {...field.props} value={field.input ?? ""} />
						</TextField>
					)}
				</Field>
				<Field of={form} path={["email"]}>
					{(field) => (
						<TextField class="gap-1">
							<TextFieldLabel class="sr-only">Email</TextFieldLabel>
							<TextFieldInput
								{...field.props}
								value={field.input ?? ""}
								type="email"
								placeholder="me@email.com"
							/>
						</TextField>
					)}
				</Field>
				<Button type="submit" disabled={form.isSubmitting}>
					{form.isSubmitting && <IconLoader class="mr-2 size-4 animate-spin" />}
					Send OTP
				</Button>
			</div>
		</Form>
	);
}

const OtpSchema = v.object({
	otp: v.pipe(v.string(), v.minLength(6)),
});

export function OtpForm({ email, name }: { email: string; name: string }) {
	const navigate = useNavigate({
		from: "/login",
	});
	const form = createForm({
		schema: OtpSchema,
		initialInput: {
			otp: "",
		},
	});

	const handleSubmit: SubmitHandler<typeof OtpSchema> = async (output) => {
		await authClient.signIn.emailOtp(
			{
				email: email,
				otp: output.otp,
			},
			{
				onSuccess: async () => {
					await server.api.user.me.patch({
						email,
						name,
					} as any);
					navigate({ to: "/host" });
				},
				// TODO: handle error
			},
		);
	};

	return (
		<div class="grid gap-6">
			<Form of={form} onSubmit={handleSubmit}>
				<div class="grid gap-4">
					<Field of={form} path={["otp"]}>
						{(field) => (
							<OTPField
								maxLength={6}
								value={field.input ?? ""}
								onValueChange={(val) => field.onInput(val)}
							>
								<OTPFieldInput
									ref={field.props.ref}
									name={field.props.name}
									onBlur={field.props.onBlur}
									onFocus={field.props.onFocus}
									pattern={REGEXP_ONLY_DIGITS}
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
					</Field>
					<Button type="submit" disabled={form.isSubmitting}>
						{form.isSubmitting && (
							<IconLoader class="mr-2 size-4 animate-spin" />
						)}
						Enter OTP
					</Button>
				</div>
			</Form>
		</div>
	);
}
