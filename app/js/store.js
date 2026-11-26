const KStore = (() => {
  'use strict';

  const key = 'kakeibo-v1';
  const fullMonth = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' });
  const shortMonth = new Intl.DateTimeFormat('en', { month: 'short' });

  function monthKey(date) {
    return String(date.getFullYear()).padStart(4, '0') + '-' + String(date.getMonth() + 1).padStart(2, '0');
  }

  function monthStart(month) {
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) throw new Error('Choose a valid month.');
    return new Date(month + '-01T12:00:00');
  }

  function currentMonth() {
    return monthKey(new Date());
  }

  function shiftMonth(month, delta) {
    const date = monthStart(month);
    date.setMonth(date.getMonth() + delta);
    const year = Math.min(9999, Math.max(1, date.getFullYear()));
    if (year !== date.getFullYear()) return year === 1 ? '0001-01' : '9999-12';
    return monthKey(date);
  }

  function monthName(month, short = false) {
    return (short ? shortMonth : fullMonth).format(monthStart(month));
  }

  function seedState() {
    return { transactions: KData.seed(), budgets: {} };
  }

  function readSaved(storage) {
    const raw = storage?.getItem(key);
    if (!raw) return null;
    try {
      const data = JSON.parse(raw);
      return data && Array.isArray(data.transactions) && data.budgets && typeof data.budgets === 'object'
        ? data : null;
    } catch {
      return null;
    }
  }

  // Some file-viewing environments only allow in-memory storage for the session.
  let storage;
  let state;
  try {
    storage = globalThis.localStorage;
    state = readSaved(storage);
    if (!state) {
      state = seedState();
      storage?.setItem(key, JSON.stringify(state));
    }
  } catch {
    storage = null;
    state ??= seedState();
  }

  function save(next) {
    try {
      storage?.setItem(key, JSON.stringify(next));
    } catch {
      throw new Error('Your browser could not save this change. Check the available local storage.');
    }
    state = next;
  }

  function hasStorage() {
    return Boolean(storage);
  }

  function refresh() {
    if (storage) state = readSaved(storage) ?? state;
  }

  globalThis.addEventListener?.('storage', (event) => {
    if (event.key === key || event.key === null) refresh();
  });

  function transactions(month) {
    return state.transactions
      .filter(entry => entry.date.slice(0, 7) === month)
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  function totals(month) {
    let income = 0;
    let expenses = 0;
    for (const entry of transactions(month)) {
      if (entry.type === 'income') income += entry.amount;
      else expenses += entry.amount;
    }
    const balance = income - expenses;
    const savingsRate = income === 0 ? 0 : balance / income * 100;
    return { income, expenses, balance, savingsRate };
  }

  function categories(month) {
    const spending = Object.fromEntries(KData.categories.map(name => [name, 0]));
    for (const entry of transactions(month)) {
      if (entry.type === 'expense') spending[entry.category] += entry.amount;
    }
    return KData.categories.map(name => {
      const spent = spending[name];
      const budget = state.budgets[month]?.[name] ?? KData.defaults[name];
      const percent = budget > 0 ? spent / budget * 100 : (spent === 0 ? 0 : null);
      return { name, spent, budget, remaining: budget - spent, percent };
    });
  }

  function series(month) {
    return Array.from({ length: 6 }, (_, index) => {
      const key = shiftMonth(month, index - 5);
      return { month: key, ...totals(key) };
    });
  }

  function wholeYen(value, minimum) {
    if (typeof value !== 'number' && !(typeof value === 'string' && /^\d+$/.test(value.trim()))) {
      return false;
    }
    return Number.isSafeInteger(Number(value)) && Number(value) >= minimum;
  }

  function add({ date, type, category, amount, memo }) {
    const calendarDate = new Date(date + 'T12:00:00Z');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(calendarDate.getTime()) ||
        calendarDate.toISOString().slice(0, 10) !== date) {
      throw new Error('Choose a valid calendar date.');
    }
    const choices = type === 'income' ? KData.incomeCategories : type === 'expense' ? KData.categories : null;
    if (!choices) throw new Error('Choose income or expense.');
    if (!choices.includes(category)) throw new Error('Choose a category for this transaction type.');
    if (!wholeYen(amount, 1)) throw new Error('Enter a positive amount in whole yen.');
    if (typeof memo !== 'string' || !memo.trim()) throw new Error('Enter a memo for this transaction.');

    refresh();
    const id = globalThis.crypto?.randomUUID?.() ?? (Date.now().toString(36) + '-' + Math.random().toString(36).slice(2));
    const entry = { id, date, type, category, amount: Number(amount), memo: memo.trim() };
    save({ ...state, transactions: [entry, ...state.transactions] });
    return entry;
  }

  function remove(id) {
    refresh();
    save({ ...state, transactions: state.transactions.filter(entry => entry.id !== id) });
  }

  function setBudget(month, name, amount) {
    monthStart(month);
    if (!KData.categories.includes(name)) throw new Error('Choose an expense category.');
    if (!wholeYen(amount, 0)) throw new Error('Enter a monthly budget in whole yen, zero or more.');
    refresh();
    const updated = { ...state.budgets[month], [name]: Number(amount) };
    save({ ...state, budgets: { ...state.budgets, [month]: updated } });
  }

  function reset() {
    save(seedState());
  }

  return Object.freeze({ hasStorage, currentMonth, shiftMonth, monthName, transactions, totals, categories, series, add, remove, setBudget, reset });
})();
