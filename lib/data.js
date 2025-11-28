import { kv } from '@vercel/kv';

const POSTS_KEY = 'bbs:posts';

export async function getPosts() {
    try {
        const posts = await kv.get(POSTS_KEY);
        return posts || [];
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

export async function addPost(post) {
    const posts = await getPosts();
    const newPost = {
        ...post,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
    };
    posts.unshift(newPost); // Add to top
    await kv.set(POSTS_KEY, posts);
    return newPost;
}
