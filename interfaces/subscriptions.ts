import type { OptionsDataStrategyEnum } from "~/client";

export type UpgradeStrategy =  OptionsDataStrategyEnum;

export interface ScheduleInterval  {
  label: "Monthly" | "Quarterly" | "Yearly";
  value: {
    interval: "MONTH" | "YEAR";
    interval_count: number;
  };
  priceMultiplier: number;
  discount?: number;
};

export interface RecurrenceOption {
  label: string;
  value: number;
}

export interface UpgradeDetails {
  planName: "Free" | "Starter" | "Pro" | "Enterprise";
  strategy: "UPGRADE_IMMEDIATELY" | "FINISH_CURRENT_CYCLE";
  intervalLabel: "Monthly" | "Quarterly" | "Yearly";
  recurrenceLabel: string;
  total: number;
  discount: number;
  promoCode: {
    code: string;
    discount: number;
  } | null;
  proratedCredit: number;
  basePrice: number;
  intervalDiscountAmount: number;
  promoDiscountAmount: number;
  intervalDetails: ScheduleInterval | undefined;
  recurrenceDetails: RecurrenceOption | undefined;
};

export interface UpgradeMetadata {
  intervalLabel: "Monthly" | "Quarterly" | "Yearly";
  recurrenceLabel: string;
  strategy: OptionsDataStrategyEnum;
  basePrice: number;
  totalPrice: number;
  intervalDiscount: {
    rate?: number;
    amount: number;
  };
  promoDiscount: {
    code: string;
    rate: number;
    amount: number;
  } | null;
  proratedCredit: {
    amount: number;
    description: string;
  };
  selectedInterval: {
    interval: "MONTH" | "YEAR";
    interval_count: number;
    priceMultiplier: number;
  };
}