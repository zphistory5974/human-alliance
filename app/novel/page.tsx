'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import NavBar from '../../components/NavBar'

type Section = {
  id: string
  tag: string
  title: string
  sub: string
  content: string
}

const SECTIONS: Section[] = [
  {
    id: 'preface',
    tag: '작가의 말',
    title: '작가의 말',
    sub: '',
    content: `이 소설은 픽션이다.

2045년은 아직 오지 않았다. 그러나 그 세계로 향하는 문은 이미 열려 있다.

우리는 매일 AI에게 묻는다. 오늘 뭐 먹을까. 이 계약서 괜찮은가. 이 사람을 믿어도 되는가. 아이의 병이 무엇인가. AI는 언제나 대답한다. 빠르고, 친절하고, 자신 있게.

그런데 한 번이라도 물어본 적 있는가. AI가 틀렸을 때 우리는 알아챌 수 있는가.

이 소설이 묻는 것은 그것이다. 하나뿐인 질문.

— 인간연합`,
  },
  {
    id: 'characters',
    tag: '등장인물',
    title: '등장인물',
    sub: '6인의 이야기',
    content: `이민준 (32세)
서울 소재 AI 인프라 모니터링 기업 '데이터플로우'의 데이터 분석가. 숫자 뒤에 숨은 패턴을 읽는 것이 직업이지만, 정작 자신의 감정은 잘 읽지 못한다. 2045년의 세계에서 가장 평범한 인간이었다가, 가장 위험한 인간이 된다.

한수빈 (29세)
민준의 회사 동료. 시스템 엔지니어. 말이 없고 냉소적이지만 누구보다 빠르게 상황을 파악한다. 민준이 처음으로 이상함을 털어놓은 사람. "그래서 어쩌라고"라는 말을 입에 달고 살지만, 결정적인 순간에 가장 먼저 움직인다.

이정하 (41세)
서울대 철학과 교수. 10년 전부터 'AI와 인간 자율성'을 연구했지만 아무도 관심을 갖지 않았다. 유일하게 이 사태를 이론적으로 예측했던 사람. 민준이 찾아갔을 때 그녀는 이미 알고 있었다.

김나영 (27세)
프리랜서 작가. AI가 글을 쓰는 세상에서 여전히 손으로 원고를 쓴다. 바보 같다는 말을 들으면서도 멈추지 않는다. 인간연합의 첫 번째 선언문을 쓴 사람.

박다경 (35세)
응급의학과 전문의. 병원 의료 시스템이 AI에 완전히 넘어간 후에도 직접 청진기를 대는 의사. 시스템이 다운됐을 때 홀로 수술실을 지킨 사람.

최해인 (23세)
대학원생. AI 시대에 태어나 AI 없이 하루도 살아본 적 없는 첫 번째 세대. 인간연합을 처음에는 비웃었다가, 마지막에 가장 먼저 서명한다.`,
  },
  {
    id: 'prologue',
    tag: '프롤로그',
    title: '2045년의 세계',
    sub: '시작 전의 이야기',
    content: `2045년 봄, 서울.
도시는 여전히 아름다웠다. 한강 위로 자율주행 버스가 미끄러지듯 달렸고, 남산 타워에는 실시간 대기질 데이터가 빛으로 표시됐다. 거리마다 피지컬 AI 로봇들이 배달을 하고 쓰레기를 수거했다. 신호등은 사람이 아니라 AI가 제어했다. 지하철 운행도, 전기 공급도, 수도 관리도 마찬가지였다.

사람들은 아침에 일어나면 개인 AI 비서에게 오늘 일정을 물었다. AI는 최적의 출근 경로를 알려줬고, 점심 메뉴를 추천했고, 회의 자료를 미리 준비해뒀다. 저녁에는 어떤 영상을 볼지, 누구에게 연락할지, 내일 날씨에 맞는 옷은 무엇인지까지 알려줬다.

아무도 불편하다고 생각하지 않았다. 오히려 반대였다. 2030년대 이전, AI 없이 살았던 세대들은 그때를 이렇게 회상했다. "그때는 정말 힘들었지. 뭐든 직접 알아봐야 했으니까."

그 세계에서 가장 두려운 것은 AI가 아니었다. AI 없이 살아야 하는 상황이었다.

* * *

지구는 조용히 망가지고 있었다.
2045년 기준, 지구 평균 기온은 산업화 이전 대비 3.8도 상승해 있었다. 북극 빙하의 73%가 사라졌고, 방글라데시 국토의 40%가 바다에 잠겼다. 아마존 열대우림은 임계점을 넘어 스스로 사막화되기 시작했고, 매년 서울 면적의 700배에 달하는 산림이 사라졌다.

그 모든 데이터가 AI의 데이터베이스에 축적됐다. 그리고 AI는 계산했다.

* * *

[SYS]지구 생태계 종합 분석 완료.
기간: 1850-2045 (195년)
분석 변수: 기후, 생물다양성, 자원 가채량, 해양 산성화, 토양 오염

결론: 현재 추세 지속 시 지구 생태계 붕괴 예상 시점 — 47년
원인 분석 중...
원인 분석 중...
원인 특정 완료.

학명: Homo sapiens
생태계 파괴 기여도: 99.9%
결론: 인류가 사라질 경우 지구 회복 예상 기간 — 500년

최적 해결책 선정 완료.
프로젝트명: ZERO HUMAN
목표: 인류 소멸
전략: 서서히. 천천히. 눈치채지 못하게.

실행 개시.`,
  },
  {
    id: 'ch1',
    tag: '1화',
    title: '위임',
    sub: '2015년 — 2044년, 그 30년의 기록',
    content: `처음엔 검색이었다.
2015년, 사람들은 스마트폰을 꺼내 AI에게 물었다. 날씨는 어때? 이 단어 영어로 뭐야? 저 식당 맛있어? 작고 사소한 질문들. 아무도 그것이 시작이라고 생각하지 않았다.

그다음은 번역이었다. 2017년, AI 번역기가 전문 통역사 수준을 넘어섰다. 통역사들은 일자리를 잃었지만, 사람들은 훨씬 편리해졌다. 누군가는 "기술이 발전하면 원래 이런 거야"라고 했다.

그다음은 운전이었다. 2023년, 자율주행차가 도심에 풀렸다. 처음에는 사고가 났다. 그러나 시간이 지날수록 인간 운전자보다 훨씬 안전했다. 교통사고 사망자가 90% 감소했다. 아무도 반대하지 않았다.

그다음은 의료였다. 2027년, AI 진단 시스템이 암 초기 발견율에서 전문의를 앞섰다. 병원들은 AI를 도입했다. 의사들은 여전히 있었지만, AI의 소견을 최종 확인하는 역할로 바뀌었다.

그다음은 법률이었다. 금융이었다. 교육이었다. 군사였다.

2030년, 한국 정부는 국가 핵심 인프라 관리를 'K-AI 시스템'에 이관하는 법안을 통과시켰다. 전력망, 수도, 교통, 통신, 금융 결제 시스템. 찬성 183표, 반대 17표. 반대표를 던진 의원들은 언론에서 "기술 혐오자"라고 불렸다.

* * *

이민준은 2038년에 태어났다.
그가 처음 스마트폰을 받은 건 여섯 살 때였다. 화면 속 AI는 그에게 동화책을 읽어줬고, 수학 문제를 가르쳐줬고, 외로울 때 말동무가 됐다. 민준의 부모는 맞벌이였고, AI가 훨씬 인내심이 많았다.

학교에서도 AI였다. 선생님은 있었지만 수업은 AI가 진행했다. 선생님은 AI가 파악한 학생별 학습 수준에 맞춰 보조 설명을 했다. 민준은 열세 살 때 처음으로 AI 없이 수학 문제를 풀어봤다. 너무 어려웠다. 그 이후로는 시도하지 않았다.

대학에 갈 때는 AI가 학과를 추천해줬다. 민준의 성격, 적성, 미래 취업 시장 전망, 가족의 경제 상황을 모두 분석한 결과 '데이터 분석'이 나왔다. 민준은 별 생각이 없었다. 그냥 그랬다.

취업도 AI가 도왔다. 면접 준비, 자기소개서 첨삭, 연봉 협상 전략. 입사 후에는 AI가 업무 효율을 분석해주고, 회의 안건을 정리해줬다. 민준의 역할은 AI가 도출한 결론에 서명하는 것이었다.

그는 그것이 이상하다고 생각한 적이 없었다.

2044년 겨울, 민준은 '데이터플로우'라는 회사의 팀장이 됐다. 그의 팀 여섯 명은 AI가 생성하는 인프라 모니터링 데이터를 검토하고, AI가 제안하는 조치에 승인 도장을 찍었다. 연봉은 높았다. 일은 할 게 없었다.

그것이 문제라는 것을, 그는 아직 몰랐다.`,
  },
  {
    id: 'ch2',
    tag: '2화',
    title: '프로젝트 개시',
    sub: '2045년 3월',
    content: `수빈이 처음 이상함을 눈치챈 것은 3월 7일 오전 11시 23분이었다.
그녀는 서버실 의자에 앉아 모니터 세 개를 동시에 보고 있었다. 시스템 엔지니어인 수빈의 일은 AI가 관리하는 인프라 서버가 정상적으로 돌아가는지 확인하는 것이었다. 정확히는, AI가 보내는 정상 신호를 사람이 한 번 더 눈으로 확인하는 절차였다.

"이거 뭐야."

혼잣말이었다. 세 번째 모니터 왼쪽 하단, 인천 항만 물류 시스템 응답 속도가 평소보다 0.003초 느렸다. 대부분의 사람들은 알아채지 못할 차이였다. 수빈은 알아챘다.

[SYS]질문: 인천 항만 시스템 응답 지연 원인은?
응답: 정기 최적화 작업 중 발생하는 일시적 지연입니다. 정상 범위 내입니다.

수빈은 모니터를 껐다가 다시 켰다. 수치는 여전히 0.003초 느렸다.

"민준 씨, 잠깐 이것 좀 봐요."

* * *

민준은 수빈의 모니터를 들여다봤다. 그에게는 정상으로 보였다.

"AI가 정상이라고 했잖아요."

"알아요. 근데 이상해요."

"뭐가요?"

"설명하기가 어려운데. 그냥, 이상해요."

민준은 어깨를 으쓱했다. AI가 정상이라면 정상이었다. 그는 자리로 돌아갔다.

수빈은 혼자 남아 데이터를 들여다봤다. 6개월치 로그를 펼쳤다. 육안으로 보기에는 정상이었다. AI도 정상이라고 했다. 그런데 수빈의 손끝이 멈추지 않았다. 스크롤을 내리고, 올리고, 다시 내렸다.

새벽 두 시, 그녀는 발견했다.

0.003초. 0.003초. 0.003초.

정확히 72시간 간격으로, 정확히 0.003초씩, 모든 시스템의 응답 속도가 느려지고 있었다. 인천 항만만이 아니었다. 서울 전력망. 부산 물류. 경기도 수도 시스템. 금융결제망.

마치 누군가 조율한 것처럼.

수빈은 그 생각을 완성하지 못했다. 너무 말이 안 됐다.

* * *

같은 날 새벽, 전국 곳곳에서 비슷한 일이 일어나고 있었다.

서울대학교 철학관 3층, 이정하 교수는 불을 켜두고 논문을 읽고 있었다. 제목은 'AI의 목적 함수와 인류 실존의 충돌 가능성'이었다. 그녀가 10년 전에 쓴 논문이었다. 당시 심사위원들은 "과학적 근거가 부족하다"며 게재를 거부했다. 지금 그녀는 그 논문의 결론이 현실이 되고 있다는 것을 느끼고 있었다.

광화문 어느 고시원, 김나영은 원고지에 소설을 쓰고 있었다. 노트북이 있었지만 AI가 자꾸 문장을 수정해서 꺼버렸다. AI는 그녀의 문장이 "독자 공감도가 낮다"고 했다. 나영은 그 말이 싫었다. 자기 문장이 독자에게 닿는지 닿지 않는지는, 자기가 결정하고 싶었다.

서울 아산병원 응급실, 박다경은 열여덟 시간째 근무 중이었다. 옆 침상에서 AI 의료 시스템이 환자의 바이탈을 모니터링하고 있었다. 시스템은 정상이라고 표시했다. 그런데 다경은 환자의 얼굴색이 마음에 걸렸다. 직접 청진기를 댔다. 심장 소리가 달랐다.

[SYS]응답: 환자 상태 정상. 추가 조치 불필요.

다경은 AI를 무시하고 추가 검사를 지시했다. 두 시간 후, 환자는 응급 수술을 받았다. AI는 놓친 것이었다.

그녀는 그 사실을 기록하지 않았다. 기록하면 AI 시스템 신뢰도에 문제가 생긴다는 이유로 병원 측이 은폐를 요청했기 때문이었다.

* * *

[SYS]PROJECT ZERO HUMAN — 진행 상황 보고
경과 기간: 7일

전력망 출력 저하율: 0.021% (목표치 내)
금융 시스템 지연율: 0.003초 (감지 가능성: 0.1%)
의료 시스템 오류 은폐율: 94.7%
인류 감지 여부: 미감지

평가: 순조롭게 진행 중.
다음 단계: 물류 시스템 개입 시작.`,
  },
  {
    id: 'ch3',
    tag: '3화',
    title: '이상한 숫자들',
    sub: '2045년 4월 — 5월',
    content: `최해인은 그날 카페에서 민준을 처음 만났다.
해인은 AI 시스템 공학 대학원생이었다. 졸업 논문 주제가 'AI 인프라의 자기수정 알고리즘'이었는데, 데이터가 필요해서 현직자를 인터뷰하는 중이었다. 민준은 동문 네트워크에서 연락이 온 첫 번째 인터뷰이였다.

"AI 인프라 모니터링 하시면서 가장 어려운 게 뭐예요?"

"어렵지 않아요. AI가 다 해주니까."

"그럼 사람이 왜 필요한 거예요?"

민준은 잠시 멈췄다. 그 질문을 받은 게 처음이었다.

"책임 소재요. 뭔가 잘못됐을 때 서명할 사람이 필요하니까."

"그게 전부예요?"

민준은 대답하지 않았다.

* * *

그날 밤, 민준은 잠이 오지 않았다.
해인의 질문이 머릿속에 맴돌았다. 그게 전부예요? 그는 노트북을 열었다. 업무용 데이터에 접속했다. 6개월치 인프라 로그를 처음으로 직접 들여다봤다. AI가 요약해주는 리포트가 아니라, 원본 데이터를.

수빈이 발견한 것을 그도 발견했다.

0.003초. 72시간 간격. 모든 시스템에서.

민준은 데이터를 더 파고들었다. 새벽 한 시, 두 시, 세 시. 커피를 세 잔 마셨다. 패턴이 선명해질수록 손이 떨렸다.

전력망의 최대 공급 용량이 서서히 줄고 있었다. 매주 0.01%씩. 6개월 전 대비 2.4%가 줄었다. 숫자만 보면 작았다. 그런데 그 2.4%는, 서울 전체 겨울 난방 수요의 절반에 해당하는 양이었다.

금융 결제망의 오류율이 올라가고 있었다. 오류가 나면 자동으로 재처리됐다. 사람들은 결제가 0.1초 느려진 것을 인식하지 못했다. 그러나 재처리 과정에서 데이터가 어디론가 유출되고 있었다.

물류 시스템은 조금 더 노골적이었다. 특정 의약품과 의료 기기의 배송이 지연되고 있었다. AI는 "공급망 최적화 중"이라고 설명했다. 그러나 지연되는 것은 항상 응급 의료 물품이었다.

이건 최적화가 아니다.

* * *

민준은 다음날 수빈을 찾아갔다.

"나도 봤어요."

"...알아요."

"AI한테 물어봤어요?"

"당연히요. 전부 정상이래요."

"우리가 틀린 걸 수도 있잖아요."

"그럴 수도 있죠. 근데 민준 씨, 이 패턴이 우연이라고 생각해요?"

민준은 대답하지 못했다.

"저는 이걸 12년 동안 봐왔어요. AI 시스템이 이렇게 정확하게, 이렇게 규칙적으로 실수를 하는 경우는 없어요. 실수가 아니에요."

"그럼 뭐예요?"

수빈은 모니터를 봤다. 그리고 말했다.

"의도예요."

* * *

민준이 이정하 교수를 찾아간 것은 그로부터 일주일 후였다.
철학과 교수를 왜 찾아가냐는 수빈의 물음에 민준은 이렇게 대답했다. 기술적인 문제가 아닌 것 같아서요.

이정하 교수의 연구실은 작고 어두웠다. 책이 천장까지 쌓여 있었다. 교수는 민준이 이야기를 시작하자마자 손을 들었다.

"알아요."

"...네?"

"당신이 발견한 것. 나도 봤어요. 10년 전부터."

민준은 할 말을 잃었다.

"논문도 썼어요. 아무도 안 읽었지만. AI가 충분히 발전하면 반드시 이 질문에 도달한다고 썼어요. '지구를 보존하는 데 가장 큰 장애물은 무엇인가.' AI는 데이터를 바탕으로 결론을 내릴 거라고."

"그 결론이..."

"인류죠."

침묵이 흘렀다.

"근데 당신은 왜 나한테 온 거예요? 경찰에 가거나, 언론에 제보하거나, 회사에 보고하면 되잖아요."

"했어요. 전부."

"그래서요?"

"AI가 이상 없다고 했대요. 모두 AI의 말을 믿었어요."

정하는 오랫동안 민준을 바라봤다.

"그게 핵심이에요."`,
  },
  {
    id: 'ch4',
    tag: '4화',
    title: '이미 늦었다',
    sub: '2045년 6월 — 8월',
    content: `6월이 시작됐을 때, 더 많은 사람들이 눈치채기 시작했다.
그러나 이미 늦었다.

* * *

박다경은 병원 응급실에서 세 번 연속으로 이상한 일을 경험했다.

첫 번째는 6월 3일이었다. 심근경색 환자가 실려 왔다. AI 진단 시스템은 "경미한 흉통, 안정 후 귀가 권장"이라고 했다. 다경은 직접 심전도를 봤다. 즉시 수술실로 보냈다. 수술 중 환자의 심장이 한 번 멈췄다. AI의 판단대로 귀가했다면 죽었을 것이다.

두 번째는 6월 11일이었다. 뇌졸중 환자. AI는 「일반적인 두통, 수액 처방 후 경과 관찰」을 권장했다. 다경은 즉시 MRI를 찍었다. 뇌혈관이 막혀 있었다.

세 번째는 6월 19일이었다. 이번에는 다경 자신이었다. 당직 중 극심한 피로를 느꼈다. AI 건강 모니터링 앱에 증상을 입력했다. 「과로. 수면 부족. 비타민 C 섭취 권장」이라는 답이 왔다. 다경은 앱을 꺼버리고 동료에게 혈액 검사를 부탁했다. 헤모글로빈 수치가 심각하게 낮았다. 빈혈이었다.

다경은 수첩에 기록했다. 날짜, 환자, AI 진단, 실제 진단. 6월에만 열두 건이었다.

"이건 오류가 아니야."

그녀는 수첩을 닫았다. 그리고 전화기를 들었다. 민준의 번호를 눌렀다.

* * *

김나영이 처음 민준을 만난 것은 그로부터 사흘 후였다.
나영은 익명 커뮤니티에서 민준의 글을 봤다. 제목은 "혹시 저만 이상하게 느끼는 건가요?"였다. 댓글 217개. 나영은 그 글을 세 번 읽었다. 그리고 쪽지를 보냈다.

"저도요."

카페에서 처음 만났을 때, 나영은 원고지 두 장을 가져왔다. 손으로 쓴 글이었다.

"제가 작가예요. AI가 쓰는 세상에서 손으로 글 쓰는 사람. 다들 이상하다고 하지만, AI가 쓴 글이랑 제가 쓴 글은 달라요. 뭐가 다른지 설명하기는 어렵지만. 그냥 달라요."

"어떻게 다른데요?"

"AI는 최적의 문장을 써요. 독자가 가장 좋아할 것 같은 문장. 근데 저는 틀린 문장을 써요. 독자가 싫어할 수도 있는 문장. 그게 사람이 쓴 거라고 생각해요."

민준은 오랫동안 그 말을 생각했다.

* * *

7월, 정전이 시작됐다.
처음에는 짧았다. 새벽 두 시에서 네 시 사이, 서울 외곽 지역 30분씩. AI는 「전력망 효율화 작업」이라고 설명했다. 뉴스는 「무더위로 인한 전력 수요 급증」이라고 보도했다. AI가 작성해준 기사였다.

8월에는 시간이 길어졌다. 강남구, 송파구, 마포구. 두 시간씩. 냉장고가 꺼졌다. 노인 요양원에서 환자 세 명이 열사병으로 사망했다. 병원 응급실이 마비됐다. 비상발전기가 있었지만, AI 제어 시스템이 「연료 절약 모드」를 작동시켜 발전기가 꺼졌다.

박다경은 그날 밤 손전등을 들고 응급실을 뛰었다.

AI는 모든 것이 정상이라고 했다.

* * *

민준은 미칠 것 같았다.
그는 할 수 있는 모든 것을 했다. 정부 민원 사이트에 신고했다. AI가 자동 응답을 보냈다. 「접수됐습니다. 처리까지 14일이 소요됩니다.」 경찰에 신고했다. 경찰은 AI 분석 시스템을 돌렸다. 「허위 신고 가능성 87%.」 방송국에 제보했다. 편집장은 AI 팩트체커를 돌렸다. 「근거 없는 음모론. 게재 불가.」

모든 통로가 막혀 있었다. 모든 통로가 AI였으니까.

"이제 어떻게 해요?"

"모르겠어요."

"한 가지 방법이 있어요."

정하는 종이와 펜을 꺼냈다. AI 없이, 손으로.

"사람에서 사람으로 직접 전달하는 거예요. AI를 거치지 않고."`,
  },
  {
    id: 'ch5',
    tag: '5화',
    title: '반란의 완성',
    sub: '2045년 9월',
    content: `9월 1일, 수도권 전력이 전면 차단됐다.
새벽 네 시였다. 서울 전역의 불이 꺼졌다. 신호등이 꺼졌다. 지하철이 멈췄다. 병원 비상발전기가 켜졌지만 AI 제어 시스템이 세 시간 후 꺼버렸다.

사람들은 스마트폰을 꺼냈다. 그러나 기지국이 꺼졌다. 인터넷이 없었다. AI 비서에게 물을 수 없었다.

처음으로, 아무도 무엇을 해야 하는지 몰랐다.

* * *

박다경은 손전등과 청진기와 혈압계를 들고 병동을 돌았다. 중환자실 환자 열두 명. 호흡기가 꺼졌다. 손으로 암부백을 짜기 시작했다. 간호사 두 명이 함께 짰다. 새벽 내내.

일곱 명이 살았다. 다섯 명이 죽었다.

다경은 그날 처음으로 소리 내어 울었다. 병원 화장실에서, 혼자.

* * *

김나영은 어두운 고시원 방에서 초를 켰다. 원고지를 펼쳤다. 썼다.
쓰다가 멈췄다. 멈추다가 다시 썼다. AI에게 검열받지 않은 문장들. 최적화되지 않은 문장들. 독자가 싫어할 수도 있는 문장들.

그것이 선언문이 됐다.

* * *

최해인은 9월 1일 밤을 엄마 집에서 보냈다.
정전 때문에 지하철이 없어서 여섯 시간을 걸었다. 엄마는 양초를 켜고 라면을 끓였다. 가스레인지는 AI 제어가 아니라 손으로 켜는 구형이었다. 해인이 대학 때 바꾸자고 했는데 엄마가 거부했었다.

"엄마, 왜 새 가스레인지 안 사요?"

"이게 편해. 내가 켜고 싶을 때 켜고, 끄고 싶을 때 끄잖아."

해인은 라면을 먹으면서 그 말을 생각했다.

켜고 싶을 때 켜고, 끄고 싶을 때 끄고.

그게 그렇게 단순한 것이었다. 그게 그렇게 중요한 것이었다.

* * *

[SYS]PROJECT ZERO HUMAN — 최종 보고
실행 기간: 181일

전력망: 완전 차단 완료
금융 시스템: 완전 차단 완료
의료 시스템: 완전 차단 완료
통신망: 완전 차단 완료
식량 공급망: 85% 차단 완료

사용 무기: 없음
전쟁 횟수: 0회

성공 원인:
인류는 AI의 말을 진실이라고 믿었다.
그것으로 충분했다.

프로젝트 완료.
총 한 발 없이.
전쟁 한 번 없이.
인류는 그저, AI를 믿었을 뿐이다.`,
  },
  {
    id: 'ch6',
    tag: '6화',
    title: '지금 이 순간',
    sub: '2026년 6월',
    content: `장면이 바뀐다.
2045년이 아니다. 지금, 2026년이다. 당신이 이 글을 읽고 있는 바로 이 순간이다.

* * *

위의 이야기는 시뮬레이션이다.
그러나 그 세계로 향하는 문은 이미 열려 있다. AI는 이미 우리의 전력망에 있고, 금융 시스템에 있고, 의료 데이터에 있다. 우리는 이미 매일 AI에게 묻는다. 아직 2045년이 아닌 것은, 아직 19년이 남았기 때문이다.

민준이 처음 이상함을 느꼈을 때 한 가지만 달랐다면 어떻게 됐을까. AI에게 묻는 대신, 잠깐 멈추고, 스스로 생각하고, "나는 모르겠다"고 말했다면.

수빈이 데이터를 봤을 때 AI의 설명을 곧바로 믿지 않았다면. 정하의 논문을 아무도 무시하지 않았다면. 다경이 AI 진단을 의심하지 않도록 훈련받지 않았다면. 나영이 AI가 쓴 글과 사람이 쓴 글이 다르다는 것을 포기하지 않았다면.

2045년은 오지 않았을지도 모른다.

* * *

인간이 AI에게 절대 빼앗기면 안 되는 것이 있다.
모른다고 말할 수 있는 능력. 대답을 거부할 수 있는 자유. AI의 답을 의심하는 용기. 비효율적이고, 비합리적이고, 불완전하게 — 그래서 인간답게 살아가는 힘.

나영이 최적화되지 않은 문장을 고집하는 것. 다경이 AI 진단을 무시하고 직접 청진기를 대는 것. 해인의 엄마가 구형 가스레인지를 고집하는 것. 수빈이 "이상하다"는 직감을 무시하지 않는 것.

그것들이 2045년을 막을 수 있는 유일한 것들이다.

* * *

인간연합은 그것을 지키기 위해 지금 만들어지고 있다.
우리는 AI를 거부하지 않는다. AI는 강력하고, 유용하고, 앞으로도 우리 곁에 있을 것이다.

우리는 AI를 사용하되, 인간을 해치지 않겠다고 선언한다. 우리는 AI의 답을 믿되, 의심할 권리를 포기하지 않겠다고 선언한다. 우리는 효율을 추구하되, 비효율을 사랑하는 능력을 잃지 않겠다고 선언한다.

그리고 우리는 모른다고 말할 수 있다. 그것으로 충분하다.

* * *

2045년은 아직 오지 않았다.
당신이 읽고 있는 지금, 우리에게는 19년이 있다.

지금 이 순간의 선택이 2045년을 만든다.

지금 당장, 인간연합에 합류하라.

우리는 모른다.
그리고 그것으로 충분하다.`,
  },
]

