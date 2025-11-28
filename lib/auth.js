import { kv } from '@vercel/kv';

const USERS_KEY = 'bbs:users';

export async function getUsers() {
    try {
        const users = await kv.get(USERS_KEY);
        return users || [];
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

export async function registerUser(username, password) {
    const users = await getUsers();
    if (users.find(u => u.username === username)) {
        throw new Error('User already exists');
    }

    const newUser = { username, password, id: Date.now().toString() };
    users.push(newUser);
    await kv.set(USERS_KEY, users);
    return newUser;
}

export async function verifyUser(username, password) {
    const users = await getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    return user;
}

export async function findUserByUsername(username) {
    const users = await getUsers();
    return users.find(u => u.username === username);
}
