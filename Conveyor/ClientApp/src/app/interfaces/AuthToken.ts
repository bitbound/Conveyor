export interface AuthToken {
    description: string;
    token: string;
    dateCreated: Date;
    lastUsed: Date;
    id: number;
    isInEditMode: boolean;
    isSelected: boolean;
    isVisible: boolean;
  }