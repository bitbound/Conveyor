export interface AuthToken {
    description: string;
    token: string;
    dateCreated: string;
    lastUsed: string;
    lastUsedIp: string;
    id: number;
    isInEditMode: boolean;
    isSelected: boolean;
    isVisible: boolean;
  }