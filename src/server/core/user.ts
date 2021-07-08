export interface UserAuthInterface {
    name: string;
    id: number; // May be it's bad idea, i mean if count of users will be upon 32-bit number?
    password: string;
    email: string;
};