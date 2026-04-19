import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  FaExpandAlt,
  FaEye,
  FaForward,
  FaPause,
  FaPlay,
  FaRandom,
  FaStepBackward,
  FaStepForward,
  FaUndo,
  FaInfoCircle,
  FaBroadcastTower,
  FaTwitter,
  FaCoffee,
  FaGlobeAmericas,
  FaShareAlt,
  FaStar,
  FaRegStar,
} from 'react-icons/fa';
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import lofi from '../images/lofi.png';
import wow from '../images/wow.png';
import lotr from '../images/lotr.png';
import zelda from '../images/zelda.png';
import harryPotter from '../images/harryPotter.png';
import animalCrossing from '../images/animalCrossing.png';
import bg3  from '../images/bauldersGate3.png';
import minecraft from '../images/minecraft.png';
import expedition33 from '../images/expedition33.png';
import { IconBaseProps } from 'react-icons';

/**
 * Central icon renderer for the app.
 *
 * We support 3 “icon sources”, all represented as a single string id that we persist in Firestore:
 *
 * 1) **Built-in vector icons** (FontAwesome via `react-icons/fa`) referenced by short ids like `play`.
 * 2) **Bundled image icons** (PNG files in `src/images/`) referenced by ids like `wow`.
 * 3) **Icon-pack exports** from `react-icons` referenced by the exported component name like:
 *    - `GiCampfire` (Game Icons)
 *    - `FaBeer` (Font Awesome)
 *    - `MdAlarm` (Material Design)
 *
 * Why this file exists:
 * - Most of the app wants a tiny, stable set of icons (fast, tree-shaken).
 * - The Admin page also wants a huge picker list (thousands of `Gi*` icons).
 * - Importing all of `react-icons/gi` up-front would bloat the main bundle.
 *
 * Solution:
 * - Keep a curated set in `IconMap` + `ImgMap`.
 * - Lazy-load large icon-pack modules only when a `Gi*`/`Fa*`/`Md*` icon is actually rendered.
 *
 * Note: we do statically import **one** GI icon (`GiPerspectiveDiceSixFacesRandom`) for the built-in
 * `random` action. That can trigger “mixed dynamic/static import” warnings during build, but it keeps
 * the common path small while still enabling the Admin GI picker.
 */


// https://react-icons.github.io/react-icons/icons?name=fa
/** Curated, app-owned set of vector icons (small + tree-shaken). */
const IconMap = {
  play: FaPlay,
  pause: FaPause,
  skip: FaStepForward,
  back: FaStepBackward,
  restart: FaUndo,
  shuffle: FaRandom,
  fullscreen: FaExpandAlt,
  eye: FaEye,
  fastForward: FaForward,
  info: FaInfoCircle,
  live: FaBroadcastTower,
  twitter: FaTwitter,
  coffee: FaCoffee,
  world: FaGlobeAmericas,
  share: FaShareAlt,
  favoriteOn: FaStar,
  favoriteOff: FaRegStar,
  random: GiPerspectiveDiceSixFacesRandom
};

/** Curated, app-owned set of bundled image icons. */
const ImgMap = {
  wow,
  lofi,
  lotr,
  zelda,
  harryPotter,
  animalCrossing,
  bg3,
  minecraft,
  expedition33
};

const color = 'white';
const size = 30;

const CustomImg = styled.img`
  /* width: ${size}px; */
  height: ${size}px;
`;

/** Keys for the curated vector icon set (`IconMap`). */
export type IconName = keyof typeof IconMap;
/** Keys for the curated bundled image set (`ImgMap`). */
export type ImgName = keyof typeof ImgMap;
/** Union of all curated (non-pack) icon ids we support. */
type KnownIconName = IconName | ImgName;

/**
 * Image icon ids that are bundled with the app.
 * Used by the Admin UI to show a small dropdown with previews.
 */
export const IMG_ICON_NAMES: readonly ImgName[] = Object.freeze(
  (Object.keys(ImgMap) as ImgName[]).sort(),
);

/**
 * String id for any Game Icon.
 *
 * These ids correspond to the `react-icons/gi` named exports, e.g. `GiCampfire`.
 * We intentionally keep this type broad (`Gi${string}`) and validate at runtime.
 */
export type GiIconName = `Gi${string}`;

/** `react-icons/fa` export name, e.g. `FaBeer`. */
export type FaIconName = `Fa${string}`;

/** `react-icons/md` export name, e.g. `MdAlarm`. */
export type MdIconName = `Md${string}`;

/**
 * The full set of icon ids we accept throughout the app.
 *
 * This is what ends up stored in Firestore as `category.icon`.
 */
export type IconId = IconName | ImgName | GiIconName | FaIconName | MdIconName;

export interface IconProps {
  /** Icon id from `IconId`. */
  icon: IconId;
}

