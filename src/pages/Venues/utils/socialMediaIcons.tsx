
import { Instagram, Facebook, Twitter } from "lucide-react";
import React from "react";

export const getSocialMediaIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'instagram':
      return <Instagram className="h-5 w-5" />;
    case 'facebook':
      return <Facebook className="h-5 w-5" />;
    case 'twitter':
      return <Twitter className="h-5 w-5" />;
    default:
      return null;
  }
};
