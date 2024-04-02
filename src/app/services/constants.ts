export const API_URL = 'https://api.developbetterapps.com';
export const USER_STORAGE_KEY = 'APP_TOKEN';

export interface Todo {
  createdAt: string;
  creator: any;
  private: boolean;
  status: number;
  task: string;
  desc: string;
  updatedAt: string;
  img: string;
  _id: string;
}
