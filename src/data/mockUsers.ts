import { PostureData } from "../types";

export interface UserData {
  name: string;
  data: PostureData;
  memo: string;
  recommendation: string;
}

export const mockUsers: UserData[] = [
  {
    name: "건강형 (Type 0)",
    data: {
      userInfo: { name: '건강형', gender: '남성', age: '20~34', height: '175', weight: '70' },
      front: {
        rightShoulderSlope: 20,
        leftShoulderSlope: 20,
        shoulderHorizontal: { direction: 'None', value: 0 },
        rightLegAngle: 0,
        leftLegAngle: 0,
        pelvisHorizontal: { direction: 'None', value: 0 },
        sectionScore: 100
      },
      sideLeft: {
        roundShoulder: 25,
        pelvisTilt: 7,
        forwardHead: 35,
        thoracic: 40,
        lumbar: 50,
        sectionScore: 100
      },
      sideRight: {
        roundShoulder: 25,
        pelvisTilt: 7,
        forwardHead: 35,
        thoracic: 40,
        lumbar: 50,
        sectionScore: 100
      },
      back: {
        shoulderHorizontal: { direction: 'None', value: 0 },
        kneeHorizontal: { direction: 'None', value: 0 },
        pelvisHorizontal: { direction: 'None', value: 0 },
        sectionScore: 100
      },
      manualScore: 100,
      topPercent: 1,
    },
    memo: "모든 측정 수치가 표준 범위 내에 있는 매우 건강한 체형입니다.",
    recommendation: "T50 (현재의 바른 자세 유지)"
  },
  {
    name: "상체 말림형 (Type A)",
    data: {
      userInfo: { name: '상체말림', gender: '여성', age: '20~34', height: '160', weight: '50' },
      front: {
        rightShoulderSlope: 22,
        leftShoulderSlope: 22,
        shoulderHorizontal: { direction: 'None', value: 0 },
        rightLegAngle: -1,
        leftLegAngle: -1,
        pelvisHorizontal: { direction: 'None', value: 0 },
        sectionScore: 80
      },
      sideLeft: {
        roundShoulder: 45,
        pelvisTilt: 7,
        forwardHead: 45,
        thoracic: 50,
        lumbar: 50,
        sectionScore: 60
      },
      sideRight: {
        roundShoulder: 45,
        pelvisTilt: 7,
        forwardHead: 45,
        thoracic: 50,
        lumbar: 50,
        sectionScore: 60
      },
      back: {
        shoulderHorizontal: { direction: 'None', value: 0 },
        kneeHorizontal: { direction: 'None', value: 0 },
        pelvisHorizontal: { direction: 'None', value: 0 },
        sectionScore: 90
      },
      manualScore: 65,
      topPercent: 45,
    },
    memo: "라운드숄더와 거북목 경향이 뚜렷한 상체 말림형 체형입니다.",
    recommendation: "T80 (상체 지지력 강화)"
  },
  {
    name: "좌우 비대칭형 (Type B)",
    data: {
      userInfo: { name: '좌우비대칭', gender: '남성', age: '35~49', height: '180', weight: '85' },
      front: {
        rightShoulderSlope: 25,
        leftShoulderSlope: 15,
        shoulderHorizontal: { direction: 'R', value: 4.5 },
        rightLegAngle: 0,
        leftLegAngle: 0,
        pelvisHorizontal: { direction: 'L', value: 3.2 },
        sectionScore: 50
      },
      sideLeft: {
        roundShoulder: 28,
        pelvisTilt: 7,
        forwardHead: 38,
        thoracic: 40,
        lumbar: 50,
        sectionScore: 85
      },
      sideRight: {
        roundShoulder: 28,
        pelvisTilt: 7,
        forwardHead: 38,
        thoracic: 40,
        lumbar: 50,
        sectionScore: 85
      },
      back: {
        shoulderHorizontal: { direction: 'R', value: 4.2 },
        kneeHorizontal: { direction: 'L', value: 3.5 },
        pelvisHorizontal: { direction: 'L', value: 3.0 },
        sectionScore: 40
      },
      manualScore: 55,
      topPercent: 60,
    },
    memo: "어깨와 골반, 무릎의 수평이 어긋나 있는 좌우 비대칭형 체형입니다.",
    recommendation: "T50 AIR (유연한 비대칭 보완)"
  },
  {
    name: "하체 O다리형 (Type C)",
    data: {
      userInfo: { name: 'O다리형', gender: '여성', age: '20~34', height: '165', weight: '55' },
      front: {
        rightShoulderSlope: 20,
        leftShoulderSlope: 20,
        shoulderHorizontal: { direction: 'None', value: 0 },
        rightLegAngle: -5.5,
        leftLegAngle: -5.8,
        pelvisHorizontal: { direction: 'None', value: 0 },
        sectionScore: 60
      },
      sideLeft: {
        roundShoulder: 25,
        pelvisTilt: 7,
        forwardHead: 35,
        thoracic: 40,
        lumbar: 50,
        sectionScore: 90
      },
      sideRight: {
        roundShoulder: 25,
        pelvisTilt: 7,
        forwardHead: 35,
        thoracic: 40,
        lumbar: 50,
        sectionScore: 90
      },
      back: {
        shoulderHorizontal: { direction: 'None', value: 0 },
        kneeHorizontal: { direction: 'None', value: 0 },
        pelvisHorizontal: { direction: 'None', value: 0 },
        sectionScore: 85
      },
      manualScore: 70,
      topPercent: 30,
    },
    memo: "다리 각도가 바깥으로 벌어진 하체 O다리형 체형입니다.",
    recommendation: "STEPO (발 받침대를 통한 정렬 유도)"
  },
  {
    name: "골반-요추 불균형형 (Type D)",
    data: {
      userInfo: { name: '골반요추', gender: '남성', age: '50+', height: '170', weight: '75' },
      front: {
        rightShoulderSlope: 20,
        leftShoulderSlope: 20,
        shoulderHorizontal: { direction: 'None', value: 0 },
        rightLegAngle: 0,
        leftLegAngle: 0,
        pelvisHorizontal: { direction: 'None', value: 0 },
        sectionScore: 90
      },
      sideLeft: {
        roundShoulder: 25,
        pelvisTilt: 12,
        forwardHead: 35,
        thoracic: 40,
        lumbar: 65,
        sectionScore: 50
      },
      sideRight: {
        roundShoulder: 25,
        pelvisTilt: 12,
        forwardHead: 35,
        thoracic: 40,
        lumbar: 65,
        sectionScore: 50
      },
      back: {
        shoulderHorizontal: { direction: 'None', value: 0 },
        kneeHorizontal: { direction: 'None', value: 0 },
        pelvisHorizontal: { direction: 'None', value: 0 },
        sectionScore: 90
      },
      manualScore: 60,
      topPercent: 50,
    },
    memo: "골반 경사와 요추 곡선이 정상 범위를 벗어난 골반-요추 불균형형 체형입니다.",
    recommendation: "T50 (요추 지지 강화)"
  },
  {
    name: "복합 불균형형 (Type E)",
    data: {
      userInfo: { name: '복합불균형', gender: '여성', age: '35~49', height: '158', weight: '62' },
      front: {
        rightShoulderSlope: 24,
        leftShoulderSlope: 18,
        shoulderHorizontal: { direction: 'R', value: 3.5 },
        rightLegAngle: -4.2,
        leftLegAngle: -4.5,
        pelvisHorizontal: { direction: 'L', value: 2.8 },
        sectionScore: 40
      },
      sideLeft: {
        roundShoulder: 42,
        pelvisTilt: 10,
        forwardHead: 48,
        thoracic: 52,
        lumbar: 60,
        sectionScore: 40
      },
      sideRight: {
        roundShoulder: 42,
        pelvisTilt: 10,
        forwardHead: 48,
        thoracic: 52,
        lumbar: 60,
        sectionScore: 40
      },
      back: {
        shoulderHorizontal: { direction: 'R', value: 3.2 },
        kneeHorizontal: { direction: 'L', value: 2.5 },
        pelvisHorizontal: { direction: 'L', value: 2.8 },
        sectionScore: 40
      },
      manualScore: 45,
      topPercent: 85,
    },
    memo: "상체 말림, 좌우 비대칭, 하체 불균형이 모두 나타나는 복합 불균형형 체형입니다.",
    recommendation: "T90 (전신 정렬 및 고기능성 지지)"
  }
];
