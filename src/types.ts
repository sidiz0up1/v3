/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type HorizontalValue = {
  direction: 'L' | 'R' | 'None';
  value: number;
};

export interface UserInfo {
  name: string;
  gender: string;
  age: string;
  height: string;
  weight: string;
  sittingTime?: string; // '상', '중', '하'
  shoulderWidth?: string;
  sittingHeight?: string;
  poplitealHeight?: string;
}

export interface PostureData {
  userInfo: UserInfo;
  front: {
    rightShoulderSlope: number | null;
    leftShoulderSlope: number | null;
    shoulderHorizontal: HorizontalValue | null;
    rightLegAngle: number | null;
    leftLegAngle: number | null;
    pelvisHorizontal: HorizontalValue | null;
  };
  sideLeft: {
    roundShoulder: number | null;
    pelvisTilt: number | null;
    forwardHead: number | null;
    thoracic: number | null;
    lumbar: number | null;
  };
  sideRight: {
    roundShoulder: number | null;
    pelvisTilt: number | null;
    forwardHead: number | null;
    thoracic: number | null;
    lumbar: number | null;
  };
  back: {
    shoulderHorizontal: HorizontalValue | null;
    kneeHorizontal: HorizontalValue | null;
    pelvisHorizontal: HorizontalValue | null;
  };
  manualScore: number | null;
  topPercent: number | null;
  recommendStefo?: boolean;
}

export enum BodyType {
  TYPE0 = '건강형',
  TYPEA = '상체 말림형',
  TYPEB = '좌우 비대칭형',
  TYPEC = '하체 O다리형',
  TYPED = '골반-요추 불균형형',
  TYPEE = '복합 불균형형',
}

export interface AnalysisResult {
  mainType: BodyType;
  subTypes: BodyType[];
  scores: Record<BodyType, number>;
  keyMetrics: {
    label: string;
    value: string;
    isAbnormal: boolean;
    position: string;
    area: string;
    meaning: string;
  }[];
  summary: string; // "쉽게 말하면"
  description: string; // "👉 유형 설명"
  cause: string; // "👉 왜 이렇게 되냐면"
  bodyFeatures: string[]; // "체형 특징"
  sittingHabits: string[]; // "앉음 습관 특징"
  maintenanceStrategy: string[]; // "유지 전략" or "앉음 교정"
  coreMessage: string; // "핵심"
  lifeHabits: string[]; // "생활 습관"
  avoidHabits: string[]; // "피해야 할 습관" or "주의 포인트"
  radarData: {
    subject: string;
    value: number;
    fullMark: number;
  }[];
  sidizChairTips: {
    title: string;
    content: string;
    icon: string;
  }[];
  mixedTrend?: string;
  hasAsymmetryBadge: boolean;
  overallScore: number;
  areaScores: {
    upperBody: number;
    leftRight: number;
    pelvisLumbar: number;
    lowerBody: number;
  };
  thematicSummaries: {
    upperBody: string;
    asymmetry: string;
    pelvisLumbar: string;
    lowerBody: string;
  };
  consultationSummary: string;
  recommendedProductIds: string[];
  recommendedAccessoryIds: string[];
  customizationDeviations?: {
    shoulderWidth: { diff: number | null; standard: number };
    sittingHeight: { diff: number | null; standard: number };
    poplitealHeight: { diff: number | null; standard: number };
    height?: { diff: number | null; standard: number };
  };
}

export interface PostureReportRecord {
  id: string;
  created_at: string;
  user_name: string;
  user_info: UserInfo;
  measurement_data: PostureData;
  analysis_result: AnalysisResult;
  pdf_url: string;
  purchased?: boolean;
  purchased_product?: string;
  store_name?: string;
}

export interface Store {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  tip: string;
  url: string;
  thumbnail?: string;
}
