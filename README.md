# Json Web Token Sample

본 문서는 node.js를 이용하여 JWT를 구현한 프로젝트입니다.

## Getting Start

```
1. .env 설정
2. sqlite3 DB 생성
3. /src/loaders/sequelize
sequelize.sync({ alter: true })
첫 실행시, DB Sync를 위해 주석 제거
```

```
npm install
npm start
```

### .env

Example

```
PORT=7000
JWT_KEY=1q2w3e4r!
DB_LOCAL_STORAGE=./elysia.db
```

## Structure

Sam Quinn의 "[Bulletproof node.js project architecture](https://softwareontheroad.com/ideal-nodejs-project-structure/)"을 기본 구조로 사용하고 있습니다.

```
src
- config: 설정 파일
- controllers: 컨트롤러
- loaders: 설정 모듈
- models: 데이터 모델
- routes: 라우터
- services: 비지니스 로직
- types: 커스텀 타입
index.ts: 시작 파일
```

## API

[API Document](https://documenter.getpostman.com/view/3471868/TzRYc4mg)

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/01d9c0924ecca32f2cbc)

## Logic

### Email Confirm

![Email Confirm](https://res.cloudinary.com/wet932/image/upload/v1621407240/ETC/Email_Confirm.png)

1. POST /members/email
2. 이메일 주소 검증
3. 검증키를 가진 이메일 전송
4. 이메일 수신, 버튼 클릭
5. 이메일, 키 확인
6. 이메일 확인 회원으로 변경

### Prevent CSRF or XSS

- **XSS**: Cross Site Scripting, 권한이 없는 사용자가 웹 사이트 스크립트를 삽입하는 공격 기법
- **CSRF**: Cross Site Request Forgery, 사용자가 자신의 의지와는 무관하게 공격자가 의도한 행위를 특정 웹사이트에 요청하게 만드는 공격

**JWT의 XSS, CSRF 방지대책**
쿠키를 사용하여 방지

- [XSS] httpOnly 속성을 사용하여 쿠키를 탈취하는 스크립트를 막을 수 있다.
- [XSS] secure 속성을 사용하여 https일 때만 전송하게 한다.
- [CSRF] CORS 도메인 설정

## DataBase

### Member

```
@Unique(true)
@Column(DataType.STRING)
email!: string;

@AllowNull(false)
@Column(DataType.STRING)
password!: string;

@AllowNull(false)
@Unique(true)
@Column(DataType.STRING)
nickName!: string;

@Column(DataType.STRING)
refreshToken!: string;
@Column(DataType.STRING)
salt!: string;

@Column(DataType.STRING)
verifyKey!: string;

@Column(DataType.ENUM('admin', 'member', 'semi'))
role!: string;
```
