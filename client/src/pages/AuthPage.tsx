import { FC, FormEvent, useEffect, useRef } from "react"
import { Button } from "@mui/material"
import { RootState, useAppDispatch, useAppSelector } from "../store/store"
import { connect } from "../store/actions/appActions"
import { Loader } from "../components/Loader/Loader"

export const AuthPage: FC = () => {
  const { errorMessage, loading } = useAppSelector((state: RootState) => state.app)
  const dispatch = useAppDispatch()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  })

  const singInHandler = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    if (inputRef.current?.value) {
      dispatch(connect(inputRef.current.value.trim().toLowerCase()))
    }
  }

  return (
    <div
      className="max-w-[460px] relative sm:mx-auto my-[25vh] h-[35vh] text-center bg-sky-100 p-5 mx-4 border-8 border-green-200">
      <p className="bg-red-100 rounded text-gray-800 text-lg absolute top-7 left-7 right-7">{errorMessage}</p>
      <div className="absolute top-16 left-7 right-7">
        <p className="text-gray-500 text-center text-4xl mb-3">Enter nickname</p>
        <form onSubmit={(e) => singInHandler(e)}>
          <input className="outline-none rounded mb-3 px-4 py-2 sm:w-2/3 text-xl" ref={inputRef}/>
        </form>
      </div>
      <div className="absolute bottom-5 right-10">
        {loading ? <Loader/>: <Button onClick={() => singInHandler()}>Sign in</Button>}
      </div>
    </div>
  )
}
