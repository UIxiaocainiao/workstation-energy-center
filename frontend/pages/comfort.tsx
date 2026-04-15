import { PageShell } from "@/components/layout/PageShell";
import { ComfortBox } from "@/components/features/ComfortBox";

export default function ComfortPage() {
  return (
    <PageShell>
      <section className="container-page pt-10">
        <ComfortBox />
      </section>
    </PageShell>
  );
}
