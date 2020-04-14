import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    return this.transactions.reduce(
      (acc: Balance, transaction: Transaction): Balance => {
        if (transaction.type === 'income') {
          const response: Balance = {
            outcome: acc.outcome,
            income: acc.income + transaction.value,
            total: acc.total + transaction.value,
          };

          return response;
        }

        if (transaction.type === 'outcome') {
          const response: Balance = {
            outcome: acc.outcome + transaction.value,
            income: acc.income,
            total: acc.total - transaction.value,
          };
          return response;
        }

        return acc;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );
  }

  public create(data: Transaction): void {
    const balance = this.getBalance();

    if (data.type === 'outcome' && data.value > balance.total) {
      throw new Error('insufficient balance');
    }

    this.transactions.push(data);
  }
}

export default TransactionsRepository;
