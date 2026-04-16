import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { HomeSceneCanvas } from "@/components/features/HomeSceneCanvas";
import { apiClient } from "@/lib/apiClient";

type TopicModulesResponse = {
  items: Array<{
    id: string;
    topicKey: string;
    topicTitle: string;
    targetPath: string;
    copies: number;
    sortOrder: number;
  }>;
};

export default function HomePage() {
  const topicModulesQuery = useQuery({
    queryKey: ["topic-modules"],
    queryFn: () => apiClient.get<TopicModulesResponse>("/config/topic-modules"),
    staleTime: 60_000,
  });

  const topicSeeds = useMemo(() => {
    const items = topicModulesQuery.data?.items;
    if (!items || items.length === 0) return undefined;

    return items.map((item) => ({
      text: item.topicTitle,
      target: item.targetPath,
      copies: Math.max(1, item.copies || 4),
    }));
  }, [topicModulesQuery.data]);

  return (
    <div className="relative h-[100svh] w-full overflow-hidden">
      <HomeSceneCanvas topicSeeds={topicSeeds} />
    </div>
  );
}
