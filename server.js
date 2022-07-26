const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const saltRounds = 10;

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.listen(5000, () => {
  console.log('app is runnning on port 5000');
});

const database = {
  users: [
    {
      id: '100',
      email: 'wonmadesign@gmail.com',
      firstName: 'Wonmi',
      lastName: 'Kwon',
      password: '12345',
      createdDate: new Date(),
      activity: {
        totalScore: 100,
        totalCredit: 300
      }
    },
    {
      id: '101',
      email: 'josh.thomp86@gmail.com',
      firstName: 'Josh',
      lastName: 'Thompson',
      password: '678910',
      createdDate: new Date(),
      activity: {
        totalScore: 200,
        totalCredit: 250
      }
    }
  ]
};

app.get('/', (req, res) => {
  // root route(?)에 GET하여 요청하는 정보는 뭘까? 추측: index.html문서가 될 것 같습니다.
  res.json(database.users);
});

app.post('/signin', (req, res) => {
  const lastUser = database.users[database.users.length - 1];
  const { email, password } = req.body;
  if (lastUser.email === email && lastUser.password === password) {
    res.json({
      id: lastUser.id,
      firstName: lastUser.firstName,
      email: lastUser.email,
      activity: lastUser.activity
    });
  } else {
    res.status(400).json('error loggin in');
  }
  // bcrypt.compare(password, dbPassword, (err, result) => {
  //   if (result && dbEmail) {
  //     res.json('login permitted!');
  //   } else if (err) {
  //     throw err;
  //   } else {
  //     res.status(400).json('user not found');
  //   }
  // });
  // User Data가 request body에 쓰여지는건 맞는가?
  // 유저가 'abcde'라고 타이핑해서 submit했을텐데
  // 해당 data가 서버에 들어오는 순간 hash되므로, req.body를 출력해보일때는
  // 이미 hash된것이 보인다.. 이런건가요?
});

app.post('/register', (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  bcrypt.hash(password, saltRounds, (err, hash) => {
    // Add a user to DB
    database.users.push({
      id: '103',
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: hash,
      createdDate: new Date(),
      activity: {
        totalScore: 0,
        totalCredit: 300
      }
    });

    // Retrieve the user from DB
    const lastUser = database.users[database.users.length - 1];

    // Send selected data of the user to the client
    res.json({
      id: lastUser.id,
      firstName: lastUser.firstName,
      email: lastUser.email,
      activity: lastUser.activity
    });
  });
});

app.put('/image', (req, res) => {
  const { id, recentScore } = req.body;
  let isIdFound = false;
  database.users.forEach(user => {
    if (user.id === id) {
      user.activity.totalScore += recentScore;
      user.activity.totalCredit -= 10;
      isIdFound = true;
      res.json(user.activity);
    }
  });
  if (!isIdFound) {
    res.status(400).json('no user found.');
  }

  // [질문] 왜 route이름이 image가 되었는지 잘 모르겠음.
  // [질문] 이 totalScore, totalCredit 업뎃하는거는 DB내에서 로직으로 할 수 있나?
  // 어쨌든 하는 일은, Clarifai API로 fetch한 후
  // DB에 업데이트하고, (방금 얻은 이미지 스코어, 토탈스코어, 오늘의 시도 남은 횟수, 총 남은 크레딧)
  // -> response로 그 유저의 점수 및 크레딧 현황을 받아와서
  // front end에 setState로 보여주는 것.
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  // id는 스트링임!!!!!!대박!!!
  let isIdFound = false;
  database.users.forEach(user => {
    if (user.id == id) {
      isIdFound = true;
      res.json(user);
    }
  });
  if (!isIdFound) {
    res.status(400).json('no user found');
  }
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
