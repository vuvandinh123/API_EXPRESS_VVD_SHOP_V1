const request = require('supertest');
const app = require('../app'); // Đảm bảo rằng đường dẫn tới file app.js là đúng

describe('POST /v1/api/auth/login', () => {
    it('should return 200 ', (done) => {
        request(app)
            .post('/v1/api/auth/login')
            .send({ email: 'vuvandinh203@gmail.com', password: '06012003' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
    it('should return 400 error password ', (done) => {
        request(app)
            .post('/v1/api/auth/login')
            .send({ email: 'vuvandinh203@gmail.com', password: '0601200' })
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
    it('should return 400 error email ', (done) => {
        request(app)
            .post('/v1/api/auth/login')
            .send({ email: 'vuvandinh203dqwd@gmail.com', password: '0601200' })
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
    it('should return 400 empty password ', (done) => {
        request(app)
            .post('/v1/api/auth/login')
            .send({ email: 'vuvandinh203@gmail.com', password: '' })
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
    it('should return 400 empty email ', (done) => {
        request(app)
            .post('/v1/api/auth/login')
            .send({ email: '', password: '06012003' })
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
});

describe('POST /v1/api/auth/signup', () => {
    it('should return 201 ', (done) => {
        request(app)
            .post('/v1/api/auth/signup')
            .send({ email: 'vuvandinh203@gmail.com', password: '06012003' })
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
    it('should return 400 error password ', (done) => {
        request(app)
            .post('/v1/api/auth/signup')
            .send({ email: 'vuvandinh203@gmail.com', password: '0601200' })
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
    it('should return 400 error email ', (done) => {
        request(app)
            .post('/v1/api/auth/signup')
            .send({ email: 'vuvandinh203dqwd@gmail.com', password: '0601200' })
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
    it('should return 400 empty password ', (done) => {
        request(app)
            .post('/v1/api/auth/signup')
            .send({ email: 'vuvandinh203@gmail.com', password: '' })
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
    it('should return 400 empty email ', (done) => {
        request(app)
            .post('/v1/api/auth/signup')
            .send({ email: '', password: '06012003' })
            .expect(400)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
});
