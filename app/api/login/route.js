import { NextResponse } from 'next/server';
import { verifyUser, registerUser, findUserByUsername } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request) {
    const body = await request.json();
    const { username, password, isRegister } = body;

    if (!username || !password) {
        return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    try {
        let user;
        if (isRegister) {
            const existing = await findUserByUsername(username);
            if (existing) {
                return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
            }
            user = await registerUser(username, password);
        } else {
            user = await verifyUser(username, password);
            if (!user) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }
        }

        // Set simple auth cookie
        const cookieStore = await cookies();
        cookieStore.set('auth_user', username, { path: '/', httpOnly: true });

        return NextResponse.json({ success: true, username: user.username });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
