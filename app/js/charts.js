/* Inline artwork and charts for the household book. */
const KCharts = (() => {
  const colors = Object.freeze({
    Groceries: '#66877c', 'Dining out': '#ba6147', Rent: '#344f60',
    Utilities: '#be923c', Transport: '#7894a2', Health: '#92859d',
    Leisure: '#a57c63', Shopping: '#c49d84', Education: '#747d51', Other: '#aaa59a'
  });
  const ink = '#383730';
  const muted = '#665f55';
  const grid = '#d9d1c3';
  const incomeColor = '#53766c';
  const expenseColor = '#c2503b';
  const yen = value => '¥' + Math.round(value).toLocaleString('en-US');
  const percentLabel = value => Number(value.toFixed(1)).toLocaleString('en-US') + '%';
  const esc = value => String(value).replace(/[&<>"']/g, ch =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
  const number = value => Number.isFinite(value) ? value : 0;
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function pine(x, y, size, flip = 1) {
    return `<g transform="translate(${x} ${y}) scale(${size * flip} ${size})" fill="#253e48">
      <path d="M-2 1c3-8 1-12 4-18 2-5 3-8 2-13l1-2c2 8-1 14-2 18 0 7-1 11-1 15z"/>
      <path d="M2-14c-3-3-5-5-10-6l1-1c5 1 9 3 10 5zM4-22c3-3 6-5 10-5v1c-3 0-6 2-10 6z"/>
      <path d="M-14-20l3-2 1-2 3 1 2-3 3 2 3 1 2 3-5 1-6-1zM5-26l3-2 2-3 2 1 2-3 3 2 2 2 2 1-6 2-5-1zM-3-31l2-2 2-1 2-3 2 1 2-2 2 2 3 1 1 2-7 1-4 1z"/>
    </g>`;
  }

  function landscape() {
    return `<svg class="k-landscape" viewBox="0 0 316 132" aria-hidden="true" focusable="false" style="display:block;width:100%;height:auto">
      <defs>
        <path id="fuji-face" d="M45 92c16-8 34-15 48-23 18-10 35-26 51-43l9-11 5-1 5 2 5-1 9 10c15 16 31 30 47 41 15 10 32 18 51 25z"/>
        <clipPath id="fuji-cut"><use href="#fuji-face"/></clipPath>
        <pattern id="fuji-wood" width="7" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(51)">
          <path d="M0 0v3m3 1v2" stroke="#faf6ef" opacity=".26" stroke-width=".65"/>
        </pattern>
      </defs>
      <g stroke-linecap="round" stroke-linejoin="round">
        <circle cx="222.5" cy="28" r="18.6" fill="#ca9141"/>
        <g fill="none" stroke="#d8c8a8" stroke-width="1.3">
          <path d="M44 30h31c9 0 8-4 18-4h18m-55 8h40m-68 5h38M234 43h27c8 0 7-3 14-3h10m-40 7h39"/>
        </g>
        <path d="M13 89l18-5 16-7 13-2 16-8 11-5 7 1 10-4 24 10 20 9 17 1 15 8z" fill="#a2ad9c"/>
        <path d="M174 83l11-6 16-4 21-13 14-4 9-4 13 4 14 11 16 4 16 10 8 2-23 9z" fill="#a0ada0"/>
        <use href="#fuji-face" fill="#c96045"/>
        <g clip-path="url(#fuji-cut)">
          <path d="M162 14l1 13 7 7 6 11 12 21 2 10-9 13 103 7-57-41z" fill="#ac493b"/>
          <path d="M153 13l5 2-9 15-8 8 3-9-12 13 8-14z" fill="#f8eed6"/>
          <path d="M156 13l14-1 18 25-10-9 3 8-12-12 5 13-8-9-3-5-4 5 2-8-10 10 6-11-10 9z" fill="#f6ead1"/>
          <path d="M91 75l35-28 16-15-20 23-18 14zm17 1l34-34-18 23zm23-9l25-36-18 32zm19 4l11-32-5 24z" fill="#d9815c"/>
          <path d="M155 30l-6 11m18-12l7 13m-35 7l-13 15m50-21l8 14m14-1l18 13" fill="none" stroke="#8f4839" stroke-width=".85" opacity=".8"/>
          <path d="M37 0h247v98H37z" fill="url(#fuji-wood)"/>
        </g>
        <path d="M4 88l15-1 17-4 14-1 16-7 13-2 16-8 9 1 12-3 13 3 18 7 15 2 19 8 16 3 16 4 25 6-190 2z" fill="#819789"/>
        <path d="M87 87l18-4 15-1 20-7 13-1 22-8 9 1 12-4 21 5 12 4 15 3 12 4 26 3 19 7 10 2-67 12z" fill="#566e72"/>
        <path d="M99 90l24-5 16-2 21-7 14-2m18-7l11 2 13 5 14 3m25 5l15 2" stroke="#849894" fill="none" stroke-width="1.1"/>
        <path d="M12 95l16-2 10 1 21-3 11 1 16-3 9 1 13-2 15 3 18-1 16 3 27 1 15 2 24 2 19 4-38 4-137-1z" fill="#c2ae76"/>
        <path d="M27 97l20-2m11 1l25-2m-45 6l24-1m25-3l15-1m16-2l16 1" fill="none" stroke="#e1d2a7" stroke-width="1.4"/>
        <path d="M10 104l24-2 41-1 25-4 33-1 22-3 22-1 12-4 18-1 8-2 14 1 21-2 23 2 19 4 17 1-15 3-26 1-13 3-29 2-28 4-37 4-45 4-31 1-27 2-20-1-24 1-14-2 30-3 19 1 30-2 21-3 28-3-36 2-26 1-25 3-30 1-26 2 17-4 31-3-18 1z" fill="#d8c496"/>
        <path d="M46 104l31-2m40-2l29-2m-11 9l25-3m12-6l29-3m-5 8l14-2m10-8l16-1" fill="none" stroke="#faf3df" stroke-width="1.6"/>
        <path d="M9 94l13-4 10 1 9-4 10-2 15 1 12-3 11 3 13 2 14 4 18 1 17 4-21-1-15 2-18-3-16 1-14-2-23 1-17-1z" fill="#405a5b"/>
        <path d="M13 91l20-2 12-5 13 1 10-3 10 2 8-2 12 4 14 2-9 1-14-3-6 1-10-2-10 2-15-1-11 4z" fill="#60786d"/>
        <path d="M113 118l18-3 22-4 13-4 13-1 18-5 12-2 17-7 13-1 21-7 12 1 13-2 12 3 12 1-6 4-15 3-7 3-16 2-20 5-17 2-22 4-17 1-17 3-27 2-11 3z" fill="#344f58"/>
        <path d="M121 121l24-3 16 1 17-4 18-1 18-4 23-2 19-5 17-2 14-4m-109 14l15-3 14-2 16-5" fill="none" stroke="#738b82" stroke-width="1.2"/>
        ${pine(240, 92, .84)}
        ${pine(257, 89, .58, -1)}
        ${pine(222, 99, .39, -1)}
        <path d="M24 116l21-1m7 4l31-3m1 5l16-2m83-2l15-3m20-1l16-2" fill="none" stroke="#bba77c" stroke-width="1.2"/>
      </g>
    </svg>`;
  }

  function scale(low, high, minStep) {
    const ideal = Math.max(minStep, (high - low) / 4);
    const magnitude = 10 ** Math.floor(Math.log10(ideal));
    const factor = [1, 2, 2.5, 5, 10].find(f => f * magnitude >= ideal);
    const step = (factor || 10) * magnitude;
    const bottom = Math.floor(low / step) * step;
    const top = Math.max(bottom + step, Math.ceil(high / step) * step);
    const ticks = Array.from({ length: 1 + Math.round((top - bottom) / step) }, (_, i) => bottom + step * i);
    return { bottom, top, ticks };
  }

  function compactYen(value) {
    const units = [[1e12, 'T'], [1e9, 'B'], [1e6, 'M'], [1e3, 'k']];
    const unit = units.find(([size]) => value >= size);
    return unit ? '¥' + +(value / unit[0]).toFixed(2) + unit[1] : yen(value);
  }

  function graph(series, isTrend) {
    const left = 59, right = 448, top = isTrend ? 22 : 42, bottom = 174;
    const values = series.flatMap(row => isTrend ? [number(row.savingsRate)] : [row.income, row.expenses]);
    const range = scale(Math.min(0, ...values), Math.max(isTrend ? 1 : 4, ...values), 1);
    const y = value => bottom - (bottom - top) * (value - range.bottom) / (range.top - range.bottom);
    const group = (right - left) / Math.max(1, series.length);
    const x = index => left + (index + .5) * group;
    const chartLabel = isTrend ? 'Monthly savings rate' : 'Monthly income and expenses in yen';
    const axes = range.ticks.map(value => `<g>
      <line x1="${left}" y1="${y(value)}" x2="${right}" y2="${y(value)}" stroke="${grid}" ${value === 0 ? '' : 'stroke-dasharray="3 4"'}/>
      <text x="${left - 9}" y="${y(value) + 4}" text-anchor="end">${isTrend ? new Intl.NumberFormat('en-US', {notation: 'compact'}).format(value) + '%' : compactYen(value)}</text>
    </g>`).join('');
    const labels = series.map((row, i) => `<text x="${x(i)}" y="196" text-anchor="middle">${monthLabels[Number(row.month.slice(5)) - 1]}</text>`).join('');
    const desc = series.map(row => isTrend ? row.month + ', ' + percentLabel(number(row.savingsRate)) :
      row.month + ', income ' + yen(row.income) + ', expenses ' + yen(row.expenses)).join('. ');
    let marks;
    if (isTrend) {
      const coords = series.map((row, i) => [x(i), y(number(row.savingsRate))]);
      const path = coords.map(([cx, cy], i) => (i ? 'L' : 'M') + cx + ' ' + cy).join(' ');
      const area = coords.length ? `${path} L${coords[coords.length - 1][0]} ${y(0)} L${coords[0][0]} ${y(0)}Z` : '';
      marks = `<path d="${area}" fill="#e9dfc6" opacity=".65"/>
        <path d="${path}" fill="none" stroke="#997526" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
        ${coords.map(([cx, cy], i) => `<circle cx="${cx}" cy="${cy}" r="4" fill="#f9f4e8" stroke="#997526" stroke-width="2.5"><title>${esc(series[i].month)} · ${percentLabel(number(series[i].savingsRate))}</title></circle>`).join('')}`;
    } else {
      const width = Math.min(15, group * .25);
      const legend = `<g fill="${ink}" font-size="13"><rect x="${left}" y="3" width="10" height="10" rx="2" fill="${incomeColor}"/><text x="${left + 17}" y="12">Income</text>
        <rect x="${left + 94}" y="3" width="10" height="10" rx="2" fill="${expenseColor}"/><text x="${left + 111}" y="12">Expenses</text></g>`;
      marks = legend + series.map((row, i) => [['Income', row.income, incomeColor], ['Expenses', row.expenses, expenseColor]].map(([label, value, color], j) =>
        `<rect x="${x(i) + (j ? 2 : -width - 2)}" y="${y(value)}" width="${width}" height="${Math.max(0, bottom - y(value))}" fill="${color}" rx="2"><title>${esc(row.month)} · ${label} · ${yen(value)}</title></rect>`).join('')).join('');
    }
    return `<svg class="k-chart" viewBox="0 0 458 208" style="display:block;width:100%;height:auto" role="img" aria-label="${chartLabel}. ${esc(desc)}">
      <title>${chartLabel}</title><g fill="${muted}" font-family="system-ui,sans-serif" font-size="13">${axes}${labels}${marks}</g></svg>`;
  }

  function donut(categories) {
    const total = categories.reduce((sum, row) => sum + row.spent, 0);
    const ring = 77, circumference = 2 * Math.PI * ring;
    let distance = 0;
    const bands = categories.filter(row => row.spent > 0).map(row => {
      const share = row.spent / total;
      const length = circumference * share;
      const gap = share === 1 ? 0 : Math.min(2.2, length / 3);
      const label = row.name + ' · ' + yen(row.spent) + ' · ' + percentLabel(share * 100);
      const band = `<circle cx="102" cy="102" r="${ring}" fill="none" stroke="${colors[row.name] || colors.Other}" stroke-width="23"
        stroke-dasharray="${length - gap} ${circumference - length + gap}" stroke-dashoffset="${-distance}" transform="rotate(-90 102 102)"><title>${esc(label)}</title></circle>`;
      distance += length;
      return band;
    }).join('');
    const details = categories.filter(row => row.spent > 0).map(row => row.name + ' ' + yen(row.spent)).join(', ');
    const label = yen(total);
    return `<svg class="k-donut" viewBox="0 0 204 204" style="display:block;width:100%;max-width:235px;height:auto" role="img" aria-label="Spending by category, total ${label}. ${esc(details)}">
      <title>Spending by category</title><circle cx="102" cy="102" r="${ring}" fill="none" stroke="#eae3d7" stroke-width="23"/>${bands}
      <text x="102" y="103" text-anchor="middle" font-family="Georgia,serif" font-size="${Math.min(23, 175 / label.length)}" fill="${ink}">${label}</text>
      <text x="102" y="123" text-anchor="middle" fill="${muted}" font-size="11" font-family="system-ui,sans-serif">Total spent</text></svg>`;
  }

  const chartColor = color =>
    /^(#[a-f\d]{3,8}|[a-z]+|var\(--[a-z-]+\))$/i.test(color) ? color : incomeColor;

  function spark(values, color) {
    const points = values.map(number);
    const low = Math.min(...points), high = Math.max(...points);
    const path = points.length < 2 || low === high ? 'M2 13H68' :
      points.map((v, i) => (i === 0 ? 'M' : 'L') + (2 + i * 66 / (points.length - 1)).toFixed(1) +
        ' ' + (21 - (v - low) * 17 / (high - low)).toFixed(1)).join(' ');
    return `<svg class="k-spark" viewBox="0 0 70 24" width="70" height="24" aria-hidden="true" focusable="false" style="display:block">
      <path d="${path}" fill="none" stroke="${esc(chartColor(color))}" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
  }

  function progress(percent, color) {
    const value = Math.max(0, Math.min(100, percent));
    const label = Number.isFinite(percent) ? percentLabel(percent) + ' used' : 'Spending exceeds the budget';
    return `<svg class="k-progress" viewBox="0 0 100 6" preserveAspectRatio="none" width="100%" height="6" role="img" aria-label="${label}" style="display:block;overflow:hidden;border-radius:8px">
      <rect width="100" height="6" fill="#e8e1d5"/><rect width="${Number.isNaN(value) ? 0 : value}" height="6" fill="${esc(chartColor(color))}"/></svg>`;
  }

  return Object.freeze({ colors, landscape, barChart: series => graph(series, false),
    donut, trend: series => graph(series, true), progress, spark });
})();
