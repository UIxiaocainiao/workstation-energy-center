import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { getDeviceId } from "@/lib/device";

export type StatusOption = {
  key: string;
  name: string;
  count?: number;
};

type TodayStatusResponse = {
  record: {
    statusKey: string;
    date: string;
  } | null;
};

type StatusStatsResponse = {
  total: number;
  items: Array<{
    statusKey: string;
    statusName: string;
    count: number;
  }>;
};

type SubmitStatusResponse = {
  ok: boolean;
  record: {
    statusKey: string;
    date: string;
  };
};

export function useStatus(date: string) {
  const queryClient = useQueryClient();

  const deviceId = useMemo(() => {
    if (typeof window === "undefined") return "";
    return getDeviceId();
  }, []);

  const todayStatus = useQuery<TodayStatusResponse>({
    queryKey: ["today-status", deviceId, date],
    queryFn: () =>
      apiClient.get<TodayStatusResponse>("/status/today", {
        deviceId,
        date,
      }),
    enabled: Boolean(deviceId && date),
    retry: 1,
  });

  const stats = useQuery<StatusStatsResponse>({
    queryKey: ["status-stats", date],
    queryFn: () =>
      apiClient.get<StatusStatsResponse>("/status/stats", {
        date,
      }),
    enabled: Boolean(date),
    retry: 1,
  });

  const submitMutation = useMutation<SubmitStatusResponse, Error, string>({
    mutationFn: async (statusKey: string) => {
      return apiClient.post<SubmitStatusResponse>("/status/submit", {
        statusKey,
        deviceId,
        date,
      });
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["today-status", deviceId, date],
        }),
        queryClient.invalidateQueries({
          queryKey: ["status-stats", date],
        }),
      ]);
    },
    onError: (error) => {
      console.error("提交状态失败：", error);
    },
  });

  const selectedStatusKey = todayStatus.data?.record?.statusKey ?? null;
  const statsItems = stats.data?.items ?? [];
  const total = stats.data?.total ?? 0;

  const getCountByKey = (statusKey: string) => {
    return statsItems.find((item) => item.statusKey === statusKey)?.count ?? 0;
  };

  return {
    deviceId,
    selectedStatusKey,
    statsItems,
    total,

    todayStatus,
    stats,

    submitMutation,
    submit: submitMutation.mutate,
    submitAsync: submitMutation.mutateAsync,

    isSubmitting: submitMutation.isPending,
    submitError: submitMutation.error,
    isSubmitError: submitMutation.isError,

    isTodayStatusLoading: todayStatus.isLoading,
    isStatsLoading: stats.isLoading,
    isLoading: todayStatus.isLoading || stats.isLoading,

    refetchTodayStatus: todayStatus.refetch,
    refetchStats: stats.refetch,

    getCountByKey,
  };
}