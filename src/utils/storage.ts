import type { Post } from '../types';

const KEY = 'local_posts';

export const getLocalPosts = (): Post[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
};

export const saveLocalPost = (post: Post) => {
  const posts = getLocalPosts();
  posts.unshift(post); // bài mới lên đầu
  localStorage.setItem(KEY, JSON.stringify(posts));
};