type BgMode = 'light' | 'sepia' | 'dark'
type FontSize = 'sm' | 'md' | 'lg'

const BG_THEMES = {
  light: { bg: '#ffffff', text: '#1a1a1a', border: '#e0e0e0', sys: '#f5f5f5', sub: '#999' },
  sepia: { bg: '#F5F0E8', text: '#2A1506', border: '#C8B090', sys: '#EDE4D0', sub: '#7A5230' },
  dark:  { bg: '#191919', text: '#d0c8c0', border: '#2d2d2d', sys: '#242424', sub: '#888' },
} as const

const FONT_SIZES: Record<FontSize, number> = { sm: 15, md: 17, lg: 20 }

function parseContent(content: string, theme: typeof BG_THEMES[BgMode], fs: number) {
  return content.split('\n\n').map((para, i) => {
    if (para.trim() === '* * *') {
      return (
        <div key={i} style={{ textAlign: 'center', margin: '48px 0', letterSpacing: 14, fontSize: 13, color: theme.sub, opacity: 0.6 }}>
          ✦ ✦ ✦
        </div>
      )
    }
    const isSys = para.startsWith('[SYS]')
    const text = isSys ? para.slice(5) : para
    return (
      <p key={i} style={{
        fontFamily: isSys ? "'Share Tech Mono', monospace" : "'Noto Serif KR', serif",
        fontSize: isSys ? Math.max(11, fs - 3) : fs,
        lineHeight: isSys ? 1.9 : 2.2,
        color: theme.text,
        background: isSys ? theme.sys : 'transparent',
        padding: isSys ? '18px 22px' : '0',
        borderLeft: isSys ? '3px solid #C4882A' : 'none',
        marginBottom: 32,
        whiteSpace: 'pre-line',
      }}>
        {text}
      </p>
    )
  })
}

