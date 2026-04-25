import { Helmet } from 'react-helmet-async';

const SEO = ({
  title,
  description,
  keywords,
  canonical,
  image = "/logo.jpeg",
  author = " Baba Chhotu Nath Sarkar Sewa Samiti",
  publishDate,
  modifiedDate,
  article = false
}) => {
  const siteName = " Baba Chhotu Nath Temple | श्री बाबा छोटू नाथ मंदिर";
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://babachhotunath.com';

  // ✅ SOCIAL MEDIA LINKS (as provided)
  const socialLinks = {
    youtube: "https://www.youtube.com/@Babachotunathsarkar",
    instagram: "https://www.instagram.com/baba_chhotu_nath_sarkar_samiti/",
    facebook: "https://www.facebook.com/profile.php?id=61574480576744"
  };

  // ✅ HIGH SEARCH VOLUME KEYWORDS
  const highVolumeKeywords = [
    "बाबा छोटू नाथ मंदिर", "छोटू नाथ सरकार", "बाबा छोटू नाथ भिवानी",
    "Baba Chhotu Nath Temple", "Chhotu Nath Temple Bhiwani", "Baba Chhotu Nath Darbar",
    "बाबा छोटू नाथ आरती", "Chhotu Nath Mandir Badesra", "Sunday Darbar Token Booking",
    "बाबा छोटू नाथ भजन", "Baba Chhotu Nath History", "Chhotu Nath Mandir Timings",
    "Baba Chhotu Nath Live Darshan", "छोटू नाथ मंदिर भिवानी", "Baba Chhotu Nath Ki Mahima"
  ];

  const defaultDescription = "श्री बाबा छोटू नाथ सरकार सेवा समिति, बादेसरा (भिवानी) का आधिकारिक वेबसाइट। Sunday Darbar टोकन बुकिंग, Online दर्शन, आरती समय, भजन, कीर्तन। हमारा उद्देश्य भक्ति मार्ग को पुष्ट करना और लोगों को भ्रम, ढोंग, पाखंड से बचाना है। सनातन के बारे में अधिक जानकारी। 🙏";

  const finalTitle = title ? `${title} | ${siteName}` : siteName;
  const finalDescription = description || defaultDescription;
  const finalKeywords = keywords ? `${keywords}, ${highVolumeKeywords.join(', ')}` : highVolumeKeywords.join(', ');

  // Absolute image URL
  const absoluteImage = image.startsWith('http')
    ? image
    : (typeof window !== 'undefined'
      ? `${window.location.origin}${image.startsWith('/') ? '' : '/'}${image}`
      : `${siteUrl}${image.startsWith('/') ? '' : '/'}${image}`);

  // ✅ MAIN STRUCTURED DATA WITH ALL SOCIAL MEDIA
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HinduTemple",
    "name": siteName,
    "description": finalDescription,
    "url": canonical || (typeof window !== 'undefined' ? window.location.href : siteUrl),
    "image": absoluteImage,
    "author": {
      "@type": "Organization",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.jpeg`
      },
      "sameAs": [
        socialLinks.youtube,
        socialLinks.instagram,
        socialLinks.facebook
      ]
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Badesra",
      "addressRegion": "Bhiwani",
      "addressCountry": "India",
      "postalCode": "127021"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "28.7667",
      "longitude": "76.1333"
    },
    "openingHours": "Su-Mo-Tu-We-Th-Fr-Sa 06:00-20:00",
    "sameAs": [
      socialLinks.youtube,
      socialLinks.instagram,
      socialLinks.facebook
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
      <meta name="googlebot" content="index, follow" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonical || (typeof window !== 'undefined' ? window.location.href : siteUrl)} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={canonical || (typeof window !== 'undefined' ? window.location.href : siteUrl)} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:image:alt" content="Shri Baba Chhotu Nath Temple Darshan" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={absoluteImage} />

      {/* ✅ SOCIAL MEDIA VERIFICATION & LINKS FOR SEO */}
      {/* YouTube */}
      <link rel="me" href={socialLinks.youtube} title="YouTube" />
      <meta property="og:video" content={socialLinks.youtube} />

      {/* Instagram */}
      <link rel="me" href={socialLinks.instagram} title="Instagram" />
      <meta property="og:instagram" content={socialLinks.instagram} />

      {/* Facebook */}
      <link rel="me" href={socialLinks.facebook} title="Facebook" />
      <meta property="og:facebook" content={socialLinks.facebook} />
      <meta property="fb:profile_id" content="61574480576744" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* ✅ SOCIAL MEDIA SPECIFIC SCHEMA */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": siteName,
          "url": siteUrl,
          "logo": `${siteUrl}/logo.jpeg`,
          "sameAs": [
            socialLinks.youtube,
            socialLinks.instagram,
            socialLinks.facebook
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO;