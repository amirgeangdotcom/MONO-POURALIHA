/** Only allow same-site relative redirects (prevents open-redirect abuse via ?next=). */
export function safeNext(value: string | null, fallback = "/dashboard") {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return fallback;
  return value;
}
