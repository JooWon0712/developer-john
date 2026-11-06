import Image, { type ImageProps } from "next/image";
import styles from "./themed-image.module.css";

type ThemedImageProps = Omit<ImageProps, "src" | "alt"> & {
  lightSrc: string;
  darkSrc: string;
  lightAlt: string;
  darkAlt: string;
};

// CSS follows the already-resolved root theme, including time and saved device preference.
export function ThemedImage({ lightSrc, darkSrc, lightAlt, darkAlt, className = "", ...props }: ThemedImageProps) {
  return <>
    <Image {...props} src={lightSrc} alt={lightAlt} className={`${className} ${styles.image} ${styles.light}`} />
    <Image {...props} src={darkSrc} alt={darkAlt} className={`${className} ${styles.image} ${styles.dark}`} />
  </>;
}
