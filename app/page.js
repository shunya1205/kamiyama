'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
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
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        setContent('');
        fetchPosts(); // Refresh list
      }
    } catch (error) {
      console.error('Failed to add post', error);
    }
  };

  return (
    <main className="container">
      <h1 className="title">SIMPLE BBS</h1>

      <div className="glass" style={{ padding: '2rem', marginBottom: '3rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            className="input"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button type="submit" className="btn">POST</button>
        </form>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {loading ? (
          <p style={{ textAlign: 'center', opacity: 0.5 }}>Loading...</p>
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
              <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem', wordBreak: 'break-word' }}>{post.content}</p>
              <p style={{ fontSize: '0.875rem', opacity: 0.5 }}>
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
        {!loading && posts.length === 0 && (
          <p style={{ textAlign: 'center', opacity: 0.5 }}>No posts yet. Be the first!</p>
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
