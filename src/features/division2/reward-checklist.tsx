"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type MouseEvent } from "react";
import styles from "./central-park/central-park.module.css";
import { checklistCopy } from "./central-park/copy";
import { createChecklistProgress, maxBackupBytes } from "./checklist-progress";
import type { Division2Language } from "./event-guides";
import type { RewardGroup, RewardItem, RewardSection } from "./reward-checklist-types";
import checklistStyles from "./reward-checklist.module.css";

const copy = {
  ko: {
    ...checklistCopy.ko,
    placeholder: "보상 이름, 임무, 헌터",
    expired: "프로모션 기록",
    ended: "프로모션 종료",
    unconfirmedName: "한국어 인벤토리 이름 미확인",
    unconfirmedAvailability: "현재 수령 가능 여부 미확인",
    imageSource: "이미지 출처",
    backupInfo: "한국어·영어 페이지에서 이 브라우저의 체크 기록을 함께 사용해요. 백업을 저장하거나 가져올 수 있어요.",
    resetConfirm: (name: string) => `${name} 보상 체크를 모두 해제할까요?`,
    importError: (name: string) => `백업을 읽지 못했어요. ${name} 체크리스트에서 저장한 256KB 이하 JSON 파일을 선택해 주세요.`,
  },
  en: {
    ...checklistCopy.en,
    placeholder: "Reward, mission or Hunter",
    expired: "Promotion archive",
    ended: "Promotion ended",
    unconfirmedName: "Korean inventory name unconfirmed",
    unconfirmedAvailability: "Current availability unconfirmed",
    imageSource: "Image source",
    backupInfo: "The Korean and English pages share this browser’s checklist. You can save or import a backup.",
    resetConfirm: (name: string) => `Clear all ${name} reward checks?`,
    importError: (name: string) => `Could not read the backup. Select a ${name} checklist JSON backup no larger than 256 KB.`,
  },
};

type StorageMode = "loading" | ReturnType<ReturnType<typeof createChecklistProgress>["loadProgress"]>["mode"];
type AcquisitionFilter = "all" | "pending" | "acquired";
type RewardImage = NonNullable<RewardItem["image"]>;
type Preview = { name: string; image: RewardImage };

const tiers = ["core", "bonus", "expired"] as const;
const normalize = (value: string) => value.normalize("NFKC").replace(/[‘’]/g, "'").toLowerCase();

function browserStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function RewardPicture({ image, collection, alt, thumbnail = false }: { image: RewardImage; collection: string; alt: string; thumbnail?: boolean }) {
  const maxHeight = thumbnail ? "var(--thumbnail-height)" : "min(65svh, 500px)";
  return (
    <span className={styles.picture} style={{ width: `min(100%, calc(${maxHeight} * ${image.width / image.height}))` }}>
      <Image src={`/games/the-division-2/${collection}/${image.file}`} alt={alt} width={image.width} height={image.height} loading={thumbnail ? "lazy" : "eager"} unoptimized />
    </span>
  );
}

function toggleFromCard(event: MouseEvent<HTMLElement>) {
  const { currentTarget, target } = event;
  if (event.defaultPrevented || !(target instanceof Element) || target.closest("a, button, input, label")) return;

  const selection = currentTarget.ownerDocument.getSelection();
  if (selection && !selection.isCollapsed && selection.containsNode(currentTarget, true)) return;

  const checkbox = currentTarget.querySelector<HTMLInputElement>('input[type="checkbox"]:enabled');
  checkbox?.focus({ preventScroll: true });
  checkbox?.click();
}

