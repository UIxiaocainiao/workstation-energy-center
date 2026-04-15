import { PageShell } from "@/components/layout/PageShell";
import { Translator } from "@/components/features/Translator";

export default function BlackWordsPage() {
  return (
    <PageShell>
      <section className="container-page pt-10">
        <Translator />
      </section>
    </PageShell>
  );
}
