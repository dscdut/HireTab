export const getEmailTemplate = (status, candidateData = {}, jobData = {}) => {
  const { name = '', jobPostingName = '' } = candidateData;
  const { companyName = 'HireTab.LTD' } = jobData;
  
  const templates = {
    Interview: {
      subject: `[INTERVIEW INVITATION - ${companyName}]`,
      body: `Dear ${name},

Thank you for your application for the ${jobPostingName} position. After reviewing your profile, we are impressed with your potential and believe you would be a great fit for this role. We would like to invite you for an interview to discuss your qualifications further and share more about our company story.

Please find the interview details below:

Time: 10:30 AM, Monday, April 21st, 2025

Location: Da Nang City, Vietnam

Important Note: Please confirm your attendance before 5:00 PM on April 19th, 2025.

(Upon arrival, please contact Admin - Ms. Kiet - +84 123 456 789)

If you have any questions, please reply to this email or contact us at 0917.240.812 (Ms. Quynh).

Best regards,
HR Department`
    },
    
    Hired: {
      subject: `[${companyName}] JOB OFFER_${jobPostingName}`,
      body: `Dear ${name},

HR Department of HireTab Software Technology Co., Ltd respectfully announces. After the review process, the company would like to recruit you for the position of ${jobPostingName}. You will:

1. Work at: Da Nang City, Vietnam
2. Position: ${jobPostingName}
3. Start date: 08:30 - Monday, April 21st, 2025
4. Official salary: To be discussed
5. Working hours: Monday - Friday (8:30 - 18:00)

PROBATION PERIOD:
1. Duration: 2 months
2. Probation salary: 85% of official salary
3. Other benefits: Salary review at least twice a year, project bonuses, 13th month salary, full health and social insurance...

After the probation period, you will be considered and become an official employee of HireTab.

If you agree with the offer, please respond with your information.

For any questions, please contact HR: +84 123 456 789 (Ms. Quynh)

(Offer Letter is attached in the file below)

Best regards,
HR Department`
    },
    
    Rejected: {
      subject: `[APPLICATION THANK YOU - ${companyName}]`,
      body: `Dear ${name},

First, ${companyName} would like to thank you for your interest in our recruitment process and for taking the time to interview with us.

We appreciate your skills and professional attitude. However, at this time, you are not quite suitable for the company's current direction. Unfortunately, we do not have the opportunity to collaborate in this recruitment round.

We will store your profile in our system and contact you if there are suitable positions in the future. We hope to accompany you on other journeys.

Best regards,
HR Department`
    }
  };

  return templates[status] || null;
};

export const getEmailTemplateByCurrentStatus = (currentStatus, candidateData, jobData) => {
  switch (currentStatus) {
    case 'In-Review':
      return getEmailTemplate('Interview', candidateData, jobData);
    case 'Interview':
      return getEmailTemplate('Hired', candidateData, jobData);
    case 'Hired':
      return null; // No email template for hired candidates
    case 'Rejected':
      return getEmailTemplate('Rejected', candidateData, jobData);
    default:
      return null;
  }
};

export const shouldSendEmailForStatus = (toStatus) => {
  return ['Interview', 'Hired', 'Rejected'].includes(toStatus);
};

export const getEmailTemplateForTransition = (fromStatus, toStatus, candidateData, jobData) => {
  if (shouldSendEmailForStatus(toStatus)) {
    return getEmailTemplate(toStatus, candidateData, jobData);
  }
  return null;
};