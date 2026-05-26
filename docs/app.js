async function loadData() {
  const res = await fetch('assets/data/site_data.json');
  return res.json();
}

function metricCard(label, value) {
  return `<div class="card"><div class="label">${label}</div><div class="value">${value}</div></div>`;
}

function buildCards(d) {
  const c = document.getElementById('metricCards');
  c.innerHTML = [
    metricCard('RGB AP50-95 (Ours)', d.rgb_overall.ap50_95.toFixed(3)),
    metricCard('RGB AP50 (Ours)', d.rgb_overall.ap50.toFixed(3)),
    metricCard('Thermal AP50-95 (Ours)', d.thermal_overall.ap50_95.toFixed(3)),
    metricCard('Thermal AP50 (Ours)', d.thermal_overall.ap50.toFixed(3))
  ].join('');
}

function buildCharts(d) {
  const labels = Object.keys(d.classes);
  const ours95 = labels.map(k => d.classes[k].ours_ap5095 ?? 0);
  const cmp95 = labels.map(k => d.classes[k].comp_ap5095 ?? 0);
  const ours50 = labels.map(k => d.classes[k].ours_ap50 ?? 0);
  const cmp50 = labels.map(k => d.classes[k].comp_ap50 ?? 0);

  new Chart(document.getElementById('chartAp95'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Ours', data: ours95, backgroundColor: '#0f766e' },
        { label: 'Best External Comparator', data: cmp95, backgroundColor: '#9a3412' }
      ]
    },
    options: { responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true, max: 1 } } }
  });

  new Chart(document.getElementById('chartAp50'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Ours', data: ours50, backgroundColor: '#0369a1' },
        { label: 'Best External Comparator', data: cmp50, backgroundColor: '#be123c' }
      ]
    },
    options: { responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true, max: 1 } } }
  });
}


function buildModelMap(d){
  const root=document.getElementById('modelMap');
  const rows=Object.entries(d.classes).map(([k,v])=>`<tr><td>${k}</td><td>${v.ours_name||'Ours'}</td><td>${v.comparator_name||v.comparator||'-'}</td></tr>`).join('');
  root.innerHTML=`<table style="width:100%;border-collapse:collapse"><thead><tr><th style="text-align:left;border-bottom:1px solid #ddd">Class</th><th style="text-align:left;border-bottom:1px solid #ddd">Ours</th><th style="text-align:left;border-bottom:1px solid #ddd">Comparator</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function buildRGBGalleries(d) {
  const root = document.getElementById('rgbGalleries');
  const blocks = [];
  for (const [cls, info] of Object.entries(d.classes)) {
    const imgs = info.compare_images || info.advantage_images || [];
    if (!imgs.length) continue;
    blocks.push(`
      <div class="gallery-wrap">
        <h3>${cls.toUpperCase()} | Ours vs ${info.comparator}</h3>
        <div class="gallery">${imgs.map(i => `<img src="${i}" alt="${cls} advantage">`).join('')}</div>
      </div>
    `);
  }
  root.innerHTML = blocks.join('');
}


function buildThermalSmall(d){
  const root=document.getElementById('thermalSmallGallery');
  if(!root) return;
  root.innerHTML=(d.thermal_small_showcase||[]).map(x=>`<img src="${x.image}" alt="thermal small showcase">`).join('');
}

function buildThermal(d) {
  const root = document.getElementById('thermalGallery');
  root.innerHTML = (d.thermal_showcase || []).map(x => `<img src="${x.image}" alt="thermal showcase">`).join('');
}

loadData().then(d => {
  buildCards(d);
  buildCharts(d);
  buildModelMap(d);
  buildRGBGalleries(d);
  buildThermalSmall(d);
  buildThermal(d);
});
