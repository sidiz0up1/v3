import { BodyType, PostureData, AnalysisResult, HorizontalValue } from '../types';

const getHorizontalNum = (h: HorizontalValue | null): number => {
  if (!h) return 0;
  return h.direction === 'L' ? h.value : -h.value;
};

const isHorizontalAbnormal = (h: HorizontalValue | null): boolean => {
  if (!h) return false;
  const val = getHorizontalNum(h);
  return val > 2 || val < -2;
};

const getDiff = (a: number | null, b: number | null): number => {
  if (a === null || b === null) return 0;
  return Math.abs(a - b);
};

const getRecommendedProducts = (userInfo: any, mainType: BodyType): string[] => {
  const gender = userInfo.gender;
  const age = userInfo.age;
  const height = parseInt(userInfo.height) || 0;
  const weight = parseInt(userInfo.weight) || 0;
  
  let typeLabel = '';
  switch(mainType) {
    case BodyType.TYPE0: typeLabel = '건강형'; break;
    case BodyType.TYPEA: typeLabel = '상체 말림형'; break;
    case BodyType.TYPEB: typeLabel = '좌우 비대칭형'; break;
    case BodyType.TYPEC: typeLabel = '하체 O다리형'; break;
    case BodyType.TYPED: typeLabel = '골반-요추 불균형형'; break;
    case BodyType.TYPEE: typeLabel = '복합 불균형형'; break;
  }

  if (gender === '남성') {
    if (age === '20~34' || age === '35~49' || age === '50+') {
      if (height < 165) {
        if (weight < 60) {
          if (typeLabel === '건강형') return ['gx', 't20'];
          if (typeLabel === '상체 말림형') return ['t80', 'gx'];
          if (typeLabel === '좌우 비대칭형') return ['t50', 'gx'];
          if (typeLabel === '하체 O다리형') return ['t20', 'gx'];
          if (typeLabel === '골반-요추 불균형형') return ['t50', 'gx'];
          if (typeLabel === '복합 불균형형') return ['t90', 'gx'];
        } else if (weight <= 80) {
          if (typeLabel === '건강형') return ['gx', 't20'];
          if (typeLabel === '상체 말림형') return ['t80', 'gx'];
          if (typeLabel === '좌우 비대칭형') return ['t50', 'gx'];
          if (typeLabel === '하체 O다리형') return ['t20', 'gx'];
          if (typeLabel === '골반-요추 불균형형') return ['t50', 't50air'];
          if (typeLabel === '복합 불균형형') return ['t90', 't50air'];
        } else {
          if (typeLabel === '건강형') return ['gx', 't60air'];
          if (typeLabel === '상체 말림형') return ['t80', 't60air'];
          if (typeLabel === '좌우 비대칭형') return ['t50', 't60air'];
          if (typeLabel === '하체 O다리형') return ['t20', 't60air'];
          if (typeLabel === '골반-요추 불균형형') return ['t50', 't60air'];
          if (typeLabel === '복합 불균형형') return ['t90', 't60air'];
        }
      } else if (height <= 175) {
        if (weight < 60) {
          if (typeLabel === '건강형') return ['gx', 't20'];
          if (typeLabel === '상체 말림형') return ['t80', 'gx'];
          if (typeLabel === '좌우 비대칭형') return ['t50', 'gx'];
          if (typeLabel === '하체 O다리형') return ['t20', 'gx'];
          if (typeLabel === '골반-요추 불균형형') return ['t50', 'gx'];
          if (typeLabel === '복합 불균형형') return ['t90', 'gx'];
        } else if (weight <= 80) {
          if (typeLabel === '건강형') return ['t50', 'gx'];
          if (typeLabel === '상체 말림형') return ['t80', 't50'];
          if (typeLabel === '좌우 비대칭형') return ['t50', 't50air'];
          if (typeLabel === '하체 O다리형') return ['t20', 't50'];
          if (typeLabel === '골반-요추 불균형형') return ['t50', 't50air'];
          if (typeLabel === '복합 불균형형') return ['t90', 't50air'];
        } else {
          if (typeLabel === '건강형') return ['t50', 't60air'];
          if (typeLabel === '상체 말림형') return ['t80', 't60air'];
          if (typeLabel === '좌우 비대칭형') return ['t50', 't60air'];
          if (typeLabel === '하체 O다리형') return ['t20', 't60air'];
          if (typeLabel === '골반-요추 불균형형') return ['t50', 't60air'];
          if (typeLabel === '복합 불균형형') return ['t90', 't60air'];
        }
      } else {
        if (weight < 60) {
          if (typeLabel === '건강형') return ['gx', 't20'];
          if (typeLabel === '상체 말림형') return ['t80', 'gx'];
          if (typeLabel === '좌우 비대칭형') return ['t50', 'gx'];
          if (typeLabel === '하체 O다리형') return ['t20', 'gx'];
          if (typeLabel === '골반-요추 불균형형') return ['t50', 'gx'];
          if (typeLabel === '복합 불균형형') return ['t90', 'gx'];
        } else if (weight <= 80) {
          if (typeLabel === '건강형') return ['t50', 'gx'];
          if (typeLabel === '상체 말림형') return ['t80', 't50'];
          if (typeLabel === '좌우 비대칭형') return ['t50', 't50air'];
          if (typeLabel === '하체 O다리형') return ['t20', 't50'];
          if (typeLabel === '골반-요추 불균형형') return ['t50', 't50air'];
          if (typeLabel === '복합 불균형형') return ['t90', 't50air'];
        } else {
          if (typeLabel === '건강형') return ['t80', 't90'];
          if (typeLabel === '상체 말림형') return ['t80', 't90'];
          if (typeLabel === '좌우 비대칭형') return ['t80', 't90'];
          if (typeLabel === '하체 O다리형') return ['t80', 't90'];
          if (typeLabel === '골반-요추 불균형형') return ['t80', 't90'];
          if (typeLabel === '복합 불균형형') return ['t90', 't80'];
        }
      }
    }
  } else { // 여성
    if (age === '20~34' || age === '35~49' || age === '50+') {
      if (height < 155) {
        if (weight < 50) {
          if (typeLabel === '건강형') return ['linie', 't20'];
          if (typeLabel === '상체 말림형') return ['t60', 'linie'];
          if (typeLabel === '좌우 비대칭형') return ['t50', 'linie'];
          if (typeLabel === '하체 O다리형') return ['t20', 'linie'];
          if (typeLabel === '골반-요추 불균형형') return ['t50', 'linie'];
          if (typeLabel === '복합 불균형형') return ['t80', 'linie'];
        } else if (weight <= 65) {
          if (typeLabel === '건강형') return ['linie', 't20'];
          if (typeLabel === '상체 말림형') return ['t60', 'linie'];
          if (typeLabel === '좌우 비대칭형') return ['t50', 'linie'];
          if (typeLabel === '하체 O다리형') return ['t20', 'linie'];
          if (typeLabel === '골반-요추 불균형형') return ['t50', 't50air'];
          if (typeLabel === '복합 불균형형') return ['t80', 't50air'];
        } else {
          if (typeLabel === '건강형') return ['linie', 't60air'];
          if (typeLabel === '상체 말림형') return ['t60', 't60air'];
          if (typeLabel === '좌우 비대칭형') return ['t50', 't60air'];
          if (typeLabel === '하체 O다리형') return ['t20', 't60air'];
          if (typeLabel === '골반-요추 불균형형') return ['t50', 't60air'];
          if (typeLabel === '복합 불균형형') return ['t80', 't60air'];
        }
      } else if (height <= 165) {
        if (weight < 50) {
          if (typeLabel === '건강형') return ['linie', 't20'];
          if (typeLabel === '상체 말림형') return ['t60', 'linie'];
          if (typeLabel === '좌우 비대칭형') return ['t50', 'linie'];
          if (typeLabel === '하체 O다리형') return ['t20', 'linie'];
          if (typeLabel === '골반-요추 불균형형') return ['t50', 'linie'];
          if (typeLabel === '복합 불균형형') return ['t80', 'linie'];
        } else if (weight <= 65) {
          if (typeLabel === '건강형') return ['t50', 'linie'];
          if (typeLabel === '상체 말림형') return ['t60', 't50'];
          if (typeLabel === '좌우 비대칭형') return ['t50', 't50air'];
          if (typeLabel === '하체 O다리형') return ['t20', 't50'];
          if (typeLabel === '골반-요추 불균형형') return ['t50', 't50air'];
          if (typeLabel === '복합 불균형형') return ['t80', 't50air'];
        } else {
          if (typeLabel === '건강형') return ['t50', 't60air'];
          if (typeLabel === '상체 말림형') return ['t60', 't60air'];
          if (typeLabel === '좌우 비대칭형') return ['t50', 't60air'];
          if (typeLabel === '하체 O다리형') return ['t20', 't60air'];
          if (typeLabel === '골반-요추 불균형형') return ['t50', 't60air'];
          if (typeLabel === '복합 불균형형') return ['t80', 't60air'];
        }
      } else {
        if (weight < 50) {
          if (typeLabel === '건강형') return ['linie', 't20'];
          if (typeLabel === '상체 말림형') return ['t60', 'linie'];
          if (typeLabel === '좌우 비대칭형') return ['t50', 'linie'];
          if (typeLabel === '하체 O다리형') return ['t20', 'linie'];
          if (typeLabel === '골반-요추 불균형형') return ['t50', 'linie'];
          if (typeLabel === '복합 불균형형') return ['t80', 'linie'];
        } else if (weight <= 65) {
          if (typeLabel === '건강형') return ['t50', 'linie'];
          if (typeLabel === '상체 말림형') return ['t60', 't50'];
          if (typeLabel === '좌우 비대칭형') return ['t50', 't50air'];
          if (typeLabel === '하체 O다리형') return ['t20', 't50'];
          if (typeLabel === '골반-요추 불균형형') return ['t50', 't50air'];
          if (typeLabel === '복합 불균형형') return ['t80', 't50air'];
        } else {
          if (typeLabel === '건강형') return ['t80', 't90'];
          if (typeLabel === '상체 말림형') return ['t80', 't90'];
          if (typeLabel === '좌우 비대칭형') return ['t80', 't90'];
          if (typeLabel === '하체 O다리형') return ['t80', 't90'];
          if (typeLabel === '골반-요추 불균형형') return ['t80', 't90'];
          if (typeLabel === '복합 불균형형') return ['t90', 't80'];
        }
      }
    }
  }

  return ['t50', 'gx'];
};

