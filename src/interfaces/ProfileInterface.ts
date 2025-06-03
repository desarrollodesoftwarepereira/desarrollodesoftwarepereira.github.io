interface SocialLinks {
  email?: string;
  phone: string;
  whatsappNumber: string;
  websiteUrl?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  maps?: string;
}

export interface Profile {
  name: string;
  description?: string;
  socialLinks: SocialLinks;
}