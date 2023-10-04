

export interface User {
    id?: number;
    name: string;
    phoneNumber: string;
    password: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
export interface TokenData {
    expiresIn: string;
    token: string;
    refreshToken?: string;
}
  