import { create } from 'zustand';
import type { GenerateIconsPayload, GenerateIconsResponse, IconResult, IconStyleId } from '../types';
import { api } from '../services/api';

interface IconStoreState {
  icons: IconResult[];
  prompt: string;
  style: IconStyleId | null;
  colors: string[];
  loading: boolean;
  error: string | null;
  requestId?: string;
  durationMs?: number;
}

interface IconStoreActions {
  generateIcons: (payload: GenerateIconsPayload) => Promise<void>;
  clearIcons: () => void;
  setError: (value: string | null) => void;
}

const initialState: IconStoreState = {
  icons: [],
  prompt: '',
  style: null,
  colors: [],
  loading: false,
  error: null,
};

export const useIconStore = create<IconStoreState & IconStoreActions>()((set) => ({
  ...initialState,
  setError: (value) => set({ error: value }),
  clearIcons: () => set(initialState),
  generateIcons: async (payload) => {
    set({ loading: true, error: null });
    try {
      const response = await api.generateIcons<GenerateIconsResponse>(payload);
      set({
        icons: response.icons,
        prompt: response.prompt,
        style: response.style.id,
        colors: payload.colors,
        loading: false,
        requestId: response.requestId,
        durationMs: response.durationMs,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate icons';
      set({ error: message, loading: false });
      throw error;
    }
  },
}));
