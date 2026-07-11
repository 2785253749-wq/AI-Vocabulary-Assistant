/**
 * 通用API响应类型
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

/**
 * 用户类型
 */
export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

/**
 * 单词类型
 */
export interface Word {
  id: number;
  word: string;
  phonetic: string;
  definition: string;
  part_of_speech: string;
  difficulty: number;
  study_status?: 'known' | 'unclear' | 'forgotten' | null;
}

/**
 * 学习记录类型
 */
export interface StudyRecord {
  id: number;
  user_id: number;
  word_id: number;
  status: 'known' | 'unclear' | 'forgotten';
  study_date: string;
  created_at: string;
}

/**
 * 错词类型
 */
export interface WrongWord {
  id: number;
  word: string;
  phonetic: string;
  definition: string;
  added_at: string;
}

/**
 * AI生成类型
 */
export type AIGenerateType = 'example' | 'mnemonic' | 'analysis';

export interface AIExampleResult {
  type: 'example';
  word: string;
  content: {
    sentence_en: string;
    sentence_zh: string;
  };
}

export interface AIMnemonicResult {
  type: 'mnemonic';
  word: string;
  content: {
    root_analysis: string;
    association: string;
  };
}

export interface AIAnalysisResult {
  type: 'analysis';
  content: {
    total_learned: number;
    total_forgotten: number;
    weak_words: string[];
    suggestion: string;
  };
}

export type AIResult = AIExampleResult | AIMnemonicResult | AIAnalysisResult;

/**
 * 学习统计类型
 */
export interface StatsOverview {
  today_learned: number;
  total_known: number;
  total_wrong: number;
  progress_percent: number;
  total_words: number;
}

/**
 * 登录/注册请求
 */
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}
