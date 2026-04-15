export function getDeviceId(): string {
  if (typeof window === "undefined") return "server";
  const key = "workstation_energy_device_id";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(key, id);
  return id;
}
