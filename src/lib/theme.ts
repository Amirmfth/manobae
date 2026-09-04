export type ThemeName = "night" | "rose" | "shared";
export type IdentityId = "amir" | "partner";

export const identityThemes: Record<IdentityId, ThemeName> = {
  amir: "night",
  partner: "rose",
};

export function themeForIdentity(identity: IdentityId | null): ThemeName {
  return identity ? identityThemes[identity] : "shared";
}
