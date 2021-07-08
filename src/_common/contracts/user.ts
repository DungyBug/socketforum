interface User {
    name: string;
    registrationDate: Date;
    status: boolean; // true - online, false - offline 
    index: number;
    data: any; // You can put there some data, for example: reputation, rank and other.
}

/*
Guests always has name "Guest", and it's hash is always "Guest".
But you can't register under name "Guest", though interface
supports registered users ( i.e. not guests ) with name "Guest", because
it will be illogical ( registered user, but anyway guest? ) and there is
no sense.
*/

export default User;