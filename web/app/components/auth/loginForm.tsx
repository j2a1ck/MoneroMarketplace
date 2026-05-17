import { useNavigate } from "react-router"
import useSWRMutation from "swr/mutation"
import { useState } from "react"

async function signUpRequest(
  url: string,
  { arg }: { arg: { username: string; password: string } },
) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: arg.username, password: arg.password }),
  })

  const data = await res.json()
  //FIXME make error persian
  if (!res.ok) throw new Error(data.message)
  return data
}

export function LogInForm() {
  const navigate = useNavigate()
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")

  const { trigger, isMutating, error } = useSWRMutation(
    "http://localhost:3001/auth/login/",
    signUpRequest,
  )

  const handleSubmit = async (e) => {
    e.preventDefault()

    await trigger({ username, password })
    navigate("/")
  }
  return (
    <div className="flex flex-col mt-18 items-center">
      {error && (
        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
          {error.message}
        </div>
      )}{" "}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-end">
        <label className="text-xl" htmlFor="username">
          یوزرنیم
        </label>
        <input
          className="border-gray-500 border mr-2  rounded-sm h-9 pl-2"
          placeholder="freedom21"
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label className="text-xl" htmlFor="password">
          پسورد
        </label>
        <input
          className="border-gray-500 border mr-2  rounded-sm h-9 pl-2"
          placeholder="Password"
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={isMutating}
          className={`md:w-80 mt-20 w-60 h-8 rounded-sm mx-5 text-white ${
            isMutating ? "bg-gray-500" : "bg-black cursor-pointer"
          }`}
        >
          {isMutating ? "در حال ثبت..." : "تایید"}
        </button>
      </form>
    </div>
  )
}
