import type { Route } from "../+types/root"
import { LogInForm } from "~/components/auth/loginForm"
import { AuthHeader } from "~/components/auth/authHeader"
import { AuthImage } from "~/components/auth/authImage"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "crypto marketplace login" },
    { name: "description", content: "login in crypto marketplace" },
  ]
}

export default function signup() {
  return (
    <div className="flex justify-center h-screen items-center">
      <div className=" w-160 h-180 mx-5 md:mx-0 md:rounded-none rounded-md  bg-white text-black">
        <AuthHeader header={"ورود"} />
        <LogInForm />
      </div>
      <AuthImage image={"login-form.png"} />
    </div>
  )
}
