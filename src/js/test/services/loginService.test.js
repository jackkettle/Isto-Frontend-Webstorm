describe('istoApp.UsersApiService', function() {

  var UsersApi, Gapi;

  beforeEach(module('istoApp'));
  beforeEach(inject(function($injector) {
    UsersApi = $injector.get('UsersApi');
    Gapi = $injector.get( 'Gapi' );
  }));

  it('Should fail to login with invalid credentials', function() {
    var username = "admin";
    var password = "password";
    
    Gapi.load().then(function () {
        UsersApi(username, password).then(function (user) {
            expect(user.result).toEqual(false);
        });
    })
  });

});