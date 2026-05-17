export function AuthImage({ image }: { image: string }) {
  return (
    <img
      alt="signup form"
      src={`${image}`}
      className="w-160 h-180 hidden lg:block"
    />
  )
}
