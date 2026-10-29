import { categories, groups, images, type RewardEntry, type RewardGroup, type RewardImage, type RewardNotice } from "./event";

// English item names were checked against Ubisoft's event and Twitch announcements:
// https://www.ubisoft.com/en-us/game/the-division/the-division-2/news-updates/7uzKuy4iB0MtOJfsXAr3TO/tuy8s32-red-moon-unleashed-creator-collaboration-escalation-updates-more
// https://www.ubisoft.com/en-us/game/the-division/the-division-2/news-updates/VLVLB9xFr5sLxAtZSVM6J/the-division-2-red-moon-unleashed-event-twitch-drops
// IDs, order, reward types, image assets, and progress remain owned by the Korean source.

const categoryTitles: Record<string, string> = {
  all: "All items",
  bounty: "Revenant bounties",
  boss: "Random boss encounters",
  collect: "Donations & login",
  apparel: "Apparel caches",
  drops: "Drops & collaborations",
  owned: "Key gear owned",
};

type GroupText = Pick<RewardGroup, "title" | "description">;
const groupText: Record<string, GroupText> = {
  bounties: {
    title: "Six returning Revenant bounties",
    description: "Each completion: 1 Event Key · 50% chance of a themed arm patch · Exotic Weapon (20%) or Exotic Cache (80%). Exotic weapons are listed as drop information.",
  },
  "all-six": {
    title: "All six bounties completion reward",
    description: "After defeating all six targets, claim the reward under Progression → Commendations. This is separate from collecting all six individual arm patches.",
  },
  bosses: {
    title: "Random boss encounters",
    description: "These cosmetics are separate from the 43 apparel-cache items. Korean names were checked against game screens; unverified Korean names are left in English.",
  },
  login: {
    title: "Login reward",
    description: "A free reward for everyone who logs into the game during the October 15–November 3, 2026 event.",
  },
  donations: {
    title: "Personal key donations",
    description: "Up to 200 keys in total. Check each reward after claiming it from the Event Vendor.",
  },
  community: {
    title: "Community donation rewards",
    description: "Reaching a community goal and receiving your own reward are recorded separately.",
  },
  apparel: {
    title: "Apparel caches · 43 items",
    description: "The 43 individual item names have not been checked, so collection is tracked by quantity. Completing the collection does not mark the backpack trophy as received.",
  },
  twitch: {
    title: "Twitch Drops",
    description: "October 15–22. Check each reward after reaching the watch-time requirement and claiming it on Twitch.",
  },
  "creator-pureprime": {
    title: "PurePrime creator collaboration",
    description: "Track the project reward and apparel from loot containers separately.",
  },
  "creator-solidfps": {
    title: "SOLIDFPS creator collaboration",
    description: "Track the project reward and apparel from loot containers separately.",
  },
  "creator-widdz": {
    title: "Widdz creator collaboration",
    description: "Track the project reward and apparel from loot containers separately.",
  },
  owned: {
    title: "Key gear owned",
    description: "Key gear available through this event's bounties, Moon Cultist bosses, key donations, Gear Caches, and Red Moon Altars. Acquisition methods and requirements vary by item.",
  },
};

