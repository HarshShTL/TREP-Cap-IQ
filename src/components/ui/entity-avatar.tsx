"use client";

import { cn } from "@/lib/utils";

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-purple-500",
  "bg-rose-500",
  "bg-teal-500",
  "bg-indigo-500",
  "bg-orange-500",
] as const;

const SIZE_CLASSES = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-lg",
} as const;

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash += name.charCodeAt(i);
  }
  return hash;
}

function getInitials(name: string, type: "contact" | "entity" = "entity"): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (type === "contact" && parts.length >= 2) {
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  return parts[0].charAt(0).toUpperCase();
}

interface EntityAvatarProps {
  name: string;
  type?: "contact" | "entity";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function EntityAvatar({
  name,
  type = "entity",
  size = "md",
  className,
}: EntityAvatarProps) {
  const color = AVATAR_COLORS[hashName(name) % AVATAR_COLORS.length];
  const initials = getInitials(name, type);

  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        color,
        SIZE_CLASSES[size],
        className,
      )}
      title={name}
    >
      {initials}
    </div>
  );
}
