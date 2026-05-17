export function AuthHeader({header}:Readonly<{header: string}>) {
  return (
    <div className="flex justify-center my-5 ">
      <h1 className=" text-2xl font-medium">{header}</h1>
    </div>
  )
}
