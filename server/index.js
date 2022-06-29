import express from 'express';
const app = express();

app.route('/test/get').get((req, res) => {
  res.send({
    code: 200
  });
});

app.route('/test/head').head((req, res) => {
  console.log(req.query);
  res.send();
});

app.route('/test/delete').delete((req, res) => {
  console.log(req.query);
  res.send({
    code: 200
  });
});

app.route('/test/post').post((req, res) => {
  console.log(req);
  res.send({
    code: 200
  });
});

app.route('/test/put').put((req, res) => {
  console.log(req.query);
  res.send({
    code: 200
  });
});

app.route('/test/patch').patch((req, res) => {
  console.log(req.query);
  res.send({
    code: 200
  });
});

app.route('/test/401').get((req, res) => {
  res.status(401).send('Something broke!');
});

app.route('/test/500').get((req, res) => {
  res.status(500).send({
    message: '500原因'
  });
});

app.route('/test/501').get((req, res) => {
  res.status(501).send({
    message: '501原因'
  });
});

app.listen(3000, () => {
  console.log(`Example app listening on port ${3000}`);
});
