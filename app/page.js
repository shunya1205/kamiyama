'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check for auth cookie (simple client-side check, ideally middleware)
    const checkAuth = async () => {
      // In a real app, we'd verify the session with an API call.
      // For this simple app, we'll try to fetch posts and if 401, redirect.
      // Or better, add a /api/me endpoint.
      // Let's just try to fetch posts, if we add auth check there.
      // For now, let's assume if we can't get posts or if a specific check fails.
      // Actually, let's just use the cookie presence for UI state, but API should enforce it.
      // We'll add a simple /api/me check.
      try {
        const res = await fetch('/api/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.username);
          fetchPosts();
        } else {
          router.push('/login');
        }
      } catch (e) {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Failed to fetch posts', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, username: user }), // Send username explicitly or let server infer from cookie
      });

      if (res.ok) {
        setContent('');
        fetchPosts();
      }
    } catch (error) {
      console.error('Failed to add post', error);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  };

  if (!user) return null; // Or loading spinner

  return (
    <main className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="title" style={{ margin: 0, fontSize: '2.5rem' }}>シンプルBBS</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>ようこそ, {user}さん</span>
          <button onClick={handleLogout} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)' }}>ログアウト</button>
        </div>
      </div>

      <div className="glass" style={{ padding: '2rem', marginBottom: '3rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            className="input"
            placeholder="今何してる？"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button type="submit" className="btn">投稿</button>
        </form>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {loading ? (
          <p style={{ textAlign: 'center', opacity: 0.5 }}>読み込み中...</p>
        ) : (
          posts.map((post, index) => (
            <div
              key={post.id}
              className="glass"
              style={{
                padding: '1.5rem',
                animation: `fadeIn 0.5s ease ${index * 0.1}s backwards`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', opacity: 0.7 }}>
                <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{post.username || '名無し'}</span>
                <span>{new Date(post.createdAt).toLocaleString('ja-JP')}</span>
              </div>
              <p style={{ fontSize: '1.25rem', wordBreak: 'break-word' }}>{post.content}</p>
            </div>
          ))
        )}
        {!loading && posts.length === 0 && (
          <p style={{ textAlign: 'center', opacity: 0.5 }}>まだ投稿がありません。一番乗りしましょう！</p>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