function RewardCard({ item, language, collection, prefix, checked, busy, trackable, onCheck, onImage }: {
  item: RewardItem;
  language: Division2Language;
  collection: string;
  prefix: string;
  checked: boolean;
  busy: boolean;
  trackable: boolean;
  onCheck: (id: string, acquired: boolean) => void;
  onImage: (preview: Preview, trigger: HTMLButtonElement) => void;
}) {
  const text = copy[language];
  const alternateLanguage = language === "ko" ? "en" : "ko";
  const name = item.name[language];
  const alternateName = item.name[alternateLanguage];
  const nameLanguage = language === "ko" && item.localizedNameUnconfirmed && name === alternateName ? "en" : undefined;
  const image = item.image;
  const kind = item.kind?.[language];
  const status = checked ? text.checked : text.unchecked;
  const checkboxId = `${prefix}-check-${item.id}`;
  return (
    <article className={styles.reward} data-reward={item.id} data-checked={checked || undefined} onClick={trackable ? toggleFromCard : undefined}>
      <div className={styles.rewardOverview}>
        <div className={trackable ? styles.cardHeading : undefined}>
          {trackable && (
            <label className={styles.checkTarget}>
              <input id={checkboxId} type="checkbox" checked={checked} disabled={busy} onChange={event => onCheck(item.id, event.currentTarget.checked)} />
            </label>
          )}
          <div className={trackable && !kind ? checklistStyles.rewardName : undefined}>
            {kind && <p className={styles.kind}>{kind}</p>}
            <h4 className={styles.rewardTitle} lang={nameLanguage}>{trackable ? <label htmlFor={checkboxId}>{name}</label> : name}</h4>
            {alternateName !== name && <p className={styles.alternateName} lang={alternateLanguage}>{alternateName}</p>}
          </div>
        </div>
        {image && (
          <button type="button" className={styles.thumbnail} aria-label={text.enlargeName(name)} aria-haspopup="dialog" onClick={event => onImage({ name, image }, event.currentTarget)}>
            <span className={styles.thumbnailFrame}><RewardPicture image={image} collection={collection} alt="" thumbnail /></span>
            <span className={styles.enlarge}>{text.enlarge} ↗</span>
          </button>
        )}
      </div>
      <p className={styles.condition}>{item.requirement[language]}</p>
      {item.note && <p className={styles.note}>{item.note[language]}</p>}
      {item.localizedNameUnconfirmed && <p className={styles.note}>{text.unconfirmedName}</p>}
      {item.availabilityUnconfirmed && <p className={styles.note}>{text.unconfirmedAvailability}</p>}
      {!!item.links?.length && (
        <div className={styles.sources}>
          {item.links.map(link => (
            <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label[language]} ↗</a>
          ))}
        </div>
      )}
      <p className={styles.itemStatus}>{trackable ? status : text.ended}</p>
    </article>
  );
}

