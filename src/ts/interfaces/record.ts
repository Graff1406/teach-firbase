export interface Record {
  title: string;
  repetition: number;
  reminds: number[];
  days: number[];
  start: string;
  end: string;
  marker: string;
}

export interface CreatedRecord extends Record {
  id: string;
  status: string;
  saved: number;
  confirm: boolean;
}

export interface Records {
  // monday: [];
  tuesday: CreatedRecord[];
  wednesday: CreatedRecord[];
  // thursday: [];
  // friday: [];
  // saturday: [];
  // sunday: [];
}