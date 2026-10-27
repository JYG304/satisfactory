const fs = require('fs');

// Read processor/index.html
const html = fs.readFileSync('processor/index.html', 'utf8');

// Inject error trapping script at the top of head
const trappedHtml = html.replace('<head>', `<head>
<script>
window.__errors = [];
window.onerror = function(msg, url, line, col, error) {
  window.__errors.push({msg, url, line, col, error: error ? error.stack : null});
  console.error("PAGE_ERROR:", msg, "at line", line, col);
};
</script>`);

fs.writeFileSync('scratch/trapped.html', trappedHtml);
console.log('Trapped HTML written.');
