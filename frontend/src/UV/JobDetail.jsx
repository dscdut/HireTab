import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { jobApi } from '@/core/services/job.service';
import { toast } from 'react-toastify';
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import ModalFormCandidate from './Modal/ModalFormCandidate'
import ChatWootWidget from '@/components/ui/chatwoot-widget';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  console.log('Job ID:', id); // Kiểm tra id
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
    // Handle form submission logic here
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
      console.log('Job data:', job);
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
    const formatNumber = (num) =>
      num.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
    return `${formatNumber(min)} - ${formatNumber(max)}`
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
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{job.title}</h1>
            <div className="text-white text-lg">{job.location} | Full-Time</div>
          </div>

          {/* Apply Button */}
          <div className="absolute z-20 top-6 right-6">
            <button onClick={handleOpenModal} className="bg-white text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50 transition font-medium">
              Apply Now
            </button>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-2xl font-bold mb-6">About the Company</h2>
          <p className="text-gray-700 mb-4">
            HireTab is a forward-thinking technology company committed to transforming the recruitment landscape. With a strong focus on innovation and user experience, we specialize in building modern, efficient, and scalable solutions that bridge the gap between job seekers and employers across various industries.
          </p>
          <p className="text-gray-700 mb-4">
            At HireTab, we believe that finding the right opportunity should be seamless, and hiring the right talent should be effortless. Our platform is designed to simplify the hiring process, enhance communication, and foster meaningful connections between companies and candidates through intelligent matching algorithms, real-time collaboration tools, and a user-friendly interface.
          </p>
          <p className="text-gray-700">
            Our team is made up of passionate engineers, designers, and recruitment experts who are dedicated to driving positive change in the job market. Whether you're a growing startup or an established enterprise, HireTab empowers you to discover top talent faster and build stronger teams. We are constantly evolving, embracing new technologies, and listening to our users to create the most effective solutions for the future of work.
          </p>
        </div>
      </div>

      {/* Job Details */}
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Job Description</h2>
            <p className="text-gray-700 mb-8">{job.description}</p>

            <h2 className="text-2xl font-bold mb-4">Requirements</h2>
            <ul className="list-disc pl-5 text-gray-700 mb-8">
              <li className="mb-2">Bachelor's degree in Computer Science or related field</li>
              <li className="mb-2">3+ years of experience with modern JavaScript frameworks</li>
              <li className="mb-2">Strong understanding of web technologies and RESTful APIs</li>
              <li className="mb-2">Experience with database design and optimization</li>
              <li className="mb-2">Excellent problem-solving and communication skills</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">Responsibilities</h2>
            <ul className="list-disc pl-5 text-gray-700">
              <li className="mb-2">Develop and maintain web applications</li>
              <li className="mb-2">Collaborate with cross-functional teams</li>
              <li className="mb-2">Implement responsive design and ensure cross-browser compatibility</li>
              <li className="mb-2">Optimize applications for maximum speed and scalability</li>
              <li className="mb-2">Participate in code reviews and contribute to team knowledge sharing</li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Job Details</h3>

              <div className="mb-4">
                <p className="text-gray-500 text-sm">Industry</p>
                <p className="font-medium">{job.industryName}</p>
              </div>

              <div className="mb-4">
                <p className="text-gray-500 text-sm">Job Level</p>
                <p className="font-medium">{job.level || "Mid-Senior Level"}</p>
              </div>

              <div className="mb-4">
                <p className="text-gray-500 text-sm">Employment Type</p>
                <p className="font-medium">Full-Time</p>
              </div>

              <div className="mb-4">
                <p className="text-gray-500 text-sm">Salary Range</p>
                <p className="font-medium">{formatSalary(job.salary_min, job.salary_max)}</p>
              </div>

              <div className="mb-4">
                <p className="text-gray-500 text-sm">Status</p>
                <p className="font-medium">{job.status}</p>
              </div>

              <div className="mt-8">
                <button onClick={handleOpenModal} className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition font-medium">
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
          jobDesRate={job.descRate}
          jobDes={job.description}
        />

      </div>

      <ChatWootWidget />
    </div>
  );
}