import { useEffect, useMemo, useState } from "react";

type CountdownTarget = {
  offWorkTime: string;
  payday: number;
};

type CountdownState = {
  offWorkMs: number;
  weekendMs: number;
  paydayMs: number;
};

function getNextWeekend(now: Date) {
  const target = new Date(now);
  const day = now.getDay();
  const daysUntilSaturday = (6 - day + 7) % 7;
  target.setDate(now.getDate() + daysUntilSaturday);
  target.setHours(0, 0, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 7);
  }
  return target;
}

function getNextPayday(now: Date, payday: number) {
  const target = new Date(now.getFullYear(), now.getMonth(), payday, 0, 0, 0, 0);
  if (target.getTime() <= now.getTime()) {
    return new Date(now.getFullYear(), now.getMonth() + 1, payday, 0, 0, 0, 0);
  }
  return target;
}

function getTodayOffWork(now: Date, offWorkTime: string) {
  const [hours, minutes] = offWorkTime.split(":").map(Number);
  const target = new Date(now);
  target.setHours(hours, minutes, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  return target;
}

export function useCountdown(config: CountdownTarget) {
  const [state, setState] = useState<CountdownState>({
    offWorkMs: 0,
    weekendMs: 0,
    paydayMs: 0
  });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setState({
        offWorkMs: getTodayOffWork(now, config.offWorkTime).getTime() - now.getTime(),
        weekendMs: getNextWeekend(now).getTime() - now.getTime(),
        paydayMs: getNextPayday(now, config.payday).getTime() - now.getTime()
      });
    };

    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [config.offWorkTime, config.payday]);

  const format = useMemo(
    () => (ms: number) => {
      const totalSeconds = Math.max(0, Math.floor(ms / 1000));
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      return `${days}天 ${hours}时 ${minutes}分 ${seconds}秒`;
    },
    []
  );

  return { state, format };
}
