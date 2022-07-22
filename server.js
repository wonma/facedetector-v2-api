const express = require('express');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(3000, () => {
  console.log('app is runnning on port 3000');
});

const database = {
  users: [
    {
      id: 100,
      email: 'wonmadesign@gmail.com',
      firstName: 'Wonmi',
      lastName: 'Kwon',
      password: '12345',
      createdDate: new Date(),
      activity: {
        recentScore: 0,
        totalScore: 100,
        totalCredit: 300
      }
    },
    {
      id: 101,
      email: 'josh.thomp86@gmail.com',
      firstName: 'Josh',
      lastName: 'Thompson',
      password: '678910',
      createdDate: new Date(),
      activity: {
        recentScore: 0,
        totalScore: 200,
        totalCredit: 250
      }
    }
  ]
};

// Fake DB - My Answer
// const users = [
//   {
//     id: 100,
//     email: 'wonmadesign@gmail.com',
//     firstName: 'Wonmi',
//     lastName: 'Kwon',
//     password: '12345',
//     createdDate: new Date(),
//     activity: {
//       recentScore: 0,
//       totalScore: 100,
//       totalCredit: 300
//     }
//   },
//   {
//     id: 101,
//     email: 'josh.thomp86@gmail.com',
//     firstName: 'Josh',
//     lastName: 'Thompson',
//     password: '678910',
//     createdDate: new Date(),
//     activity: {
//       recentScore: 0,
//       totalScore: 200,
//       totalCredit: 250
//     }
//   }
// ];

app.get('/', (req, res) => {
  // root route(?)에 GET하여 요청하는 정보는 뭘까? 추측: index.html문서가 될 것 같습니다.
  res.json(database.users);
});

app.post('/signin', (req, res) => {
  // 1. Read request
  const { email, password } = req.body;
  if (
    email === database.users[0].email &&
    password === database.users[0].password
  ) {
    res.json('login permitted!');
  } else {
    res.status(400).json('user not found');
  }
  // 2. Check with DB & Send response

  // User Data가 request body에 쓰여지는건 맞는가?
  // 유저가 'abcde'라고 타이핑해서 submit했을텐데
  // 해당 data가 서버에 들어오는 순간 hash되므로, req.body를 출력해보일때는
  // 이미 hash된것이 보인다.. 이런건가요?
});

app.post('/register', (req, res) => {
  const { email, fisrtName, lastName, password } = req.body;
  database.users.push({
    id: 103,
    email: email,
    firstName: fisrtName,
    lastName: lastName,
    password: password,
    createdDate: new Date(),
    activity: {
      recentScore: 0,
      totalScore: 0,
      totalCredit: 300
    }
  });
  res.json(database.users[database.users.length - 1]);
});

app.put('/image', (req, res) => {
  const { totalScore, totalCredit, recentScore } = req.body;
  users[0].activity.totalScore += recentScore;
  res.send(users[0].activity.totalScore); // 이게 안되는 이유 모르겠음

  // [질문] 왜 route이름이 image가 되었는지 잘 모르겠음.
  // [질문] 이 totalScore, totalCredit 업뎃하는거는 DB내에서 로직으로 할 수 있나?
  // 어쨌든 하는 일은, Clarifai API로 fetch한 후
  // DB에 업데이트하고, (방금 얻은 이미지 스코어, 토탈스코어, 오늘의 시도 남은 횟수, 총 남은 크레딧)
  // -> response로 그 유저의 점수 및 크레딧 현황을 받아와서
  // front end에 setState로 보여주는 것.
});

app.get('/profile/:id', (req, res) => {
  // [질문] 로그인 후 response로 받은 id를 이용하여 연이은 request를 하는건가?
  console.log(req.params.id);
  res.send(users[0].activity);
  // 유저의 사용현황 object를 통으로 response로 받아서, 유저의 대쉬보드에 개별화된 정보가 채워짐.
});

/* API endpoint - METHOD - response

/  -  GET  -  'success'메세지를 보내준다

유저가 로그인할 때
/signin  -  POST  -  user id를 보내준다? (다음 화면에서 parameter로 들어가서 개별화된 화면 나오도록)

유저가 최초 등록할 때
/register  -  POST  -  user오브젝트를 보내준다

유저가 home화면으로 direct될 때
/profile/:id  -  GET  -  user오브젝트를 보내준다

유저가 이미지주소 submit할때 
/image  -  PUT  -  user의 업데이트된 참여정보를 보내준다 (credits, total score, total attempts)


*/
