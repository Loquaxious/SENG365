import create from 'zustand';
interface UserState {
    users: User[];
    setUsers: (users: Array<User>) => void;
    editUser: (user: User, newUsername: string) => void;
    removeUser: (user: User) => void;
}
const useStore = create<UserState>((set) => ({
    users: [],
    setUsers: (users: Array<User>) => set(() => {
        return {users: users}
    }),
    editUser: (user: User, newUsername) => set((state) => {
        return {users: state.users.map(u => u.user_id === user.user_id ?
                ({...u, username: newUsername} as User): u)}
    }),
    removeUser: (user: User) => set((state) => {
        return {users: state.users.filter(u => u.user_id !==
                user.user_id)}
    })
}))
export const useUserStore = useStore;