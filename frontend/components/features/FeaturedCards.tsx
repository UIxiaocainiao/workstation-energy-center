import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { getDeviceId } from "@/lib/device";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type FeaturedCardItem = {
  id: string;
  type: string;
  title: string;
  content: string;
  tag: string;
  likeRealCount: number;
  likeSayCount: number;
  likeSameCount: number;
};

type Response = {
  items: FeaturedCardItem[];
};

export function FeaturedCards() {
  const queryClient = useQueryClient();
  const deviceId = typeof window !== "undefined" ? getDeviceId() : "server";

  const cards = useQuery({
    queryKey: ["featured-cards"],
    queryFn: () => apiClient.get<Response>("/cards/featured", { page: 1, pageSize: 6 })
  });

  const reactMutation = useMutation({
    mutationFn: ({ cardId, reactionType }: { cardId: string; reactionType: string }) =>
      apiClient.post("/cards/reaction", { cardId, reactionType, deviceId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["featured-cards"] });
    }
  });

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">精选共鸣内容</h2>
        <p className="mt-1 text-sm text-slate-400">高压工作日里，你并不是一个人。</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.data?.items.map((item) => (
          <Card key={item.id} className="flex h-full flex-col justify-between">
            <div>
              <div className="text-xs text-brand-100">{item.tag}</div>
              <div className="mt-2 text-lg font-semibold">{item.title}</div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{item.content}</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                variant="secondary"
                onClick={() => reactMutation.mutate({ cardId: item.id, reactionType: "real" })}
              >
                太真实了 {item.likeRealCount}
              </Button>
              <Button
                variant="secondary"
                onClick={() => reactMutation.mutate({ cardId: item.id, reactionType: "say" })}
              >
                替我说了 {item.likeSayCount}
              </Button>
              <Button
                variant="secondary"
                onClick={() => reactMutation.mutate({ cardId: item.id, reactionType: "same" })}
              >
                我也一样 {item.likeSameCount}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
