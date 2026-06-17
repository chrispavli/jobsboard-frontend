import Link from 'next/link';

async function getJob(id) {
  const res = await fetch(`http://jobsboard.ddev.site/jsonapi/node/job_listing/${id}?include=field_job_type`);
  const data = await res.json();
  return { job: data.data, included: data.included };
}

export default async function JobPage({ params }) {
  const { id } = await params;
  const { job, included } = await getJob(id);

  const termId = job.relationships.field_job_type?.data?.id;
  const term = included?.find((item) => item.id === termId);
  const jobType = term?.attributes?.name || null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/" className="text-blue-600 hover:underline text-sm">← Back to jobs</Link>

      <div className="mt-6 border border-gray-200 rounded-xl p-8">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">{job.attributes.title}</h1>
          {jobType && (
            <span className="shrink-0 px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-bold">
              {jobType}
            </span>
          )}
        </div>

        <div className="mt-1 flex flex-col text-gray-600">
          <span className="flex items-center">
            {job.attributes.field_company}
          </span>
          <span className="flex items-center">
            {job.attributes.field_location}
          </span>
          <span className="flex items-center">
            {job.attributes.field_salary}
          </span>
        </div>

        {job.attributes.field_body && (
          <div className="mt-8 pt-8 border-t border-gray-200 text-gray-700 leading-relaxed">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h2>
            <p>{job.attributes.field_body}</p>
          </div>
        )}
      </div>
    </div>
  );
}