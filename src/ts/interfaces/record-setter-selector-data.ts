// export interface RemindOptions {
//   [index: number]: string
// }
// export interface RepetitionOptions {
//   [index: number]: string
// }
// export interface DayOptions {
//   [index: number]: string
// // }
export interface Option {
  value: string;
  id?: string | number;
}
export interface Options {
  days: Option[];
  repetitions: Option[];
  reminds: Option[];
  markers: Option[];
  statuses: Option[];
}

export interface RecordSelectOptions {
  en: Options;
}