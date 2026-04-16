import { PageShell } from "@/components/layout/PageShell";
import { StatusSign } from "@/components/features/StatusSign";

export default function StatusPage() {
  return (
    <PageShell>
      <section className="container-page pt-10">
        <StatusSign />
      </section>
    </PageShell>
  );
}
