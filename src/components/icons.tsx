import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function ArrowRight(props: IconProps) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}><path d="M4 12h16M13 5l7 7-7 7" /></svg>;
}

function OutlineIcon({ children, ...props }: IconProps) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>{children}</svg>;
}

export function Sun(props: IconProps) {
  return <OutlineIcon {...props}><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></OutlineIcon>;
}

export function Moon(props: IconProps) {
  return <OutlineIcon {...props}><path d="M20.6 14A8.7 8.7 0 0 1 10 3.4 8.8 8.8 0 1 0 20.6 14Z" /></OutlineIcon>;
}

export function Clock(props: IconProps) {
  return <OutlineIcon {...props}><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.5 2" /></OutlineIcon>;
}

export function Monitor(props: IconProps) {
  return <OutlineIcon {...props}><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8m-4-4v4" /></OutlineIcon>;
}

export function Check(props: IconProps) {
  return <OutlineIcon {...props}><path d="m5 12 4 4L19 6" /></OutlineIcon>;
}
