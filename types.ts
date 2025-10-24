// Supabase type definition
export interface Database {
  public: {
    Tables: {
      // FIX: Add the 'accounts' table definition to the Database interface to resolve type errors.
      accounts: {
        Row: {
          id: string;
          pyg: number;
          brl: number;
        };
        Insert: {
          id?: string;
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
          created_at: string;
          // FIX: Add pygSold and brlReceived fields for currency exchange transactions.
          pygSold: number | null;
          brlReceived: number | null;
        };
        Insert: {
          type: string;
          date: string;
          amount?: number | null;
          description?: string | null;
          category?: string | null;
          paymentMethod?: string | null;
          owedBy?: string | null;
          // FIX: Add pygSold and brlReceived fields for currency exchange transactions.
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
          // FIX: Add pygSold and brlReceived fields for currency exchange transactions.
          pygSold?: number | null;
          brlReceived?: number | null;
        };
      };
    };
  };
}

// FIX: Export the 'Accounts' type alias to be used in components.
export type Accounts = Database['public']['Tables']['accounts']['Row'];

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
    
    // FIX: Add optional properties for currency exchange transactions.
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