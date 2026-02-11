import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ShrineInfo {
  shrineName: string;
  location: string;
  deities: string[];
  founded: string;
  history: string;
  highlights: string[];
}

export async function analyzeShrineImage(base64Image: string): Promise<ShrineInfo> {
  try {
    const response = await api.post('/trpc/shrine.analyzeShrineImage', {
      image: base64Image,
    });
    
    if (response.data.result?.data) {
      return response.data.result.data;
    }
    throw new Error('Failed to analyze image');
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
