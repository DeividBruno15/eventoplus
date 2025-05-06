
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { getSocialMediaIcon, getSocialMediaColor } from '../utils/socialMediaIcons';
import { Link } from "lucide-react";
import { cn } from "@/lib/utils";

interface SocialLink {
  type: string;
  url: string;
}

interface VenueSocialLinksProps {
  socialLinks: SocialLink[] | null;
  externalLink?: string | null;
}

export const VenueSocialLinks = ({ socialLinks, externalLink }: VenueSocialLinksProps) => {
  // Combine social links with external link if provided
  const allLinks = [...(socialLinks || [])];
  
  if (externalLink && !allLinks.some(link => link.url === externalLink)) {
    allLinks.push({
      type: 'external',
      url: externalLink
    });
  }
  
  if (allLinks.length === 0) return null;
  
  return (
    <>
      <Separator />
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Links</h2>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {allLinks.map((link, index) => {
            const icon = getSocialMediaIcon(link.type);
            if (!icon) return null;
            
            const colorClass = getSocialMediaColor(link.type);
            
            // Extrair nome de domínio para mostrar
            let displayText = link.url
              .replace(/^https?:\/\//i, '')
              .replace(/^www\./i, '')
              .split('/')[0];
              
            return (
              <a
                key={index}
                href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 group"
              >
                <span className={cn(
                  "p-2 rounded-full text-white flex items-center justify-center transition-transform group-hover:scale-110",
                  colorClass
                )}>
                  {icon}
                </span>
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                  {displayText}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
};
