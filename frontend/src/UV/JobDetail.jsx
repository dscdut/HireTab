import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { jobApi } from '@/core/services/job.service';
import { toast } from 'react-toastify';
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import ModalFormCandidate from './Modal/ModalFormCandidate'
import ChatWootWidget from '@/components/ui/chatwoot-widget';
import Header from '@/components/landing/Header';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  console.log('Job ID:', id);
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSubmit = (formData) => {
    console.log("Form submitted:", formData)
    setIsModalOpen(false)
  }
  
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading job details!</div>;
  }

  const formatSalary = (min, max) => {
    if (typeof min !== "number" || typeof max !== "number" || isNaN(min) || isNaN(max)) {
      return "Negotiable";
    }
    const formatNumber = (num) =>
      num.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
    return `${formatNumber(min)} - ${formatNumber(max)}`;
  }

  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen mt-24">
        {/* Hero section with blue overlay */}
        <div className="relative">
          <div className="absolute inset-0 z-10 bg-blue-600/80" />
          <div
            className="relative bg-cover bg-center h-[400px]"
            style={{ backgroundImage: "url('https://github.com/meishenry/HireNova/blob/main/%E1%BB%A8ng%20Vi%C3%AAn/M%C3%B4%20t%E1%BA%A3%20c%C3%B4ng%20vi%E1%BB%87c%20khi%20ch%C6%B0a%20apply%20(%E1%BB%A9ng%20vi%C3%AAn)/images/main-image.jpg?raw=true')" }}
          >
            <div className="relative z-20 p-6">
              <button className="flex items-center text-white transition hover:text-blue-100"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span>Open Positions</span>
              </button>
            </div>
            <div className="relative z-20 flex flex-col justify-center h-full px-6 pb-16">
              <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">{job.title}</h1>
              <div className="text-lg text-white">{job.location} | Full-Time</div>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="py-12 bg-gray-50">
          <div className="container max-w-4xl px-6 mx-auto">
            <h2 className="mb-6 text-2xl font-bold">About GDGoC - DUT</h2>
            <p className="mb-4 text-gray-700">
              GDGoC - DUT (Google Developer Group of Danang University of Science and Technology) is a vibrant tech community of students passionate about programming, design, and software development. With a strong spirit of learning and sharing, GDGoC connects young talents within and beyond the university to explore new technologies and build meaningful projects together.
            </p>
            <p className="mb-4 text-gray-700">
              We believe that every student has the potential to become a great engineer. GDGoC offers hands-on workshops, inspiring talk shows, hackathons, and mentorship programs to help members sharpen their skills, grow their networks, and gain a clearer career direction.
            </p>
            <p className="text-gray-700">
              Led by dedicated and experienced members, GDGoC continuously strives to innovate and grow. Whether you're a first-year student or already experienced, we welcome you to join GDGoC — to learn, grow, and contribute to a stronger tech community at DUT.
            </p>
          </div>
        </div>

        {/* Job Details */}
        <div className="container max-w-4xl px-6 py-12 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <h2 className="mb-4 text-2xl font-bold">Job Description</h2>
              <p className="mb-8 text-gray-700">{job.description}</p>

              <h2 className="mb-4 text-2xl font-bold">Requirements</h2>
              <ul className="pl-5 mb-8 text-gray-700 list-disc">
                <li className="mb-2">Bachelor's degree in Computer Science or related field</li>
                <li className="mb-2">3+ years of experience with modern JavaScript frameworks</li>
                <li className="mb-2">Strong understanding of web technologies and RESTful APIs</li>
                <li className="mb-2">Experience with database design and optimization</li>
                <li className="mb-2">Excellent problem-solving and communication skills</li>
              </ul>

              <h2 className="mb-4 text-2xl font-bold">Responsibilities</h2>
              <ul className="pl-5 text-gray-700 list-disc">
                <li className="mb-2">Develop and maintain web applications</li>
                <li className="mb-2">Collaborate with cross-functional teams</li>
                <li className="mb-2">Implement responsive design and ensure cross-browser compatibility</li>
                <li className="mb-2">Optimize applications for maximum speed and scalability</li>
                <li className="mb-2">Participate in code reviews and contribute to team knowledge sharing</li>
              </ul>
            </div>

            <div className="md:col-span-1">
              <div className="p-6 rounded-lg bg-gray-50">
                <h3 className="mb-4 text-xl font-semibold">Job Details</h3>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">Industry</p>
                  <p className="font-medium">{job.industryName}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">Job Level</p>
                  <p className="font-medium">{job.level || "Mid-Senior Level"}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">Employment Type</p>
                  <p className="font-medium">Full-Time</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">Salary Range</p>
                  <p className="font-medium">{formatSalary(job.salary_min, job.salary_max)}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{job.status}</p>
                </div>

                <div className="mt-8">
                  <button onClick={handleOpenModal} className="w-full py-3 font-medium text-white transition bg-blue-600 rounded-md hover:bg-blue-700">
                    Apply for this position
                  </button>
                </div>
              </div>
            </div>
          </div>
          <ModalFormCandidate
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleSubmit}
            jobId={job.id}
            jobTitle={job.title}
            jobLocation={job.location}
            jobLevel={job.level}
            jobDesRate={job.descRate}
            jobDes={job.description}  // Changed from jobDes to jobDescription
          />
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

        <ChatWootWidget />
      </div>
    </>
  );
}