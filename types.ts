// Supabase type definition
export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: {
          id: string;
          pyg: number;
          brl: number;
          created_at: string;
        };
        Insert: {
          pyg: number;
          brl: number;
        };
        Update: {
          pyg?: number;
          brl?: number;
        };
      };
      recurring_payments: {
        Row: {
          id: string;
          name: string;
          amount: number;
          type: string;
          category: string;
          paymentMethod: string;
          billingCycle: string;
          nextPaymentDate: string;
          paidMonths: string[] | null;
          icon: 'rent' | 'condominio' | 'wifi' | 'default' | null;
          created_at: string;
        };
        Insert: {
          name: string;
          amount: number;
          type: string;
          category: string;
          paymentMethod: string;
          billingCycle: string;
          nextPaymentDate: string;
          paidMonths?: string[] | null;
          icon?: 'rent' | 'condominio' | 'wifi' | 'default' | null;
        };
        Update: {
          name?: string;
          amount?: number;
          type?: string;
          category?: string;
          paymentMethod?: string;
          billingCycle?: string;
          nextPaymentDate?: string;
          paidMonths?: string[] | null;
          icon?: 'rent' | 'condominio' | 'wifi' | 'default' | null;
        };
      };
      transactions: {
        Row: {
          id: string;
          type: string;
          date: string;
          amount: number | null;
          description: string | null;
          category: string | null;
          paymentMethod: string | null;
          owedBy: string | null;
          pygSold: number | null;
          brlReceived: number | null;
          created_at: string;
        };
        Insert: {
          type: string;
          date: string;
          amount?: number | null;
          description?: string | null;
          category?: string | null;
          paymentMethod?: string | null;
          owedBy?: string | null;
          pygSold?: number | null;
          brlReceived?: number | null;
        };
        Update: {
          type?: string;
          date?: string;
          amount?: number | null;
          description?: string | null;
          category?: string | null;
          paymentMethod?: string | null;
          owedBy?: string | null;
          pygSold?: number | null;
          brlReceived?: number | null;
        };
      };
    };
  };
}

export enum TransactionType {
    Income = 'income',
    Expense = 'expense'
}

export enum TransactionCategory {
    Food = 'Food',
    Transport = 'Transport',
    Shopping = 'Shopping',
    Travel = 'Travel',
    Bills = 'Bills',
    Entertainment = 'Entertainment',
    Health = 'Health',
    Income = 'Income',
    CreditCard = 'Credit Card Payment',
    Other = 'Other',
}

export interface Transaction {
    id: string;
    type: 'income' | 'expense' | 'exchange';
    date: string;
    
    // For income/expense
    amount?: number | null;
    description?: string | null;
    category?: TransactionCategory | null;
    paymentMethod?: 'cash' | 'credit' | 'brl_account' | null;
    owedBy?: string | null; 
    
    // For exchange
    pygSold?: number | null;
    brlReceived?: number | null;
}


export enum RecurringPaymentType {
    Subscription = 'Subscription',
    Utility = 'Utility Bill',
    Rent = 'Rent/Mortgage',
}

export interface RecurringPayment {
    id: string;
    name: string;
    amount: number;
    type: RecurringPaymentType;
    category: TransactionCategory;
    paymentMethod: 'cash' | 'credit' | 'brl_account';
    billingCycle: 'monthly' | 'yearly';
    nextPaymentDate: string;
    paidMonths?: string[] | null; // e.g., ["2024-01", "2024-02"]
    icon?: 'rent' | 'condominio' | 'wifi' | 'default' | null;
}

export interface SmartPromptData {
    message: string;
    category: TransactionCategory;
    icon: 'coffee' | 'lunch';
}

export interface Accounts {
    pyg: number;
    brl: number;
}