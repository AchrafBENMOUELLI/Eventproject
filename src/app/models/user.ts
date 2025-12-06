export class User {
  _id?: string;
  email: string;
  password?: string; 
  firstName: string;
  lastName: string;
  role: 'user' | 'organizer' | 'admin';
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
