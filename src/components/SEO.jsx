import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description = "Official website of Shri Baba Chhotu Nath Sarkar Sewa Samiti, Badesra (Bhiwani). Experience divine grace, view live updates, events, and Sunday Darbar token booking details.", 
  keywords, 
  canonical = window.location.href,
  image = "/logo.jpeg"
}) => {
  const siteName = "Shri Baba Chhotu Nath Temple";
  const defaultKeywords = "babachhotunathsarkar, babachhotunathsarkarsewasamiti, temple, hindu temple, bhiwani district temple, badesra temple, baba chhotunath temple, baba temple";
  
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const fullKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;
  
  // Ensure we use the absolute URL for images
  const absoluteImage = image.startsWith('http') ? image : `${window.location.origin}${image.startsWith('/') ? '' : '/'}${image}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={fullKeywords} />
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={absoluteImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />
    </Helmet>
  );
};

export default SEO;
