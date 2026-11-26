(() => {
  'use strict';

  const main = document.getElementById('main');
  const navigation = document.getElementById('navigation');
  const dialog = document.getElementById('confirm-dialog');
  const yenFormat = new Intl.NumberFormat('en-US');
  const percentageFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });
  const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });
  const routes = {
    overview: ['Overview', 'Monthly overview', 'Your household finances at a glance.'],
    ledger: ['Ledger', 'Transaction ledger', 'A record of what came in and what went out.'],
    budgets: ['Budgets', 'Monthly budgets', 'Set a spending limit for each part of household life.'],
    insights: ['Insights', 'Spending insights', 'Reflect on your spending and savings over time.']
  };
  const paths = {
    overview: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    ledger: '<path d="M5 4h13a2 2 0 0 1 2 2v14H6a2 2 0 0 1-2-2V6a2 2 0 0 1 1-2Zm2 0v16m3-11h6m-6 4h6"/>',
    budgets: '<path d="M4 7V5a2 2 0 0 1 2-2h12v4M3 8h17v12H5a2 2 0 0 1-2-2Zm12 4h6v4h-6z"/>',
    insights: '<path d="M3 20h18M5 16v-5m6 5V5m6 11v-7"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-13 4h2m4 0h2"/>',
    left: '<path d="m14 6-6 6 6 6"/>', right: '<path d="m10 6 6 6-6 6"/>',
    arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>', plus: '<path d="M12 5v14M5 12h14"/>',
    income: '<path d="m6 6 11 11m0-9v9H8"/>', expense: '<path d="M6 18 18 6M8 6h10v10"/>',
    balance: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18m-6 5h3"/>',
    savings: '<path d="m4 16 6-6 4 3 7-8m-6 0h6v6"/>',
    bars: '<path d="M4 5v14m3-12h13M7 12h9m-9 5h5"/>',
    bell: '<path d="M18 9a6 6 0 0 0-12 0v5l-2 3h16l-2-3Zm-8 11h4"/>',
    basket: '<path d="m3 10 2 10h14l2-10H3Zm4 0 4-6m6 6-4-6M9 13l1 4m5-4-1 4"/>',
    dining: '<path d="M4 3v6q0 3 3 3t3-3V3M7 3v18m12-18c-3 2-4 6-4 10h4m0-10v18"/>',
    home: '<path d="m2.5 11 9.5-8 9.5 8M5 10v10h14V10m-10 10v-6h6v6"/>',
    utilities: '<path d="m14 2-9 12h6l-1 8 9-13h-6z"/>',
    train: '<rect x="5" y="3" width="14" height="15" rx="3"/><path d="M5 10h14M9 18l-3 4m9-4 3 4M8 14h1m6 0h1"/>',
    health: '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',
    leisure: '<path d="m3 8 17-4 2 9-17 4zM15 6l2 9m-9-3 3-.8"/>',
    shopping: '<path d="M5 7h14l1 14H4L5 7Zm4 2V6a3 3 0 0 1 6 0v3"/>',
    education: '<path d="M3 5c4-1 6 0 9 2 3-2 6-3 9-2v13c-3-1-6 0-9 2-3-2-5-3-9-2zM12 7v13"/>',
    other: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    cash: '<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M5 9h1m12 6h1"/>',
    trash: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
    reset: '<path d="M4 10a8 8 0 1 1 1 7M4 4v6h6"/>',
    pen: '<path d="m4 20 1-5L16 4a2 2 0 0 1 4 4L9 19l-5 1Zm10-14 4 4"/>'
  };
  const categoryIcons = {
    Groceries: 'basket', 'Dining out': 'dining', Rent: 'home', Utilities: 'utilities',
    Transport: 'train', Health: 'health', Leisure: 'leisure', Shopping: 'shopping', Education: 'education', Other: 'other'
  };
  const icon = (name, size = 18) => `<svg class="icon" aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
  const safe = value => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
  const yen = amount => (amount < 0 ? '−' : '') + '¥' + yenFormat.format(Math.abs(amount));
  const pct = value => percentageFormat.format(value) + '%';
  const monthDate = date => dateFormat.format(new Date(date + 'T12:00:00'));
  const link = (target, label) => `<a class="text-link" href="#/${target}">${label}${icon('arrow', 15)}</a>`;
  const color = name => KCharts.colors[name] || '#566f67';
  const dot = name => `<i class="dot" style="--dot:${color(name)}"></i>`;
  const catIcon = name => `<span class="category-icon" style="--category-color:${color(name)}">${icon(categoryIcons[name] || 'cash', 17)}</span>`;
  const sum = (rows, field) => rows.reduce((value, row) => value + row[field], 0);

  let month = KStore.currentMonth();
  let categoryFilter = '';
  let typeFilter = '';
  let allCategories = false;
  let pendingAction;
  let noticeTimeout;
  let focusEntry = false;

  function route() {
    const key = location.hash.replace(/^#\/?/, '').toLowerCase();
    return Object.hasOwn(routes, key) ? key : 'overview';
  }

  function notify(message) {
    const notice = document.getElementById('notice');
    clearTimeout(noticeTimeout);
    notice.textContent = message;
    notice.classList.add('visible');
    noticeTimeout = setTimeout(() => notice.classList.remove('visible'), 3200);
  }

  function pageHead(page) {
    return `<header class="page-head">
      <div class="heading-copy"><div class="eyebrow"><span lang="ja">家計簿</span><i></i>Household budget book</div>
      <h1>${routes[page][1]}</h1><p>${routes[page][2]}</p></div>
      <div class="woodcut" aria-hidden="true">${KCharts.landscape()}</div>
    </header>`;
  }

  function monthTools(page) {
    const transactionCount = KStore.transactions(month).length;
    const notes = {
      ledger: transactionCount + (transactionCount === 1 ? ' transaction' : ' transactions'),
      budgets: KData.categories.length + ' expense categories',
      insights: KStore.monthName(KStore.shiftMonth(month, -5), true) + ' – ' + KStore.monthName(month)
    };
    return `<div class="tools">
      <div class="month-switch" aria-label="Selected month">
        <button class="month-arrow" type="button" data-step="-1" aria-label="Previous month">${icon('left', 15)}</button>
        <span>${icon('calendar', 16)}<strong>${KStore.monthName(month)}</strong></span>
        <button class="month-arrow" type="button" data-step="1" aria-label="Next month">${icon('right', 15)}</button>
      </div>
      ${page === 'overview' ? `<button type="button" class="primary" data-new>${icon('plus', 16)} Add transaction</button>` :
        `<span class="tool-note">${icon(page === 'budgets' ? 'pen' : 'ledger', 15)}${notes[page]}</span>`}
    </div>`;
  }

  function metrics(totals, entries) {
    const incomes = entries.filter(row => row.type === 'income').length;
    const series = KStore.series(month);
    const metrics = [
      ['income', 'Income', 'income', yen(totals.income), `${incomes} income ${incomes === 1 ? 'entry' : 'entries'}`, '#688475'],
      ['expense', 'Expenses', 'expenses', yen(totals.expenses), `${entries.length - incomes} expense ${entries.length - incomes === 1 ? 'entry' : 'entries'}`, '#c76551'],
      ['balance', 'Balance', 'balance', yen(totals.balance), 'Income less expenses', '#c5d6ce'],
      ['savings', 'Savings rate', 'savingsRate', pct(totals.savingsRate), 'Of monthly income', '#aa883c']
    ];
    return `<section class="metrics" aria-label="Monthly summary">${metrics.map(([id, label, key, value, detail, ink]) =>
      `<article class="metric ${id}"><div class="metric-label"><span class="metric-icon">${icon(id, 16)}</span>${label}</div>
        <div class="metric-value">${value}</div><div class="metric-foot"><span>${detail}</span><span class="spark" title="Six-month ${label.toLowerCase()} trend">${KCharts.spark(series.map(row => row[key]), ink)}</span></div></article>`
    ).join('')}</section>`;
  }

  function spendingPanel(categories, total) {
    const sorted = [...categories].sort((a, b) => b.spent - a.spent);
    const visible = allCategories ? sorted : sorted.slice(0, 5);
    return `<section class="panel spending" aria-labelledby="spending-title">
      <div class="panel-head"><h2 id="spending-title">Spending by category</h2><span class="head-icon">${icon('bars', 19)}</span></div>
      <div class="bar-list">${visible.map(row => {
        const share = total ? row.spent / total * 100 : 0;
        return `<div class="bar-item"><div class="bar-key">${dot(row.name)}${row.name}</div>
          <div class="spend-track">${KCharts.progress(share, color(row.name))}</div>
          <strong>${yen(row.spent)}</strong><span class="share">${pct(share)}</span></div>`;
      }).join('')}</div>
      <div class="panel-foot"><span>${yen(total)} total spent</span>
        <button type="button" class="text-link" data-all aria-expanded="${allCategories}">${allCategories ? 'Show top categories' : 'All ' + categories.length + ' categories'} ${icon(allCategories ? 'left' : 'right', 14)}</button></div>
    </section>`;
  }

  function watchPanel(categories) {
    const alerts = categories.filter(row => row.remaining < 0 || row.percent >= 80)
      .sort((a, b) => (b.percent ?? Infinity) - (a.percent ?? Infinity));
    return `<section class="panel watch"><div class="panel-head"><h2>Budget watch</h2><span class="alert-count">${alerts.length} ${alerts.length === 1 ? 'alert' : 'alerts'}</span></div>
      <div class="watch-list">${alerts.length ? alerts.map(row => {
        const over = row.remaining < 0;
        return `<div class="watch-row ${over ? 'over' : 'near'}">${catIcon(row.name)}
          <div><strong>${row.name}</strong><small>${over ? yen(-row.remaining) + ' over budget' : row.remaining === 0 ? 'Budget fully used' : yen(row.remaining) + ' remaining'}</small></div>
          <span class="percent-tag">${row.percent === null ? 'Unbudgeted' : pct(row.percent)}</span></div>`;
      }).join('') : '<p class="empty">All categories are below 80% of their monthly budgets.</p>'}</div>
      <div class="panel-foot"><span>At least 80% used</span>${link('budgets', 'View budgets')}</div></section>`;
  }

  function transactionTable(rows, editable = false) {
    if (!rows.length) return '<p class="empty">No transactions match this view.</p>';
    return `<table class="transactions ${editable ? 'editable' : ''}"><thead><tr>
      <th scope="col">Date</th><th scope="col">Category</th><th scope="col">Memo</th><th scope="col" class="money">Amount</th>
      ${editable ? '<th scope="col" class="action-col"><span class="sr-only">Delete</span></th>' : ''}</tr></thead>
      <tbody>${rows.map(row => `<tr><td class="date-cell"><time datetime="${safe(row.date)}">${monthDate(row.date)}</time></td>
        <td class="cat-cell"><span>${dot(row.category)}${safe(row.category)}</span></td><td class="memo-cell">${safe(row.memo)}</td>
        <td class="money ${row.type === 'income' ? 'money-in' : 'money-out'}"><span class="sr-only">${safe(row.type)} </span>${row.type === 'income' ? '+' : '−'}${yen(row.amount)}</td>
        ${editable ? `<td class="action-col"><button type="button" data-delete="${safe(row.id)}" class="delete-button" aria-label="Delete ${safe(row.memo)}">${icon('trash', 15)}</button></td>` : ''}</tr>`).join('')}</tbody></table>`;
  }

  function overview() {
    const totals = KStore.totals(month);
    const entries = KStore.transactions(month);
    const categories = KStore.categories(month);
    return metrics(totals, entries) + `<div class="overview-grid">${spendingPanel(categories, totals.expenses)}${watchPanel(categories)}</div>
      <section class="panel recent"><div class="panel-head"><h2>Recent transactions</h2>${link('ledger', 'Open ledger')}</div>
        ${transactionTable(entries.slice(0, 8))}</section>`;
  }

  function options(choices, selected = '') {
    return choices.map(name => `<option value="${safe(name)}"${name === selected ? ' selected' : ''}>${safe(name)}</option>`).join('');
  }

  function entryForm() {
    const day = month === KStore.currentMonth() ? new Date().getDate() : 1;
    return `<section class="panel form-panel" id="new-entry"><div class="panel-head"><h2>Add transaction</h2>${icon('pen', 18)}</div>
      <form id="entry-form">
        <div class="field-pair"><label>Date<input type="date" name="date" min="0001-01-01" max="9999-12-31" value="${month}-${String(day).padStart(2, '0')}" required></label>
          <label>Type<select name="type"><option value="expense">Expense</option><option value="income">Income</option></select></label></div>
        <label>Category<select name="category">${options(KData.categories)}</select></label>
        <label>Amount <span class="currency-input"><b>¥</b><input type="number" inputmode="numeric" name="amount" min="1" step="1" max="999999999999" required></span></label>
        <label>Memo<input name="memo" type="text" maxlength="180" required></label>
        <p class="form-error" id="entry-error" role="alert" hidden></p>
        <button class="primary save-entry" type="submit">${icon('plus', 16)} Save transaction</button>
      </form></section>`;
  }

  function ledgerResults() {
    const rows = KStore.transactions(month).filter(row => (!categoryFilter || row.category === categoryFilter) && (!typeFilter || row.type === typeFilter));
    const total = rows.reduce((value, row) => value + (row.type === 'income' ? row.amount : -row.amount), 0);
    return `${transactionTable(rows, true)}<div class="running-total"><span>Running total <small>· ${rows.length} ${rows.length === 1 ? 'entry' : 'entries'}</small></span><strong>${yen(total)}</strong></div>`;
  }

  function ledger() {
    return `<div class="ledger-grid"><section class="panel ledger-panel"><div class="panel-head"><h2>Transactions</h2>${icon('ledger', 18)}</div>
      <div class="filters"><label>Category<select id="category-filter"><option value="">All categories</option>${options([...KData.categories, ...KData.incomeCategories], categoryFilter)}</select></label>
        <label>Type<select id="type-filter"><option value="">All types</option>
        <option value="income" ${typeFilter === 'income' ? 'selected' : ''}>Income</option><option value="expense" ${typeFilter === 'expense' ? 'selected' : ''}>Expense</option></select></label></div>
      <div id="ledger-results">${ledgerResults()}</div></section>${entryForm()}</div>`;
  }

  function budgetNumbers(rows) {
    return `<td data-label="Budget">${yen(sum(rows, 'budget'))}</td><td data-label="Spent">${yen(sum(rows, 'spent'))}</td>
      <td class="budget-usage" data-label="Used">${sum(rows, 'budget') ? pct(sum(rows, 'spent') / sum(rows, 'budget') * 100) : 'No budget'}</td>
      <td data-label="Remaining" class="${sum(rows, 'remaining') < 0 ? 'over-text' : ''}">${yen(sum(rows, 'remaining'))}</td>`;
  }

  function usage(row) {
    const ink = row.remaining < 0 ? '#c73e2c' : row.percent >= 80 ? '#ae842d' : '#58756a';
    return `<div class="usage-wrap">${KCharts.progress(row.percent ?? 100, ink)}<span>${row.percent === null ? 'No budget' : pct(row.percent)}</span></div>`;
  }

  function budgets() {
    const rows = KStore.categories(month);
    return `<section class="panel budget-panel"><div class="panel-head"><h2>Category budgets</h2><span class="panel-note">Edits save automatically</span></div>
      <table class="budget-table"><thead><tr><th scope="col">Category</th><th scope="col">Monthly budget</th><th scope="col">Spent</th><th scope="col">Budget used</th><th scope="col">Remaining</th></tr></thead>
        <tbody>${rows.map(row => `<tr><th scope="row"><span class="budget-category">${catIcon(row.name)}${row.name}</span></th>
          <td data-label="Budget"><label class="currency-input"><b>¥</b><input data-budget="${row.name}" aria-label="${row.name} monthly budget" type="number" inputmode="numeric" step="1" min="0" max="999999999999" required value="${row.budget}"></label></td>
          <td data-label="Spent">${yen(row.spent)}</td><td data-label="Used" class="budget-usage">${usage(row)}</td>
          <td data-label="Remaining" class="remaining ${row.remaining < 0 ? 'over-text' : ''}">${yen(row.remaining)}</td></tr>`).join('')}</tbody>
        <tfoot><tr id="budget-totals"><th scope="row">Total</th>${budgetNumbers(rows)}</tr></tfoot></table></section>`;
  }

  function monthSummary(totals, last, ranks) {
    if (!KStore.transactions(month).length) return `There are no entries for ${KStore.monthName(month)} yet. Add a transaction to begin this month’s review.`;
    const movement = totals.expenses - last.expenses;
    const comparison = last.expenses ? (movement ? `Spending was ${yen(Math.abs(movement))} ${movement > 0 ? 'higher' : 'lower'} than in ${KStore.monthName(last.month, true)}.` : 'Spending matched last month.') : '';
    const largest = ranks[0]?.spent ? `${ranks[0].name} accounted for the largest share at ${pct(ranks[0].spent / totals.expenses * 100)}.` : '';
    return `In ${KStore.monthName(month)}, your household received ${yen(totals.income)} and spent ${yen(totals.expenses)}, leaving a balance of ${yen(totals.balance)}. ${comparison} ${largest}`;
  }

  function insights() {
    const series = KStore.series(month);
    const totals = series[series.length - 1];
    const ranks = KStore.categories(month).sort((a, b) => b.spent - a.spent);
    return `<section class="reflection"><span class="reflection-icon">${icon('education', 23)}</span><div><h2>Monthly reflection</h2><p>${monthSummary(totals, series[series.length - 2], ranks)}</p></div></section>
      <div class="insight-grid">
        <section class="panel"><div class="panel-head"><h2>Income &amp; expenses</h2><span class="panel-note">Six months</span></div><div class="chart-area">${KCharts.barChart(series)}</div></section>
        <section class="panel"><div class="panel-head"><h2>Spending mix</h2><span class="panel-note">${KStore.monthName(month, true)}</span></div>
          <div class="donut-layout"><div class="donut">${KCharts.donut(ranks)}</div><ul class="legend">${ranks.map(row => `<li>${dot(row.name)}${row.name}<strong>${pct(totals.expenses ? row.spent / totals.expenses * 100 : 0)}</strong></li>`).join('')}</ul></div></section>
        <section class="panel"><div class="panel-head"><h2>Savings rate</h2><span class="panel-note">Six months</span></div><div class="chart-area">${KCharts.trend(series)}</div></section>
        <section class="panel"><div class="panel-head"><h2>Top spending categories</h2><span class="panel-note">By amount</span></div>
          <ol class="rank-list">${ranks.slice(0, 5).map(row => `<li>${catIcon(row.name)}<span>${row.name}</span><strong>${yen(row.spent)}</strong></li>`).join('')}</ol></section>
      </div><div class="reset-row"><p>Restore the original transactions and budgets on this device.</p><button class="secondary" data-reset>${icon('reset', 16)} Reset demo data</button></div>`;
  }

  function render() {
    const page = route();
    navigation.innerHTML = Object.entries(routes).map(([key, [label]]) => `<a href="#/${key === 'overview' ? '' : key}"${key === page ? ' aria-current="page"' : ''}>${icon(key, 17)}<span>${label}</span></a>`).join('');
    const views = { overview, ledger, budgets, insights };
    main.innerHTML = pageHead(page) + monthTools(page) + views[page]();
    document.title = `${routes[page][0]} · Kakeibo — Household Budget Book`;
    if (!KStore.hasStorage()) document.getElementById('save-status').innerHTML = '<i></i>Session only';
  }

  function confirmAction(title, copy, button, action) {
    document.getElementById('dialog-title').textContent = title;
    document.getElementById('dialog-copy').textContent = copy;
    document.getElementById('confirm-action').textContent = button;
    pendingAction = action;
    dialog.returnValue = '';
    dialog.showModal();
  }

  dialog.addEventListener('close', () => {
    if (dialog.returnValue === 'confirm' && pendingAction) {
      try { pendingAction(); } catch (error) { notify(error.message); }
    }
    pendingAction = null;
  });

  main.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.hasAttribute('data-step')) {
      month = KStore.shiftMonth(month, Number(button.dataset.step));
      render();
      main.querySelector(`[data-step="${button.dataset.step}"]`).focus({ preventScroll: true });
    } else if (button.hasAttribute('data-new')) {
      focusEntry = true;
      location.hash = '/ledger';
    } else if (button.hasAttribute('data-all')) {
      allCategories = !allCategories;
      const panel = main.querySelector('.spending');
      panel.outerHTML = spendingPanel(KStore.categories(month), KStore.totals(month).expenses);
      main.querySelector('[data-all]').focus({ preventScroll: true });
    } else if (button.hasAttribute('data-delete')) {
      const row = KStore.transactions(month).find(entry => entry.id === button.dataset.delete);
      if (!row) return;
      confirmAction('Delete transaction?', `${row.memo} · ${monthDate(row.date)} · ${yen(row.amount)}`, 'Delete transaction', () => {
        KStore.remove(row.id);
        render();
        document.getElementById('category-filter').focus({ preventScroll: true });
        notify('Transaction deleted.');
      });
    } else if (button.hasAttribute('data-reset')) {
      confirmAction('Reset demo data?', 'Your saved entries and budget edits will be replaced with the original six months of transactions.', 'Reset demo data', () => {
        KStore.reset();
        month = KStore.currentMonth();
        categoryFilter = typeFilter = '';
        allCategories = false;
        render();
        notify('Demo data restored.');
      });
    }
  });

  main.addEventListener('change', event => {
    const input = event.target;
    if (input.id === 'category-filter' || input.id === 'type-filter') {
      categoryFilter = document.getElementById('category-filter').value;
      typeFilter = document.getElementById('type-filter').value;
      document.getElementById('ledger-results').innerHTML = ledgerResults();
    } else if (input.name === 'type') {
      input.form.elements.category.innerHTML = options(input.value === 'income' ? KData.incomeCategories : KData.categories);
    } else if (input.hasAttribute('data-budget')) {
      const category = input.dataset.budget;
      try {
        if (!input.validity.valid) throw new Error('Enter a whole-yen budget between zero and ' + yen(Number(input.max)) + '.');
        KStore.setBudget(month, category, input.value);
        const rows = KStore.categories(month);
        const row = rows.find(item => item.name === category);
        const tr = input.closest('tr');
        tr.querySelector('.budget-usage').innerHTML = usage(row);
        const remaining = tr.querySelector('.remaining');
        remaining.textContent = yen(row.remaining);
        remaining.classList.toggle('over-text', row.remaining < 0);
        document.getElementById('budget-totals').innerHTML = '<th scope="row">Total</th>' + budgetNumbers(rows);
        notify(category + ' budget saved.');
      } catch (error) {
        input.value = KStore.categories(month).find(row => row.name === category).budget;
        notify(error.message);
      }
    }
  });

  main.addEventListener('submit', event => {
    if (event.target.id !== 'entry-form') return;
    event.preventDefault();
    const form = event.target;
    try {
      const entry = KStore.add(Object.fromEntries(new FormData(form)));
      month = entry.date.slice(0, 7);
      categoryFilter = typeFilter = '';
      render();
      notify('Transaction saved.');
    } catch (error) {
      const message = document.getElementById('entry-error');
      message.hidden = false;
      message.textContent = error.message;
    }
  });

  document.querySelector('.skip-link').addEventListener('click', event => {
    event.preventDefault();
    main.focus();
  });
  window.addEventListener('hashchange', () => {
    render();
    if (focusEntry && route() === 'ledger') {
      const form = document.getElementById('new-entry');
      form.scrollIntoView({ block: 'nearest' });
      form.querySelector('input').focus({ preventScroll: true });
    } else {
      window.scrollTo(0, 0);
      main.focus({ preventScroll: true });
    }
    focusEntry = false;
  });
  window.addEventListener('storage', event => {
    if (!event.key || event.key === 'kakeibo-v1') render();
  });
  render();
})();
