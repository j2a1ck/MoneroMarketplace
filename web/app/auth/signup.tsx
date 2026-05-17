import type { Route } from "../+types/root"
import { useState } from "react"
import { SignUpForm } from "~/components/auth/sigupForm"
import { AuthHeader } from "~/components/auth/authHeader"
import { AuthImage } from "~/components/auth/authImage"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "crypto marketplace signup" },
    { name: "description", content: "signup in crypto marketplace" },
  ]
}

export default function signup() {
  const [isAgree, setIsAgree] = useState<boolean>(false)
  return (
    <div className="flex justify-center h-screen items-center">
      <div className=" w-160 h-180 mx-5 md:mx-0 md:rounded-none rounded-md  bg-white text-black">
        <AuthHeader header={"ثبت نام"} />
        <SignUpForm isAgree={isAgree} setIsAgree={setIsAgree} />
      </div>
      <AuthImage image={"/signup-form.png"} />
    </div>
  )
}
