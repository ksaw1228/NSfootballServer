# NSfootball

## 네이티브 코드
- **네이티브 코드**:[NSfootball-Native](https://github.com/ksaw1228/NSfootball-native)

## 배포 상황

- :apple: **앱스토어**: 제출 심사중
- :iphone: **플레이스토어**: [NSfootball](https://play.google.com/store/apps/details?id=com.dnals528.NSfootball)
- :globe_with_meridians: **Expo**: [Expo App](https://expo.dev/@dnals528/NSfootball)

## 프로젝트 소개

축구 일정을 제공하는 외부 API를 사용하여 해당 데이터 중 경기 결과 데이터를 사용자의 기호에 따라 <br>
숨기거나 표시할 수 있는 기능을 제공하여 스포일러를 방지해주는 축구 일정 어플리케이션 입니다.

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

이러한 문제를 해결하기 위해, 백엔드에서 외부 API를 호출하여 얻은 데이터를 자체 데이터베이스(DB)에 저장하는 전략을 구현하였습니다. 이렇게 함으로써, 클라이언트는 필요한 정보를 직접적으로 자체 DB로부터 받아오게 되어 API 요청 횟수와 관련된 비용을 크게 절감할 수 있었습니다.

### 실시간 업데이트 반영 및 불필요한 업데이트 제거
경기가 진행 중일 때는 실시간으로 정보를 갱신해야 하지만, 그렇지 않은 경우 불필요한 업데이트로 인한 서버 부담과 비용을 줄일 필요가 있었습니다.

매일 하루의 첫 경기와 마지막 경기의 시간을 계산하는 로직을 구현하여 정해진 주기마다(경기가 진행 중인 경우) 외부API 호출하여 전체 일정을 업데이트 하는 방식으로 이 문제를 해결하였습니다. 결과적으로, 불필요한 데이터 업데이트와 관련된 서버 부담과 통신비용을 절감할 수 있었습니다.

### 다중 리그 일정 데이터 제공 최적화
여러 개의 리그 중에서도 클라이언트가 원하는 특정 리그만 선택적으로 데이터 요청을 할 수 있는 시스템 구축에 대해서도 고민하였습니다.

/api/:id 경로에서 동적 경로 매개변수(id)를 사용하여 클라이언트에서 원하는 리그의 데이터만 요청할 수 있도록 구현하였고, Promise.all 메서드 활용하여 여러 리그의 데이터들을 동시에 처리 후 JSON 형태로 반환함으로써 성능 최적화를 도모하였습니다.

### 요청 제한 및 인증 토큰 관리
외부 API를 사용함에 있어, 악의적인 요청에 대한 제한과 인증

토큰을 관리 하는 것도 중요한 문제 중 하나였습니다. 특히, 악의적인 사용자에 의해 서버가 과도한 요청을 받아 처리능력을 초과하는 상황, 또는 API 호출 횟수 제한을 넘어서는 경우를 방지하기 위해 적절한 대응이 필요하였습니다.

이 문제를 해결하기 위해 express-rate-limit 라이브러리를 도입하여 IP 주소 당 요청 횟수를 제한하는 방안을 구현하였습니다. 이는 과도한 요청으로 인해 발생할 수 있는 서버 부담과 비용 증가 문제를 예방하는 데 크게 기여하였습니다.

또한, 외부 API 호출 시 필요한 인증 토큰은 .env 파일과 dotenv 라이브러리를 활용하여 안전하게 관리하였습니다. 이렇게 함으로써 보안성 강화와 함께 API 비용 및 서버의 통신비용 절감에 성공하였습니다.

