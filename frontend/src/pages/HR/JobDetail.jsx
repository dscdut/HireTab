import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { jobApi } from '@/core/services/job.service';
import { toast } from 'react-toastify';
import { ArrowLeft } from "lucide-react"
import { marked } from 'marked';

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
    // Check if both min and max are valid numbers
    if (!min || !max || isNaN(min) || isNaN(max)) {
      return "Salary not specified";
    }

    const formatNumber = (num) =>
      num.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

    return `${formatNumber(min)} - ${formatNumber(max)}`
  }

  // Helper function to safely get job property with fallback
  const getJobProperty = (property, fallback = "Not specified") => {
    return job && job[property] ? job[property] : fallback;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section with blue overlay */}
      <div className="relative">
        <div className="absolute inset-0 bg-blue-600/80 z-10" />
        <div
          className="relative bg-cover bg-center h-[400px]"
          style={{ backgroundImage: "url('https://github.com/meishenry/HireNova/blob/main/%E1%BB%A8ng%20Vi%C3%AAn/M%C3%B4%20t%E1%BA%A3%20c%C3%B4ng%20vi%E1%BB%87c%20khi%20ch%C6%B0a%20apply%20(%E1%BB%A9ng%20vi%C3%AAn)/images/main-image.jpg?raw=true')" }}
        >
          {/* Navigation */}
          <div className="relative z-20 p-6">
            <button className="flex items-center text-white hover:text-blue-100 transition"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              <span>Open Positions</span>
            </button>
          </div>

          {/* Job Title and Location */}
          <div className="relative z-20 flex flex-col justify-center h-full px-6 pb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{getJobProperty('title', 'Job Title')}</h1>
            <div className="text-white text-lg">{getJobProperty('location', 'Location')} | {getJobProperty('employmentType', 'Full-Time')}</div>
          </div>

          {/* Apply Button */}
          <div className="absolute z-20 top-6 right-6">
            <button className="bg-white text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50 transition font-medium"
              onClick={() => navigate(`/hr/job-dashboard/${job?.id}`)}>
              View List Candidate
            </button>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-2xl font-bold mb-6">About the Company</h2>
          <p className="text-gray-700 mb-4">
            Google Developer Student Clubs (GDSC) là chương trình toàn cầu của Google Developers dành cho sinh viên đam
            mê công nghệ tại các trường đại học, cao đẳng và các tổ chức giáo dục khác.
          </p>
          <p className="text-gray-700">
            Tụ hào là một trong những chapter của GDSC, Google Developer Student Club - Danang University of Science and
            Technology (GDSC - DUT) là cộng đồng các bạn trẻ đam mê công nghệ cùng nhau học hỏi và xây dựng những giải
            pháp nhằm giải quyết các vấn đề tại địa phương thông qua các sự kiện và hoạt động từ nguồn tài nguyên của
            Google.
          </p>
        </div>
      </div>

      {/* Job Details */}
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Job Description</h2>
            {/* <p className="text-gray-700 mb-8">{getJobProperty('description', 'No description available')}</p> */}
            <div
              className="prose text-gray-700 mb-8"
              dangerouslySetInnerHTML={{
                __html: marked(getJobProperty('description', 'No description available')),
              }}
            />
            <h2 className="text-2xl font-bold mb-4">Requirements</h2>
            <ul className="list-disc pl-5 text-gray-700 mb-8">
              {job?.requirements && Array.isArray(job.requirements) && job.requirements.length > 0 ? (
                job.requirements.map((requirement, index) => (
                  <li key={index} className="mb-2">{requirement}</li>
                ))
              ) : (
                <>
                  <li className="mb-2">Bachelor's degree in Computer Science or related field</li>
                  <li className="mb-2">3+ years of experience with modern JavaScript frameworks</li>
                  <li className="mb-2">Strong understanding of web technologies and RESTful APIs</li>
                  <li className="mb-2">Experience with database design and optimization</li>
                  <li className="mb-2">Excellent problem-solving and communication skills</li>
                </>
              )}
            </ul>

            <h2 className="text-2xl font-bold mb-4">Responsibilities</h2>
            <ul className="list-disc pl-5 text-gray-700">
              {job?.responsibilities && Array.isArray(job.responsibilities) && job.responsibilities.length > 0 ? (
                job.responsibilities.map((responsibility, index) => (
                  <li key={index} className="mb-2">{responsibility}</li>
                ))
              ) : (
                <>
                  <li className="mb-2">Develop and maintain web applications</li>
                  <li className="mb-2">Collaborate with cross-functional teams</li>
                  <li className="mb-2">Implement responsive design and ensure cross-browser compatibility</li>
                  <li className="mb-2">Optimize applications for maximum speed and scalability</li>
                  <li className="mb-2">Participate in code reviews and contribute to team knowledge sharing</li>
                </>
              )}
            </ul>
          </div>

          <div className="md:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Job Details</h3>

              <div className="mb-4">
                <p className="text-gray-500 text-sm">Industry</p>
                <p className="font-medium">{getJobProperty('industryName', 'Not specified')}</p>
              </div>

              <div className="mb-4">
                <p className="text-gray-500 text-sm">Job Level</p>
                <p className="font-medium">{getJobProperty('level', 'Mid-Senior Level')}</p>
              </div>

              <div className="mb-4">
                <p className="text-gray-500 text-sm">Employment Type</p>
                <p className="font-medium">{getJobProperty('employmentType', 'Full-Time')}</p>
              </div>

              <div className="mb-4">
                <p className="text-gray-500 text-sm">Salary Range</p>
                <p className="font-medium">{formatSalary(job?.salaryMin, job?.salaryMax)}</p>
              </div>

              <div className="mb-4">
                <p className="text-gray-500 text-sm">Status</p>
                <p className="font-medium">{getJobProperty('status', 'Open')}</p>
              </div>

              <div className="mt-8">
                <button className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition font-medium"
                  onClick={() => navigate(`/hr/job-dashboard/${job?.id}`)}>
                  View List Candidate
                </button>
              </div>
            </div>
          </div>
        </div>

        <style>
          {`.prose ul {
      list-style-type: disc;
      padding-left: 1.5rem;
    }
    .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
      font-weight: bold;
    }`}
        </style>
      </div>
    </div>
  );
}