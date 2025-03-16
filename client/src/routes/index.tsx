import { createFileRoute } from "@tanstack/solid-router";
import { createSignal, onMount } from "solid-js";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [isVisible, setIsVisible] = createSignal(false);

  onMount(() => {
    setIsVisible(true);
  });

  const fadeIn = (delay: number) => {
    return {
      opacity: isVisible() ? 1 : 0,
      transform: isVisible() ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.8s ease, transform 0.8s ease",
      "transition-delay": `${delay}ms`,
    };
  };

  return (
    <div class="min-h-screen bg-gradient-to-b from-background to-background/90">
      {/* Hero Section */}
      <section class="container mx-auto px-4 pt-16 md:pt-24 lg:pt-32">
        <div class="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div style={fadeIn(0)}>
            <h1 class="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
              Streamline Your Submission Management
            </h1>
            <p class="text-xl text-muted-foreground mb-8">
              Kontest.app gives you everything you need to run programs that
              involve submissions and their management, no matter how complex or
              simple.
            </p>
            <div class="flex flex-wrap gap-4">
              <Button size="lg">Get Started</Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
          <div class="relative" style={fadeIn(200)}>
            <div class="rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 p-1">
              <div class="rounded-lg bg-card p-6 shadow-lg">
                <div class="space-y-4">
                  <div class="h-8 w-3/4 rounded-md bg-muted animate-pulse"></div>
                  <div class="space-y-2">
                    <div class="h-4 rounded-md bg-muted animate-pulse"></div>
                    <div class="h-4 rounded-md bg-muted animate-pulse"></div>
                    <div class="h-4 w-2/3 rounded-md bg-muted animate-pulse"></div>
                  </div>
                  <div class="flex justify-between items-center">
                    <div class="h-8 w-24 rounded-md bg-primary/50 animate-pulse"></div>
                    <div class="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-primary/30 blur-2xl"></div>
            <div class="absolute -top-4 -left-4 h-24 w-24 rounded-full bg-secondary/30 blur-2xl"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section class="container mx-auto px-4 py-24">
        <div style={fadeIn(400)} class="text-center mb-16">
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Everything You Need in One Place
          </h2>
          <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
            From submission collection to judging and management, Kontest.app
            simplifies the entire process.
          </p>
        </div>

        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <div
            class="rounded-lg border bg-card p-6 shadow-sm transition hover:shadow-md"
            style={fadeIn(600)}
          >
            <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-primary"
              >
                <path d="m8 3 4 8 5-5 5 15H2L8 3z"></path>
              </svg>
            </div>
            <h3 class="mb-2 text-xl font-bold">Effortless Collection</h3>
            <p class="text-muted-foreground">
              Customize submission forms to match your needs and collect entries
              with ease.
            </p>
          </div>

          {/* Feature 2 */}
          <div
            class="rounded-lg border bg-card p-6 shadow-sm transition hover:shadow-md"
            style={fadeIn(800)}
          >
            <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-primary"
              >
                <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                <path d="M9 9h6"></path>
                <path d="M9 15h6"></path>
              </svg>
            </div>
            <h3 class="mb-2 text-xl font-bold">Streamlined Management</h3>
            <p class="text-muted-foreground">
              Organize, categorize, and track all submissions in a centralized
              dashboard.
            </p>
          </div>

          {/* Feature 3 */}
          <div
            class="rounded-lg border bg-card p-6 shadow-sm transition hover:shadow-md"
            style={fadeIn(1000)}
          >
            <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-primary"
              >
                <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </div>
            <h3 class="mb-2 text-xl font-bold">Efficient Judging</h3>
            <p class="text-muted-foreground">
              Create custom judging criteria and invite judges to review
              submissions collaboratively.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section class="container mx-auto px-4 py-24 relative">
        <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl"></div>
        <div class="relative z-10 grid gap-12 lg:grid-cols-2 items-center">
          <div style={fadeIn(1200)}>
            <h2 class="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              Why Choose Kontest.app?
            </h2>
            <ul class="space-y-6">
              <li class="flex gap-4">
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-primary"
                  >
                    <path d="m5 12 5 5L20 7"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-semibold mb-1">
                    Save Time and Resources
                  </h3>
                  <p class="text-muted-foreground">
                    Automate manual tasks and focus on what matters most -
                    evaluating great submissions.
                  </p>
                </div>
              </li>
              <li class="flex gap-4">
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-primary"
                  >
                    <path d="m5 12 5 5L20 7"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-semibold mb-1">
                    Enhance Collaboration
                  </h3>
                  <p class="text-muted-foreground">
                    Enable seamless communication between hosts, judges, and
                    team members.
                  </p>
                </div>
              </li>
              <li class="flex gap-4">
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="text-primary"
                  >
                    <path d="m5 12 5 5L20 7"></path>
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-semibold mb-1">Scale With Ease</h3>
                  <p class="text-muted-foreground">
                    Whether you have 10 or 10,000 submissions, our platform
                    handles it all with ease.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div class="relative" style={fadeIn(1400)}>
            <div class="rounded-xl bg-card p-8 shadow-lg border">
              <blockquote>
                <p class="text-lg font-medium italic mb-6">
                  "Kontest.app transformed how we manage our annual photography
                  contest. What used to take weeks now takes days, and our
                  judges love the intuitive interface."
                </p>
                <footer class="flex items-center gap-4">
                  <div class="h-12 w-12 rounded-full bg-muted"></div>
                  <div>
                    <p class="font-semibold">Sarah Johnson</p>
                    <p class="text-sm text-muted-foreground">
                      Contest Director, PhotoVision Awards
                    </p>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        class="container mx-auto px-4 py-24 text-center"
        style={fadeIn(1600)}
      >
        <h2 class="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
          Ready to Transform Your Submission Process?
        </h2>
        <p class="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Join thousands of organizations that trust Kontest.app to power their
          submission and judging workflows.
        </p>
        <div class="flex flex-wrap gap-4 justify-center">
          <Button size="lg">Get Started for Free</Button>
          <Button variant="outline" size="lg">
            Request a Demo
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer class="border-t bg-muted/30 py-8">
        <div class="container mx-auto px-4">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <p class="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Kontest.app. All rights reserved.
            </p>
            <div class="flex gap-6">
              <a
                href="#"
                class="text-sm text-muted-foreground hover:text-foreground"
              >
                Privacy
              </a>
              <a
                href="#"
                class="text-sm text-muted-foreground hover:text-foreground"
              >
                Terms
              </a>
              <a
                href="#"
                class="text-sm text-muted-foreground hover:text-foreground"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
