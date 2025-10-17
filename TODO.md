# TODO: Modify Swagger UI to Add Authorization Header via requestInterceptor

- [ ] Edit server.js to add customJs in swaggerUi.setup options that sets a requestInterceptor to automatically add the Authorization header to all requests if req.swaggerAuth is present.
- [ ] Test the implementation by running the server and checking that Swagger UI requests include the Authorization header when authenticated.
