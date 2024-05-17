const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

describe('URL Access Restrictions', () => {
  const agent = chai.request.agent('http://localhost:3000');


  it('should redirect GET request to / to /login with status code 302', () => {
    return agent.get('/')
      .redirects(0) // Disable redirects
      .then((getResponse) => {
        // Check if status code is 302
        expect(getResponse).to.have.status(302);
      });

  });


  it("GET /urls/new should redirect to /login with status 302", () => {
    return agent.get("/urls/new").redirects(0).then((res) => {
      expect(res).to.redirectTo("/login");
      expect(res).to.have.status(302);
    });
  });


  it("GET /urls/NOTEXIST should redirect to /login with status 302", () => {
    return agent.get("/urls/NOTEXIST ").redirects(0).then((res) => {
      expect(res).to.redirectTo("/login");
      expect(res).to.have.status(302);
    });
  });

  it("GET /urls/i3BoGr should redirect to /login with status 302 since you are not logged in", () => {
    return agent.get("/urls/i3BoGr ").redirects(0).then((res) => {
      expect(res).to.redirectTo("/login");
      expect(res).to.have.status(302);
    });
  });


  it('should return status code 403 for accessing restricted URL when signed in ', () => {
    return agent.post('/register')
      .send({ email: 'user2@example.com', password: 'dishwasher-funk' })
      .then(() => {
        return agent.get('/urls/i3BoGr')
          .redirects(0) // Disable redirects
          .then((getResponse) => {
            // Check if status code is 403
            expect(getResponse).to.have.status(403);
          });
      });
  });



});