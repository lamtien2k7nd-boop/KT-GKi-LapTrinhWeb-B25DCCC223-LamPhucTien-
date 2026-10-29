import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../types';
import { getLocalPosts } from '../utils/storage';

const PAGE_SIZE = 8;
const PAGE_COUNT = 5;
const coverImages = [
  'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=700&q=80',
];

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Lỗi ${res.status} - không tải được bài viết`);

        const data: Post[] = await res.json();
        // Ghép bài viết local lên đầu
        setPosts([...getLocalPosts(), ...data]);
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          setError((e as Error).message);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const matches = q ? posts.filter(p => p.title.toLowerCase().includes(q)) : posts;
    const start = (page - 1) * PAGE_SIZE;
    return matches.slice(start, start + PAGE_SIZE);
  }, [posts, search, page]);

  const matchingCount = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? posts.filter(post => post.title.toLowerCase().includes(q)).length : posts.length;
  }, [posts, search]);

  if (loading) return <div className="status">⏳ Đang tải bài viết...</div>;
  if (error) return <div className="status error">❌ {error}</div>;

  const featured = filtered[0];
  const latest = filtered.slice(1, 5);
  const founders = filtered.slice(5, 8);
  const pageCount = Math.max(1, Math.min(PAGE_COUNT, Math.ceil(matchingCount / PAGE_SIZE)));

  return (
    <div className="home-page">
      {filtered.length === 0 ? (
        <div className="empty-state">Không tìm thấy bài viết phù hợp.</div>
      ) : (
        <>
          <section className="editorial-top" id="latest" aria-label="Bài viết mới nhất">
            <Link to={`/posts/${featured.id}`} className="feature-card">
              <img src={coverImages[(page - 1) % coverImages.length]} alt="Cồn cát dưới dãy núi lúc hoàng hôn" />
              <div className="feature-copy">
                <span className="badge"><span /> {featured.isLocal ? 'Bài viết mới' : 'Câu chuyện nổi bật'}</span>
                <h1>{featured.title}</h1>
                <p>{featured.body.slice(0, 110)}{featured.body.length > 110 ? '...' : ''}</p>
                <span className="post-meta">10 phút đọc <span aria-hidden="true">·</span> Bài viết số {featured.id}</span>
              </div>
            </Link>

            <aside className="latest-panel">
              <div className="section-heading compact-heading">
                <h2>Mới nhất</h2>
                <span>{matchingCount} bài viết</span>
              </div>
              {latest.map((post, index) => (
                <Link to={`/posts/${post.id}`} className="latest-item" key={post.id}>
                  <img src={coverImages[(page + index) % coverImages.length]} alt="" />
                  <span className="latest-copy">
                    <strong>{post.title}</strong>
                    <span className="post-meta">10 phút đọc</span>
                  </span>
                </Link>
              ))}
            </aside>
          </section>

          <section className="founders-section" id="founders">
            <div className="section-heading founders-heading">
              <div>
                <p className="eyebrow">Ý tưởng, con người và hành trình</p>
                <h2>Góc sáng lập</h2>
              </div>
              <label className="search-control">
                <span className="sr-only">Tìm theo tiêu đề</span>
                <span aria-hidden="true">⌕</span>
                <input
                  type="search"
                  placeholder="Tìm bài viết"
                  value={search}
                  onChange={event => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                />
              </label>
            </div>

            <div className="founder-grid">
              {founders.map((post, index) => (
                <article className="founder-card" key={post.id}>
                  <Link to={`/posts/${post.id}`} className="founder-image">
                    <img src={coverImages[(page + index + 4) % coverImages.length]} alt="" />
                  </Link>
                  <div className="founder-copy">
                    <span className="badge"><span /> {post.isLocal ? 'Cộng đồng' : 'Câu chuyện'}</span>
                    <Link to={`/posts/${post.id}`} className="founder-title"><h3>{post.title}</h3></Link>
                    <p>{post.body.slice(0, 118)}{post.body.length > 118 ? '...' : ''}</p>
                    <span className="post-meta">10 phút đọc <span aria-hidden="true">·</span> Bài viết số {post.id}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <nav className="pagination" aria-label="Phân trang">
            <button type="button" className="page-arrow" aria-label="Trang trước" disabled={page === 1} onClick={() => setPage(current => Math.max(1, current - 1))}>←</button>
            <div className="page-numbers">
              {Array.from({ length: pageCount }, (_, index) => index + 1).map(pageNumber => (
                <button
                  type="button"
                  key={pageNumber}
                  className={page === pageNumber ? 'page-number active' : 'page-number'}
                  aria-current={page === pageNumber ? 'page' : undefined}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
            <button type="button" className="page-arrow" aria-label="Trang tiếp theo" disabled={page >= pageCount} onClick={() => setPage(current => Math.min(pageCount, current + 1))}>→</button>
          </nav>
        </>
      )}
    </div>
  );
}