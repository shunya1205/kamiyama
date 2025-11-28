import { NextResponse } from 'next/server';
import { getPosts, addPost } from '@/lib/data';

export async function GET() {
    const posts = await getPosts();
    return NextResponse.json(posts);
}

export async function POST(request) {
    const body = await request.json();

    if (!body.content) {
        return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const newPost = await addPost(body);
    return NextResponse.json(newPost);
}
