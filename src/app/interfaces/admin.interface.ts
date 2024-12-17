export interface Admin {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    nin: string;
    last_login?: string;
    wallet_balance?: number;
  }
  
  export interface ListView {
    meta: {
      limit?: number;
      next?: string;
      offset?: number;
      previous?: string;
      total_count?: number;
    };
    objects: {
      admin: Admin[];
    };
  }
  