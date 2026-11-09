type LocalizedText = Record<"ko" | "en", string>;

export type RewardSource = { href: string; label: LocalizedText };

export type RewardItem = {
  id: string;
  group: string;
  name: LocalizedText;
  requirement: LocalizedText;
  note?: LocalizedText;
  links?: readonly RewardSource[];
  kind?: LocalizedText;
  image?: {
    file: string;
    width: number;
    height: number;
    source: { href: string; credit: string } | { credit: LocalizedText };
    caption?: LocalizedText;
  };
  localizedNameUnconfirmed?: boolean;
  availabilityUnconfirmed?: boolean;
};

export type RewardGroup = {
  id: string;
  tier: "core" | "bonus" | "expired";
  title: LocalizedText;
  note?: LocalizedText;
};

export type RewardSection = RewardGroup & {
  links?: readonly RewardSource[];
  items: readonly RewardItem[];
};
