
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { getSocialMediaIcon } from '../utils/socialMediaIcons';

interface SocialLink {
  type: string;
  url: string;
}

interface VenueSocialLinksProps {
  socialLinks: SocialLink[] | null;
}

export const VenueSocialLinks = ({ socialLinks }: VenueSocialLinksProps) => {
  if (!socialLinks || socialLinks.length === 0) return null;
  
  return (
    <>
      <Separator />
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Redes sociais</h2>
        <div className="flex gap-4">
          {socialLinks.map((link, index) => {
            const icon = getSocialMediaIcon(link.type);
            if (!icon) return null;
            
            return (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full ${
                  link.type === 'instagram' 
                    ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500' 
                    : link.type === 'facebook'
                      ? 'bg-blue-600'
                      : 'bg-blue-400'
                } text-white`}
              >
                {icon}
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
};
