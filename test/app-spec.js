const {
    app
  } = require('../src/app');
  const {
    asyncReadFile,
    asyncWriteFile
  } = require('../src/dao')
  const request = require('supertest');
  
  describe("app", () => {
    describe("get request", () => {
      it("should get all todos when request url pattern is '/api/tasks'", (done) => {
        app.locals.dataFilePath = "./test/fixture.json"
        request(app).get('/api/tasks').expect(200).expect([
            {
                "id": "1",
                "content": "AAAA",
                "createdTime": "2019-05-15T00:00:00Z"
            },
            {
                "id": "2",
                "content": "BBBB",
                "createdTime": "2019-05-15T00:00:00Z"
            },
            {
                "id": 3,
                "comment": "CCC",
                "createdTime": "2020-3-20 13:50:00"
            }
        ]).end((err, res) => {
          if (err) throw err;
          done()
        })
      })
  
      it("should get specific todo when request url patten is '/api/tasks/:id'", (done) => {
        request(app).get('/api/tasks/1').expect(200).expect({
            "id": "1",
            "content": "AAAA",
            "createdTime": "2019-05-15T00:00:00Z"
        }).end((err, res) => {
          if (err) throw err;
          done()
        })
      })
    })
  
    describe("post request", () => {
      afterEach(async function () {
        await asyncWriteFile(JSON.stringify([
            {
                "id": "1",
                "content": "AAAA",
                "createdTime": "2019-05-15T00:00:00Z"
            },
            {
                "id": "2",
                "content": "BBBB",
                "createdTime": "2019-05-15T00:00:00Z"
            },
            {
                "id": 3,
                "comment": "CCC",
                "createdTime": "2020-3-20 13:50:00"
            }
        ]), "./test/fixture.json")
      })
      it("should create a todo when the corresponding email does not exist in the datasource", (done) => {
        request(app).post('/api/tasks').send({
            "id": 4,
            "comment": "DDDD",
            "createdTime": "2020-3-20 13:50:00"
        }).expect(201).expect([
            {
                "id": "1",
                "content": "AAAA",
                "createdTime": "2019-05-15T00:00:00Z"
            },
            {
                "id": "2",
                "content": "BBBB",
                "createdTime": "2019-05-15T00:00:00Z"
            },
            {
                "id": 3,
                "comment": "CCC",
                "createdTime": "2020-3-20 13:50:00"
            }, 
            {
                "id": 4,
                "comment": "DDDD",
                "createdTime": "2020-3-20 13:50:00"
            }
        ]).end((err, res) => {
          if (err) throw err;
          done()
        })
      })
  
      it("should not create the todo when its email has already existed in the datasource", (done) => {
        request(app).post('/api/tasks').send({
            "id": "1",
            "content": "AAAA",
            "createdTime": "2019-05-15T00:00:00Z"
        }).expect(400).end((err, res) => {
          if (err) throw err;
          done()
        })
      })
    })
  })
  