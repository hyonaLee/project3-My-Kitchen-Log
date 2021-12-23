const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");
const cors = require('cors');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const mongoose = require("mongoose");
  mongoose
  .connect(config.mongoURI, {
    // userNewUrlParser: true, 
    useUnifiedTopology:true, 
    // useCreateIndex:true, 
    // useFindAndModify:false
  })
  .then(() => console.log("mongoDB Connected...."))
  .catch((err) => console.log("mongoDB Connect err!!",err));

app.get("/", (req, res) => res.send("Hello world!!!"));

app.get("/api/hello", (req, res) => res.send("HELLO"));

app.post("/api/users/register", (req, res) => {
  //회원가입 시 필요한 정보들을 client에서 가져오면
  //그것들을 데이터베이스에 넣어준다.

  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.post("/api/users/login", (req, res) => {
  console.log(req.body);
  //요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }
  //이메일이 맞다면 비밀번호가 맞는지 확인
  user.comparePassword(req.body.password, (err, isMatch) => {
    if (!isMatch)
      return res.json({
        loginSuccess: false,
        message: "비밀번호가 틀렸습니다.",
      });
      //비밀번호도 맞는게 확인되면 토큰 생성
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
          //쿠키에 토큰 저장
          res
            .cookie("x_auth", user.token)
            .status(200)
            .json({ loginSuccess: true, userId: user._id });
        });
    });
  });
});


app.get('/api/users/logout', auth, (req, res) => {
  console.log('logout req.user', req.user)
  User.findOneAndUpdate({ _id: req.user._id },
    { token: "" }
    , (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true
      })
    })
})

// role 1 어드민 / role 2 특정 부서 어드민
// role 0 일반유저 role 0이 아니면 관리자
app.get("/api/users/auth", auth, (req, res) => {
  //여기까지 미들웨어를 통과해 왔다는 말은 Authentication이 true라는 말.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
    image: req.user.image,
  });
});


const port = 5000;

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`));
