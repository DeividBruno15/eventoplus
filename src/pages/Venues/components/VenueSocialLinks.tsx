
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface VenueSocialLinksProps {
  socialLinks?: Array<{
    type: string;
    url: string;
  }> | null;
  externalLink?: string | null;
}

export const VenueSocialLinks = ({ 
  socialLinks,
  externalLink
}: VenueSocialLinksProps) => {
  // If there are no social links and no external link, don't render anything
  if ((!socialLinks || socialLinks.length === 0) && !externalLink) {
    return null;
  }
  
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Links</h2>
      
      <Card className="p-6">
        <div className="space-y-3">
          {externalLink && (
            <div>
              <a
                href={externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Site oficial</span>
              </a>
            </div>
          )}
          
          {socialLinks?.map((link, index) => (
            <div key={index}>
              <a
                href={link.type === 'instagram' && !link.url.startsWith('http') 
                  ? `https://instagram.com/${link.url.replace('@', '')}` 
                  : link.url
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary hover:underline"
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  {link.type === 'instagram' ? 'IG' :
                   link.type === 'facebook' ? 'FB' :
                   link.type === 'twitter' ? 'X' : '🔗'}
                </span>
                <span>
                  {link.type === 'instagram' ? 'Instagram' :
                   link.type === 'facebook' ? 'Facebook' :
                   link.type === 'twitter' ? 'Twitter/X' :
                   'Link'}
                </span>
              </a>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
