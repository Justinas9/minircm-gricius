
export interface Contact {
  firstName: string;
  lastName: string;
  position: string;
  phoneNumber: string;
}

export interface Company {
  id?: string;
  companyName: string;
  companyCode: string;
  vatCode: string;
  address: string;
  email: string;
  phone: string;
  contacts: Contact[];
}
