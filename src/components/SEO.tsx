
import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
}

export const SEO = ({
  title,
  description = 'Plataforma para conectar prestadores de serviço e contratantes.',
  keywords = 'serviços, eventos, prestadores, contratação',
  ogImage = '/og-image.jpg',
  ogUrl,
}: SEOProps) => {
  const siteTitle = title ? `${title} | Nome do Site` : 'Nome do Site';
  
  useEffect(() => {
    // Atualiza o título da página
    document.title = siteTitle;
    
    // Atualiza meta tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }
    
    // Atualiza meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = keywords;
      document.head.appendChild(meta);
    }
    
    // Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', siteTitle);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:title');
      meta.content = siteTitle;
      document.head.appendChild(meta);
    }
    
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', description);
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:description');
      meta.content = description;
      document.head.appendChild(meta);
    }
    
    if (ogImage) {
      const ogImg = document.querySelector('meta[property="og:image"]');
      const fullImageUrl = ogImage.startsWith('http') ? ogImage : `${window.location.origin}${ogImage}`;
      
      if (ogImg) {
        ogImg.setAttribute('content', fullImageUrl);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'og:image');
        meta.content = fullImageUrl;
        document.head.appendChild(meta);
      }
    }
    
    if (ogUrl) {
      const ogUrlTag = document.querySelector('meta[property="og:url"]');
      
      if (ogUrlTag) {
        ogUrlTag.setAttribute('content', ogUrl);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'og:url');
        meta.content = ogUrl;
        document.head.appendChild(meta);
      }
    }
  }, [siteTitle, description, keywords, ogImage, ogUrl]);
  
  return null;
};
