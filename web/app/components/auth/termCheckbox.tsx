import { Link } from "react-router"

interface TermCheckboxProps {
  setIsAgree: (value: boolean) => void
}

export function TermCheckbox({ setIsAgree }: TermCheckboxProps) {
  return (
    <div className="flex mt-10 justify-end">
      <label htmlFor="agree">
        <Link to="/terms" className="text-amber-500 underline mx-1">
          قوانین
        </Link>
        را میپذیرم
      </label>
      <input
        onChange={(e) => setIsAgree(e.target.checked)}
        className="ml-2"
        type="checkbox"
      />
    </div>
  )
}
