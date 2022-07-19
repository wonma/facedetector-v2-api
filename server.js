const express = require('express');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.listen(3000, () => {
  console.log('app is runnning on port 3000');
});

app.get('/', (req, res) => {
  res.send('success');
});

app.post('/signin', (req, res) => {});

// app.post('/register', (req, res) => {});

// app.put('/image', (req, res) => {});

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
