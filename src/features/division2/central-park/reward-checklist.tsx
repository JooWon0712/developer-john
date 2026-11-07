"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ChangeEvent, type MouseEvent } from "react";
import type { Division2Language } from "../event-guides";
import { collectiblesId, guardianCards, guardianCardsSource } from "./collectibles";
import { checklistCopy } from "./copy";
import { loadProgress, maxBackupBytes, parseBackup, saveProgress, serializeBackup, storageKey } from "./progress";
import {
  clockworkVideoSources, codesVerifiedDate, coupons, dropsEndDate, dropsSource, dropsStartDate, gamescomPromotion, groups, hunterChest, hunterMasksTitle,
  progressionStages, redeemUrl, rewards, twitchInventoryUrl, type Reward, type RewardImage,
} from "./rewards";
import styles from "./central-park.module.css";

type StorageMode = "loading" | ReturnType<typeof loadProgress>["mode"];
type AcquisitionFilter = "all" | "acquired" | "pending";
type RewardPreview = { name: string; image: RewardImage };
type OpenPreview = (preview: RewardPreview, trigger: HTMLButtonElement) => void;

const tiers = ["core", "bonus"] as const;
const imageDirectory = "/games/the-division-2/echoes-of-central-park-2026/clean";
const sections = groups.map((group, index) => ({ ...group, number: String(index + 1).padStart(2, "0"), items: rewards.filter(item => item.group === group.id) }));
const normalize = (text: string) => text.normalize("NFKC").toLowerCase();
const searchIndex = new Map(sections.flatMap(group => group.items.map(item => {
  const groupContext = item.progressionStage ? progressionStages[item.progressionStage] : group;
  const subgroupTitle = item.hunterChest ? hunterChest.title : group.id === "hunters" ? hunterMasksTitle : undefined;
  const subgroupDescription = item.hunterChest ? hunterChest.description : undefined;
  return [item.id, normalize([
    item.name.ko, item.name.en, item.kind.ko, item.kind.en,
    item.condition?.ko, item.condition?.en, item.note?.ko, item.note?.en,
    groupContext.title.ko, groupContext.title.en, groupContext.description?.ko, groupContext.description?.en,
    subgroupTitle?.ko, subgroupTitle?.en, subgroupDescription?.ko, subgroupDescription?.en,
    coupons.find(coupon => coupon.rewardIds.includes(item.id))?.code,
  ].join(" "))];
})));

function browserStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function RewardPicture({ image, thumbnail = false }: { image: RewardImage; thumbnail?: boolean }) {
  const maxHeight = thumbnail ? "var(--thumbnail-height)" : "min(55svh, 420px)";
  const width = `min(100%, calc(${maxHeight} * ${image.width / image.height}))`;
  return (
    <span className={styles.picture} style={{ width }}>
      <Image
        src={`${imageDirectory}/${image.file}`}
        alt=""
        width={image.width}
        height={image.height}
        loading={thumbnail ? "lazy" : "eager"}
        unoptimized
      />
    </span>
  );
}

function RewardThumbnail({ image, name, language, onOpen }: RewardPreview & {
  language: Division2Language;
  onOpen: OpenPreview;
}) {
  const text = checklistCopy[language];
  return (
    <button type="button" className={styles.thumbnail} onClick={event => onOpen({ image, name }, event.currentTarget)} aria-label={text.enlargeName(name)} aria-haspopup="dialog">
      <span className={styles.thumbnailFrame}><RewardPicture image={image} thumbnail /></span>
      <span className={styles.enlarge}>{text.enlarge} ↗</span>
    </button>
  );
}

