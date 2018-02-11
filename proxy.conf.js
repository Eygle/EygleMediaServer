const PROXY_CONFIG = [
  {
    context: [
      "/api",
      "/register",
      "/login",
      "/logout",
      "/forgot-password",
      "/change-password",
      "/unlock-user",
      "/unsubscribe",
      "/dl"
    ],
    target: "http://localhost:4242",
    secure: false
  }
];

module.exports = PROXY_CONFIG;
