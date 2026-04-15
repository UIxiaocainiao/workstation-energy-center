import { useStatus } from "@/hooks/useStatus";

export function StatusSignComponent({ date }: { date: string }) {
  const {
    isLoading,
    statsItems,
    submit,
    isSubmitting,
    isSubmitError,
    getCountByKey,
  } = useStatus(date);

  if (isLoading) return <div>加载中...</div>;

  return (
    <div>
      <h2>今日状态签到</h2>

      {["still_holding", "slightly_crashing", "soul_out"].map((key) => (
        <button
          key={key}
          disabled={isSubmitting}
          onClick={() => submit(key)}
        >
          {key} - 已选 {getCountByKey(key)} 次
        </button>
      ))}

      {isSubmitError && <div>提交失败，请重试</div>}
    </div>
  );
}