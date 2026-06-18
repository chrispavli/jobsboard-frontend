'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  jobType: string | null;
}

export default function JobList({ jobs }: { jobs: Job[] }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const jobTypes = ['All', ...new Set(jobs.map((job) => job.jobType).filter(Boolean))] as string[];

  const filtered = jobs.filter((job) => {
    const matchesType = filter === 'All' || job.jobType === filter;
    const matchesSearch =
      search === '' ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4">
        <input
          type="text"
          placeholder="Search by job title or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400"
        />
        <div className="flex gap-2">
          {jobTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded-md text-sm font-medium border transition-all ${
                filter === type
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 && (
          <p className="text-gray-500 text-sm">No jobs found.</p>
        )}
        {filtered.map((job) => (
          <Link key={job.id} href={`/jobs/${job.id}`} className="block">
            <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{job.title}</h2>
                  <p className="text-gray-600 mt-1">{job.company}</p>
                  <p className="text-sm text-gray-500">{job.location}</p>
                  <p className="text-sm text-gray-500">{job.salary}</p>
                </div>
                {job.jobType && (
                  <span className="shrink-0 px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-bold">
                    {job.jobType}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