type EntryText = Pick<RewardEntry, "title"> & Partial<Pick<RewardEntry, "detail" | "tag">>;
const entryText: Record<string, EntryText> = {
  "bounty-final": { title: "Final Girl", detail: "Target: The Carver · Downtown West", tag: "Exotic Weapon · Regulus (20%)" },
  "bounty-scarecrow": { title: "Scarecrow", detail: "Target: The Raven · Downtown West", tag: "Exotic Weapon · Prima Donna (20%)" },
  "bounty-dousing": { title: "Dousing the Light", detail: "Target: The Fool’s Light · White House", tag: "Exotic Weapon · The Bighorn (20%)" },
  "bounty-binding": { title: "Binding Circle", detail: "Target: The Bound · Downtown East", tag: "Exotic Weapon · Steel & Sons ACR (20%)" },
  "bounty-blinding": { title: "Blinding The Eye", detail: "Target: The Burning Eye · Downtown East", tag: "Exotic Weapon · Eagle Bearer (20%)" },
  "bounty-rubber": { title: "Rubber and Glue", detail: "Target: The Mocker · Constitution Hall", tag: "Exotic Weapon · Vindicator (20%)" },
  "patch-all-six": {
    title: "Necromancer Arm Patch",
    detail: "Commendation: Red Moon Distinction · Complete all six bounties · Arm patch + 30 commendation points",
  },
  "mask-necro": {
    title: "The Necromancer",
    detail: "Exclusive mask: Bound Necromancer Mask · 1 Event Key · Sarru (20%) or Exotic Cache (80%)",
    tag: "Necromancer",
  },
  "mask-risen": {
    title: "Risen Hunter",
    detail: "Exclusive mask: Bound Risen Hunter Mask · 1 Event Key · Vertigo (20%) or Exotic Cache (80%)",
    tag: "Risen Hunter",
  },
  "mask-houndsman": {
    title: "Bloody Houndsman",
    detail: "No Event Key drop · Bat Drone Skill VFX works with all Drone variants. See the uniform drop issue and separate login grant below. Check each cosmetic after confirming receipt.",
    tag: "Bloody Houndsman",
  },
  "vfx-hive": {
    title: "Necromancer Unleashed",
    detail: "Exclusive VFX: Necromancer Hive Skill VFX · Works with all Hive variants · West End (Korean zone name unverified) · Defeat solo on Heroic · 1 Event Key · Ouroboros (20%) or Exotic Cache (80%)",
    tag: "Korean boss name unverified",
  },
  "login-mask": {
    title: "Bound Slasher Mask",
    detail: "Log into The Division 2 during the event, then check Apparel → Masks to confirm delivery. The official announcement says it is free on login but does not specify a separate claim button or location.",
    tag: "Log in during the event · Free",
  },
  "donate-10": { title: "Sinister Spells Shirt", detail: "Donate 10 keys in total", tag: "10 keys" },
  "donate-20": { title: "Scorpio", detail: "Donate 20 keys in total", tag: "20 keys" },
  "donate-40": { title: "Sinister Spells Gloves", detail: "Donate 40 keys in total", tag: "40 keys" },
  "donate-60": { title: "BT Red Moon Unit", detail: "Donate 60 keys in total", tag: "60 keys" },
  "donate-80": { title: "Sinister Spells Boots", detail: "Donate 80 keys in total", tag: "80 keys" },
  "donate-100": { title: "Caretaker", detail: "Donate 100 keys in total", tag: "100 keys" },
  "donate-125": { title: "Sinister Spells Pants", detail: "Donate 125 keys in total", tag: "125 keys" },
  "donate-150": { title: "Bloodstone", detail: "Donate 150 keys in total", tag: "150 keys" },
  "donate-175": { title: "Sinister Spells Mask", detail: "Donate 175 keys in total", tag: "175 keys" },
  "donate-200": { title: "Sinister Spells Backpack Trophy", detail: "Donate 200 keys in total", tag: "200 keys" },
  "community-jacket": { title: "The Fool’s Light Jacket", detail: "Reward for 3 million keys donated by the community", tag: "3 million keys overall" },
  "community-pants": { title: "The Fool’s Light Pants", detail: "Reward for 10 million keys donated by the community", tag: "10 million keys overall" },
  "community-mask": { title: "The Fool’s Lantern Mask", detail: "Reward for 20 million keys donated by the community", tag: "20 million keys overall" },
  "apparel-trophy": { title: "43-item completion reward", detail: "The Necromancer · Backpack Trophy" },
  "twitch-summon": { title: "Summon Arm Patch", detail: "Watch for 30 minutes in total" },
  "twitch-named": { title: "Named Cache", detail: "Watch for 1 hour in total" },
  "twitch-bind": { title: "Bind Arm Patch", detail: "Watch for 2 hours in total" },
  "twitch-exotic": { title: "Exotic Cache", detail: "Watch for 3 hours in total" },
  "twitch-eye": { title: "Eye Contact Weapon Skin", detail: "Watch for 4 hours in total" },
  "own-eagle": { title: "Eagle Bearer", detail: "Blinding The Eye bounty · Defeat The Burning Eye · 20% weapon reward chance" },
  "own-regulus": { title: "Regulus", detail: "Final Girl bounty · Defeat The Carver · 20% weapon reward chance" },
  "own-steel": { title: "Steel & Sons ACR", detail: "Binding Circle bounty · Defeat The Bound · 20% weapon reward chance" },
  "own-vindicator": { title: "Vindicator", detail: "Rubber and Glue bounty · Defeat The Mocker · 20% weapon reward chance" },
  "own-prima": { title: "Prima Donna", detail: "Scarecrow bounty · Defeat The Raven · 20% weapon reward chance" },
  "own-bighorn": { title: "The Bighorn", detail: "Dousing the Light bounty · Defeat The Fool’s Light · 20% weapon reward chance" },
  "own-ouroboros": { title: "Ouroboros", detail: "West End (Korean zone name unverified) · Defeat Necromancer Unleashed, who appears when playing solo, on Heroic difficulty · 20% weapon reward chance" },
  "own-sarru": { title: "Sarru", detail: "Defeat The Necromancer · 20% weapon reward chance" },
  "own-vertigo": { title: "Vertigo", detail: "Defeat Risen Hunter · 20% weapon reward chance" },
  "own-scorpio": { title: "Scorpio", detail: "Reward for donating 20 keys in total" },
  "own-caretaker": { title: "Caretaker", detail: "Reward for donating 100 keys in total · Also in the Special Named Items reward pool for event Gear Caches and Red Moon Altars" },
  "own-lichtenberg": { title: "Lichtenberg · Standard", detail: "7% reward chance in event Gear Caches · Red Moon Altars use the same gear reward pool" },
  "own-lichtenberg-proto": { title: "Lichtenberg · Prototype", detail: "1% reward chance in event Gear Caches · Red Moon Altars use the same gear reward pool" },
};

