declare global {
  namespace Express {
    interface Request {
      user?: UserProps;
    }
  }
}

export interface UserProps {
  id: string;
  userId: string;
  email: string;
  name: string;
  password: string;
  role?: string;
}
