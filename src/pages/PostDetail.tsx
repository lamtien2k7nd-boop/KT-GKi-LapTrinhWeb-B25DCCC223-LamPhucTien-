import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Comment, Post } from '../types';
import { getLocalPosts } from '../utils/storage';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // Ưu tiên tìm trong local trước (bài viết do user tự tạo)
        const localPost = getLocalPosts().find(p => String(p.id) === id);
        if (localPost) {
          setPost(localPost);
          setComments([]);
          return;
        }

        const [postRes, cmtRes] = await Promise.all([
          fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, { signal: controller.signal }),
          fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`, { signal: controller.signal }),
        ]);

        if (!postRes.ok) throw new Error('Không tìm thấy bài viết');
        if (!cmtRes.ok) throw new Error('Không tải được bình luận');

        setPost(await postRes.json());
        setComments(await cmtRes.json());
      } catch (e) {
        if ((e as Error).name !== 'AbortError') setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [id]);

  if (loading) return <div className="status">⏳ Đang tải chi tiết...</div>;
  if (error) return <div className="status error">❌ {error}</div>;
  if (!post) return null;

  return (
    <>
      <Link to="/" className="back-link">← Quay lại</Link>

      <article className="post-detail">
        <h1>{post.title}</h1>
        {post.isLocal && <span className="badge">Bài viết của bạn</span>}
        <p>{post.body}</p>
      </article>

      <section>
        <h2>Bình luận ({comments.length})</h2>
        {comments.length === 0 ? (
          <p>Chưa có bình luận nào.</p>
        ) : (
          <ul className="comment-list">
            {comments.map(c => (
              <li key={c.id}>
                <strong>{c.name}</strong> <em>({c.email})</em>
                <p>{c.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}