import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

export type SiteConfig = {
  offWorkTime: string;
  payday: number;
  siteName: string;
  slogan: string;
};

const DEFAULT_SITE_CONFIG: SiteConfig = {
  offWorkTime: "18:00",
  payday: 15,
  siteName: "工位补能站",
  slogan: "献给每一个表面正常上班、实际全靠硬撑的人",
};

export function useSiteConfig() {
  const query = useQuery<SiteConfig>({
    queryKey: ["site-config"],
    queryFn: () => apiClient.get<SiteConfig>("/config/site"),
    staleTime: 60_000,
    retry: 1,
  });

  return {
    ...query,
    config: query.data ?? DEFAULT_SITE_CONFIG,
  };
}