function hasOwn(obj: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/** True if the id is one of our curated icon ids (vector or bundled image). */
function isKnownIconName(value: string): value is KnownIconName {
  return hasOwn(IconMap, value) || hasOwn(ImgMap, value);
}

/**
 * True if the id looks like a Game Icon export name.
 *
 * This is a cheap check; the real validation happens when we look up the export
 * in the lazily-loaded GI module.
 */
export function isGiIconName(value: string): value is GiIconName {
  return value.startsWith('Gi') && value.length > 2;
}

function isFaIconName(value: string): value is FaIconName {
  return value.startsWith('Fa') && value.length > 2;
}

function isMdIconName(value: string): value is MdIconName {
  return value.startsWith('Md') && value.length > 2;
}

/**
 * Best-effort conversion from persisted string to an icon id we can render.
 * Returns `undefined` for unknown/unsupported values.
 */
export function toIconId(value: string | undefined | null): IconId | undefined {
  if (!value) return undefined;
  if (isKnownIconName(value)) return value;
  if (isGiIconName(value)) return value;
  if (isFaIconName(value)) return value;
  if (isMdIconName(value)) return value;
  return undefined;
}

function isImgType(name: KnownIconName): name is ImgName {
  return hasOwn(ImgMap, name);
}

type ReactIconModule = Record<string, unknown>;
type ReactIconPack = 'gi' | 'fa' | 'md';

const reactIconModules: Partial<Record<ReactIconPack, ReactIconModule>> = {};
const reactIconModulePromises: Partial<Record<ReactIconPack, Promise<ReactIconModule>>> = {};

function getReactIconPack(icon: string): ReactIconPack | undefined {
  if (isGiIconName(icon)) return 'gi';
  if (isFaIconName(icon)) return 'fa';
  if (isMdIconName(icon)) return 'md';
  return undefined;
}

/**
 * Lazy-loads the appropriate `react-icons/<pack>` module.
 *
 * We cache both the in-flight Promise and the resolved module so multiple Icon
 * instances don’t trigger multiple imports.
 */
async function loadReactIconModule(pack: ReactIconPack): Promise<ReactIconModule> {
  const cached = reactIconModules[pack];
  if (cached) return cached;

  if (!reactIconModulePromises[pack]) {
    reactIconModulePromises[pack] = (
      pack === 'gi'
        ? (import('react-icons/gi') as unknown as Promise<ReactIconModule>)
        : pack === 'fa'
          ? (import('react-icons/fa') as unknown as Promise<ReactIconModule>)
          : (import('react-icons/md') as unknown as Promise<ReactIconModule>)
    );
  }

  const mod = await reactIconModulePromises[pack]!;
  reactIconModules[pack] = mod;
  return mod;
}

/**
 * React hook that resolves a `Gi*`/`Fa*`/`Md*` icon id into the corresponding component.
 *
 * For non-pack ids it returns `null` immediately.
 */
function useReactIconComponent(icon: IconId): React.ComponentType<IconBaseProps> | null {
  const [resolved, setResolved] = useState<React.ComponentType<IconBaseProps> | null>(null);

  useEffect(() => {
    const pack = getReactIconPack(icon);
    if (!pack) {
      setResolved(null);
      return;
    }

    let cancelled = false;
    loadReactIconModule(pack)
      .then((mod) => {
        if (cancelled) return;
        const candidate = mod[icon];
        const Comp = typeof candidate === 'function'
          ? (candidate as React.ComponentType<IconBaseProps>)
          : null;
        setResolved(() => Comp);
      })
      .catch(() => {
        if (cancelled) return;
        setResolved(null);
      });

    return () => {
      cancelled = true;
    };
  }, [icon]);

  return resolved;
}

/**
 * Renders an icon by id.
 *
 * Rendering order:
 * - bundled image icons (`ImgMap`)
 * - curated vector icons (`IconMap`)
 * - Pack icons (`Gi*`/`Fa*`/`Md*`, lazy-loaded)
 */
export const Icon: React.FC<IconProps> = ({ icon }) => {
  const packComponent = useReactIconComponent(icon);

  if (isKnownIconName(icon) && isImgType(icon)) {
    const imgSrc = ImgMap[icon];
    return <CustomImg src={imgSrc} alt={icon} />;
  }

  if (isKnownIconName(icon)) {
    const KnownIconComponent = (IconMap as Record<string, React.ComponentType<IconBaseProps> | undefined>)[icon];
    if (!KnownIconComponent) return null;
    return <KnownIconComponent color={color} size={size} />;
  }

  if (isGiIconName(icon) || isFaIconName(icon) || isMdIconName(icon)) {
    if (!packComponent) return null;
    const Component = packComponent;
    return <Component color={color} size={size} />;
  }

  return null;
};
