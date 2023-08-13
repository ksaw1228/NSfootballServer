# NSfootball

## 네이티브 코드
- **네이티브 코드**:[NSfootball-Native](https://github.com/ksaw1228/NSfootball-native)

## 배포 상황

- :apple: **앱스토어**: 제출 심사중
- :iphone: **플레이스토어**: [NSfootball](https://play.google.com/store/apps/details?id=com.dnals528.NSfootball)
- :globe_with_meridians: **Expo**: [Expo App](https://expo.dev/@dnals528/NSfootball)

## 프로젝트 소개

"NSfootball"은 경기 결과를 사용자의 기호에 따라 숨기거나 표시할 수 있는 기능을 제공하는 축구일정 어플리케이션 입니다.<br>
아시아 국가에서 유럽 축구 경기를 실시간으로 시청하기 어려운 사용자들의 스포일러를 방지하기 위해 개발되었습니다.

## 🛠️Stacks

### Front-End : <img src="https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"/>&nbsp;
### Back-End :  <img src="https://img.shields.io/badge/ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB"/>&nbsp;
### DataBase : <img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white"/>&nbsp;
### IaaS : <img src="https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white"/>&nbsp;

## 주요 기능

1. :calendar: 경기 일정 확인
2. :eye: 사용자 기호에 따른 경기 결과 숨기기/표시하기
3. :tv: 다음날 아침 하이라이트 시청을 위한 옵션(예정)

## 문제와 해결 사항
### API 금액 관련 문제해결
초기에는 프론트에서 직접 외부 API를 호출하였습니다. 그로 인해 사용자가 많아질수록 비용이 기하급수적으로 증가하는 문제를 발견하였습니다.<br>
이 문제를 해결하기 위해 백엔드에서 외부 API의 데이터를 받아서 자체 DB에 저장했습니다.<br>
#### 그 후 자체 DB에서 프론트에 데이터를 전송하여 비용절감을 이루어 냈습니다.
### 실시간 업데이트 반영 및 불필요한 업데이트 멈춤
경기가 진행중일때는 실시간으로 업데이트를 해야 하지만 경기가 진행중이지 않을 때는 불필요한 업데이트를 멈춰야 했습니다.<br>
이를 해결하기 위해, setRealTimeUpdate() 함수를 구현하여 정해진 주기마다(경기가 진행중일때만) getData()를 호출하여 전체 일정을 업데이트하도록 했습니다.<br>
#### 이렇게 불필요한 업데이트를 줄임으로서 서버의 통신비용을 절감하였습니다.
### 여러 리그 일정 데이터 제공
여러개의 리그 중 모든 리그를 불러오는 것이 아닌 클라이언트가 원하는 리그만 효율적으로 불러오는 방법을 고민했습니다.<br>
이를 해결하기 위해, /api/:id 경로에서 동적 경로로 리그를 지정해주어, 클라이언트에서 어떤 리그든지 원하는 데이터를 요청할 수 있게 구현했습니다.<br>
또한 Promise.all을 사용해 동시에 여러 리그의 데이터를 가져온 후, 클라이언트에게 JSON 형식으로 제공하는 방식을 사용했습니다.
#### 이 방법으로 프론트의 초기 실행 시간을 줄이고 서버의 통신비용을 절감하였습니다.
### 요청 제한 및 인증 토큰 관리
외부 API를 사용하기 때문에 악의적으로 많은 요청을 하는 것을 제한해야 할 필요성을 느꼈습니다.<br>
이를 해결하기 위해, express-rate-limit 라이브러리를 사용하여 IP별 요청 횟수를 제한하였고, .env 파일과 dotenv 라이브러리를 사용하여 API 키를 안전하게 관리했습니다.<br>
#### 이렇게 함으로써 API비용과 서버의 통신비용을 절감하였습니다.

