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

// Timeline slider logic for accessibility, keyboard, and touch support
document.addEventListener('DOMContentLoaded', function () {
  // Timeline slider
  const slider = document.querySelector('.timeline-slider');
  if (slider) {
    const items = slider.querySelectorAll('.timeline-item');
    const prevBtn = slider.querySelector('.timeline-nav.prev');
    const nextBtn = slider.querySelector('.timeline-nav.next');
    let current = 0;

    function updateSlider(idx) {
      items.forEach((item, i) => {
        item.classList.toggle('active', i === idx);
        if (i === idx) item.setAttribute('tabindex', '0');
        else item.setAttribute('tabindex', '-1');
      });
      // Progress bar (optional)
      const progress = document.querySelector('.timeline-progress');
      if (progress) {
        progress.style.width = `${((idx + 1) / items.length) * 100}%`;
      }
    }

    function goto(idx) {
      current = (idx + items.length) % items.length;
      updateSlider(current);
      items[current].focus();
      items[current].scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }

    prevBtn && prevBtn.addEventListener('click', () => goto(current - 1));
    nextBtn && nextBtn.addEventListener('click', () => goto(current + 1));

    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') goto(current - 1);
      if (e.key === 'ArrowRight') goto(current + 1);
    });

    // Touch support
    let startX = null;
    slider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });
    slider.addEventListener('touchend', (e) => {
      if (startX !== null) {
        const dx = e.changedTouches[0].clientX - startX;
        if (dx > 40) goto(current - 1);
        if (dx < -40) goto(current + 1);
        startX = null;
      }
    });

    updateSlider(current);
  }
});