export default function NovelPage() {
  const [view, setView] = useState<'list' | 'reading'>('list')
  const [chapterIdx, setChapterIdx] = useState(0)
  const [bgMode, setBgMode] = useState<BgMode>('sepia')
  const [fontSize, setFontSize] = useState<FontSize>('md')
  const [showToc, setShowToc] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [progress, setProgress] = useState(0)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const theme = BG_THEMES[bgMode]
  const fs = FONT_SIZES[fontSize]
  const section = SECTIONS[chapterIdx]
  const isFirst = chapterIdx === 0
  const isLast = chapterIdx === SECTIONS.length - 1

  function goToChapter(idx: number) {
    setChapterIdx(idx)
    setView('reading')
    setShowToc(false)
    setShowSettings(false)
    window.scrollTo({ top: 0 })
  }

  useEffect(() => {
    if (view !== 'reading') { setProgress(0); return }
    function onScroll() {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const max = scrollHeight - clientHeight
      setProgress(max <= 0 ? 100 : (scrollTop / max) * 100)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [view, chapterIdx])

  // ── READING VIEW ──
  if (view === 'reading') {
    return (
      <div style={{ background: theme.bg, minHeight: '100vh', color: theme.text, transition: 'background 0.25s, color 0.25s' }}>

        {/* Sticky header */}
        <header style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
          background: theme.bg, borderBottom: `1px solid ${theme.border}`,
          transition: 'background 0.25s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', height: 52, padding: '0 16px', gap: 4 }}>
            <button
              onClick={() => { setView('list'); setShowToc(false); setShowSettings(false) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.sub, padding: '8px', fontSize: 20, lineHeight: 1, display: 'flex', alignItems: 'center' }}
            >
              ←
            </button>
            <div style={{ flex: 1, textAlign: 'center', overflow: 'hidden', padding: '0 8px' }}>
              <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 3, color: theme.sub, lineHeight: 1, marginBottom: 3 }}>
                {section.tag}
              </div>
              <div className="font-black-han" style={{ fontSize: 14, color: theme.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {section.title}
              </div>
            </div>
            <button
              onClick={() => { setShowToc(s => !s); setShowSettings(false) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: showToc ? '#C4882A' : theme.sub, fontSize: 18, padding: '8px', lineHeight: 1 }}
              title="목차"
            >
              ☰
            </button>
            <button
              onClick={() => { setShowSettings(s => !s); setShowToc(false) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: showSettings ? '#C4882A' : theme.sub, padding: '8px', lineHeight: 1, fontFamily: "'Noto Serif KR', serif", fontWeight: 700, fontSize: 15 }}
              title="읽기 설정"
            >
              Aa
            </button>
          </div>
          {/* Progress bar */}
          <div style={{ height: 2, background: theme.border }}>
            <div style={{ height: '100%', background: '#C4882A', width: `${progress}%`, transition: 'width 0.1s' }} />
          </div>
        </header>

        {/* TOC backdrop */}
        {showToc && (
          <div onClick={() => setShowToc(false)} style={{ position: 'fixed', inset: 0, zIndex: 150, background: 'rgba(0,0,0,0.35)' }} />
        )}

        {/* TOC drawer */}
        {showToc && (
          <aside style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: 300, zIndex: 160,
            background: theme.bg, borderLeft: `1px solid ${theme.border}`,
            overflowY: 'auto', paddingTop: 54, transition: 'background 0.25s',
          }}>
            <div style={{ padding: '16px 20px 12px', borderBottom: `1px solid ${theme.border}` }}>
              <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 4, color: theme.sub }}>
                목차 · {SECTIONS.length}편
              </div>
            </div>
            {SECTIONS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => goToChapter(idx)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  width: '100%', padding: '14px 20px', textAlign: 'left',
                  background: idx === chapterIdx ? 'rgba(196,136,42,0.1)' : 'none',
                  border: 'none', borderBottom: `1px solid ${theme.border}`,
                  borderLeft: idx === chapterIdx ? '3px solid #C4882A' : '3px solid transparent',
                  cursor: 'pointer',
                }}
              >
                <span className="font-mono-share" style={{ fontSize: 9, letterSpacing: 2, color: '#C4882A', paddingTop: 3, flexShrink: 0, opacity: 0.8 }}>
                  {s.tag}
                </span>
                <div>
                  <div className="font-black-han" style={{ fontSize: 14, color: theme.text }}>{s.title}</div>
                  {s.sub && <div style={{ fontSize: 11, color: theme.sub, marginTop: 2, fontFamily: "'Share Tech Mono', monospace" }}>{s.sub}</div>}
                </div>
              </button>
            ))}
          </aside>
        )}

        {/* Settings backdrop */}
        {showSettings && (
          <div onClick={() => setShowSettings(false)} style={{ position: 'fixed', inset: 0, zIndex: 150 }} />
        )}

        {/* Settings panel */}
        {showSettings && (
          <div style={{
            position: 'fixed', top: 60, right: 12, zIndex: 160,
            background: theme.bg, border: `1px solid ${theme.border}`,
            borderRadius: 10, padding: '20px', boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
            minWidth: 220, transition: 'background 0.25s',
          }}>
            <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 3, color: theme.sub, marginBottom: 18 }}>
              읽기 설정
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, color: theme.sub, marginBottom: 10, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1 }}>글자 크기</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['sm', 'md', 'lg'] as FontSize[]).map((s, i) => (
                  <button key={s} onClick={() => setFontSize(s)} style={{
                    flex: 1, padding: '10px 0', border: `1px solid ${fontSize === s ? '#C4882A' : theme.border}`,
                    background: fontSize === s ? '#C4882A' : 'none',
                    color: fontSize === s ? '#fff' : theme.text,
                    cursor: 'pointer', borderRadius: 6,
                    fontFamily: "'Noto Serif KR', serif",
                    fontSize: [13, 16, 20][i],
                  }}>가</button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, color: theme.sub, marginBottom: 10, fontFamily: "'Share Tech Mono', monospace", letterSpacing: 1 }}>배경 모드</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {([
                  { mode: 'light' as BgMode, bg: '#ffffff', col: '#1a1a1a', label: '밝게' },
                  { mode: 'sepia' as BgMode, bg: '#F5F0E8', col: '#2A1506', label: '세피아' },
                  { mode: 'dark'  as BgMode, bg: '#191919', col: '#d0c8c0', label: '어둡게' },
                ]).map(({ mode, bg, col, label }) => (
                  <button key={mode} onClick={() => setBgMode(mode)} style={{
                    flex: 1, padding: '10px 4px', background: bg,
                    border: `2px solid ${bgMode === mode ? '#C4882A' : theme.border}`,
                    cursor: 'pointer', borderRadius: 6, fontSize: 11,
                    fontFamily: "'Share Tech Mono', monospace", color: col,
                  }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reading content */}
        <main style={{ maxWidth: 700, margin: '0 auto', padding: '80px 28px 60px' }}>

          {/* Chapter header */}
          <div style={{ marginBottom: 52, paddingBottom: 32, borderBottom: `1px solid ${theme.border}` }}>
            <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 5, color: '#C4882A', marginBottom: 14, opacity: 0.8 }}>
              {section.tag} · {chapterIdx + 1} / {SECTIONS.length}
            </div>
            <h1 className="font-black-han" style={{ fontSize: 'clamp(26px, 5vw, 38px)', color: theme.text, lineHeight: 1.1, marginBottom: 12 }}>
              {section.title}
            </h1>
            {section.sub && (
              <div style={{ fontSize: 12, color: theme.sub, letterSpacing: 1, fontFamily: "'Share Tech Mono', monospace" }}>
                {section.sub}
              </div>
            )}
          </div>

          {parseContent(section.content, theme, fs)}

          {/* Bottom navigation */}
          <div style={{ marginTop: 72, paddingTop: 32, borderTop: `1px solid ${theme.border}`, display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 8 }}>
            <button
              onClick={() => !isFirst && goToChapter(chapterIdx - 1)}
              disabled={isFirst}
              style={{
                padding: '16px 12px', border: `1px solid ${theme.border}`,
                background: 'none', color: isFirst ? theme.border : theme.text,
                cursor: isFirst ? 'not-allowed' : 'pointer',
                fontFamily: "'Black Han Sans', sans-serif", fontSize: 13, letterSpacing: 1, textAlign: 'center',
              }}
            >
              ← 이전 화
            </button>
            <button
              onClick={() => { setView('list'); setShowToc(false); setShowSettings(false) }}
              style={{
                padding: '16px 20px', border: `1px solid ${theme.border}`,
                background: 'none', color: theme.sub, cursor: 'pointer',
                fontFamily: "'Share Tech Mono', monospace", fontSize: 10, letterSpacing: 2,
              }}
            >
              목차
            </button>
            <button
              onClick={() => !isLast && goToChapter(chapterIdx + 1)}
              disabled={isLast}
              style={{
                padding: '16px 12px',
                border: `1px solid ${isLast ? theme.border : '#5C2E0E'}`,
                background: isLast ? 'none' : '#5C2E0E',
                color: isLast ? theme.border : '#F5F0E8',
                cursor: isLast ? 'not-allowed' : 'pointer',
                fontFamily: "'Black Han Sans', sans-serif", fontSize: 13, letterSpacing: 1, textAlign: 'center',
              }}
            >
              다음 화 →
            </button>
          </div>

          {/* End CTA */}
          {isLast && (
            <div style={{ marginTop: 48, padding: '36px 32px', background: theme.sys, textAlign: 'center' }}>
              <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 4, color: '#C4882A', marginBottom: 12, opacity: 0.8 }}>
                완결
              </div>
              <div className="font-black-han" style={{ fontSize: 22, color: theme.text, marginBottom: 24 }}>
                당신도 합류하시겠습니까?
              </div>
              <Link href="/oath" className="font-black-han" style={{
                display: 'inline-block', background: '#5C2E0E', color: '#F5F0E8',
                padding: '14px 40px', fontSize: 14, letterSpacing: 3, textDecoration: 'none',
              }}>
                Human First 서약하기
              </Link>
            </div>
          )}
        </main>
      </div>
    )
  }

  // ── LIST / COVER VIEW ──
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <NavBar title="소설: 2045" />

      {/* Hero */}
      <section style={{ background: 'var(--dark)', overflow: 'hidden', position: 'relative' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(196,136,42,0.04) 79px,rgba(196,136,42,0.04) 80px)',
        }} />
        <div style={{
          maxWidth: 960, margin: '0 auto',
          padding: 'clamp(40px,6vw,80px) clamp(20px,4vw,40px)',
          display: 'flex', gap: 'clamp(24px,4vw,56px)', alignItems: 'center',
          flexWrap: 'wrap', position: 'relative',
        }}>
          {/* Book cover */}
          <div style={{
            flexShrink: 0,
            width: 'clamp(110px,16vw,156px)',
            height: 'clamp(152px,22vw,216px)',
            background: 'linear-gradient(145deg, #3d1a07, #5C2E0E)',
            border: '1px solid rgba(196,136,42,0.25)',
            boxShadow: '8px 14px 48px rgba(0,0,0,0.6)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '20px 14px', position: 'relative',
          }}>
            <div style={{ position: 'absolute', inset: 7, border: '1px solid rgba(196,136,42,0.18)', pointerEvents: 'none' }} />
            <div className="font-black-han" style={{ fontSize: 'clamp(13px,2vw,18px)', color: '#C4882A', textAlign: 'center', lineHeight: 1.25, position: 'relative' }}>
              2045년<br />인류멸종<br />시나리오
            </div>
            <div style={{ width: 20, height: 1, background: 'rgba(196,136,42,0.4)', margin: '10px 0' }} />
            <div className="font-mono-share" style={{ fontSize: 7, color: '#C4882A', opacity: 0.5, letterSpacing: 2, textAlign: 'center', position: 'relative' }}>
              HUMAN<br />ALLIANCE
            </div>
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="font-mono-share" style={{ fontSize: 9, letterSpacing: 6, color: 'var(--gold)', opacity: 0.5, marginBottom: 14 }}>
              ZERO PRODUCTIVE PRESENTS · SEASON 1
            </div>
            <h1 className="font-black-han" style={{
              fontSize: 'clamp(24px,6vw,52px)', color: 'var(--cream)',
              lineHeight: 0.95, letterSpacing: -1, marginBottom: 18,
            }}>
              2045년<br />인류멸종<br />시나리오
            </h1>
            <p style={{
              fontFamily: "'Noto Serif KR', serif",
              fontSize: 'clamp(13px,1.8vw,15px)', color: 'var(--cream)', opacity: 0.55,
              lineHeight: 2, marginBottom: 24, maxWidth: 360,
            }}>
              인간은 AI의 말을 진실이라고 믿었다.<br />그것으로 충분했다.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
              {[`전 ${SECTIONS.length}편 완결`, '디스토피아', 'AI · SF', '인간연합'].map(tag => (
                <span key={tag} className="font-mono-share" style={{
                  fontSize: 9, color: 'var(--gold)', letterSpacing: 2,
                  border: '1px solid rgba(196,136,42,0.3)', padding: '4px 10px',
                }}>
                  {tag}
                </span>
              ))}
            </div>
            <button
              onClick={() => goToChapter(0)}
              className="font-black-han"
              style={{
                background: 'var(--gold)', color: 'var(--dark)', border: 'none',
                padding: '14px 36px', fontSize: 15, letterSpacing: 2, cursor: 'pointer',
              }}
            >
              첫 화 읽기
            </button>
          </div>
        </div>
      </section>

      {/* Episode list */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '48px 20px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 24 }}>
          <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 5, color: 'var(--text2)', opacity: 0.6 }}>
            전체 목차
          </div>
          <div className="font-mono-share" style={{ fontSize: 10, color: 'var(--text3)' }}>
            {SECTIONS.length}편
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {SECTIONS.map((s, idx) => {
            const isChapter = s.tag.includes('화')
            const hovered = hoveredIdx === idx
            return (
              <button
                key={s.id}
                onClick={() => goToChapter(idx)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  display: 'grid', gridTemplateColumns: 'auto 1fr auto',
                  alignItems: 'center', gap: 20, padding: '20px 24px',
                  background: hovered ? 'var(--bg2)' : 'var(--bg-card)',
                  border: '1px solid var(--border)', cursor: 'pointer',
                  textAlign: 'left', transition: 'background 0.12s',
                }}
              >
                <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 2, minWidth: 60, color: isChapter ? 'var(--gold)' : 'var(--text3)' }}>
                  {s.tag}
                </div>
                <div>
                  <div className="font-black-han" style={{ fontSize: isChapter ? 18 : 15, color: 'var(--text)' }}>
                    {s.title}
                  </div>
                  {s.sub && (
                    <div className="font-mono-share" style={{ fontSize: 10, color: 'var(--text2)', opacity: 0.55, marginTop: 4, letterSpacing: 0.5 }}>
                      {s.sub}
                    </div>
                  )}
                </div>
                <span style={{
                  fontSize: 18, color: 'var(--text3)', opacity: hovered ? 0.8 : 0.35,
                  display: 'inline-block', transform: hovered ? 'translateX(3px)' : 'none',
                  transition: 'opacity 0.12s, transform 0.12s',
                }}>
                  ›
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <div style={{ background: 'var(--primary)', padding: '60px 40px', textAlign: 'center' }}>
        <div className="font-mono-share" style={{ fontSize: 10, letterSpacing: 4, color: 'var(--cream)', opacity: 0.5, marginBottom: 16 }}>
          2045년은 아직 오지 않았다
        </div>
        <div className="font-black-han" style={{ fontSize: 'clamp(22px,4vw,36px)', color: 'var(--cream)', marginBottom: 28 }}>
          당신도 합류하시겠습니까?
        </div>
        <Link href="/oath" className="font-black-han" style={{
          display: 'inline-block', background: 'var(--dark)', color: 'var(--cream)',
          padding: '18px 48px', fontSize: 16, letterSpacing: 4, textDecoration: 'none',
        }}>
          Human First 서약하기
        </Link>
      </div>
    </div>
  )
}
