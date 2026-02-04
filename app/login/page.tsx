import { login, signup } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <form className="flex w-full max-w-sm flex-col gap-4">
        <h1 className="text-2xl font-bold">Login</h1>
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="rounded border p-2 text-black"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="rounded border p-2 text-black"
          />
        </div>
        {(await searchParams).error && (
          <p className="text-red-500">{(await searchParams).error}</p>
        )}
        <div className="flex gap-2">
          <button
            formAction={login}
            className="flex-1 rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
          >
            Log in
          </button>
          <button
            formAction={signup}
            className="flex-1 rounded bg-gray-500 p-2 text-white hover:bg-gray-600"
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  )
}
