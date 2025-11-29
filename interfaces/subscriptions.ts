import type { OptionsDataStrategyEnum } from "~/client";

export type UpgradeStrategy = OptionsDataStrategyEnum;

export interface ScheduleInterval {
  label: "Monthly" | "Quarterly" | "Yearly";
  value: {
    interval: "MONTH" | "YEAR";
    intervalCount: number;
  };
  priceMultiplier: number;
  discount?: number;
}

export interface RecurrenceOption {
  label: string;
  value: number;
}

export interface UpgradeDetails {
  planName: "Free" | "Starter" | "Pro" | "Enterprise";
  strategy: OptionsDataStrategyEnum;
  intervalLabel: "Monthly" | "Quarterly" | "Yearly";
  recurrenceLabel: string;
  basePrice: number;
  totalPrice: number;
  discount: number;
  promoCode: {
    code: string;
    discount: number;
  } | null;
  proratedCredit: {
    amount: number;
    description: string;
  };
  intervalDiscount: {
    rate: number;
    amount: number;
  } | null;
  promoDiscount: {
    code: string;
    rate: number;
    amount: number;
  } | null;
  selectedInterval: {
    interval: "MONTH" | "YEAR";
    intervalCount: number;
    totalRecurrance: number;
    priceMultiplier: number;
  };
  recurrenceDetails: RecurrenceOption | undefined;
  [key: string]: unknown;
}

export interface UpgradeMetadata {
  planName: "Free" | "Starter" | "Pro" | "Enterprise";
  strategy: OptionsDataStrategyEnum;
  intervalLabel: "Monthly" | "Quarterly" | "Yearly";
  recurrenceLabel: string;
  basePrice: number;
  totalPrice: number;
  discount: number;
  promoCode: {
    code: string;
    discount: number;
  } | null;
  proratedCredit: {
    amount: number;
    description: string;
  };
  intervalDiscount: {
    rate: number;
    amount: number;
  } | null;
  promoDiscount: {
    code: string;
    rate: number;
    amount: number;
  } | null;
  selectedInterval: {
    interval: "MONTH" | "YEAR";
    intervalCount: number;
    totalRecurrance: number;
    priceMultiplier: number;
  };
  recurrenceDetails?: RecurrenceOption;
  [key: string]: unknown;
}
