const CONFIG = {
  email: 'tuemail@dominio.com',
  whatsapp: '346XXXXXXXX',
  instagram: 'https://www.instagram.com/mfournier1414/',
  excel: 'obras.xlsx'
};

const SERIES = {
  Habitats: { folder: 'Habitats', label: 'Habitats' },
  Baloons: { folder: 'Baloons', label: 'Baloons' },
  BrokenFrame: { folder: 'BrokenFrame', label: 'BrokenFrame' },
  Other: { folder: 'Other', label: 'OtherWorks' }
};

function normalizeSerie(value) {
  const raw = String(value || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '');
  if (raw === 'habitats' || raw === 'habitat') return 'Habitats';
  if (raw === 'baloons' || raw === 'balloons' || raw === 'baloon') return 'Baloons';
  if (raw === 'brokenframe' || raw === 'brokenframes') return 'BrokenFrame';
  if (raw === 'other' || raw === 'otherworks' || raw === 'otros') return 'Other';
  return value;
}

function getValue(obj, names) {
  for (const name of names) {
    if (obj[name] !== undefined && obj[name] !== null && String(obj[name]).trim() !== '') return obj[name];
  }
  return '';
}

function escapeHtml(value) {
  return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function buildPurchaseText(obra) {
  const title = obra.titulo || obra.imagen;
  return `Hola Manuel,\n\nEstoy interesado/a en esta obra:\n\nTitulo: ${title}\nSerie: ${obra.serie}\nImagen: ${obra.imagen}\nDimensiones: ${obra.dimensiones}\nTecnica: ${obra.tecnica}\nPrecio: ${obra.precio}\n\nPodrias facilitarme mas informacion?\n\nGracias.`;
}

function makeCard(obra) {
  const folder = SERIES[obra.serie]?.folder || obra.serie;
  const imgPath = `${folder}/${obra.imagen}`;
  const title = obra.titulo || obra.imagen;
  const whatsappText = encodeURIComponent(buildPurchaseText(obra));
  const emailSubject = encodeURIComponent(`Solicitud de compra - ${title}`);
  const emailBody = encodeURIComponent(buildPurchaseText(obra));
  const whatsappHref = `https://wa.me/${CONFIG.whatsapp}?text=${whatsappText}`;
  const emailHref = `mailto:${CONFIG.email}?subject=${emailSubject}&body=${emailBody}`;

  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <figure class="work-media">
      <img class="work-image" src="${escapeHtml(imgPath)}" alt="${escapeHtml(title)}" loading="lazy">
    </figure>
    <div class="card-body">
      <h3>${escapeHtml(title)}</h3>
      <p class="meta">${escapeHtml(obra.dimensiones)}</p>
      <p class="meta">${escapeHtml(obra.tecnica)}</p>
      <p class="price">${escapeHtml(obra.precio)}</p>
      <div class="acciones-compra">
        <a class="btn-whatsapp" href="${whatsappHref}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
        <a class="btn-email" href="${emailHref}">Email</a>
      </div>
    </div>`;
  return card;
}

function renderWorks(works) {
  document.querySelectorAll('[data-series]').forEach(grid => {
    const serie = grid.dataset.series;
    grid.innerHTML = '';
    const filtered = works.filter(work => work.serie === serie);
    if (!filtered.length) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = `No hay obras cargadas todavia para ${SERIES[serie]?.label || serie}.`;
      grid.appendChild(empty);
      return;
    }
    filtered.forEach(obra => grid.appendChild(makeCard(obra)));
  });
}

async function loadExcel() {
  const response = await fetch(CONFIG.excel);
  if (!response.ok) throw new Error('No se ha podido leer obras.xlsx');
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
  return rows.map(row => {
    const imagen = String(getValue(row, ['Imagen', 'imagen', 'IMAGEN'])).trim();
    const serie = normalizeSerie(getValue(row, ['Serie', 'serie', 'SERIE']));
    return {
      imagen,
      serie,
      titulo: String(getValue(row, ['Titulo', 'Título', 'titulo', 'TITULO']) || imagen).trim(),
      dimensiones: String(getValue(row, ['Dimensiones', 'dimensiones', 'DIMENSIONES']) || '').trim(),
      tecnica: String(getValue(row, ['Tecnica', 'Técnica', 'tecnica', 'TECNICA']) || '').trim(),
      precio: String(getValue(row, ['Precio', 'precio', 'PRECIO']) || 'Consultar').trim()
    };
  }).filter(work => work.imagen && SERIES[work.serie]);
}

window.addEventListener('DOMContentLoaded', async () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  const emailLink = document.getElementById('emailLink');
  if (emailLink) emailLink.href = `mailto:${CONFIG.email}`;
  const instagramLink = document.getElementById('instagramLink');
  if (instagramLink) instagramLink.href = CONFIG.instagram;
  try {
    const works = await loadExcel();
    renderWorks(works);
  } catch (error) {
    console.error(error);
    renderWorks([]);
    alert('No se ha podido cargar obras.xlsx. Revisa que este junto a index.html y que las columnas se llamen Imagen, Serie, Titulo, Dimensiones, Tecnica y Precio.');
  }
});
