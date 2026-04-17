import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiClient } from "@/lib/apiClient";

type TopicModuleItem = {
  id: string;
  topicKey: string;
  topicTitle: string;
  targetPath: string;
  copies: number;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type TopicModulesResponse = {
  items: TopicModuleItem[];
};

type TopicModuleForm = {
  id?: string;
  topicKey: string;
  topicTitle: string;
  targetPath: string;
  copies: number;
  sortOrder: number;
  isActive: boolean;
};

function createEmptyForm(): TopicModuleForm {
  return {
    topicKey: "",
    topicTitle: "",
    targetPath: "",
    copies: 4,
    sortOrder: 0,
    isActive: true,
  };
}

export default function TopicModulesManagerPage() {
  const queryClient = useQueryClient();
  const [adminToken, setAdminToken] = useState("change-me");
  const [form, setForm] = useState<TopicModuleForm>(createEmptyForm());

  useEffect(() => {
    if (typeof window === "undefined") return;
    const cached = localStorage.getItem("admin_token");
    if (cached) setAdminToken(cached);
  }, []);

  const headers = useMemo(() => ({ "x-admin-token": adminToken }), [adminToken]);

  const listQuery = useQuery({
    queryKey: ["admin-topic-modules", adminToken],
    queryFn: () =>
      apiClient.get<TopicModulesResponse>("/admin/topic-modules", undefined, {
        headers,
      }),
    enabled: Boolean(adminToken),
  });

  const saveMutation = useMutation({
    mutationFn: (payload: TopicModuleForm) =>
      apiClient.post<{ item: TopicModuleItem }>("/admin/topic-modules", payload, {
        headers,
      }),
    onSuccess: () => {
      toast("已保存话题模块");
      setForm(createEmptyForm());
      queryClient.invalidateQueries({ queryKey: ["admin-topic-modules"] });
    },
    onError: (error: Error) => {
      toast.error(error.message.includes("Unauthorized") ? "管理员令牌无效" : "保存失败，请重试");
    },
  });

  const saveToken = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_token", adminToken);
    }
    toast("已保存管理员令牌");
    listQuery.refetch();
  };

  const startEdit = (item: TopicModuleItem) => {
    setForm({
      id: item.id,
      topicKey: item.topicKey,
      topicTitle: item.topicTitle,
      targetPath: item.targetPath,
      copies: item.copies,
      sortOrder: item.sortOrder,
      isActive: item.isActive,
    });
  };

  const submit = () => {
    if (!form.topicKey.trim() || !form.topicTitle.trim() || !form.targetPath.trim()) {
      toast.error("topicKey / 话题标题 / 跳转路径不能为空");
      return;
    }

    saveMutation.mutate({
      ...form,
      topicKey: form.topicKey.trim(),
      topicTitle: form.topicTitle.trim(),
      targetPath: form.targetPath.trim(),
      copies: Math.max(1, Math.min(12, Number(form.copies) || 1)),
      sortOrder: Number(form.sortOrder) || 0,
    });
  };

  return (
    <PageShell>
      <section className="container-page pt-10">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card>
            <div className="flex items-center justify-between gap-3">
              <h1 className="section-title text-2xl font-medium">话题模块管理</h1>
              <Button size="sm" onClick={() => listQuery.refetch()}>
                刷新
              </Button>
            </div>

            <div className="mt-4 grid gap-2 md:grid-cols-[1fr_auto]">
              <Input
                value={adminToken}
                onChange={(event) => setAdminToken(event.target.value)}
                placeholder="管理员令牌"
              />
              <Button onClick={saveToken}>保存令牌</Button>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-[var(--color-frost-border)]">
              <div className="grid grid-cols-[1fr_1.2fr_1fr_90px_90px_90px] gap-2 border-b border-[var(--color-frost-border)] bg-white/[0.04] px-3 py-2 text-xs text-white/70">
                <span>topicKey</span>
                <span>话题标题</span>
                <span>跳转路径</span>
                <span>copies</span>
                <span>排序</span>
                <span>操作</span>
              </div>

              <div className="max-h-[420px] overflow-auto">
                {listQuery.data?.items.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[1fr_1.2fr_1fr_90px_90px_90px] gap-2 border-b border-[var(--color-frost-border)] px-3 py-2 text-sm"
                  >
                    <span className="truncate text-white/80">{item.topicKey}</span>
                    <span className="truncate">{item.topicTitle}</span>
                    <span className="truncate text-white/70">{item.targetPath}</span>
                    <span>{item.copies}</span>
                    <span>{item.sortOrder}</span>
                    <button
                      className="text-left text-brand-100 hover:text-white"
                      onClick={() => startEdit(item)}
                    >
                      编辑
                    </button>
                  </div>
                ))}

                {listQuery.isSuccess && listQuery.data.items.length === 0 && (
                  <div className="px-3 py-6 text-sm text-[var(--color-silver)]">暂无话题模块配置</div>
                )}
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="section-title text-xl font-medium">{form.id ? "编辑话题模块" : "新增话题模块"}</h2>

            <div className="mt-4 space-y-3">
              <Input
                value={form.topicKey}
                onChange={(event) => setForm((prev) => ({ ...prev, topicKey: event.target.value }))}
                placeholder="topicKey（如 status）"
              />
              <Input
                value={form.topicTitle}
                onChange={(event) => setForm((prev) => ({ ...prev, topicTitle: event.target.value }))}
                placeholder="话题标题（节点展示文案）"
              />
              <Input
                value={form.targetPath}
                onChange={(event) => setForm((prev) => ({ ...prev, targetPath: event.target.value }))}
                placeholder="跳转路径（如 /status）"
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  min={1}
                  max={12}
                  value={form.copies}
                  onChange={(event) => setForm((prev) => ({ ...prev, copies: Number(event.target.value) }))}
                  placeholder="copies"
                />
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(event) => setForm((prev) => ({ ...prev, sortOrder: Number(event.target.value) }))}
                  placeholder="排序"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))}
                />
                启用（首页场景可见）
              </label>

              <div className="flex gap-2">
                <Button onClick={submit} disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? "保存中..." : "保存"}
                </Button>
                <Button variant="ghost" onClick={() => setForm(createEmptyForm())}>
                  清空
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}
