import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { jobApi } from '@/core/services/job.service';
import { toast } from 'react-toastify';
import { ArrowLeft } from "lucide-react"

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  console.log('Job ID:', id); 

  const { data: job, isLoading, isError } = useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      try {
        console.log('Calling API for Job ID:', id);
        const response = await jobApi.getJobById(id);
        console.log('API Response:', response);
        return response;
      } catch (error) {
        console.error('API Error:', error);
        toast.error('Failed to load job details!');
        throw error;
      }
    },
    retry: false,
  });
console.log('Job Data:', job); 
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading job details!</div>;
  }
  const formatSalary = (min, max) => {
    const formatNumber = (num) =>
      num.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
    return `${formatNumber(min)} - ${formatNumber(max)}`
  }
  // Helper for days left
  const calculateDaysLeft = (endTime) => {
    const endDate = new Date(endTime);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days left` : 'Closed';
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero section with blue overlay */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600/80 to-blue-400/80 z-10" />
        <div
          className="relative bg-cover bg-center h-[340px] md:h-[420px]"
          style={{ backgroundImage: "url('https://github.com/meishenry/HireNova/blob/main/%E1%BB%A8ng%20Vi%C3%AAn/M%C3%B4%20t%E1%BA%A3%20c%C3%B4ng%20vi%E1%BB%87c%20khi%20ch%C6%B0a%20apply%20(%E1%BB%A9ng%20vi%C3%AAn)/images/main-image.jpg?raw=true')" }}
        >
          {/* Navigation */}
          <div className="relative z-20 p-6 flex items-center justify-between">
            <button className="flex items-center text-white hover:text-blue-100 transition text-lg font-medium bg-blue-700/40 px-4 py-2 rounded-lg shadow"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              <span>Back to Jobs</span>
            </button>
            <button className="bg-white text-blue-700 px-6 py-2 rounded-lg hover:bg-blue-50 transition font-bold shadow"
              onClick={() => navigate(`/hr/job-dashboard/${job.id}`)}>
              View Candidates
            </button>
          </div>
          {/* Job Title and Info */}
          <div className="relative z-20 flex flex-col justify-center h-full px-6 pb-10 md:pb-16 max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-white text-lg font-medium mb-2">
              <span className="bg-blue-900/60 px-3 py-1 rounded-full text-base">{job.location}</span>
              <span className="bg-blue-900/60 px-3 py-1 rounded-full text-base">Full-Time</span>
              <span className="bg-blue-900/60 px-3 py-1 rounded-full text-base">{job.level || 'Mid-Senior Level'}</span>
              <span className="bg-blue-900/60 px-3 py-1 rounded-full text-base">{job.industryName}</span>
              <span className="bg-red-500/80 px-3 py-1 rounded-full text-base">{calculateDaysLeft(job.endTime)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Left: Job Description, Requirements, Responsibilities */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow p-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-900">Job Description</h2>
            <p className="text-gray-700 mb-8 text-base leading-relaxed">{job.description}</p>

            <h2 className="text-2xl font-bold mb-4 text-blue-900">Requirements</h2>
            <ul className="list-disc pl-5 text-gray-700 mb-8 space-y-2">
              <li>Bachelor's degree in Computer Science or related field</li>
              <li>3+ years of experience with modern JavaScript frameworks</li>
              <li>Strong understanding of web technologies and RESTful APIs</li>
              <li>Experience with database design and optimization</li>
              <li>Excellent problem-solving and communication skills</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4 text-blue-900">Responsibilities</h2>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Develop and maintain web applications</li>
              <li>Collaborate with cross-functional teams</li>
              <li>Implement responsive design and ensure cross-browser compatibility</li>
              <li>Optimize applications for maximum speed and scalability</li>
              <li>Participate in code reviews and contribute to team knowledge sharing</li>
            </ul>
          </div>

          {/* Right: Job Info Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6 sticky top-32">
              <h3 className="text-xl font-bold mb-2 text-blue-900">Job Info</h3>
              <div>
                <p className="text-gray-500 text-sm">Industry</p>
                <p className="font-semibold text-blue-800">{job.industryName}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Job Level</p>
                <p className="font-semibold text-blue-800">{job.level || "Mid-Senior Level"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Employment Type</p>
                <p className="font-semibold text-blue-800">Full-Time</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Salary Range</p>
                <p className="font-semibold text-blue-800">{formatSalary(job.salary_min, job.salary_max)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Status</p>
                <p className="font-semibold text-blue-800">{job.status}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Days Left</p>
                <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">{calculateDaysLeft(job.endTime)}</span>
              </div>
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white py-3 rounded-xl font-bold text-lg shadow transition"
                onClick={() => navigate(`/hr/job-dashboard/${job.id}`)}>
                View Candidates
              </button>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow p-8">
            <h2 className="text-xl font-bold mb-4 text-blue-900">About the Company</h2>
            <p className="text-gray-700 mb-2">
              Google Developer Student Clubs (GDSC) là chương trình toàn cầu của Google Developers dành cho sinh viên đam mê công nghệ tại các trường đại học, cao đẳng và các tổ chức giáo dục khác.
            </p>
            <p className="text-gray-700">
              Tự hào là một trong những chapter của GDSC, Google Developer Student Club - Danang University of Science and Technology (GDSC - DUT) là cộng đồng các bạn trẻ đam mê công nghệ cùng nhau học hỏi và xây dựng những giải pháp nhằm giải quyết các vấn đề tại địa phương thông qua các sự kiện và hoạt động từ nguồn tài nguyên của Google.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}