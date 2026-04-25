// Create a separate sitemap.js file in public folder
// Or use this as a serverless function

export const sitemap = () => {
  const baseUrl = 'https://babachhotunathsarkar.vercel.app';
  const pages = ['/', '/about', '/darshan', '/events', '/gallery', '/videos', '/donations', '/darbar-booking', '/contact'];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  pages.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${page}</loc>\n`;
    xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  return xml;
};