import { Fragment, h } from "../lib/jsx";

export function Features() {
	const features = [
		{
			title: "Dynamic Form Intake",
			desc: "Build adaptable submission workflows with typed validation using Valibot and TypeBox schema builders.",
			icon: "📝",
		},
		{
			title: "Multi-Round Evaluation",
			desc: "Structure complex programs into stages (Qualifiers, Semifinals, Finals) with customizable rubric criteria.",
			icon: "⚖️",
		},
		{
			title: "Eden Treaty Type Safety",
			desc: "Elysia server routes are directly inferred on the client without code generation or manual type syncing.",
			icon: "⚡",
		},
		{
			title: "SolidJS 2 Reactivity",
			desc: "Ultra-performant fine-grained reactive state without Virtual DOM overhead or unnecessary component re-renders.",
			icon: "🚀",
		},
		{
			title: "Role-Based Access Control",
			desc: "Organized permissions for Workspace Owners, Program Admins, Jurors, and Applicants via BetterAuth.",
			icon: "🔒",
		},
		{
			title: "Bun Static Engine",
			desc: "Blazing fast documentation and marketing site compiled with native Bun JSX and Markdown parsing.",
			icon: "📦",
		},
	];

	return (
		<section class="features-section">
			<div class="container">
				<div class="section-header">
					<div class="section-tag">Key Features</div>
					<h2 class="section-title">Built for scale, precision, and speed.</h2>
					<p class="section-desc">
						Everything you need to orchestrate competitions, manage juror
						rubrics, and process submissions seamlessly.
					</p>
				</div>

				<div class="features-grid">
					{features.map((f) => (
						<div class="feature-card">
							<div class="feature-icon-wrapper">
								<span style="font-size: 1.5rem;">{f.icon}</span>
							</div>
							<h3 class="feature-title">{f.title}</h3>
							<p class="feature-desc">{f.desc}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
