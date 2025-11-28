import fs from 'fs/promises';
import path from 'path';

const dataFile = path.join(process.cwd(), 'posts.json');

export async function getPosts() {
    try {
        const data = await fs.readFile(dataFile, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return empty array
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
    await fs.writeFile(dataFile, JSON.stringify(posts, null, 2));
    return newPost;
}
