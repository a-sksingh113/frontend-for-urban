export type BillingCycle = "monthly" | "payg";

export type StripeLog = {
  id: string;
  cycle: BillingCycle;
  event: string;
  status: "succeeded" | "pending" | "failed";
  amount: number; // cents
  currency?: "usd" | "eur";
  createdAt: string | Date;
  description?: string;
  customer?: string;
};
