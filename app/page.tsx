import JobList from './components/JobList';

interface JobType {
  id: string;
  attributes: { name: string };
}

interface JobNode {
  id: string;
  attributes: {
    title: string;
    field_company: string;
    field_location: string;
    field_salary: string;
  };
  relationships: {
    field_job_type?: { data?: { id: string } };
  };
}

async function getJobs() {
  const res = await fetch(`${process.env.DRUPAL_API_URL}/jsonapi/node/job_listing?include=field_job_type`);
  const data = await res.json();
  return { jobs: data.data as JobNode[], included: data.included as JobType[] };
}

export default async function Home() {
  const { jobs, included } = await getJobs();

  function getJobType(job: JobNode): string | null {
    const termId = job.relationships.field_job_type?.data?.id;
    if (!termId) return null;
    const term = included.find((item) => item.id === termId);
    return term?.attributes?.name || null;
  }

  const normalised = jobs.map((job) => ({
    id: job.id,
    title: job.attributes.title,
    company: job.attributes.field_company,
    location: job.attributes.field_location,
    salary: job.attributes.field_salary,
    jobType: getJobType(job),
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Latest Positions</h1>
        <p className="text-gray-500">{jobs.length} positions available</p>
      </div>
      <JobList jobs={normalised} />
    </div>
  );
}
