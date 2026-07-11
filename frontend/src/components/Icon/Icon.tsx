import { IconName } from '@/config/icons';

interface IconProps {
  name: IconName | string;
  size?: number;
  className?: string;
  color?: string;
}

// 内联 SVG 路径 — 简洁线性风格，统一 24x24 viewBox
const PATHS: Record<string, string> = {
  book: 'M4 6h16v12H4z M4 6a2 2 0 0 1 2-2h8l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z M8 10h8 M8 14h6',
  robot: 'M12 2a2 2 0 0 1 2 2v1h4v14H6V5h4V4a2 2 0 0 1 2-2z M9 10v1 M15 10v1 M10 15h4',
  user: 'M12 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2',
  chart: 'M3 3v18h18 M7 16l4-8 4 4 4-6',
  wrong: 'M4 4h16v16H4z M8 3v2 M16 3v2 M3 8h18 M10 12l4 4 M14 12l-4 4',
  success: 'M5 13l4 4L19 7',
  error: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M15 9l-6 6 M9 9l6 6',
  brain: 'M12 2a3 3 0 0 0-3 3v1c-2 0-3.5 1.5-3.5 3.5S7 13 9 13h1c.5 0 1-.2 1-.5V12c0-1.1.9-2 2-2s2 .9 2 2v.5c0 .3.5.5 1 .5h1c2 0 3.5-1.5 3.5-3.5S17 6 15 6V5a3 3 0 0 0-3-3z M9 13v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5',
  search: 'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35',
  mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
  message: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  translate: 'M5 8h6m-3 0v8m-4-4h8 M14 12l1.5-4 1.5 4m-1-1h2 M14 16c1.5 1.5 4 2 5 0',
  trophy: 'M6 9H3V7a2 2 0 0 1 2-2h1 M18 9h3V7a2 2 0 0 0-2-2h-1 M12 13a4 4 0 0 0 4-4V3H8v6a4 4 0 0 0 4 4z M8 21h8 M12 17v4',
  clock: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 6v6l4 2',
  close: 'M6 6l12 12 M18 6L6 18',
  arrow: 'M5 12h14 M12 5l7 7-7 7',
  warning: 'M12 2L2 22h20L12 2z M12 9v5 M12 17v1',
};

export default function Icon({ name, size = 20, className = '', color }: IconProps) {
  const path = PATHS[name];

  if (!path) {
    return (
      <span
        className={className}
        style={{ width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      >
        ?
      </span>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || 'currentColor'}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flexShrink: 0 }}
    >
      <path d={path} />
    </svg>
  );
}
