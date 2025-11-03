import {
  EnvelopeSimpleIcon,
  GithubLogoIcon,
  XLogoIcon,
} from "@phosphor-icons/react";

type SocialLink = {
  label: string;
  href: string;
  icon: typeof GithubLogoIcon;
  copy?: string;
};

export const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/0xpolarzero",
    icon: GithubLogoIcon,
  },
  {
    label: "Twitter",
    href: "https://x.com/0xpolarzero",
    icon: XLogoIcon,
  },
  {
    label: "Email",
    href: "mailto:contact@polarzero.xyz",
    icon: EnvelopeSimpleIcon,
    copy: "contact@polarzero.xyz",
  },
] as const satisfies SocialLink[];
