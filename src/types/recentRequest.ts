export type HistoryItem = {
  id: string;
  status: string;
  user: {
    id: string;
    tokensRemaining: number;
    requestCount: number;
    tokenUsed: number;
  };
  problem: {
    id: string;
    detectedIssue: string | null;
    imageUrl: string | null;
    location: string | null;
  };
};

export type GetHistoryResponse = {
  success: boolean;
  history: HistoryItem[];
};
