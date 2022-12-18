import create from 'zustand';

interface State {
    accessToken: string;
    setAccessToken: (accessToken: string) => void;
}

export const useStore = create<State>(set => ({
    accessToken: '',
    setAccessToken: accessToken => set(() => ({ accessToken }))
}));
