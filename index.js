const fs = require('fs');
const path = require('path');
const baseDir = __dirname;
const srcPath = path.join(baseDir, 'index1.js');
const cssPath = path.join(baseDir, 'figma.css');
const htmlPath = path.join(baseDir, 'figma.html');
try {
    const raw = fs.readFileSync(srcPath, 'utf-8');
  
    const json = JSON.parse(raw);
    let html = json.absoluteHtml;
  
    const styleMatch = html.match(/<style[\s\S]*?<\/style>/i);
    if (styleMatch) {
        const styleBlock = styleMatch[0];
        const cssContent = styleBlock.replace(/<style[\s\S]*?>|<\/style>/gi, '').trim();
        fs.writeFileSync(cssPath, cssContent, 'utf-8');
        html = html.replace(styleBlock, ''); 
    }
   
    const finalHtml = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Figma Export</title>\n  <link rel=\"stylesheet\" href=\"figma.css\">\n</head>\n<body style=\"margin:0;\">\n${html}\n</body>\n</html>`;
    fs.writeFileSync(htmlPath, finalHtml, 'utf-8');
    console.log('✔ Extraction complete! Files generated:\n -', path.basename(htmlPath), '\n -', path.basename(cssPath));
} catch (err) {
    console.error('Extraction failed:', err.message);
    process.exit(1);
}
