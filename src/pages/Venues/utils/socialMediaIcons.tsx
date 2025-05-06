
import { Instagram, Facebook, Twitter, Globe, Linkedin, Youtube } from "lucide-react";
import React from "react";

export const getSocialMediaIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'instagram':
      return <Instagram className="h-5 w-5" />;
    case 'facebook':
      return <Facebook className="h-5 w-5" />;
    case 'twitter':
    case 'x':
      return <Twitter className="h-5 w-5" />;
    case 'linkedin':
      return <Linkedin className="h-5 w-5" />;
    case 'youtube':
      return <Youtube className="h-5 w-5" />;
    case 'tiktok':
      return (
        <svg 
          viewBox="0 0 24 24" 
          className="h-5 w-5"
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
          <path d="M16 8v8" />
          <path d="M12 16v-8" />
          <path d="M20 12V8h-8" />
          <path d="M16 4c0 1-1 2-3 2s-3-1-3-2" />
        </svg>
      );
    case 'external':
    default:
      return <Globe className="h-5 w-5" />;
  }
};

export const detectSocialMediaType = (url: string): string => {
  if (!url) return 'external';
  
  const domain = url.toLowerCase();
  
  if (domain.includes('instagram.com')) return 'instagram';
  if (domain.includes('facebook.com') || domain.includes('fb.com')) return 'facebook';
  if (domain.includes('twitter.com') || domain.includes('x.com')) return 'twitter';
  if (domain.includes('linkedin.com')) return 'linkedin';
  if (domain.includes('youtube.com') || domain.includes('youtu.be')) return 'youtube';
  if (domain.includes('tiktok.com')) return 'tiktok';
  
  return 'external';
};

export const getSocialMediaColor = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'instagram':
      return 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500';
    case 'facebook':
      return 'bg-blue-600';
    case 'twitter':
    case 'x':
      return 'bg-black';
    case 'linkedin':
      return 'bg-blue-700';
    case 'youtube':
      return 'bg-red-600';
    case 'tiktok':
      return 'bg-black';
    case 'external':
    default:
      return 'bg-gray-700';
  }
};
