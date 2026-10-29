export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
  isLocal?: boolean;
}

export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}