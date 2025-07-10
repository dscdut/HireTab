/**
 * @param {import("knex")} knex
 */
exports.seed = async knex => {
    await knex('job_postings').del();

    await knex('job_postings').insert([
        {
            user_id: 4,
            industry_id: 1,
            title: 'Senior Full-Stack Developer',
            description: 'We are looking for an experienced Full-Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern frameworks and technologies.',
            location: 'Ho Chi Minh City, Vietnam',
            emoloyment_type: 'Full-time',
            requirements: JSON.stringify([
                "Bachelor's degree in Computer Science or related field",
                "3+ years experience with React/Node.js",
                "Knowledge of databases (SQL/NoSQL)",
                "Experience with Git and CI/CD",
                "Strong problem-solving skills"
            ]),
            responsibilities: JSON.stringify([
                "Develop frontend and backend features",
                "Write clean and maintainable code",
                "Collaborate with cross-functional teams",
                "Participate in code reviews",
                "Mentor junior developers"
            ]),
            salary_min: 20000000,
            salary_max: 35000000,
            status: 'To Do',
            level: 'Senior',
            desc_rate: 'Competitive salary with performance bonus and comprehensive benefits package.',
            start_time: '2025-07-15 09:00:00',
            end_time: '2025-08-15 18:00:00',
            deleted_at: null,
        },
        {
            user_id: 4,
            industry_id: 2,
            title: 'Machine Learning Engineer',
            description: 'Join our AI team to build and optimize machine learning models for cutting-edge applications. Work with large datasets and deploy ML solutions at scale.',
            location: 'Hanoi, Vietnam',
            emoloyment_type: 'Full-time',
            requirements: JSON.stringify([
                "Master's degree in AI/ML or related field",
                "2+ years experience with Python/TensorFlow/PyTorch",
                "Strong mathematical background in statistics/linear algebra",
                "Experience with cloud platforms (AWS/GCP/Azure)",
                "Knowledge of MLOps practices"
            ]),
            responsibilities: JSON.stringify([
                "Design and implement ML algorithms",
                "Optimize model performance and accuracy",
                "Deploy models to production environments",
                "Research new ML techniques and frameworks",
                "Collaborate with data engineering team"
            ]),
            salary_min: 25000000,
            salary_max: 45000000,
            status: 'In Progress',
            level: 'Mid-level',
            desc_rate: 'Exciting opportunity to work on AI projects with international clients.',
            start_time: '2025-07-20 09:00:00',
            end_time: '2025-08-20 17:00:00',
            deleted_at: null,
        },
        {
            user_id: 4,
            industry_id: 3,
            title: 'Cybersecurity Specialist',
            description: 'Protect our digital infrastructure by monitoring security threats, implementing security measures, and responding to incidents.',
            location: 'Da Nang, Vietnam',
            emoloyment_type: 'Full-time',
            requirements: JSON.stringify([
                "Bachelor's degree in Cybersecurity or IT",
                "Security certifications (CISSP, CEH, CISM)",
                "Experience with security tools and frameworks",
                "Knowledge of compliance standards (ISO 27001, GDPR)",
                "Understanding of network security protocols"
            ]),
            responsibilities: JSON.stringify([
                "Monitor security systems and alerts",
                "Conduct security assessments and audits",
                "Implement security policies and procedures",
                "Respond to security incidents and breaches",
                "Train staff on security best practices"
            ]),
            salary_min: 18000000,
            salary_max: 30000000,
            status: 'Done',
            level: 'Mid-level',
            desc_rate: 'Critical role ensuring company and client data security.',
            start_time: '2025-07-10 08:00:00',
            end_time: '2025-08-10 16:00:00',
            deleted_at: null,
        },
        {
            user_id: 4,
            industry_id: 4,
            title: 'Cloud Solutions Architect',
            description: 'Design and implement cloud infrastructure solutions for enterprise clients. Lead cloud migration projects and optimize cloud costs.',
            location: 'Remote',
            emoloyment_type: 'Part-time',
            requirements: JSON.stringify([
                "Cloud certifications (AWS Solutions Architect, Azure Architect)",
                "5+ years experience with cloud platforms",
                "Experience with Infrastructure as Code (Terraform, CloudFormation)",
                "Strong communication and leadership skills",
                "Knowledge of DevOps practices and CI/CD"
            ]),
            responsibilities: JSON.stringify([
                "Design scalable cloud architectures",
                "Lead cloud migration projects",
                "Optimize cloud infrastructure costs",
                "Provide technical guidance to development teams",
                "Ensure security and compliance in cloud environments"
            ]),
            salary_min: 30000000,
            salary_max: 50000000,
            status: 'To Do',
            level: 'Senior',
            desc_rate: 'Remote work opportunity with flexible schedule.',
            start_time: '2025-08-01 09:00:00',
            end_time: '2025-09-01 17:00:00',
            deleted_at: null,
        },
        {
            user_id: 4,
            industry_id: 5,
            title: 'Data Scientist Intern',
            description: 'Learn and contribute to data science projects. Analyze data, build predictive models, and create data visualizations.',
            location: 'Ho Chi Minh City, Vietnam',
            emoloyment_type: 'Internship',
            requirements: JSON.stringify([
                "Currently pursuing degree in Data Science/Statistics/Mathematics",
                "Basic knowledge of Python/R programming",
                "Familiarity with data analysis tools (pandas, numpy)",
                "Strong analytical and problem-solving skills",
                "Eagerness to learn new technologies"
            ]),
            responsibilities: JSON.stringify([
                "Analyze datasets and extract insights",
                "Build simple machine learning models",
                "Create data visualizations and reports",
                "Support senior data scientists on projects",
                "Participate in team meetings and learning sessions"
            ]),
            salary_min: 5000000,
            salary_max: 8000000,
            status: 'Closed',
            level: 'Intern',
            desc_rate: 'Great learning opportunity with mentorship from experienced data scientists.',
            start_time: '2025-06-01 09:00:00',
            end_time: '2025-07-01 17:00:00',
            deleted_at: null,
        },
    ]);
};
