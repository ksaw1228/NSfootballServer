# NSfootball
사용자의 기호에 따라 버튼을 눌러 경기 결과를 숨기거나  표시할 수 있는 기능을 제공하여 스포일러를 방지해주는 축구 일정 어플리케이션 입니다.

<img width=20% height=20% src="https://github.com/ksaw1228/NSfootballServer/assets/48974380/a331874b-0a3e-48d4-97df-785718d4ddfb"/>
<img width=20% height=20% src="https://github.com/ksaw1228/NSfootballServer/assets/48974380/e074dbbc-5be9-4c44-bd50-3287cde1b2e1"/>

- **프론트 코드**:[NSfootball-Native](https://github.com/ksaw1228/NSfootball-native)

## 배포 상황

- :apple: **앱스토어**: 제출 심사중
- :iphone: **플레이스토어**: [NSfootball](https://play.google.com/store/apps/details?id=com.dnals528.NSfootball)
- :globe_with_meridians: **Expo**: [Expo App](https://expo.dev/@dnals528/NSfootball)

## 🛠️Stacks

### Front-End : <img src="https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"/>&nbsp;
### Back-End :  <img src="https://img.shields.io/badge/ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB"/>&nbsp;
### DataBase : <img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white"/>&nbsp;
### IaaS : <img src="https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white"/>&nbsp;

## 서비스 아키텍처
![Untitled-2023-08-30-1124](https://github.com/ksaw1228/NSfootballServer/assets/48974380/e76a110f-6d1e-4b9f-b7e0-113d9c74c430)

---

## 문제와 해결 사항
### API 비용 최적화 및 효율성 향상 전략
초기에는 클라이언트 측에서 외부 API를 직접 호출하는 방식을 채택하였습니다. 이 방식은 사용자 수의 증가에 따라 API 호출 횟수가 기하급수적으로 증가하며, 이로 인해 발생하는 비용 문제를 야기하였습니다.

이러한 문제를 해결하기 위해, 백엔드에서 외부 API를 호출하여 얻은 데이터를 자체 데이터베이스(DB)에 저장하는 전략을 구현하였습니다. </br> 
**결과적으로 기존 월15$의 API 호출 비용을 0원으로 절감하였습니다.**

![스크린샷 2023-08-31 오후 1 38 50](https://github.com/ksaw1228/NSfootballServer/assets/48974380/97f3f596-1e49-451e-90be-818eb69c26eb)


### 실시간 업데이트 반영 및 불필요한 업데이트 제거
경기가 진행 중일 때는 실시간으로 정보를 갱신해야 하지만, 그렇지 않은 경우에는 불필요한 업데이트를 제한하여 서버 부담과 비용을 줄일 필요가 있었습니다.

매일 하루의 첫 경기와 마지막 경기의 시간을 계산하는 로직을 구현하여 경기가 진행 중인 경우에만 외부API를 호출하여 일정과 결과를 업데이트 하는 방식으로 이 문제를 해결하였습니다. </br>
**결과적으로, 기존 1440회의 DB, API 통신 횟수를 720회로 최적화 하여 통신 비용을 절감하였습니다.**

이 로직은 다음과 같이 작동합니다.

- 하루가 시작할 때 서버는 당일 첫 경기의 시작 시간과 마지막 경기가 끝나는 시간을 계산합니다.
- 현재 시각과 첫 경기 시작 시각 사이에 남은 시간을 setTimeout 하여'대기시간'으로 계산합니다. 대기시간 동안은 외부 API 호출을 하지 않습니다.
- 첫 경기 시작 시각과 마지막 경기 종료 시각 사이에 필요한 총 호출 시간을 계산합니다. 이 시간을 "n분"으로 치환합니다.

  예를 들어, 오전 10시에 시작해서 오후 10시에 끝나는 일정이라면 총 12시간, 즉 720분이 필요합니다.
- 대기시간이 지나면 첫 경기가 시작되고, 1분마다 외부 API를 호출하는 루프가 시작됩니다. 루프는 총 호출 시간이 소진되면 종료됩니다.

  위 예시의 loop는 720번 실행 후 종료됩니다.

![스크린샷 2023-08-30 오후 3 15 09](https://github.com/ksaw1228/NSfootballServer/assets/48974380/6559cb90-c90b-452c-a6b6-2396e2532852)