function RewardCard({ item, language, checked, disabled, onCheck, onImage }: {
  item: Reward;
  language: Division2Language;
  checked: boolean;
  disabled: boolean;
  onCheck: (id: string, checked: boolean) => void;
  onImage: OpenPreview;
}) {
  const text = checklistCopy[language];
  const alternateLanguage = language === "ko" ? "en" : "ko";
  const checkboxId = `central-park-check-${item.id}`;
  const isClockwork = item.id === "clockwork";
  return (
    <article className={styles.reward} data-reward={item.id} data-checked={checked || undefined}>
      <div className={styles.rewardOverview}>
        <div className={styles.cardHeading}>
          <input id={checkboxId} type="checkbox" checked={checked} disabled={disabled} onChange={event => onCheck(item.id, event.currentTarget.checked)} />
          <div>
            <p className={styles.kind}>{item.kind[language]}</p>
            <h4 className={styles.rewardTitle}><label htmlFor={checkboxId}>{item.name[language]}</label></h4>
            {item.name[alternateLanguage] !== item.name[language] && <p className={styles.alternateName} lang={alternateLanguage}>{item.name[alternateLanguage]}</p>}
          </div>
        </div>
        {item.image && <RewardThumbnail image={item.image} name={item.name[language]} language={language} onOpen={onImage} />}
      </div>
      {item.condition && <p className={styles.condition}>{item.condition[language]}</p>}
      {item.note && <p className={styles.note}>{item.note[language]}</p>}
      {(item.sources.length > 0 || isClockwork) && (
        <div className={styles.sources}>
          {isClockwork ? <a href={`#${collectiblesId}`}>{text.guardianCards} ↓</a> : (
            item.sources.map(source => <a key={source.href} href={source.href} target="_blank" rel="noopener noreferrer">{source.label[language]} ↗</a>)
          )}
        </div>
      )}
      <p className={styles.itemStatus}>{checked ? text.checked : text.unchecked}</p>
    </article>
  );
}

function ClockworkCollectibles({ language, checkedIds, disabled, onCheck }: {
  language: Division2Language;
  checkedIds: ReadonlySet<string>;
  disabled: boolean;
  onCheck: (id: string, checked: boolean) => void;
}) {
  const text = checklistCopy[language];
  const count = guardianCards.filter(card => checkedIds.has(card.id)).length;
  return (
    <section className={styles.collectibles} id={collectiblesId} aria-labelledby="central-park-guardian-cards-title">
      <h4 className={styles.groupTitle} id="central-park-guardian-cards-title">{text.collectiblesTitle}</h4>
      <p className={styles.groupDescription} role="status">{text.collectiblesCount(count, guardianCards.length)}</p>
      <p className={styles.groupDescription}>{text.cardsInstructions}</p>
      <div className={styles.grid}>
        {guardianCards.map(card => {
          const checked = checkedIds.has(card.id);
          const checkboxId = `central-park-collectible-${card.id}`;
          return (
            <article className={styles.reward} key={card.id} data-checked={checked || undefined}>
              <div className={styles.cardHeading}>
                <input id={checkboxId} type="checkbox" checked={checked} disabled={disabled} onChange={event => onCheck(card.id, event.currentTarget.checked)} />
                <div>
                  <h5 className={styles.rewardTitle}><label htmlFor={checkboxId}>{card.name[language]}</label></h5>
                  {language === "ko" && <p className={styles.alternateName} lang="en">{card.name.en}</p>}
                </div>
              </div>
              <p className={styles.condition}>{card.hint[language]}</p>
            </article>
          );
        })}
      </div>
      <div className={styles.sources}>
        <a href={guardianCardsSource} target="_blank" rel="noopener noreferrer">{text.cardsSource} ↗</a>
        {clockworkVideoSources.map(source => (
          <a key={source.href} href={source.href} target="_blank" rel="noopener noreferrer">{source.label[language]} ↗</a>
        ))}
      </div>
    </section>
  );
}

