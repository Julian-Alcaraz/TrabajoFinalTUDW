export class ApiEmails {
  constructor(
    public address: string,
    public status: string,
    public sub_status: string,
    public free_email: boolean,
    public account: string,
    public domain: string,
    public domain_age_days: number,
    public smtp_provider: string,
    public mx_record: string,
    public mx_found: boolean,
    public firstname: string,
    public lastname: string,
    public gender: string,
    public country: string,
    public region: string,
    public city: string,
    public zipcode: number,
    public processed_at: Date,
  ) {}

  static overload_constructor() {
    return new ApiEmails('', '', '', true, '', '', 0, '', '', true, '', '', '', '', '', '', 0, new Date('2000-12-10'));
  }
}