export function RewardChecklist({ language, collection, prefix = collection, name, sections, groups = sections }: {
  language: Division2Language;
  collection: string;
  prefix?: string;
  name: string;
  sections: readonly RewardSection[];
  groups?: readonly RewardGroup[];
}) {
  const text = copy[language];
  const { loadProgress, parseBackup, saveProgress, serializeBackup, storageKey } = useMemo(() => createChecklistProgress(
    collection,
    sections.filter(section => section.tier !== "expired").flatMap(section => section.items.map(item => item.id)),
    collection,
  ), [collection, sections]);
  const searchIndex = useMemo(() => {
    const categoryTitles = new Map(groups.map(group => [group.id, group.title]));
    return new Map(sections.flatMap(section => section.items.map(item => {
      const category = categoryTitles.get(item.group);
      return [item.id, normalize([
        item.name.ko, item.name.en, item.requirement.ko, item.requirement.en, item.note?.ko, item.note?.en,
        category?.ko, category?.en, section.title.ko, section.title.en, section.note?.ko, section.note?.en,
      ].join(" "))] as const;
    })));
  }, [groups, sections]);
  const rewardCount = searchIndex.size;
  const [checked, setChecked] = useState<string[]>([]);
  const [storageMode, setStorageMode] = useState<StorageMode>("loading");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState<AcquisitionFilter>("all");
  const [message, setMessage] = useState("");
  const [importing, setImporting] = useState(false);
  const [activeImage, setActiveImage] = useState<Preview | null>(null);
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
  }, [loadProgress, storageKey]);

  useEffect(() => {
    if (activeImage && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [activeImage]);

  const busy = storageMode === "loading" || importing;
  const checkedIds = new Set(checked);
  const normalizedQuery = normalize(query.trim());
  const visibleSections = sections
    .map(section => ({
      ...section,
      visibleItems: section.items.filter(item =>
        (category === "all" || category === item.group) &&
        (status === "all" || (section.tier !== "expired" && checkedIds.has(item.id) === (status === "acquired"))) &&
        searchIndex.get(item.id)?.includes(normalizedQuery)),
    }))
    .filter(section => section.visibleItems.length > 0);
  const visibleCount = visibleSections.reduce((total, section) => total + section.visibleItems.length, 0);

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
      setMessage(text.importError(name));
    } finally {
      setImporting(false);
    }
  }

  function exportChecks() {
    const url = URL.createObjectURL(new Blob([serializeBackup(checked)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${collection}-backup.json`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage(text.exportDone);
  }

  function resetChecks() {
    if (!window.confirm(text.resetConfirm(name))) return;
    replaceChecks([]);
    setMessage(text.resetDone);
  }

  function openImage(preview: Preview, trigger: HTMLButtonElement) {
    imageTrigger.current = trigger;
    setActiveImage(preview);
  }

  return (
    <div id={`${prefix}-rewards`} className={styles.checklist}>
      <section className={styles.progressSection} aria-labelledby={`${prefix}-progress-title`}>
        <h2 id={`${prefix}-progress-title`}>{text.progress}</h2>
        <div className={styles.progressGrid}>
          {(["core", "bonus"] as const).map(tier => {
            const items = sections.filter(section => section.tier === tier).flatMap(section => section.items);
            if (!items.length) return null;
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
          <select name="category" value={category} onChange={event => setCategory(event.currentTarget.value)}>
            <option value="all">{text.allCategories}</option>
            {tiers.map(tier => {
              const tierGroups = groups.filter(group => group.tier === tier);
              if (!tierGroups.length) return null;
              return <optgroup key={tier} label={text[tier]}>
                {tierGroups.map(group => <option key={group.id} value={group.id}>{group.title[language]}</option>)}
              </optgroup>;
            })}
          </select>
        </label>
        <label>{text.status}
          <select name="status" ref={statusSelect} value={status} onChange={event => setStatus(event.currentTarget.value as AcquisitionFilter)}>
            <option value="all">{text.allStatuses}</option>
            <option value="pending">{text.pending}</option>
            <option value="acquired">{text.acquired}</option>
          </select>
        </label>
      </div>
      <div className={styles.results}>
        <p role="status">{text.results(visibleCount, rewardCount)}</p>
        <p role="status" data-storage={storageMode}>{text[storageMode]}</p>
      </div>
      {visibleCount === 0 && <div className={styles.empty}><p>{text.empty}</p><button type="button" onClick={clearFilters}>{text.clear}</button></div>}

      {tiers.map(tier => {
        const tierSections = visibleSections.filter(section => section.tier === tier);
        if (!tierSections.length) return null;
        return (
          <section className={styles.tier} key={tier} aria-labelledby={`${prefix}-${tier}-title`}>
            <h2 id={`${prefix}-${tier}-title`}>{text[tier]}</h2>
            {tierSections.map(section => (
              <section className={`${styles.rewardPanel} ${styles.collectibles}`} id={`${prefix}-${section.id}`} data-category={section.id} key={section.id} aria-labelledby={`${prefix}-${section.id}-title`}>
                <h3 className={styles.groupTitle} id={`${prefix}-${section.id}-title`}>
                  {section.title[language]}
                  {tier !== "expired" && <span className={checklistStyles.groupProgress}>{section.items.filter(item => checkedIds.has(item.id)).length} / {section.items.length}</span>}
                </h3>
                {section.note && <p className={styles.groupDescription}>{section.note[language]}</p>}
                {!!section.links?.length && (
                  <div className={`${styles.sources} ${checklistStyles.panelSource}`}>
                    {section.links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label[language]} ↗</a>)}
                  </div>
                )}
                <div className={styles.grid}>
                  {section.visibleItems.map(item => <RewardCard key={item.id} item={item} language={language} collection={collection} prefix={prefix} checked={checkedIds.has(item.id)} busy={busy} trackable={tier !== "expired"} onCheck={toggleCheck} onImage={openImage} />)}
                </div>
              </section>
            ))}
          </section>
        );
      })}

      <section className={styles.backup} id={`${prefix}-backup`} aria-labelledby={`${prefix}-backup-title`}>
        <h2 id={`${prefix}-backup-title`}>{text.manage}</h2>
        <p>{text.backupInfo}</p>
        <div className={styles.backupActions}>
          <button type="button" disabled={busy} onClick={exportChecks}>{text.export}</button>
          <button type="button" disabled={busy} onClick={() => fileInput.current?.click()}>{importing ? text.importing : text.import}</button>
          <button type="button" disabled={busy} onClick={resetChecks}>{text.reset}</button>
          <input ref={fileInput} type="file" accept=".json,application/json" onChange={importChecks} hidden />
        </div>
        <p className={styles.message} role="status">{message}</p>
      </section>

      <dialog ref={dialog} className={styles.dialog} aria-label={text.imageDialog} onClick={event => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }} onClose={() => {
        setActiveImage(null);
        imageTrigger.current?.focus({ preventScroll: true });
      }}>
        <div className={styles.dialogBody}>
          <div className={styles.dialogBar}><strong>{activeImage?.name}</strong><button autoFocus type="button" onClick={() => dialog.current?.close()}>{text.close}</button></div>
          {activeImage && (
            <>
              <RewardPicture image={activeImage.image} collection={collection} alt={activeImage.image.caption?.[language] ?? activeImage.name} />
              {activeImage.image.caption && <p className={styles.condition}>{activeImage.image.caption[language]}</p>}
              <div className={styles.sources}>
                {"href" in activeImage.image.source ? (
                  <a href={activeImage.image.source.href} target="_blank" rel="noopener noreferrer">{text.imageSource} · {activeImage.image.source.credit} ↗</a>
                ) : (
                  <span>{text.imageSource} · {activeImage.image.source.credit[language]}</span>
                )}
              </div>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}
