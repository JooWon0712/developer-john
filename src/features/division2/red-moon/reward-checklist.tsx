"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { event, records, type RewardImage } from "./event";
import { createEmptyProgress, setApparelCount, STORAGE_KEY, summarizeProgress, toggleCheck, type Progress } from "./progress";
import { readStoredProgress, writeStoredProgress, type StorageState } from "./storage";
import { periodStatus } from "./availability";
import { resolveRewardAnchor, type RewardAnchor } from "./navigation";
import { getEventPath, getLocalizedEventData, getRewardSearchText, type Language } from "./localization";
import { getRewardCopy } from "./copy";
import styles from "./red-moon.module.css";

function useToday() {
  const [today, setToday] = useState("");
  useEffect(() => {
    function updateDate() {
      const parts = new Intl.DateTimeFormat("en", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
      const part = (type: Intl.DateTimeFormatPartTypes) => parts.find(item => item.type === type)?.value;
      setToday(`${part("year")}-${part("month")}-${part("day")}`);
    }
    updateDate();
    const timer = window.setInterval(updateDate, 60_000);
    return () => window.clearInterval(timer);
  }, []);
  return today;
}

export function EventAvailability({ language = "ko" }: { language?: Language }) {
  const today = useToday();
  const status = periodStatus(today, event.startsOn, event.endsOn, language);
  return <span className={`${styles.periodBadge} ${styles[status.tone]}`}>{status.label}</span>;
}

export function RewardChecklist({ language = "ko" }: { language?: Language }) {
  const copy = getRewardCopy(language);
  const { categories, groups, images } = getLocalizedEventData(language);
  const [progress, setProgress] = useState<Progress>(createEmptyProgress);
  const progressRef = useRef(progress);
  const storage = useRef<Storage | null>(null);
  const blocked = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [storageState, setStorageState] = useState<StorageState>("ready");
  const [notice, setNotice] = useState("");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [apparelDraft, setApparelDraft] = useState("0");
  const [apparelError, setApparelError] = useState("");
  const [activeImage, setActiveImage] = useState<RewardImage | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const imageTrigger = useRef<HTMLButtonElement | null>(null);
  const [shareUrl, setShareUrl] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const shareInput = useRef<HTMLInputElement>(null);
  const today = useToday();
  const groupPanels = useRef(new Map<string, HTMLDetailsElement>());
  const [anchor, setAnchor] = useState<RewardAnchor | null>(null);

  useEffect(() => {
    function applyStored() {
      let applied = false;
      try {
        storage.current = window.localStorage;
        const result = readStoredProgress(storage.current);
        blocked.current = result.state !== "ready";
        setStorageState(result.state);
        if (result.state === "ready") {
          applied = true;
          progressRef.current = result.progress;
          setProgress(result.progress);
          setApparelDraft(String(result.progress.apparelCount));
          setApparelError("");
        }
      } catch {
        blocked.current = true;
        setStorageState("unavailable");
      }
      setLoaded(true);
      return applied;
    }
    applyStored();
    function onStorage(change: StorageEvent) {
      if ((change.key !== STORAGE_KEY && change.key !== null) || change.storageArea !== storage.current) return;
      const applied = applyStored();
      setShareMessage("");
      setNotice(applied ? copy.otherTabApplied : copy.otherTabFailed);
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (activeImage && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [activeImage]);

  useEffect(() => {
    if (shareUrl) {
      shareInput.current?.focus();
      shareInput.current?.select();
    }
  }, [shareUrl]);

  useEffect(() => {
    function followHash() {
      const target = resolveRewardAnchor(window.location.hash);
      setAnchor(target);
      if (!target) return;
      setCategory("all");
      setQuery("");
      setFilter("all");
    }
    followHash();
    window.addEventListener("hashchange", followHash);
    return () => window.removeEventListener("hashchange", followHash);
  }, []);

  useEffect(() => {
    if (!anchor) return;
    const panel = groupPanels.current.get(anchor.groupId);
    if (!panel) return;
    panel.open = true;
    const frame = window.requestAnimationFrame(() => document.getElementById(anchor.targetId)?.scrollIntoView({ block: "start" }));
    return () => window.cancelAnimationFrame(frame);
  }, [anchor]);

  function setVisibleGroupsOpen(open: boolean) {
    for (const panel of groupPanels.current.values()) panel.open = open;
  }

  function save(next: Progress) {
    if (!loaded) return;
    const updated = { ...next, savedAt: new Date().toISOString() };
    progressRef.current = updated;
    setProgress(updated);
    if (blocked.current) return;
    if (!storage.current || !writeStoredProgress(storage.current, updated)) {
      blocked.current = true;
      setStorageState("unavailable");
    }
  }

  function resetProgress() {
    if (!loaded || !window.confirm(copy.resetConfirm)) return;
    blocked.current = false;
    try { storage.current = window.localStorage; } catch { storage.current = null; }
    setStorageState("ready");
    setApparelDraft("0");
    setApparelError("");
    save(createEmptyProgress());
    setShareMessage("");
    setNotice(copy.resetNotice);
  }

  async function sharePage() {
    const url = `${window.location.origin}${getEventPath(language)}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareUrl("");
      setShareMessage(copy.shareCopied);
    } catch {
      setShareUrl(url);
      setShareMessage(copy.shareManual);
    }
  }

  function commitApparel() {
    const value = Number(apparelDraft);
    if (apparelDraft.trim() === "" || !Number.isInteger(value) || value < 0 || value > 43) {
      setApparelError(copy.apparelError);
      setApparelDraft(String(progressRef.current.apparelCount));
      return;
    }
    setApparelError("");
    setApparelDraft(String(value));
    if (value !== progressRef.current.apparelCount) save(setApparelCount(progressRef.current, value));
  }

  const summary = summarizeProgress(progress);
  const checked = new Set(progress.checkedIds);
  const search = query.normalize("NFKC").trim().toLocaleLowerCase("ko-KR");
  const visibleGroups = groups.filter(group => category === "all" || group.category === category).map(group => ({
    ...group,
    entries: group.entries.map(entry => {
      const haystack = getRewardSearchText(entry.id).normalize("NFKC").toLocaleLowerCase("ko-KR");
      const matches = !search || haystack.includes(search);
      return { ...entry, visibleChecks: matches ? entry.checks.filter(check => filter === "all" || (filter === "checked" ? checked.has(check.id) : !checked.has(check.id))) : [], showApparel: Boolean(entry.apparel && matches && filter === "all") };
    }).filter(entry => entry.visibleChecks.length > 0 || entry.showApparel),
  })).filter(group => group.entries.length > 0);
  const visibleCount = visibleGroups.reduce((total, group) => total + group.entries.reduce((sum, entry) => sum + entry.visibleChecks.length, 0), 0);
  const visibleGroupIds = visibleGroups.map(group => group.id).join(",");
  const stats = [
    { key: "reward" as const, ...copy.stats.reward },
    { key: "bounty" as const, ...copy.stats.bounty },
    { key: "apparel" as const, ...copy.stats.apparel },
    { key: "owned" as const, ...copy.stats.owned },
  ];

  useEffect(() => {
    if (category !== "all" || search || filter !== "all") setVisibleGroupsOpen(true);
  }, [category, search, filter, visibleGroupIds]);

  return <>
    <section className={styles.stats} aria-label={copy.statsLabel}>
      {stats.map(({ key, title, note }) => <div className={styles.stat} key={key}>
        <span>{title}</span>
        <strong>{loaded ? summary[key].current : "—"}<small> / {summary[key].total}</small></strong>
        <progress value={loaded ? summary[key].current : 0} max={summary[key].total} aria-label={copy.progressLabel(title)} />
        <p>{note}</p>
      </div>)}
    </section>

    <div className={styles.workspace}>
      <aside className={styles.sidebar}>
        <p className={styles.navTitle}>{copy.browseRewards}</p>
        <nav className={styles.categories} aria-label={copy.categoriesLabel}>
          {categories.map(item => <button type="button" key={item.id} aria-pressed={category === item.id} aria-controls="reward-results" onClick={() => setCategory(item.id)}>
            <span>{item.title}</span><small>{records.filter(record => item.id === "all" || record.category === item.id).length}</small>
          </button>)}
        </nav>
        <p className={styles.sidebarNote}>{copy.sidebarNote}</p>
      </aside>

      <div className={styles.resultsArea}>
        <div className={styles.toolbar}>
          <label className={styles.search}><span>{copy.searchLabel}</span><input type="search" value={query} onChange={change => setQuery(change.target.value)} placeholder={copy.searchPlaceholder} /></label>
          <label className={styles.statusFilter}><span>{copy.filterLabel}</span><select value={filter} disabled={!loaded} onChange={change => setFilter(change.target.value)}><option value="all">{copy.filterAll}</option><option value="unchecked">{copy.filterUnchecked}</option><option value="checked">{copy.filterChecked}</option></select></label>
        </div>
        <div className={styles.saveLine}>
          <span aria-live="polite">{copy.visibleCount(visibleCount)}</span>
          <span role="status">{!loaded ? copy.loading : storageState !== "ready" ? copy.savingStopped : progress.savedAt ? copy.saved : copy.savePrompt}</span>
        </div>
        {storageState !== "ready" && <p className={styles.warning} role="alert">{copy.storageMessages[storageState]}</p>}
        <noscript><p className={styles.warning}>{copy.noScript}</p></noscript>

        <div className={styles.accordionTools}>
          <p id="reward-accordion-help">{copy.accordionHelp}</p>
          <div><button type="button" className={styles.utilityButton} disabled={visibleGroups.length === 0} aria-controls="reward-results" onClick={() => setVisibleGroupsOpen(true)}>{copy.expandAll}</button><button type="button" className={styles.utilityButton} disabled={visibleGroups.length === 0} aria-controls="reward-results" onClick={() => setVisibleGroupsOpen(false)}>{copy.collapseAll}</button></div>
        </div>
        <div id="reward-results" className={styles.groupList} aria-describedby="reward-accordion-help">
          {visibleGroups.map(group => {
            const groupRecords = records.filter(record => record.groupId === group.id);
            const status = periodStatus(today, group.id === "twitch" ? event.dropsStartsOn : event.startsOn, group.id === "twitch" ? event.dropsEndsOn : event.endsOn, language);
            // Fragment navigation can open native details before React hydrates.
            return <details key={group.id} id={`group-${group.id}`} suppressHydrationWarning className={styles.rewardGroup} aria-labelledby={`title-${group.id}`} ref={panel => { if (panel) groupPanels.current.set(group.id, panel); else groupPanels.current.delete(group.id); }}>
              <summary className={styles.groupHeading}><h2 id={`title-${group.id}`}><span className={styles.groupTitle}>{group.title}</span><span className={styles.groupCount}>{copy.groupCount(loaded ? groupRecords.filter(record => checked.has(record.id)).length : "—", groupRecords.length)}</span><span className={styles.groupCaret} aria-hidden="true">⌄</span></h2></summary>
              <div className={styles.groupContent}>
              <a className={styles.groupLink} href={`#group-${group.id}`}>{copy.groupLink}</a>
              {group.id === "twitch" && <span className={`${styles.periodBadge} ${styles[status.tone]}`}>Twitch · {status.label}</span>}
              <p className={styles.groupDescription}>{group.description}</p>
              <div className={styles.cards}>
                {group.entries.map(entry => <article className={styles.card} id={`reward-${entry.id}`} key={entry.id}>
                  <h3><a href={`#reward-${entry.id}`}>{entry.title}</a></h3>
                  {entry.tag && <span className={styles.itemTag}>{entry.tag}</span>}
                  {entry.detail && <p className={styles.detail}>{entry.detail}</p>}
                  {entry.notice && <aside className={styles.rewardNotice} aria-labelledby={`notice-${entry.id}`}>
                    <h4 id={`notice-${entry.id}`}>{entry.notice.title}</h4>
                    <p className={styles.noticePeriod}><strong>{entry.notice.period.title}</strong><span><time dateTime={entry.notice.period.startsOn}>{entry.notice.period.startsOn}</time> — <time dateTime={entry.notice.period.endsOn}>{entry.notice.period.endsOn}</time></span></p>
                    {entry.notice.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                    <p className={styles.noticeDates}>{copy.noticeDates(entry.notice.publishedOn, entry.notice.checkedOn)}</p>
                    <div className={styles.noticeLinks}>{entry.notice.links.map(link => <a href={link.href} target="_blank" rel="noopener noreferrer" key={link.href}>{link.label} ↗</a>)}</div>
                  </aside>}
                  {entry.showApparel && <div className={styles.apparel}>
                    <label htmlFor="apparel-count">{copy.apparelLabel}</label>
                    <div><input id="apparel-count" type="number" min="0" max="43" step="1" inputMode="numeric" value={apparelDraft} disabled={!loaded} aria-describedby={apparelError ? "apparel-error" : undefined} aria-invalid={Boolean(apparelError)} onChange={change => { setApparelDraft(change.target.value); setApparelError(""); }} onBlur={commitApparel} onKeyDown={key => { if (key.key === "Enter") key.currentTarget.blur(); }} /><span>{copy.apparelUnit}</span></div>
                    {apparelError && <p id="apparel-error" role="alert">{apparelError}</p>}
                  </div>}
                  <div className={styles.checks}>
                    {entry.visibleChecks.map(check => {
                      const image = images[check.id];
                      const done = checked.has(check.id);
                      return <div key={check.id} className={`${styles.checkBlock} ${image ? styles.withImage : ""}`}>
                        <label className={`${styles.check} ${done ? styles.checked : ""}`}><input id={check.id} type="checkbox" checked={done} disabled={!loaded} aria-label={copy.checkLabel(group.title, entry.title, check.label)} onChange={change => save(toggleCheck(progressRef.current, check.id, change.target.checked))} /><span>{check.label}<small aria-hidden="true">{done ? check.type === "bounty" ? copy.completed : check.type === "owned" ? copy.owned : copy.received : copy.unchecked}</small></span></label>
                        {image && <button className={styles.imageButton} type="button" aria-label={copy.imageLabel(image.title)} aria-haspopup="dialog" aria-controls="reward-image-dialog" onClick={click => { imageTrigger.current = click.currentTarget; setActiveImage(image); }}><Image src={image.src} alt="" width={image.width} height={image.height} unoptimized className={styles.thumbnail} /><span aria-hidden="true">{copy.enlarge}</span></button>}
                      </div>;
                    })}
                  </div>
                </article>)}
              </div>
              </div>
            </details>;
          })}
          {visibleGroups.length === 0 && <div className={styles.empty}><h2>{copy.emptyTitle}</h2><p>{copy.emptyHelp}</p><button type="button" className={styles.utilityButton} onClick={() => { setQuery(""); setCategory("all"); setFilter("all"); }}>{copy.showAll}</button></div>}
        </div>
      </div>
    </div>

    <div className={styles.recordActions}>
      <div><strong>{copy.privacyTitle}</strong><p>{copy.privacyHelp}</p></div>
      <button type="button" className={styles.utilityButton} disabled={!loaded} onClick={resetProgress}>{copy.resetButton}</button>
      <button type="button" className={styles.utilityButton} onClick={sharePage}>{copy.shareButton}</button>
    </div>
    <p className={styles.actionNotice} role="status">{shareMessage || notice}</p>
    {shareUrl && <label className={styles.shareFallback}>{copy.shareLabel}<input ref={shareInput} value={shareUrl} readOnly onFocus={focus => focus.currentTarget.select()} /></label>}

    <dialog id="reward-image-dialog" ref={dialog} className={styles.dialog} aria-labelledby="reward-image-title" onClose={() => { setActiveImage(null); imageTrigger.current?.focus(); }} onClick={click => { if (click.target !== click.currentTarget) return; const rect = click.currentTarget.getBoundingClientRect(); if (click.clientX < rect.left || click.clientX > rect.right || click.clientY < rect.top || click.clientY > rect.bottom) click.currentTarget.close(); }}>
      <div className={styles.dialogHeading}><h2 id="reward-image-title">{activeImage?.title ?? copy.dialogTitle}</h2><button type="button" className={styles.utilityButton} onClick={() => dialog.current?.close()}>{copy.close}</button></div>
      {activeImage && <><Image src={activeImage.src} alt={activeImage.title} width={activeImage.width} height={activeImage.height} unoptimized className={styles.expandedImage} /><p>{activeImage.evidence ?? copy.imageEvidence}</p>{activeImage.source && <a href={activeImage.source} target="_blank" rel="noopener noreferrer">{copy.officialDetails}</a>}</>}
    </dialog>
  </>;
}
