/* The kitchen-ritual tabs enhance the static content; no framework is needed. */
(() => {
  const tabs = [...document.querySelectorAll('[data-process-tab]')];
  const panel = document.querySelector('#process-panel');
  if (!tabs.length || !panel) return;
  const photo = panel.querySelector('img');
  const title = document.querySelector('#process-panel-title');
  const description = document.querySelector('#process-panel-description');
  const count = document.querySelector('#process-step-count');
  const stages = {
    ready: {image:'preparation',alt:'A bright, organised kitchen workspace ready for preparation',title:'Set the stage',description:'An organised space creates room for a better rhythm. The little things are considered before the first ingredient reaches the board.'},
    prepare: {image:'kitchen',alt:'Hands carefully chopping fresh herbs and vegetables',title:'Prepare with purpose',description:'Wash, chop, measure, and consider. Careful preparation gives each ingredient a clear role and leaves room for a calmer, more thoughtful way to cook.'},
    combine: {image:'ritual',alt:'People working together at a stove while preparing a meal',title:'Bring it together',description:'Taste, adjust, and find the balance. Texture, warmth, seasoning, and a final detail turn individual ingredients into a dish that feels complete.'},
    welcome: {image:'table',alt:'A welcoming table set with glasses, flowers and place settings',title:'Make it welcoming',description:'The journey does not end at the kitchen door. A considered setting and a thoughtful welcome make room for the experience around the meal.'}
  };
  let selection = 0;
  const cache = new Map();
  function loadPhoto(stage) {
    if (cache.has(stage.image)) return cache.get(stage.image);
    const image = new Image();
    const ready = new Promise((resolve, reject) => {
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = `assets/about/${stage.image}.jpg`;
    });
    cache.set(stage.image, ready);
    return ready;
  }
  async function selectTab(tab) {
    const request = ++selection;
    const stage = stages[tab.dataset.processTab];
    panel.setAttribute('aria-busy','true');
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected',String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    try {
      await loadPhoto(stage);
      if (request !== selection) return;
      photo.src = `assets/about/${stage.image}.jpg`;
      photo.alt = stage.alt;
      title.textContent = stage.title;
      description.textContent = stage.description;
      count.textContent = `${String(tabs.indexOf(tab)+1).padStart(2,'0')} / 04`;
      panel.setAttribute('aria-labelledby',tab.id);
      if (typeof animateElement === 'function') animateElement(panel,'panel-in');
    } catch {
      if (request !== selection) return;
      const previousTab = tabs.find(item => item.id === panel.getAttribute('aria-labelledby')) || tabs[0];
      tabs.forEach(item => {
        item.setAttribute('aria-selected',String(item === previousTab));
        item.tabIndex = item === previousTab ? 0 : -1;
      });
      if (typeof notify === 'function') notify('This photo could not load. Please try the step again.');
      cache.delete(stage.image);
    } finally {
      if (request === selection) panel.setAttribute('aria-busy','false');
    }
  }
  tabs.forEach((tab,index) => {
    tab.addEventListener('click',() => selectTab(tab));
    tab.addEventListener('keydown',event => {
      if (!['ArrowDown','ArrowUp','ArrowRight','ArrowLeft','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length-1 :
        (index + (['ArrowDown','ArrowRight'].includes(event.key) ? 1 : -1) + tabs.length) % tabs.length;
      tabs[next].focus();
      selectTab(tabs[next]);
    });
  });
})();
