
export interface Product {
  id: string;
  name: string;
  description: string;
  tip: string;
  url: string;
  thumbnail?: string;
}

export const PRODUCTS: Product[] = [
  { 
    id: 't90', 
    name: 'T90', 
    description: '시디즈의 기술력이 집약된 플래그십 모델로, 사용자의 모든 움직임을 정교하게 서포트합니다. 4단계 틸팅 강도 조절과 알루미늄 다이캐스팅 부품을 사용하여 내구성과 심미성을 동시에 잡았습니다. 특히 \'얼티메이트 싱크\' 기술은 등판과 좌판이 인체 구조에 맞춰 유기적으로 움직여 최상의 안락함을 제공합니다.', 
    tip: '장시간 고도의 집중력이 필요한 전문직 종사자에게 가장 추천하는 모델입니다.',
    url: 'https://kr.sidiz.com/products/t90',
    thumbnail: 'https://picsum.photos/seed/sidiz-t90-chair/400/300'
  },
  { 
    id: 't80', 
    name: 'T80', 
    description: '독일 디자인 스튜디오와 협업하여 탄생한 프리미엄 체어입니다. 장시간 집중이 필요한 전문가들을 위해 설계되었으며, 요추 지지대의 세밀한 조절을 통해 허리 건강을 완벽하게 케어합니다. 고급스러운 소재와 마감 처리는 서재나 오피스의 품격을 한 단계 높여줍니다.', 
    tip: '허리 지지력이 중요한 분들께 최적의 요추 케어 솔루션을 제공합니다.',
    url: 'https://kr.sidiz.com/products/t80',
    thumbnail: 'https://picsum.photos/seed/sidiz-t80-chair/400/300'
  },
  { 
    id: 't60', 
    name: 'T60', 
    description: '모든 체형을 고려한 퍼스널 피팅 기능을 갖춘 인체공학 사무용 의자입니다. 다양한 조절 기능과 안정적인 지지 설계로 장시간 업무나 재택근무 환경에서도 편안함을 제공합니다. 체형 맞춤 착석감을 중요하게 생각하는 분께 추천하는 시디즈 공식 사무용 의자입니다.', 
    tip: '다양한 사용자가 공유하는 공간이나 첫 인체공학 의자로 훌륭한 선택입니다.',
    url: 'https://kr.sidiz.com/products/t60',
    thumbnail: 'https://picsum.photos/seed/sidiz-t60-chair/400/300'
  },
  { 
    id: 't60air', 
    name: 'T60 AIR', 
    description: '뛰어난 통기성과 편안함을 제공하는 인체공학 사무용 의자입니다. 에어 풀메쉬 등좌판과 섬세한 조절 기능이 결합되어 장시간 착석에서도 쾌적한 사용감을 유지합니다. 통기성 좋은 사무용 의자를 찾는 분께 추천하는 시디즈 공식 의자 제품입니다.', 
    tip: '체열이 많거나 쾌적한 업무 환경을 최우선으로 생각하는 분들께 추천합니다.',
    url: 'https://kr.sidiz.com/products/t60-air',
    thumbnail: 'https://picsum.photos/seed/sidiz-t60air-chair/400/300'
  },
  { 
    id: 't50', 
    name: 'T50', 
    description: '전 세계적으로 사랑받는 시디즈의 스테디셀러입니다. 인체공학적인 S-Curve 등판 설계로 허리의 하중을 효과적으로 분산시키며, 좌판의 깊이와 각도 조절이 가능해 다양한 체형의 사용자가 최적의 자세를 찾을 수 있도록 돕습니다. 입문용부터 전문가용까지 폭넓게 추천되는 표준 모델입니다.', 
    tip: '검증된 인체공학 설계로 실패 없는 선택을 원하는 분들께 권장합니다.',
    url: 'https://kr.sidiz.com/products/t50',
    thumbnail: 'https://picsum.photos/seed/sidiz-t50-chair/400/300'
  },
  { 
    id: 't50air', 
    name: 'T50 AIR', 
    description: 'T50의 인체공학적 설계에 \'에어스킨 메쉬\' 소재를 더해 쾌적함을 극대화했습니다. 일반 메쉬보다 탄성이 뛰어난 특수 소재를 사용하여 몸을 부드럽게 감싸주면서도 땀이 차지 않는 쾌적한 환경을 제공합니다. 열이 많은 체질이거나 여름철 장시간 업무를 보시는 분들께 최고의 선택입니다.', 
    tip: '메쉬의 탄성 지지력과 통기성을 동시에 원하는 분들께 적합합니다.',
    url: 'https://kr.sidiz.com/products/t50-air',
    thumbnail: 'https://picsum.photos/seed/sidiz-t50air-chair/400/300'
  },
  { 
    id: 't20', 
    name: 'T20', 
    description: '실용성과 편안함에 초점을 맞춘 기본형 인체공학 사무용 의자입니다. 메쉬 등판과 간단한 조절 기능으로 데일리 업무 환경에서 안정적인 착석감을 제공합니다. 부담 없는 구성의 실용형 의자를 찾는 분께 추천하는 시디즈 공식 제품입니다.', 
    tip: '합리적인 가격대에 시디즈의 핵심 인체공학 기술을 경험하고 싶은 분들께 추천합니다.',
    url: 'https://kr.sidiz.com/products/t20',
    thumbnail: 'https://picsum.photos/seed/sidiz-t20-chair/400/300'
  },
  { 
    id: 'linie', 
    name: 'LINIE', 
    description: '컴팩트한 사이즈와 미니멀한 디자인으로 홈오피스나 학생방에 최적화된 모델입니다. 유연한 \'플렉스 등판\'이 사용자의 움직임에 따라 유연하게 반응하며, 좁은 공간에서도 효율적으로 사용할 수 있는 실용적인 설계를 갖추고 있습니다. 디자인과 기능의 균형을 중시하는 분들께 추천합니다.', 
    tip: '좁은 공간에서도 스타일을 유지하며 바른 자세를 유지하고 싶은 분들께 적합합니다.',
    url: 'https://kr.sidiz.com/products/linie',
    thumbnail: 'https://picsum.photos/seed/sidiz-linie-chair/400/300'
  },
  { 
    id: 'gx', 
    name: 'GX', 
    description: '활동성과 편안함을 동시에 제공하는 사무용 의자입니다. 유연한 등판과 인체공학 설계로 장시간 업무 환경에서도 안정적인 지지와 편안함을 제공하며, 일상 업무부터 집중 작업까지 폭넓게 대응합니다. 사무용 퍼포먼스 의자를 찾는 분께 추천하는 시디즈 공식 의자입니다.', 
    tip: '업무 중 움직임이 많거나 유연한 지지력을 선호하는 분들께 추천합니다.',
    url: 'https://kr.sidiz.com/products/gx-work',
    thumbnail: 'https://picsum.photos/seed/sidiz-gx-chair/400/300'
  },
  { 
    id: 'gcpro', 
    name: 'GC PRO', 
    description: '게이머의 퍼포먼스를 극대화하기 위해 탄생한 프로페셔널 게이밍 체어입니다. 자동차 시트의 안락함과 사무용 의자의 인체공학을 결합하여, 격렬한 움직임 속에서도 자세가 흐트러지지 않도록 단단하게 지지해줍니다. 쿨링 시트와 LED 라이팅 등 게이밍에 특화된 기능이 탑재되어 있습니다.', 
    tip: '장시간 몰입이 필요한 게이머나 크리에이터에게 최상의 퍼포먼스를 약속합니다.',
    url: 'https://kr.sidiz.com/products/gc-pro',
    thumbnail: 'https://picsum.photos/seed/sidiz-gcpro-chair/400/300'
  },
  { 
    id: 'stepo', 
    name: 'STEPO', 
    description: '바른 자세의 시작은 발바닥 밀착에서 시작됩니다. 스테포 발받침대는 다리 각도를 조절하여 허리에 가해지는 압력을 분산시키고, 무릎 수평을 맞춰주어 장시간 착석 시 하체 피로도를 획기적으로 낮춰줍니다. 특히 키가 작아 발이 바닥에 닿지 않거나, 다리 부종이 있는 분들께 필수적인 액세서리입니다.', 
    tip: '다리 각도와 무릎 수평 정렬이 필요한 분들께 강력 추천하는 필수 액세서리입니다.',
    url: 'https://kr.sidiz.com/products/stepo-footrest',
    thumbnail: 'https://picsum.photos/seed/sidiz-stepo-footrest/400/300'
  }
];
