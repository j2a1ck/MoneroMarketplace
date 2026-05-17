import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("signup", "./auth/signup.tsx"),
  route("login", "./auth/login.tsx"),
] satisfies RouteConfig
