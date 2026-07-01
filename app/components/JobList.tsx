'use client';

import { useState } from 'react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  jobType: string | null;
  body: string | null;
}

export default function JobList({ jobs }: { jobs: Job[] }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(jobs[0]?.id ?? null);

  const jobTypes = ['All', ...new Set(jobs.map((job) => job.jobType).filter(Boolean))] as string[];

  const filtered = jobs.filter((job) => {
    const matchesType = filter === 'All' || job.jobType === filter;
    const matchesSearch =
      search === '' ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const selected = jobs.find((j) => j.id === selectedId) ?? null;

  return (
    <div className="flex gap-6 items-start">
      {/* Left: list */}
      <div className="w-full md:w-2/5 shrink-0">
        <div className="mb-6 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Search by job title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400"
          />
          <div className="flex flex-wrap gap-2">
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

        <div className="space-y-3">
          {filtered.length === 0 && (
            <p className="text-gray-500 text-sm">No jobs found.</p>
          )}
          {filtered.map((job) => (
            <button
              key={job.id}
              onClick={() => setSelectedId(job.id)}
              className={`w-full text-left border rounded-xl p-5 transition-all ${
                selectedId === job.id
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">{job.title}</h2>
                  <p className="text-gray-600 text-sm mt-0.5">{job.company}</p>
                  <p className="text-xs text-gray-500 mt-1">{job.location} · {job.salary}</p>
                </div>
                {job.jobType && (
                  <span className="shrink-0 px-2.5 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-bold">
                    {job.jobType}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: detail panel */}
      <div className="hidden md:block flex-1 sticky top-6">
        {selected ? (
          <div className="border border-gray-200 rounded-2xl p-8 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selected.title}</h2>
                <p className="text-gray-600 mt-1">{selected.company}</p>
              </div>
              {selected.jobType && (
                <span className="shrink-0 px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-bold">
                  {selected.jobType}
                </span>
              )}
            </div>

            <div className="flex gap-6 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
              <span>{selected.location}</span>
              <span>{selected.salary}</span>
            </div>

            {selected.body ? (
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: selected.body }}
              />
            ) : (
              <p className="text-gray-400 text-sm">No description available.</p>
            )}

            <div className="mt-8">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Apply Now
              </button>
            </div>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-2xl p-8 bg-white text-center text-gray-400 text-sm">
            Select a job to view details
          </div>
        )}
      </div>
    </div>
  );
}
