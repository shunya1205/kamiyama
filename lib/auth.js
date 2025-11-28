import fs from 'fs/promises';
import path from 'path';

const usersFile = path.join(process.cwd(), 'users.json');

export async function getUsers() {
    try {
        const data = await fs.readFile(usersFile, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
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
    await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
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
