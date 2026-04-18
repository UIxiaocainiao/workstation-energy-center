import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useLocale } from "@/hooks/useLocale";
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
  const { isZh } = useLocale();
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
      toast(isZh ? "已保存话题模块" : "Topic module saved");
      setForm(createEmptyForm());
      queryClient.invalidateQueries({ queryKey: ["admin-topic-modules"] });
    },
    onError: (error: Error) => {
      toast.error(error.message.includes("Unauthorized") ? (isZh ? "管理员令牌无效" : "Invalid admin token") : isZh ? "保存失败，请重试" : "Save failed, please retry");
    },
  });

  const saveToken = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_token", adminToken);
    }
    toast(isZh ? "已保存管理员令牌" : "Admin token saved");
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
      toast.error(isZh ? "topicKey / 话题标题 / 跳转路径不能为空" : "topicKey / topic title / target path cannot be empty");
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
              <h1 className="section-title text-2xl font-medium">{isZh ? "话题模块管理" : "Topic Module Manager"}</h1>
              <Button size="sm" onClick={() => listQuery.refetch()}>
                {isZh ? "刷新" : "Refresh"}
              </Button>
            </div>

            <div className="mt-4 grid gap-2 md:grid-cols-[1fr_auto]">
              <Input value={adminToken} onChange={(event) => setAdminToken(event.target.value)} placeholder={isZh ? "管理员令牌" : "Admin token"} />
              <Button onClick={saveToken}>{isZh ? "保存令牌" : "Save Token"}</Button>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-[var(--color-frost-border)]">
              <div className="grid grid-cols-[1fr_1.2fr_1fr_90px_90px_90px] gap-2 border-b border-[var(--color-frost-border)] bg-white/[0.04] px-3 py-2 text-xs text-white/70">
                <span>topicKey</span>
                <span>{isZh ? "话题标题" : "Topic Title"}</span>
                <span>{isZh ? "跳转路径" : "Target Path"}</span>
                <span>copies</span>
                <span>{isZh ? "排序" : "Order"}</span>
                <span>{isZh ? "操作" : "Action"}</span>
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
                    <button className="text-left text-brand-100 hover:text-white" onClick={() => startEdit(item)}>
                      {isZh ? "编辑" : "Edit"}
                    </button>
                  </div>
                ))}

                {listQuery.isSuccess && listQuery.data.items.length === 0 && (
                  <div className="px-3 py-6 text-sm text-[var(--color-silver)]">{isZh ? "暂无话题模块配置" : "No topic module configuration yet"}</div>
                )}
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="section-title text-xl font-medium">{form.id ? (isZh ? "编辑话题模块" : "Edit Topic Module") : isZh ? "新增话题模块" : "Create Topic Module"}</h2>

            <div className="mt-4 space-y-3">
              <Input
                value={form.topicKey}
                onChange={(event) => setForm((prev) => ({ ...prev, topicKey: event.target.value }))}
                placeholder={isZh ? "topicKey（如 status）" : "topicKey (e.g. status)"}
              />
              <Input
                value={form.topicTitle}
                onChange={(event) => setForm((prev) => ({ ...prev, topicTitle: event.target.value }))}
                placeholder={isZh ? "话题标题（节点展示文案）" : "Topic title (node label)"}
              />
              <Input
                value={form.targetPath}
                onChange={(event) => setForm((prev) => ({ ...prev, targetPath: event.target.value }))}
                placeholder={isZh ? "跳转路径（如 /status）" : "Target path (e.g. /status)"}
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
                  placeholder={isZh ? "排序" : "Order"}
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-white/80">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))}
                />
                {isZh ? "启用（首页场景可见）" : "Enabled (visible on home scene)"}
              </label>

              <div className="flex gap-2">
                <Button onClick={submit} disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? (isZh ? "保存中..." : "Saving...") : isZh ? "保存" : "Save"}
                </Button>
                <Button variant="ghost" onClick={() => setForm(createEmptyForm())}>
                  {isZh ? "清空" : "Reset"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}
