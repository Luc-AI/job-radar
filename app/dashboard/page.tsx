import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Job } from '@/types/database.types'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetching data from the 'jobs' table
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .limit(10)

  return (
    <div className="flex min-h-screen flex-col p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-600">Logged in as: {user.email}</p>
          <form action="/auth/signout" method="post">
            <button className="text-sm text-red-500 hover:underline">Sign out</button>
          </form>
        </div>
      </div>

      <div className="grid gap-4">
        <h2 className="text-xl font-semibold">Job Postings</h2>
        {error && (
          <div className="p-4 bg-red-50 text-red-500 rounded border border-red-200">
            Error fetching jobs: {error.message}
            <p className="text-xs mt-2">
              Note: Make sure the &apos;jobs&apos; table exists in your Supabase database and has the correct RLS policies.
            </p>
          </div>
        )}
        {!jobs || jobs.length === 0 ? (
          <p className="text-gray-500 italic">No jobs found or table is empty.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Posted</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job: Job) => (
                  <tr key={job.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.title || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.organization || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.locations_raw || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.date_posted || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
