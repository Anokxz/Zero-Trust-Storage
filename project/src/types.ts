export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}

export interface FileDetails {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
  downloadCount: number;
  uploadedBy: string;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}