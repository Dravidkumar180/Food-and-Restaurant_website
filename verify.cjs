const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const code = fs.readFileSync('dist/app.js', 'utf8');
for (const page of ['index', 'menu', 'about', 'offers', 'gallery', 'contact']) {
  const nodes = new Map();
  const node = key => {
    if (!nodes.has(key)) nodes.set(key, {innerHTML:'', value:'', style:{}, dataset:{}, addEventListener(){}, close(){}, classList:{toggle(){}}});
    return nodes.get(key);
  };
  const context = {location:{pathname:`/${page}.html`}, document:{querySelector:node,querySelectorAll:()=>[],addEventListener(){}}, localStorage:{getItem:()=>null}, window:{}, setTimeout, clearTimeout, console};
  vm.runInNewContext(code, context);
  const html = node('#app').innerHTML;
  assert(html.length > 1000, `${page}: page renders`);
  assert(!html.includes('undefined'), `${page}: no undefined content`);
  assert.equal((node('#header').innerHTML.match(/aria-current="page"/g)||[]).length,1,`${page}: active navigation`);
  for (const href of [...(html+node('#header').innerHTML+node('#footer').innerHTML).matchAll(/href="([a-z]+\.html)"/g)]) assert(fs.existsSync(`dist/${href[1]}`),`${page}: ${href[1]} exists`);
  console.log(`${page}: rendering and navigation passed`);
}
Promise.all(['index.html','menu.html','about.html','offers.html','gallery.html','contact.html','style.css','app.js'].map(async file=>{const res=await fetch(`http://127.0.0.1:4173/${file}`);assert.equal(res.status,200);assert((await res.text()).length>100);return file})).then(files=>console.log(`HTTP checks passed: ${files.length} files`)).catch(err=>{console.error(err);process.exitCode=1});
