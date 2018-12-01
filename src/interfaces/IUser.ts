interface IUser {
    firstName: string;
    lastName: string;
    alias?: string;
    office: string;
    section: string;
    phone: string;
    ext?: string;
    fax?: string;
    cellular?: string;
    startDate?: string;
    endDate?: string;
    modified: string;
}

export default IUser;