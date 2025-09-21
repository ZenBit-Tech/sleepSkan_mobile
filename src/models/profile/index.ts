
export interface IProfileState {
  error: string | null
  loading: boolean
  profile: IProfile | null
  // reminderTime: IReminder | null
}

export interface IProfile {
  uid?: string
  email?: string
  isProfileComplete: boolean
  name: string
  //first questionary
  first_questionary?: number
  dob?: string
  gender?: 'male' | 'female'
  height?: number
  weight?: number
  BMI?: number
  tired?: boolean
  stop_breathing?: boolean
  loud_snore?: boolean
  blood_pressure?: boolean
  neck_size?: boolean
  //second questionary
  second_questionary?: number
  diabetes?: boolean
  alcohol?: boolean
  tobacco?: TOBACCO_VARIANTS
  alcohol_per_day?: boolean
  coffee: COFFEE_VARIANTS
  sleep_hours?: SLEEP_VARIANTS
  medicines?: number[]
  //scores
  score?: number
}

export enum COFFEE_VARIANTS {
  SMALL = '0-2',
  MEDIUM = '3-4', 
  ALOT = '5+'
}

export enum SLEEP_VARIANTS {
  NOT_ENOUGH = '<6h or 6h',
  ENOUGH = '7–9h ', 
  TOO_MUCH = '>9h'
}

export enum TOBACCO_VARIANTS {
  YES = 'yes',
  NO = 'no', 
  EX_SMOKER = 'ex-smoker'
}


export interface IReminder {
  hour: number
  minutes: number
  timezone?: string
}

export interface IMarketingFormData {
  signs: string[]
  wantsProducts: boolean
  phoneNumber: string
  seeDoctor: boolean
}

export interface ISubmissionData {
  name: string
  email: string
  phone: string
  query: string
}
