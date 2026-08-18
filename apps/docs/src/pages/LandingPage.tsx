import { ArchitectureSection } from "../components/ArchitectureSection";
import { Features } from "../components/Features";
import { Hero } from "../components/Hero";
import { Layout } from "../components/Layout";
import { Fragment, h } from "../lib/jsx";

export function LandingPage() {
	return (
		<Layout
			title="Kontest — Modern Submission & Evaluation Platform"
			description="Streamline hackathons, competitions, grant applications, and multi-round judging with Kontest."
			activePage="/"
		>
			<Hero />
			<Features />
			<ArchitectureSection />
			<section
				class="container"
				style="padding: 4rem 1.5rem; text-align: center;"
			>
				<div
					class="feature-card"
					style="background: linear-gradient(135deg, var(--bg-card), var(--bg-muted)); padding: 3rem 2rem;"
				>
					<h2 class="section-title" style="margin-bottom: 1rem;">
						Ready to build with Kontest?
					</h2>
					<p
						class="section-desc"
						style="max-width: 600px; margin: 0 auto 2rem auto;"
					>
						Explore our comprehensive guides, explore the architecture, or start
						developing locally in seconds.
					</p>
					<div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
						<a href="/docs/getting-started.html" class="btn btn-primary btn-lg">
							Get Started Now
						</a>
						<a
							href="/docs/routing-migration.html"
							class="btn btn-secondary btn-lg"
						>
							Solid 2 Router Guide
						</a>
					</div>
				</div>
			</section>
		</Layout>
	);
}
