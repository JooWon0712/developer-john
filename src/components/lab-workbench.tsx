import { brand } from "@/data/brand";

export function LabWorkbench() {
  return <div className="workbench" aria-hidden="true">
    <div className="workbench-top"><span><i /> THE WORKBENCH</span><span>VOL. 001</span></div>
    <div className="workbench-diagram">
      <div className="diagram-grid" />
      <svg className="diagram-lines" viewBox="0 0 420 280" fill="none"><circle cx="210" cy="127" r="95" stroke="currentColor" strokeDasharray="3 7" /><path d="M210 45v170M115 127h190M145 194l130-134" stroke="currentColor" /></svg>
      <span className="diagram-label label-idea">01 / IDEA</span>
      <div className="diagram-core">{brand.monogram}<span>.</span><small>DEV</small></div>
      <span className="diagram-node node-code">&lt;/&gt;</span>
      <span className="diagram-node node-spark">✳</span>
      <span className="diagram-label label-share">BUILD → SHARE</span>
      <span className="diagram-coordinate">A SPACE FOR SMALL IDEAS</span>
    </div>
    <div className="workbench-bottom"><span>작은 실험을 쌓아가는 중</span><span className="workbench-version">v0.1</span></div>
  </div>;
}