export function CentralParkChecklist({ language }: { language: Division2Language }) {
  const text = checklistCopy[language];
  const [checked, setChecked] = useState<string[]>([]);
  const [storageMode, setStorageMode] = useState<StorageMode>("loading");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<AcquisitionFilter>("all");
  const [message, setMessage] = useState("");
  const [importing, setImporting] = useState(false);
  const [activeImage, setActiveImage] = useState<RewardPreview | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const statusSelect = useRef<HTMLSelectElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const imageTrigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const currentStorage = browserStorage();
    if (!currentStorage) {
      setStorageMode("unavailable");
      return;
    }
    const storage = currentStorage;

    function sync() {
      const progress = loadProgress(storage);
      if (progress.mode === "ready") setChecked(progress.checked);
      setStorageMode(progress.mode);
    }

    function onStorage(event: StorageEvent) {
      if (event.storageArea === storage && (event.key === storageKey || event.key === null)) sync();
    }

    sync();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (activeImage && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [activeImage]);

  const busy = storageMode === "loading" || importing;
  const checkedIds = new Set(checked);
  const normalizedQuery = normalize(query.trim());
  const visibleSections = sections.map(section => ({ ...section, items: section.items.filter(item =>
    (category === "all" || category === section.id) &&
    (status === "all" || checkedIds.has(item.id) === (status === "acquired")) &&
    (searchIndex.get(item.id)?.includes(normalizedQuery) ?? false),
  ) })).filter(section => section.items.length > 0 || section.id === "weapons");
  const visibleCount = visibleSections.reduce((total, section) => total + section.items.length, 0);
  const visibleArg = visibleSections.find(section => section.id === "arg");

  function replaceChecks(next: string[]) {
    const storage = browserStorage();
    setChecked(next);
    setStorageMode(storage && saveProgress(storage, next) ? "ready" : "unavailable");
  }

  function toggleCheck(id: string, acquired: boolean) {
    const storage = browserStorage();
    const current = storage && storageMode === "ready" ? loadProgress(storage) : null;
    const next = new Set(current?.mode === "ready" ? current.checked : checked);
    if (acquired) next.add(id);
    else next.delete(id);

    if (storageMode === "corrupt" || current?.mode === "corrupt") {
      setChecked([...next]);
      setStorageMode("corrupt");
    } else {
      replaceChecks([...next]);
    }
  }

  function toggleRewardCheck(id: string, acquired: boolean) {
    toggleCheck(id, acquired);
    if (status !== "all") statusSelect.current?.focus({ preventScroll: true });
  }

  function clearFilters() {
    setQuery("");
    setCategory("all");
    setStatus("all");
  }

  async function importChecks(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;

    setMessage("");
    setImporting(true);
    try {
      if (file.size > maxBackupBytes) throw new Error("Backup too large.");
      const next = parseBackup(await file.text());
      if (!window.confirm(text.importConfirm(next.length))) return;
      replaceChecks(next);
      clearFilters();
      setMessage(text.importDone(next.length));
    } catch {
      setMessage(text.importError);
    } finally {
      setImporting(false);
    }
  }

  function exportChecks() {
    const url = URL.createObjectURL(new Blob([serializeBackup(checked)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "echoes-of-central-park-2026-backup.json";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage(text.exportDone);
  }

  function resetChecks() {
    if (!window.confirm(text.resetConfirm)) return;
    replaceChecks([]);
    setMessage(text.resetDone);
  }

  function openImage(preview: RewardPreview, trigger: HTMLButtonElement) {
    imageTrigger.current = trigger;
    setActiveImage(preview);
  }

  function closeOnBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) event.currentTarget.close();
  }

  function renderGrid(items: readonly Reward[]) {
    return <div className={styles.grid}>{items.map(item => <RewardCard key={item.id} item={item} language={language} checked={checkedIds.has(item.id)} disabled={busy} onCheck={toggleRewardCheck} onImage={openImage} />)}</div>;
  }

  function renderHunterRewards(items: readonly Reward[]) {
    const masks = items.filter(item => !item.hunterChest);
    const chestRewards = items.filter(item => item.hunterChest);
    return (
      <>
        {masks.length > 0 && (
          <div className={styles.subgroup}>
            <h4 className={styles.groupTitle}>{hunterMasksTitle[language]}</h4>
            {renderGrid(masks)}
          </div>
        )}
        {chestRewards.length > 0 && (
          <div className={styles.subgroup}>
            <h4 className={styles.groupTitle} id="central-park-group-gear">{hunterChest.title[language]}</h4>
            <p className={styles.groupDescription}>{hunterChest.description[language]}</p>
            {renderGrid(chestRewards)}
          </div>
        )}
      </>
    );
  }

  function renderProgressionRewards(items: readonly Reward[]) {
    return Object.entries(progressionStages).map(([stageId, stage]) => {
      const stageItems = items.filter(item => item.progressionStage === stageId);
      return stageItems.length > 0 && (
        <div className={styles.subgroup} key={stageId}>
          <h4 className={styles.groupTitle}>{stage.title[language]}</h4>
          {stage.description && <p className={styles.groupDescription}>{stage.description[language]}</p>}
          {renderGrid(stageItems)}
        </div>
      );
    });
  }

  function renderGroupRewards(section: (typeof sections)[number]) {
    if (section.id === "hunters") return renderHunterRewards(section.items);
    if (section.id === "skills") return renderProgressionRewards(section.items);
    return section.items.length > 0 && renderGrid(section.items);
  }

  function renderTier(tier: (typeof tiers)[number]) {
    const matches = visibleSections.filter(section => section.tier === tier && section.id !== "arg");
    return matches.length > 0 && (
      <section className={styles.tier} aria-labelledby={`central-park-tier-${tier}`}>
        <h2 id={`central-park-tier-${tier}`}>{text[tier]}</h2>
        {matches.map(section => (
          <section className={styles.rewardPanel} key={section.id} aria-labelledby={`central-park-group-${section.id}`}>
            <h3 className={styles.groupTitle} id={`central-park-group-${section.id}`}>
              {tier === "core" && <span aria-hidden="true">{section.number}</span>}
              {section.title[language]}
            </h3>
            {section.description && <p className={styles.groupDescription}>{section.description[language]}</p>}
            {section.id === "drops" && (
              <div className={styles.dropsInfo}>
                <p><strong>{text.dropsPeriod}</strong> <time dateTime={dropsStartDate}>{text.dropsStart}</time> – <time dateTime={dropsEndDate}>{text.dropsEnd}</time></p>
                <p>{text.dropsInstructions} {text.dropsDeadline}</p>
                <div className={styles.sources}>
                  <a href={dropsSource.href} target="_blank" rel="noopener noreferrer">{dropsSource.label[language]} ↗</a>
                  <a href={twitchInventoryUrl} target="_blank" rel="noopener noreferrer">{text.inventory} ↗</a>
                </div>
              </div>
            )}
            {renderGroupRewards(section)}
            {section.id === "weapons" && <ClockworkCollectibles language={language} checkedIds={checkedIds} disabled={busy} onCheck={toggleCheck} />}
          </section>
        ))}
      </section>
    );
  }

  return (
    <div id="central-park-rewards" className={styles.checklist}>
      <section className={styles.progressSection} aria-labelledby="central-park-progress-title">
        <h2 id="central-park-progress-title">{text.progress}</h2>
        <div className={styles.progressGrid}>
          {tiers.map(tier => {
            const items = sections.filter(section => section.tier === tier).flatMap(section => section.items);
            const count = items.filter(item => checkedIds.has(item.id)).length;
            return (
              <div key={tier} className={styles.progressCard} data-progress={tier}>
                <div><span>{text[tier]}</span><span><strong>{count}</strong> / {items.length}</span></div>
                <progress aria-label={text[tier]} value={count} max={items.length} />
              </div>
            );
          })}
        </div>
      </section>

      <div className={styles.filters}>
        <label>{text.search}<input type="search" placeholder={text.placeholder} value={query} onChange={event => setQuery(event.currentTarget.value)} /></label>
        <label>{text.category}
          <select value={category} onChange={event => setCategory(event.currentTarget.value)}>
            <option value="all">{text.allCategories}</option>
            {tiers.map(tier => <optgroup key={tier} label={text[tier]}>{sections.filter(section => section.tier === tier).map(section => <option key={section.id} value={section.id}>{section.title[language]}</option>)}</optgroup>)}
          </select>
        </label>
        <label>{text.status}
          <select ref={statusSelect} value={status} onChange={event => setStatus(event.currentTarget.value as AcquisitionFilter)}>
            <option value="all">{text.allStatuses}</option>
            <option value="pending">{text.pending}</option>
            <option value="acquired">{text.acquired}</option>
          </select>
        </label>
      </div>
      <div className={styles.results}>
        <p role="status">{text.results(visibleCount, rewards.length)}</p>
        <p role="status" data-storage={storageMode}>{text[storageMode]}</p>
      </div>

      {visibleCount === 0 && <div className={styles.empty}><p>{text.empty}</p><button type="button" onClick={clearFilters}>{text.clear}</button></div>}
      {renderTier("core")}
      {renderTier("bonus")}

      <section id="reward-codes" className={styles.tier} aria-labelledby="reward-codes-title">
        <div className={styles.redeemHeader}>
          <h2 id="reward-codes-title">{text.rewardCodes}</h2>
          <a className="button" href={redeemUrl} target="_blank" rel="noopener noreferrer">{text.redeem} ↗</a>
        </div>
        <p className={styles.groupDescription}>{text.codeInstructions}</p>
        {visibleArg && <p className={styles.groupDescription}>{text.codeVerified} <time dateTime={codesVerifiedDate}>{codesVerifiedDate}</time></p>}
        {visibleArg && coupons.map(coupon => {
          const items = visibleArg.items.filter(item => coupon.rewardIds.includes(item.id));
          return items.length > 0 && (
            <section className={styles.rewardPanel} key={coupon.code} data-coupon={coupon.code} aria-label={coupon.title[language]}>
              <h3 className={styles.couponHeading}><span>{coupon.title[language]}</span><code>{coupon.code}</code></h3>
              {renderGrid(items)}
            </section>
          );
        })}
        <section id="gamescom-2026" className={styles.rewardPanel} data-coupon={gamescomPromotion.code} aria-label={text.gamescomTitle}>
          <h3 className={styles.couponHeading}><span>{text.gamescomTitle}</span><code>{gamescomPromotion.code}</code></h3>
          <div className={styles.grid}>
            {gamescomPromotion.items.map(item => (
              <article className={styles.reward} key={item.image.file}>
                <div className={styles.rewardOverview}>
                  <div className={styles.rewardIdentity}>
                    <p className={styles.kind}>{item.kind[language]}</p>
                    <h4 className={styles.rewardTitle}>{item.name[language]}</h4>
                  </div>
                  <RewardThumbnail image={item.image} name={item.name[language]} language={language} onOpen={openImage} />
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className={styles.backup} aria-labelledby="central-park-backup-title">
        <h2 id="central-park-backup-title">{text.manage}</h2>
        <p>{text.backupInfo}</p>
        <div className={styles.backupActions}>
          <button type="button" disabled={busy} onClick={exportChecks}>{text.export}</button>
          <button type="button" disabled={busy} onClick={() => fileInput.current?.click()}>{importing ? text.importing : text.import}</button>
          <button type="button" disabled={busy} onClick={resetChecks}>{text.reset}</button>
          <input ref={fileInput} type="file" accept=".json,application/json" onChange={importChecks} hidden />
        </div>
        <p className={styles.message} role="status">{message}</p>
      </section>

      <dialog ref={dialog} className={styles.dialog} aria-label={text.imageDialog} onClick={closeOnBackdrop} onClose={() => {
        setActiveImage(null);
        imageTrigger.current?.focus({ preventScroll: true });
      }}>
        <div className={styles.dialogBody}>
          <div className={styles.dialogBar}><strong>{activeImage?.name}</strong><button autoFocus type="button" onClick={() => dialog.current?.close()}>{text.close}</button></div>
          {activeImage && <RewardPicture image={activeImage.image} />}
        </div>
      </dialog>
    </div>
  );
}