for (const [id, creator] of [["pureprime", "PurePrime"], ["solidfps", "SOLIDFPS"], ["widdz", "Widdz"]]) {
  entryText["creator-" + id + "-backpack"] = { title: "Themed backpack", detail: "Complete all six " + creator + " projects" };
  entryText["creator-" + id + "-cap"] = { title: "Cap", detail: creator + " · Loot containers" };
  entryText["creator-" + id + "-shirt"] = { title: "T-shirt", detail: creator + " · Loot containers" };
  entryText["creator-" + id + "-hoodie"] = { title: "Hoodie", detail: creator + " · Loot containers" };
}

type NoticeText = { title: string; paragraphs: string[]; periodTitle: string; linkLabels: string[] };
const noticeText: Record<string, NoticeText> = {
  "mask-houndsman": {
    title: "Uniform drop issue and separate login grant",
    paragraphs: [
      "The Uniform is listed as a boss reward, but the October 15 announcement identified a problem preventing it from dropping.",
      "Ubisoft announced a Uniform grant for all players logging in during the period below. These dates differ from the main event (October 15–November 3).",
      "The announced grant covers the Uniform. The post does not specify delivery timing, a claim location or a completed fix. Check off the Uniform only after confirming receipt; verify other cosmetics separately.",
    ],
    periodTitle: "Login dates eligible for the separate Uniform grant",
    linkLabels: ["Official X announcement", "Official bug report TCTD2-8273"],
  },
};
function translateNotice(id: string, notice?: RewardNotice): RewardNotice | undefined {
  if (!notice) return undefined;
  const text = required(noticeText[id], id);
  return {
    ...notice, title: text.title, paragraphs: text.paragraphs,
    period: { ...notice.period, title: text.periodTitle },
    links: notice.links.map((link, index) => ({ ...link, label: required(text.linkLabels[index], id + " link") })),
  };
}

const checkLabels: Record<string, string> = {
  "patch-all-six": "Arm patch received",
  "mask-necro": "Bound Necromancer Mask received",
  "mask-risen": "Bound Risen Hunter Mask received",
  "mask-houndsman": "Bloody Houndsman Mask received",
  "gloves-houndsman": "Bloody Houndsman Gloves received",
  "backpack-houndsman": "Bloody Houndsman Backpack received",
  "uniform-houndsman": "Bloody Houndsman Uniform received",
  "vfx-drone": "Bat Drone Skill VFX received",
  "vfx-hive": "Necromancer Hive Skill VFX received",
  "apparel-trophy": "Completion backpack trophy received",
};