export const analyzePosture = (data: PostureData): AnalysisResult => {
  const scores: Record<BodyType, number> = {
    [BodyType.TYPE0]: 0,
    [BodyType.TYPEA]: 0,
    [BodyType.TYPEB]: 0,
    [BodyType.TYPEC]: 0,
    [BodyType.TYPED]: 0,
    [BodyType.TYPEE]: 0,
  };

  const rsMax = Math.max(data.sideLeft.roundShoulder || 0, data.sideRight.roundShoulder || 0);
  const fhMax = Math.max(data.sideLeft.forwardHead || 0, data.sideRight.forwardHead || 0);
  const thMax = Math.max(data.sideLeft.thoracic || 0, data.sideRight.thoracic || 0);
  const sHorizVal = Math.abs(getHorizontalNum(data.front.shoulderHorizontal));
  const pHorizVal = Math.abs(getHorizontalNum(data.front.pelvisHorizontal));
  const kHorizVal = Math.abs(getHorizontalNum(data.back.kneeHorizontal));
  const legAngleL = data.front.leftLegAngle || 0;
  const legAngleR = data.front.rightLegAngle || 0;
  const ptL = data.sideLeft.pelvisTilt || 0;
  const ptR = data.sideRight.pelvisTilt || 0;
  const lumL = data.sideLeft.lumbar || 0;
  const lumR = data.sideRight.lumbar || 0;

  // 1. TYPE A: 상체 말림형
  const isTypeA = rsMax > 30;
  if (isTypeA) {
    let aScore = 60;
    if (rsMax > 40) aScore += 20;
    if (thMax > 45 || fhMax > 40) aScore += 20;
    scores[BodyType.TYPEA] = Math.min(100, aScore);
  }

  // 2. TYPE B: 좌우 비대칭형
  const asymmetryCount = [sHorizVal > 2, pHorizVal > 2, kHorizVal > 2].filter(Boolean).length;
  const isTypeB = asymmetryCount >= 2;
  if (isTypeB) {
    scores[BodyType.TYPEB] = 60 + (asymmetryCount - 2) * 20;
  } else if (asymmetryCount === 1) {
    scores[BodyType.TYPEB] = 40;
  }

  // 3. TYPE C: 하체 O다리형
  const isTypeC = legAngleL < -3 || legAngleR < -3;
  if (isTypeC) {
    let cScore = 60;
    if (legAngleL < -5 || legAngleR < -5) cScore += 20;
    if (legAngleL < -3 && legAngleR < -3) cScore += 20;
    scores[BodyType.TYPEC] = Math.min(100, cScore);
  }

  // 4. TYPE D: 골반-요추 불균형형
  const ptOut = ptL < 5 || ptL > 8 || ptR < 5 || ptR > 8;
  const lumOut = lumL < 45 || lumL > 55 || lumR < 45 || lumR > 55;
  const isTypeD = ptOut || lumOut;
  if (isTypeD) {
    scores[BodyType.TYPED] = (ptOut && lumOut) ? 90 : 70;
  }

  // 5. TYPE E: 복합 불균형형
  const activeTypes = [isTypeA, isTypeB, isTypeC, isTypeD].filter(Boolean).length;
  const isTypeE = activeTypes >= 2;
  if (isTypeE) {
    scores[BodyType.TYPEE] = 80 + (activeTypes - 2) * 10;
  }

  // 6. TYPE 0: 건강형
  const allInRange = 
    !isTypeA && !isTypeB && !isTypeC && !isTypeD &&
    sHorizVal <= 2 && pHorizVal <= 2 && kHorizVal <= 2 &&
    legAngleL >= -3 && legAngleL <= 3 && legAngleR >= -3 && legAngleR <= 3 &&
    rsMax <= 30 && fhMax <= 40 &&
    thMax >= 35 && thMax <= 45 &&
    lumL >= 45 && lumL <= 55 && lumR >= 45 && lumR <= 55 &&
    ptL >= 5 && ptL <= 8 && ptR >= 5 && ptR <= 8;

  if (allInRange) {
    scores[BodyType.TYPE0] = 100;
  } else {
    const penalties = activeTypes * 20 + asymmetryCount * 5;
    scores[BodyType.TYPE0] = Math.max(0, 95 - penalties);
  }

  // 메인 타입 결정
  let mainType: BodyType = BodyType.TYPE0;
  if (isTypeE) {
    mainType = BodyType.TYPEE;
  } else if (isTypeA) {
    mainType = BodyType.TYPEA;
  } else if (isTypeB) {
    mainType = BodyType.TYPEB;
  } else if (isTypeC) {
    mainType = BodyType.TYPEC;
  } else if (isTypeD) {
    mainType = BodyType.TYPED;
  } else {
    mainType = BodyType.TYPE0;
  }

  const subTypes = (Object.keys(scores) as BodyType[]).filter(t => t !== mainType && scores[t] >= 60);

  const keyMetrics: AnalysisResult['keyMetrics'] = [];
  const addMetric = (label: string, value: string, isAbnormal: boolean, position: string, area: string, meaning: string) => {
    keyMetrics.push({ label, value, isAbnormal, position, area, meaning });
  };

  // Round Shoulder Analysis
  const rsL = data.sideLeft.roundShoulder || 0;
  const rsR = data.sideRight.roundShoulder || 0;
  // rsMax is already declared above
  const rsAnalysis = rsMax > 30 
    ? `양쪽 어깨가 앞으로 말려 있습니다. 가슴 근육의 단축과 등 근육 약화가 진행 중이니, 상체 피로도를 낮추기 위한 관리가 필요합니다.`
    : `양쪽 어깨 정렬이 표준 범위 내에 있어 안정적입니다. 현재의 좋은 균형을 유지하기 위해 주기적인 스트레칭을 권장합니다.`;
  addMetric('라운드숄더', `왼 ${(rsL?.toFixed(1) || '-')}° / 오 ${(rsR?.toFixed(1) || '-')}°`, rsMax > 30, '측면', '어깨', rsAnalysis);

  // Forward Head Analysis
  const fhL = data.sideLeft.forwardHead || 0;
  const fhR = data.sideRight.forwardHead || 0;
  // fhMax is already declared above
  const fhAnalysis = fhMax > 40
    ? `경추가 전방으로 돌출되어 하중이 집중되고 있습니다. 목 주변 근육의 긴장도가 높으니 경추 정렬 교정을 권장합니다.`
    : `경추 정렬이 양호하여 목에 가해지는 하중이 적절히 분산되고 있습니다. 모니터 높이 조절 등을 통해 현재 상태를 유지해 보세요.`;
  addMetric('거북목', `왼 ${(fhL?.toFixed(1) || '-')}° / 오 ${(fhR?.toFixed(1) || '-')}°`, fhMax > 40, '측면', '목', fhAnalysis);

  // Thoracic Angle Analysis
  const thL = data.sideLeft.thoracic || 0;
  const thR = data.sideRight.thoracic || 0;
  // thMax is already declared above
  const thAnalysis = thMax > 35
    ? `흉추의 굽은 정도가 심해져 등이 굽어 있는 상태입니다. 흉추 주변 근육의 긴장도가 높고 호흡이 얕아질 수 있으니, 흉추 가동성 확보와 등 근육 이완이 필요합니다.`
    : `흉추의 곡선이 표준 범위 내에 있어 상체의 하중을 안정적으로 지지하고 있습니다. 바른 자세 유지를 위해 주기적인 상체 스트레칭을 권장합니다.`;
  addMetric('흉추 각도', `왼 ${(thL?.toFixed(1) || '-')}° / 오 ${(thR?.toFixed(1) || '-')}°`, thMax > 35, '측면', '등', thAnalysis);
  
  // Pelvis Horizontal Analysis
  const phF = data.front.pelvisHorizontal;
  const phB = data.back.pelvisHorizontal;
  if (phF && phB) {
    const phMax = Math.max(Math.abs(phF.value), Math.abs(phB.value));
    const phFDisplay = phF.direction === 'None' ? '-' : `${phF.direction === 'L' ? '왼' : '오'} ${(phF.value?.toFixed(1) || '-')}°`;
    const phBDisplay = phB.direction === 'None' ? '-' : `${phB.direction === 'L' ? '왼' : '오'} ${(phB.value?.toFixed(1) || '-')}°`;
    const phAnalysis = phMax > 2
      ? `골반의 좌우 수평이 맞지 않습니다. 전면에서 ${phFDisplay}, 후면에서 ${phBDisplay}의 불균형이 관찰됩니다. 골반 비대칭은 척추 정렬에 영향을 줄 수 있으므로 교정이 필요합니다.`
      : '골반의 좌우 수평이 전면과 후면 모두 안정적입니다. 현재의 균형 잡힌 상태를 유지하기 위해 바른 자세 습관을 지속해 주세요.';
    addMetric('골반 수평', `전면 ${phFDisplay} / 후면 ${phBDisplay}`, phMax > 2, '전/후면', '골반', phAnalysis);
  }

  let summary = '';
  let description = '';
  let cause = '';
  let bodyFeatures: string[] = [];
  let sittingHabits: string[] = [];
  let maintenanceStrategy: string[] = [];
  let coreMessage = '';
  let lifeHabits: string[] = [];
  let avoidHabits: string[] = [];

  switch (mainType) {
    case BodyType.TYPE0:
      description = '전반적으로 균형이 잘 잡힌 체형입니다.';
      bodyFeatures = ['어깨 좌우 균형이 안정적입니다.', '골반 좌우 균형이 유지됩니다.', '척추 곡선이 정상 범위에 있습니다.', '다리 정렬이 안정적입니다.'];
      summary = '무너지는 패턴이 아직 나타나지 않은 상태입니다.';
      sittingHabits = ['장시간 앉아도 자세가 크게 무너지지 않고 비교적 유지됩니다.', '등판에 자연스럽게 기대어 앉는 패턴이 나타납니다.', '특정 부위에 부담이 집중되지 않습니다.'];
      cause = '좋은 체형은 만드는 것보다 유지하는 것이 더 중요하기 때문입니다.';
      maintenanceStrategy = ['엉덩이를 깊숙이 넣고 앉으세요.', '허리의 자연스러운 곡선을 유지하세요.', '모니터 높이를 눈높이에 맞추세요.'];
      coreMessage = '좋은 자세는 ‘만드는 것’이 아니라 ‘유지하는 능력’입니다.';
      lifeHabits = ['1시간마다 가볍게 움직이기', '한 자세를 오래 유지하지 않기', '운동과 스트레칭으로 균형 유지하기'];
      avoidHabits = ['“나는 괜찮다”는 생각으로 자세를 방치하기', '좋은 자세가 오히려 고정된 자세로 변하는 경우'];
      break;
    case BodyType.TYPEA:
      description = '어깨가 말리고 상체가 앞으로 무너지는 유형입니다.';
      bodyFeatures = ['어깨가 안으로 말려 있습니다.', '등 상부가 굽어 있습니다.', '가만히 있어도 상체가 자연스럽게 앞으로 쏠립니다.'];
      summary = '허리보다 등이 먼저 무너지는 체형입니다.';
      sittingHabits = ['처음에는 바르게 앉아도 시간이 지나면 상체가 앞으로 기울어집니다.', '허리를 세워도 어깨는 계속 앞으로 말려 있는 상태가 유지됩니다.', '모니터를 볼 때, 화면보다 얼굴이 먼저 앞으로 나가 있는 경우가 많습니다.'];
      cause = '등 상부의 지지력이 부족해 상체 전체가 앞으로 무너지기 때문입니다.';
      maintenanceStrategy = ['허리보다 등을 먼저 등판에 밀착해 앉으세요.', '모니터를 낮추기보다 몸이 앞으로 나오지 않도록 조정하세요.', '키보드는 몸 가까이에 배치하세요.'];
      coreMessage = '허리가 아니라 ‘등 상부’를 먼저 안정적으로 지지해야 자세가 유지됩니다.';
      lifeHabits = ['스마트폰을 볼 때 턱을 가볍게 당기세요.', '30분마다 한 번씩 등을 펴 주세요.', '팔꿈치는 항상 안정적으로 지지하세요.'];
      avoidHabits = ['고개를 숙인 상태로 장시간 작업하기', '팔걸이 없는 의자 사용하기', '허리만 세우는 자세'];
      break;
    case BodyType.TYPEB:
      description = '몸이 한쪽으로 기울어지는 유형입니다.';
      bodyFeatures = ['골반의 좌우 높이가 다릅니다.', '어깨 균형이 맞지 않습니다.', '체중이 한쪽으로 쏠립니다.'];
      summary = '몸의 중심이 가운데에서 벗어난 상태입니다.';
      sittingHabits = ['똑바로 앉았다고 생각하지만, 실제로는 한쪽으로 기울어져 있는 경우가 많습니다.', '같은 방향으로 다리를 꼬거나 기대는 습관이 반복됩니다.', '의자에 앉으면 한쪽 엉덩이에 압력이 더 많이 실립니다.'];
      cause = '몸이 중앙 정렬을 유지하지 못하고 편한 쪽으로 계속 쏠리기 때문입니다.';
      maintenanceStrategy = ['자세를 세우기 전에 좌우 압력이 같은지 먼저 확인하세요.', '등을 펴더라도 중심이 틀어져 있으면 효과가 제한됩니다.', '엉덩이 양쪽이 균형 있게 눌리도록 앉으세요.'];
      coreMessage = '이 유형은 자세보다 ‘중심 정렬’이 더 중요합니다.';
      lifeHabits = ['다리 꼬는 습관 줄이기', '가방을 양쪽 번갈아 들기', '서 있을 때 체중을 균형 있게 분산하기'];
      avoidHabits = ['턱 괴기', '한쪽으로 기대어 앉기', '한쪽 팔만 사용하는 습관'];
      break;
    case BodyType.TYPEC:
      description = '다리 축이 바깥으로 벌어지는 유형입니다.';
      bodyFeatures = ['무릎이 바깥으로 벌어집니다.', '다리 정렬이 불균형합니다.', '고관절과 무릎의 축이 틀어져 있습니다.'];
      summary = '다리가 자연스럽게 벌어지는 체형입니다.';
      sittingHabits = ['편하게 앉으면 다리가 자연스럽게 벌어지는 경우가 많습니다.', '발이 바깥쪽을 향하고 있는 상태가 자주 나타납니다.', '무릎을 모으려고 하면 어색하거나 오래 유지하기 어렵습니다.'];
      cause = '발 방향이 바깥으로 열려 있어 무릎이 함께 벌어지기 때문입니다.';
      maintenanceStrategy = ['무릎을 억지로 모으기보다 발 방향을 정면으로 맞추세요.', '발의 정렬이 바뀌면 무릎도 자연스럽게 따라옵니다.', '발바닥 전체를 바닥에 안정적으로 밀착하세요.'];
      coreMessage = '무릎이 아니라 ‘발 방향’을 먼저 바로잡는 것이 중요합니다.';
      lifeHabits = ['서 있을 때 발을 11자로 유지하기', '계단을 오를 때 무릎 방향 인식하기', '장시간 서 있을 때 체중 균형 유지하기'];
      avoidHabits = ['양반다리', '의자에 한쪽 다리 올리기', '발을 바깥 방향으로 두고 서 있기'];
      break;
    case BodyType.TYPED:
      description = '허리 곡선과 골반 기울기에 불균형이 있는 유형입니다.';
      bodyFeatures = ['골반 기울기가 정상 범위에서 벗어나 있습니다.', '허리 곡선이 과하거나 부족합니다.'];
      summary = '허리를 어떻게 사용해야 할지 어려운 상태입니다.';
      sittingHabits = ['허리를 세운다고 생각하지만 실제로는 허리가 과하게 꺾여 있는 경우가 많습니다.', '시간이 지날수록 자세가 점점 무너집니다.', '바른 자세를 유지하려고 해도 오래 유지하기 어렵습니다.'];
      cause = '허리를 직접 조절하려다 보니 정렬이 더욱 틀어지기 때문입니다.';
      maintenanceStrategy = ['허리보다 엉덩이 위치를 먼저 맞추세요.', '엉덩이가 안정되면 허리는 자연스럽게 정렬됩니다.', '허리에 과도한 힘을 주지 말고 편안하게 유지하세요.'];
      coreMessage = '허리는 조절의 대상이 아니라 ‘정렬의 결과’입니다.';
      lifeHabits = ['서 있을 때 골반의 중립 자세 유지하기', '복부에 가볍게 힘 주기', '앉았다 일어날 때 허리 부담 줄이기'];
      avoidHabits = ['허리를 과도하게 꺾는 자세', '완전히 무너져 앉기', '복부 지지 없이 장시간 앉기'];
      break;
    case BodyType.TYPEE:
      description = '여러 자세 문제가 동시에 나타나는 유형입니다.';
      bodyFeatures = ['상체, 골반, 좌우 균형 문제가 함께 나타납니다.', '자세 유지가 어렵습니다.', '시간이 지날수록 정렬이 무너집니다.'];
      summary = '신체 전반의 균형이 동시에 흔들리는 상태입니다.';
      sittingHabits = ['자세를 바꿔도 몇 분 지나면 다시 원래 자세로 돌아가는 경우가 많습니다.', '어디부터 교정해야 할지 혼란을 느끼게 됩니다.', '자세를 계속 수정하게 되는 패턴이 반복됩니다.'];
      cause = '여러 불균형이 동시에 존재해 한 번에 안정되지 않기 때문입니다.';
      maintenanceStrategy = ['한 번에 모두 교정하려 하지 말고 단계적으로 접근하세요.', '엉덩이 정렬 → 등판에 기대기 → 목 정렬'];
      coreMessage = '이 유형은 ‘교정의 순서’가 가장 중요합니다.';
      lifeHabits = ['30~40분마다 자세 리셋하기', '앉기와 서기를 반복하기', '문제를 하나씩 나누어 교정하기'];
      avoidHabits = ['완벽한 자세를 한 번에 만들려는 시도', '장시간 같은 자세 유지', '한 자세로 오래 고정하기'];
      break;
  }

  let mixedTrend = '';
  if (subTypes.length > 0) {
    mixedTrend = `이런 패턴이 반복된다면, 현재 체형의 영향을 받고 있을 가능성이 높습니다. (${subTypes.map(t => t.split(' ')[2]).join(', ')} 경향이 함께 관찰됩니다.)`;
  } else {
    mixedTrend = '이런 패턴이 반복된다면, 현재 체형의 영향을 받고 있을 가능성이 높습니다.';
  }

  const hasAsymmetryBadge = asymmetryCount > 0;

  // Radar Data Calculation using section scores
  const frontScore = data.front.sectionScore || 0;
  const sideLeftScore = data.sideLeft.sectionScore || 0;
  const sideRightScore = data.sideRight.sectionScore || 0;
  const backScore = data.back.sectionScore || 0;

  const radarData = [
    { subject: '전면', value: frontScore, fullMark: 100 },
    { subject: '측면(왼)', value: sideLeftScore, fullMark: 100 },
    { subject: '측면(오)', value: sideRightScore, fullMark: 100 },
    { subject: '후면', value: backScore, fullMark: 100 },
  ];

  // Sidiz Chair Tips
  let sidizChairTips: AnalysisResult['sidizChairTips'] = [];

  switch (mainType) {
    case BodyType.TYPE0:
      sidizChairTips = [
        { title: '요추 지지대(Lumbar Support) 정밀 세팅', content: '단순히 받치는 것이 아니라, 골반 바로 위 요추 3~4번 지점에 지지대를 밀착시켜 척추의 자연스러운 S-라인을 견고하게 유지하세요.', icon: 'ShieldCheck' },
        { title: '다이내믹 시팅(Dynamic Sitting) 활용', content: '고정된 자세보다 틸팅 강도를 조절하여 움직임에 따라 등판이 유연하게 반응하도록 설정하면, 척추 기립근의 피로도를 획기적으로 낮출 수 있습니다.', icon: 'Settings' }
      ];
      break;
    case BodyType.TYPEA:
      sidizChairTips = [
        { title: '등판 틸트 리미트(Tilt Limit) 최적화', content: '등판을 1단(가장 세운 상태)으로 설정하여 등 상부가 뒤로 밀리지 않게 지지하고, 가슴을 자연스럽게 열어주는 포지션을 확보하세요.', icon: 'ArrowUpCircle' },
        { title: '암레스트(Armrest) 높이 및 각도 조절', content: '팔걸이를 책상 높이보다 1~2cm 높게 설정하고 안쪽으로 모아주면, 어깨 하중이 팔걸이로 분산되어 라운드 숄더 완화에 직접적인 도움을 줍니다.', icon: 'Maximize2' }
      ];
      break;
    case BodyType.TYPEB:
      sidizChairTips = [
        { title: '좌판 깊이(Seat Depth)와 중심 정렬', content: '엉덩이를 끝까지 밀착시킨 후, 좌판 깊이를 조절하여 오금 부위 공간을 확보하세요. 좌우 엉덩이 뼈(좌골)에 실리는 무게가 5:5가 되도록 의식적으로 정중앙을 유지해야 합니다.', icon: 'Move' },
        { title: '비대칭 대응 암레스트 세팅', content: '기울어진 쪽의 팔걸이를 미세하게 높여 상체의 수평 균형을 유도하고, 척추가 한쪽으로 휘어지는 패턴을 억제하세요.', icon: 'Equal' }
      ];
      break;
    case BodyType.TYPEC:
      sidizChairTips = [
        { title: '좌판 각도(Seat Slope) 및 발 정렬', content: '좌판 앞부분을 낮추지 말고 수평을 유지하여 골반이 앞으로 쏟아지지 않게 하세요. 발바닥 전체를 지면에 밀착시키고 무릎보다 발끝을 5도 정도 안쪽으로 모으는 느낌을 유지하세요.', icon: 'Minus' },
        { title: '의자 높이와 고관절 각도', content: '무릎 각도가 90~100도가 되도록 높이를 조절하여 고관절에 가해지는 압박을 최소화하고, 다리가 벌어지는 힘을 제어하세요.', icon: 'ArrowDownUp' }
      ];
      break;
    case BodyType.TYPED:
      sidizChairTips = [
        { title: '멀티 싱크 틸팅(Multi-Sync Tilting) 동기화', content: '등판과 좌판이 서로 다른 각도로 움직이는 기능을 활용하여, 어떤 각도에서도 골반이 뒤로 눕지 않도록 중립 상태를 견고하게 지지받으세요.', icon: 'RefreshCw' },
        { title: '요추 지지대 깊이(Depth) 조절', content: '지지대를 단순히 높이는 것이 아니라 앞뒤 깊이를 조절하여, 허리 곡선이 무너지지 않도록 능동적으로 밀어주는 텐션을 확보하는 것이 핵심입니다.', icon: 'UserCheck' }
      ];
      break;
    case BodyType.TYPEE:
      sidizChairTips = [
        { title: '시팅 포지션 3단계 리셋', content: '1단계: 의자 높이(발바닥 밀착), 2단계: 좌판 깊이(골반 밀착), 3단계: 요추 및 목 지지대 순으로 매일 아침 새롭게 세팅하여 복합적인 불균형을 리셋하세요.', icon: 'RotateCcw' },
        { title: '주기적 틸팅 모드 전환', content: '고정된 자세는 복합 불균형을 심화시킵니다. 30분마다 틸팅 잠금을 해제하고 몸을 뒤로 젖혀 척추 마디마디의 압력을 재분산시키는 \'액티브 시팅\'을 실천하세요.', icon: 'Activity' }
      ];
      break;
  }

  const recommendedProductIds = getRecommendedProducts(data.userInfo, mainType);

  // Accessory Recommendation Logic (STEPO)
  const pHorizValFront = Math.abs(getHorizontalNum(data.front.pelvisHorizontal));
  const pHorizValBack = Math.abs(getHorizontalNum(data.back.pelvisHorizontal));
  const pHorizMax = Math.max(pHorizValFront, pHorizValBack);

  const needsStepo = 
    Math.abs(legAngleL) > 3 || 
    Math.abs(legAngleR) > 3 || 
    kHorizVal > 2 ||
    pHorizMax > 2 ||
    Math.abs(ptL) < 5 || Math.abs(ptL) > 8 ||
    Math.abs(ptR) < 5 || Math.abs(ptR) > 8;
  
  if (needsStepo && !recommendedProductIds.includes('stepo')) {
    recommendedProductIds.push('stepo');
  }

  // Use manual score if provided, otherwise use calculated TYPE 0 score as base
  const finalScores = { ...scores };
  if (data.manualScore !== null) {
    finalScores[mainType] = data.manualScore;
  }

  return {
    mainType,
    subTypes,
    scores: finalScores,
    summary,
    description,
    cause,
    bodyFeatures,
    sittingHabits,
    maintenanceStrategy,
    coreMessage,
    lifeHabits,
    avoidHabits,
    radarData,
    sidizChairTips,
    mixedTrend,
    hasAsymmetryBadge,
    overallScore: data.manualScore !== null ? data.manualScore : Math.round(scores[BodyType.TYPE0]),
    recommendedProductIds,
    recommendedAccessoryIds: [] as string[],
    keyMetrics: keyMetrics, // Return all metrics instead of slicing
  };
};
