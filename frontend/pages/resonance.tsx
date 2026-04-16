import { PageShell } from "@/components/layout/PageShell";
import { FeaturedCards } from "@/components/features/FeaturedCards";

export default function ResonancePage() {
  return (
    <PageShell>
      <section className="container-page pt-10">
        <FeaturedCards />
      </section>
    </PageShell>
  );
}