const imageText: Record<string, Pick<RewardImage, "title" | "evidence">> = {
  "twitch-summon": { title: "Summon Arm Patch" },
  "twitch-bind": { title: "Bind Arm Patch" },
  "patch-final": { title: "The Carver arm patch", evidence: "The Korean item name and selected design were checked on The Carver detail screen." },
  "patch-scarecrow": { title: "The Raven arm patch", evidence: "The design on The Raven detail screen was compared with the first original screen in the same list." },
  "patch-rubber": { title: "The Mocker arm patch", evidence: "The Korean item name and selected design were checked on The Mocker detail screen." },
  "patch-dousing": { title: "The Fool’s Light arm patch", evidence: "The Korean item name and selected design were checked on The Fool’s Light detail screen." },
  "patch-binding": { title: "The Bound arm patch", evidence: "The Korean item name and selected design were checked on The Bound detail screen." },
  "mask-houndsman": { title: "Bloody Houndsman Mask", evidence: "The Korean name and selected appearance were checked on the mask detail screen." },
  "gloves-houndsman": { title: "Bloody Houndsman Gloves", evidence: "The Korean name and selected appearance were checked on the gloves detail screen." },
  "backpack-houndsman": { title: "Bloody Houndsman Backpack", evidence: "The Korean name and selected appearance were checked on the backpack detail screen." },
  "uniform-houndsman": { title: "Bloody Houndsman Uniform", evidence: "The Korean name and selected uniform appearance were checked on the supplied apparel screen on 2026-10-29. Image and name verification do not confirm reward delivery or automatically change the receipt check." },
  "patch-all-six": {
    title: "Necromancer Arm Patch",
    evidence: "The design and 30 commendation points were checked in the reward popup on 2026-10-25. A later apparel detail screen confirmed the Korean item name. Red Moon Distinction is the six-target commendation name, rather than the item name. The item corresponds to the Necromancer Arm Patch in the official announcement.",
  },
  "mask-necro": {
    title: "Bound Necromancer Mask",
    evidence: "The Korean name, Exotic rarity, and equipped appearance were checked on the mask detail screen on 2026-10-25. This image shows the equipped preview.",
  },
  "mask-risen": {
    title: "Bound Risen Hunter Mask",
    evidence: "The Korean name, Exotic rarity, and equipped appearance were checked on the mask detail screen on 2026-10-25. This image shows the equipped preview.",
  },
  "vfx-hive": {
    title: "Necromancer Hive Skill VFX",
    evidence: "The Korean name, icon, and compatibility with all Hive variants were checked on the skill-skin screen on 2026-10-25. This is the VFX icon rather than a video of the effect.",
  },
  "vfx-drone": {
    title: "Bat Drone Skill VFX",
    evidence: "The Korean name, icon, and compatibility with all Drone variants were checked on the skill-skin screen on 2026-10-25. This is the VFX icon rather than a video of the effect.",
  },
  "patch-blinding": {
    title: "The Burning Eye arm patch",
    evidence: "The Korean name, Superior rarity, and selected design were checked on the apparel detail screen on 2026-10-25.",
  },
  "community-mask": { title: "The Fool’s Lantern Mask", evidence: "The Korean name and selected reward appearance were checked on the game detail screen on 2026-10-29." },
  "community-jacket": { title: "The Fool’s Light Jacket", evidence: "The Korean name and selected reward appearance were checked on the game detail screen on 2026-10-29." },
  "community-pants": { title: "The Fool’s Light Pants", evidence: "The Korean name and selected reward appearance were checked on the game detail screen on 2026-10-29." },
  "twitch-eye": { title: "Eye Contact Weapon Skin", evidence: "The Korean name and selected reward appearance were checked on the game detail screen on 2026-10-29." },
  "login-mask": { title: "Bound Slasher Mask", evidence: "The Korean name and selected mask appearance were checked on the apparel detail screen on 2026-10-29." },
  "apparel-trophy": { title: "The Necromancer Backpack Trophy", evidence: "The Korean name, Backpack Trophy category, and selected appearance were checked on the apparel detail screen on 2026-10-29." },
};

function required<T>(text: T | undefined, id: string): T {
  if (text === undefined) throw new Error("Missing English event text: " + id);
  return text;
}

export const categoriesEn: typeof categories = categories.map(category => ({
  ...category,
  title: required(categoryTitles[category.id], category.id),
}));

export const groupsEn: RewardGroup[] = groups.map(group => ({
  ...group,
  ...required(groupText[group.id], group.id),
  entries: group.entries.map(entry => {
    const text = required(entryText[entry.id], entry.id);
    return {
      ...entry,
      ...text,
      notice: translateNotice(entry.id, entry.notice),
      search: [entry.search, text.title, text.detail, text.tag].filter(Boolean).join(" "),
      checks: entry.checks.map(check => ({
        ...check,
        label: checkLabels[check.id] ?? (check.type === "bounty" ? "Bounty completed" : check.type === "owned" ? "Gear owned" : check.id.startsWith("patch-") ? "Exclusive arm patch received" : "Reward received"),
      })),
    };
  }),
}));

export const imagesEn: Record<string, RewardImage> = Object.fromEntries(
  Object.entries(images).map(([id, image]) => [
    id,
    { ...image, ...required(imageText[id], id) },
  ]),
);
