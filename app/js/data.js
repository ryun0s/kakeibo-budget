const KData = (() => {
  'use strict';

  const defaults = Object.freeze({
    Groceries: 42000,
    'Dining out': 16000,
    Rent: 98000,
    Utilities: 24000,
    Transport: 18000,
    Health: 9000,
    Leisure: 16000,
    Shopping: 20000,
    Education: 10000,
    Other: 7000
  });
  const categories = Object.freeze(Object.keys(defaults));
  const incomeCategories = Object.freeze(['Salary', 'Bonus', 'Other income']);

  // Entries run from the oldest month to the newest. Each column is a month's actual receipts.
  const receipts = [
    [1, 'Transport', 'Monthly commuter pass', [12480, 12480, 12480, 12480, 12480, 12480]],
    [2, 'Groceries', 'Fresh produce at the morning market', [5870, 6430, 8260, 7780, 6620, 9640]],
    [4, 'Utilities', 'Gas and water bill', [6840, 7240, 7880, 7680, 8390, 8610]],
    [6, 'Health', 'Pharmacy and household first aid', [2860, 1870, 5940, 2460, 3280, 2640]],
    [8, 'Dining out', 'Lunch at the neighborhood soba shop', [3940, 4240, 5160, 4480, 5180, 5120]],
    [10, 'Groceries', 'Pantry staples and rice', [8340, 7340, 11250, 9860, 7880, 10570]],
    [11, 'Education', 'Japanese calligraphy class', [6000, 6000, 7600, 6000, 6000, 6000]],
    [13, 'Other', 'Postage and parcel delivery', [1880, 930, 2640, 1650, 2720, 1950]],
    [15, 'Utilities', 'Electricity bill', [8630, 9750, 12560, 8940, 7290, 8140]],
    [17, 'Groceries', 'Fish, vegetables and miso', [6210, 8450, 6760, 9230, 7120, 6810]],
    [19, 'Leisure', 'Museum tickets and exhibition guide', [4200, 7300, 3600, 8400, 6800, 5600]],
    [21, 'Shopping', ['Kitchen tools', 'Summer linens', 'A new pair of shoes', 'Household supplies', 'Winter bedding', 'Ceramic bowls for the kitchen'], [6540, 9800, 13800, 7680, 17800, 9240]],
    [24, 'Salary', 'Monthly salary deposit', [412000, 412000, 412000, 412000, 412000, 412000]],
    [25, 'Rent', 'Apartment rent', [98000, 98000, 98000, 98000, 98000, 98000]],
    [26, 'Groceries', 'Weekly shop at the co-op', [10720, 9460, 8330, 7480, 8210, 10260]],
    [27, 'Dining out', 'Family dinner at an izakaya', [7460, 8350, 12400, 6960, 8180, 11640]]
  ];

  function seed(today = new Date()) {
    const transactions = [];
    for (let column = 0; column < 6; column++) {
      const monthStart = new Date(today.getFullYear(), today.getMonth() - 5 + column, 1);
      const year = monthStart.getFullYear();
      const month = String(monthStart.getMonth() + 1).padStart(2, '0');
      const record = (day, category, memo, amount) => {
        const date = year + '-' + month + '-' + String(day).padStart(2, '0');
        transactions.push({
          id: 'seed-' + date + '-' + category,
          date,
          type: incomeCategories.includes(category) ? 'income' : 'expense',
          category,
          amount,
          memo
        });
      };
      for (const [day, category, memos, amounts] of receipts) {
        record(day, category, Array.isArray(memos) ? memos[column] : memos, amounts[column]);
      }
      if (column === 1) record(20, 'Bonus', 'Performance bonus', 85000);
      if (column === 3) record(22, 'Other income', 'Payment for a weekend translation', 18500);
    }
    return transactions;
  }

  return Object.freeze({ categories, incomeCategories, defaults, seed });
})();
