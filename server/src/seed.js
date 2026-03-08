/**
 * Database Seed Script
 * Populates the database with sample users, companies, jobs, referrals,
 * conversations, messages, and notifications.
 *
 * Usage: node src/seed.js
 *        node src/seed.js --clear   (clear all data first)
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('./models/User');
const Company = require('./models/Company');
const Job = require('./models/Job');
const Referral = require('./models/Referral');
const Notification = require('./models/Notification');
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/job_referral_platform';

// ──────────────────────────────── USERS ────────────────────────────────

const usersData = [
  // ── Admin ──
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@jobreferral.com',
    password: 'Admin@1234',
    role: 'admin',
    headline: 'Platform Administrator',
    bio: 'Managing the Job Referral Platform and ensuring smooth operations for all users.',
    phone: '+1-555-100-0001',
    location: { city: 'San Francisco', state: 'California', country: 'USA' },
    skills: ['Platform Management', 'User Support', 'Analytics'],
    isEmailVerified: true,
    isActive: true,
  },

  // ── Referrers ──
  {
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@google.com',
    password: 'Referrer@1234',
    role: 'referrer',
    headline: 'Senior Software Engineer at Google',
    bio: 'Working at Google for 5+ years in the Search team. Passionate about helping talented engineers join great teams. Always willing to refer strong candidates who are passionate about building products at scale.',
    phone: '+1-555-200-0001',
    location: { city: 'Mountain View', state: 'California', country: 'USA' },
    skills: ['Java', 'Python', 'Distributed Systems', 'Machine Learning', 'System Design'],
    currentPosition: 'Senior Software Engineer',
    isVerifiedEmployee: true,
    referralCapacity: 5,
    referralsGivenThisMonth: 1,
    experience: [
      { title: 'Senior Software Engineer', company: 'Google', location: 'Mountain View, CA', startDate: new Date('2021-03-01'), current: true, description: 'Working on Google Search ranking algorithms and infrastructure.' },
      { title: 'Software Engineer', company: 'Google', location: 'Mountain View, CA', startDate: new Date('2019-06-01'), endDate: new Date('2021-02-28'), description: 'Built data pipelines for search quality.' },
    ],
    education: [
      { institution: 'Stanford University', degree: 'MS', field: 'Computer Science', startDate: new Date('2017-09-01'), endDate: new Date('2019-06-01') },
      { institution: 'IIT Delhi', degree: 'BTech', field: 'Computer Science', startDate: new Date('2013-08-01'), endDate: new Date('2017-05-01'), grade: '9.1/10' },
    ],
    socialLinks: { linkedin: 'https://linkedin.com/in/priyasharma', github: 'https://github.com/priyasharma' },
    isEmailVerified: true,
    isActive: true,
  },
  {
    firstName: 'Rahul',
    lastName: 'Verma',
    email: 'rahul.verma@microsoft.com',
    password: 'Referrer@1234',
    role: 'referrer',
    headline: 'Principal Engineer at Microsoft',
    bio: 'Leading the Azure Kubernetes Service team. 8+ years at Microsoft. Happy to refer talented engineers who are passionate about cloud and infrastructure.',
    phone: '+1-555-200-0002',
    location: { city: 'Redmond', state: 'Washington', country: 'USA' },
    skills: ['C#', '.NET', 'Azure', 'Kubernetes', 'Microservices', 'Go'],
    currentPosition: 'Principal Engineer',
    isVerifiedEmployee: true,
    referralCapacity: 5,
    referralsGivenThisMonth: 2,
    experience: [
      { title: 'Principal Engineer', company: 'Microsoft', location: 'Redmond, WA', startDate: new Date('2020-01-01'), current: true, description: 'Technical lead for Azure Kubernetes Service.' },
      { title: 'Senior Software Engineer', company: 'Microsoft', location: 'Redmond, WA', startDate: new Date('2016-07-01'), endDate: new Date('2019-12-31'), description: 'Built core Azure cloud infrastructure services.' },
    ],
    education: [
      { institution: 'MIT', degree: 'MS', field: 'Computer Science', startDate: new Date('2014-09-01'), endDate: new Date('2016-06-01') },
      { institution: 'IIT Bombay', degree: 'BTech', field: 'Computer Science', startDate: new Date('2010-08-01'), endDate: new Date('2014-05-01'), grade: '9.4/10' },
    ],
    socialLinks: { linkedin: 'https://linkedin.com/in/rahulverma', github: 'https://github.com/rahulverma' },
    isEmailVerified: true,
    isActive: true,
  },
  {
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@meta.com',
    password: 'Referrer@1234',
    role: 'referrer',
    headline: 'Engineering Manager at Meta',
    bio: 'Managing the Instagram Reels infrastructure team. Previously at Uber and Airbnb. Actively looking to refer strong full-stack and backend engineers.',
    phone: '+1-555-200-0003',
    location: { city: 'Menlo Park', state: 'California', country: 'USA' },
    skills: ['React', 'Python', 'PHP/Hack', 'GraphQL', 'Team Leadership', 'System Design'],
    currentPosition: 'Engineering Manager',
    isVerifiedEmployee: true,
    referralCapacity: 8,
    referralsGivenThisMonth: 0,
    experience: [
      { title: 'Engineering Manager', company: 'Meta', location: 'Menlo Park, CA', startDate: new Date('2022-01-01'), current: true, description: 'Leading Instagram Reels backend/infra team.' },
      { title: 'Senior Engineer', company: 'Uber', location: 'San Francisco, CA', startDate: new Date('2019-03-01'), endDate: new Date('2021-12-31'), description: 'Built real-time pricing and dispatch systems.' },
    ],
    education: [
      { institution: 'UC Berkeley', degree: 'MS', field: 'EECS', startDate: new Date('2016-09-01'), endDate: new Date('2018-06-01') },
      { institution: 'University of Michigan', degree: 'BS', field: 'Computer Science', startDate: new Date('2012-09-01'), endDate: new Date('2016-05-01') },
    ],
    socialLinks: { linkedin: 'https://linkedin.com/in/sarahchen', github: 'https://github.com/sarahchen' },
    isEmailVerified: true,
    isActive: true,
  },
  {
    firstName: 'Amit',
    lastName: 'Patel',
    email: 'amit.patel@amazon.com',
    password: 'Referrer@1234',
    role: 'referrer',
    headline: 'SDE III at Amazon Web Services',
    bio: 'Building AWS Lambda and serverless infrastructure. Love mentoring and referring motivated engineers. If you are passionate about distributed systems, let\'s connect!',
    phone: '+1-555-200-0004',
    location: { city: 'Seattle', state: 'Washington', country: 'USA' },
    skills: ['Java', 'AWS', 'Distributed Systems', 'DynamoDB', 'Serverless', 'TypeScript'],
    currentPosition: 'SDE III',
    isVerifiedEmployee: true,
    referralCapacity: 5,
    referralsGivenThisMonth: 3,
    experience: [
      { title: 'SDE III', company: 'Amazon', location: 'Seattle, WA', startDate: new Date('2021-06-01'), current: true, description: 'Core AWS Lambda execution runtime team.' },
      { title: 'SDE II', company: 'Amazon', location: 'Seattle, WA', startDate: new Date('2018-08-01'), endDate: new Date('2021-05-31'), description: 'Built DynamoDB streams processing.' },
    ],
    education: [
      { institution: 'Georgia Tech', degree: 'MS', field: 'Computer Science', startDate: new Date('2016-09-01'), endDate: new Date('2018-06-01') },
      { institution: 'NIT Trichy', degree: 'BTech', field: 'Computer Science', startDate: new Date('2012-08-01'), endDate: new Date('2016-05-01'), grade: '8.7/10' },
    ],
    socialLinks: { linkedin: 'https://linkedin.com/in/amitpatel', github: 'https://github.com/amitpatel' },
    isEmailVerified: true,
    isActive: true,
  },
  {
    firstName: 'Jessica',
    lastName: 'Williams',
    email: 'jessica.w@apple.com',
    password: 'Referrer@1234',
    role: 'referrer',
    headline: 'Staff iOS Engineer at Apple',
    bio: 'Building the next generation of iOS experiences. 7 years at Apple. Happy to refer talented iOS, macOS, and systems engineers.',
    phone: '+1-555-200-0005',
    location: { city: 'Cupertino', state: 'California', country: 'USA' },
    skills: ['Swift', 'Objective-C', 'iOS', 'macOS', 'Metal', 'Core ML'],
    currentPosition: 'Staff iOS Engineer',
    isVerifiedEmployee: true,
    referralCapacity: 4,
    referralsGivenThisMonth: 1,
    experience: [
      { title: 'Staff iOS Engineer', company: 'Apple', location: 'Cupertino, CA', startDate: new Date('2020-04-01'), current: true, description: 'Core iOS Frameworks and SwiftUI architecture.' },
    ],
    education: [
      { institution: 'Carnegie Mellon University', degree: 'MS', field: 'Software Engineering', startDate: new Date('2015-09-01'), endDate: new Date('2017-05-01') },
    ],
    socialLinks: { linkedin: 'https://linkedin.com/in/jessicawilliams' },
    isEmailVerified: true,
    isActive: true,
  },

  // ── Job Seekers ──
  {
    firstName: 'Arjun',
    lastName: 'Kumar',
    email: 'arjun.kumar@gmail.com',
    password: 'Seeker@1234',
    role: 'jobseeker',
    headline: 'Full-Stack Developer | React & Node.js',
    bio: 'Passionate full-stack developer with 3 years of experience building web applications. Looking for opportunities at top tech companies where I can contribute to large-scale systems.',
    phone: '+1-555-300-0001',
    location: { city: 'Bangalore', state: 'Karnataka', country: 'India' },
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'TypeScript', 'Python', 'Docker', 'AWS'],
    experience: [
      { title: 'Full-Stack Developer', company: 'Wipro', location: 'Bangalore, India', startDate: new Date('2022-06-01'), current: true, description: 'Building enterprise web applications using React and Node.js.' },
      { title: 'Junior Developer', company: 'TCS', location: 'Chennai, India', startDate: new Date('2021-01-01'), endDate: new Date('2022-05-31'), description: 'Front-end development with Angular and React.' },
    ],
    education: [
      { institution: 'VIT Vellore', degree: 'BTech', field: 'Computer Science', startDate: new Date('2017-07-01'), endDate: new Date('2021-05-01'), grade: '8.5/10' },
    ],
    socialLinks: { linkedin: 'https://linkedin.com/in/arjunkumar', github: 'https://github.com/arjunkumar', portfolio: 'https://arjunkumar.dev' },
    isEmailVerified: true,
    isActive: true,
  },
  {
    firstName: 'Neha',
    lastName: 'Gupta',
    email: 'neha.gupta@gmail.com',
    password: 'Seeker@1234',
    role: 'jobseeker',
    headline: 'Backend Engineer | Java & Spring Boot',
    bio: 'Experienced Java backend engineer with expertise in microservices and cloud-native development. Seeking roles at FAANG or similar top tech companies.',
    phone: '+1-555-300-0002',
    location: { city: 'Hyderabad', state: 'Telangana', country: 'India' },
    skills: ['Java', 'Spring Boot', 'Microservices', 'Kafka', 'PostgreSQL', 'Docker', 'Kubernetes', 'Redis'],
    experience: [
      { title: 'Backend Engineer', company: 'Infosys', location: 'Hyderabad, India', startDate: new Date('2021-07-01'), current: true, description: 'Developing microservices for banking clients using Spring Boot and Kafka.' },
    ],
    education: [
      { institution: 'IIIT Hyderabad', degree: 'BTech', field: 'Computer Science', startDate: new Date('2017-08-01'), endDate: new Date('2021-05-01'), grade: '9.0/10' },
    ],
    socialLinks: { linkedin: 'https://linkedin.com/in/nehagupta', github: 'https://github.com/nehagupta' },
    isEmailVerified: true,
    isActive: true,
  },
  {
    firstName: 'David',
    lastName: 'Smith',
    email: 'david.smith@gmail.com',
    password: 'Seeker@1234',
    role: 'jobseeker',
    headline: 'ML Engineer | Python & TensorFlow',
    bio: 'Machine Learning Engineer with experience in NLP and computer vision. Looking for ML/AI roles at innovative tech companies.',
    phone: '+1-555-300-0003',
    location: { city: 'Austin', state: 'Texas', country: 'USA' },
    skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'Scikit-Learn', 'SQL', 'Spark'],
    experience: [
      { title: 'ML Engineer', company: 'DataRobot', location: 'Austin, TX', startDate: new Date('2022-01-01'), current: true, description: 'Building NLP models for automated feature engineering.' },
      { title: 'Data Scientist', company: 'IBM', location: 'Austin, TX', startDate: new Date('2020-06-01'), endDate: new Date('2021-12-31'), description: 'Applied ML to enterprise data analytics products.' },
    ],
    education: [
      { institution: 'UT Austin', degree: 'MS', field: 'Computer Science (AI Track)', startDate: new Date('2018-09-01'), endDate: new Date('2020-05-01') },
      { institution: 'Purdue University', degree: 'BS', field: 'Computer Science', startDate: new Date('2014-09-01'), endDate: new Date('2018-05-01') },
    ],
    socialLinks: { linkedin: 'https://linkedin.com/in/davidsmith', github: 'https://github.com/davidsmith' },
    isEmailVerified: true,
    isActive: true,
  },
  {
    firstName: 'Sneha',
    lastName: 'Reddy',
    email: 'sneha.reddy@gmail.com',
    password: 'Seeker@1234',
    role: 'jobseeker',
    headline: 'Frontend Developer | React & Vue.js',
    bio: 'Creative frontend developer with an eye for design and UX. 2+ years of experience. Looking for frontend / UI engineering roles.',
    phone: '+91-9876543210',
    location: { city: 'Pune', state: 'Maharashtra', country: 'India' },
    skills: ['React', 'Vue.js', 'TypeScript', 'CSS', 'Tailwind CSS', 'Figma', 'Jest', 'Cypress'],
    experience: [
      { title: 'Frontend Developer', company: 'Zoho', location: 'Chennai, India', startDate: new Date('2023-01-01'), current: true, description: 'Building responsive UIs for Zoho CRM using React.' },
    ],
    education: [
      { institution: 'BITS Pilani', degree: 'BE', field: 'Computer Science', startDate: new Date('2019-08-01'), endDate: new Date('2023-05-01'), grade: '8.2/10' },
    ],
    socialLinks: { linkedin: 'https://linkedin.com/in/snehareddy', portfolio: 'https://snehareddy.design' },
    isEmailVerified: true,
    isActive: true,
  },
  {
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.j@gmail.com',
    password: 'Seeker@1234',
    role: 'jobseeker',
    headline: 'DevOps Engineer | AWS & Kubernetes',
    bio: 'DevOps/SRE engineer passionate about infrastructure automation, CI/CD, and cloud-native architecture. Looking for SRE or Platform Engineering roles.',
    phone: '+1-555-300-0005',
    location: { city: 'Chicago', state: 'Illinois', country: 'USA' },
    skills: ['AWS', 'Kubernetes', 'Terraform', 'Docker', 'Jenkins', 'Python', 'Prometheus', 'Grafana'],
    experience: [
      { title: 'DevOps Engineer', company: 'Accenture', location: 'Chicago, IL', startDate: new Date('2021-09-01'), current: true, description: 'Managing cloud infrastructure and CI/CD pipelines for Fortune 500 clients.' },
    ],
    education: [
      { institution: 'University of Illinois', degree: 'BS', field: 'Computer Science', startDate: new Date('2017-09-01'), endDate: new Date('2021-05-01') },
    ],
    socialLinks: { linkedin: 'https://linkedin.com/in/michaeljohnson', github: 'https://github.com/michaelj' },
    isEmailVerified: true,
    isActive: true,
  },
];

// ──────────────────────────────── COMPANIES ────────────────────────────────

const companiesData = [
  {
    name: 'Google',
    logo: { url: 'https://www.google.com/s2/favicons?domain=google.com&sz=128' },
    description: 'Google LLC is an American multinational technology company focusing on artificial intelligence, online advertising, search engine technology, cloud computing, computer software, quantum computing, e-commerce, and consumer electronics.',
    industry: 'Technology',
    website: 'https://careers.google.com',
    size: '5000+',
    founded: 1998,
    headquarters: { city: 'Mountain View', state: 'California', country: 'USA' },
    locations: [
      { city: 'Mountain View', state: 'California', country: 'USA' },
      { city: 'New York', state: 'New York', country: 'USA' },
      { city: 'Bangalore', state: 'Karnataka', country: 'India' },
      { city: 'London', country: 'UK' },
    ],
    techStack: ['Python', 'Java', 'Go', 'C++', 'JavaScript', 'Kubernetes', 'TensorFlow', 'Angular'],
    benefits: ['Health Insurance', 'Free Meals', '401k Match', 'Parental Leave', 'Remote Work Option', 'Education Reimbursement', 'Gym Membership'],
    culture: 'Google fosters a culture of innovation, collaboration, and continuous learning. With an open office environment and 20% time for personal projects, employees are encouraged to think big and experiment.',
    socialLinks: { linkedin: 'https://linkedin.com/company/google', twitter: 'https://twitter.com/google', glassdoor: 'https://glassdoor.com/google' },
    averageRating: 4.5,
    totalReviews: 12500,
    isVerified: true,
    isActive: true,
  },
  {
    name: 'Microsoft',
    logo: { url: 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=128' },
    description: 'Microsoft Corporation is an American multinational technology corporation producing computer software, consumer electronics, personal computers, and related services. Known for Windows, Azure, Office 365, and Xbox.',
    industry: 'Technology',
    website: 'https://careers.microsoft.com',
    size: '5000+',
    founded: 1975,
    headquarters: { city: 'Redmond', state: 'Washington', country: 'USA' },
    locations: [
      { city: 'Redmond', state: 'Washington', country: 'USA' },
      { city: 'Hyderabad', state: 'Telangana', country: 'India' },
      { city: 'Dublin', country: 'Ireland' },
    ],
    techStack: ['C#', '.NET', 'Azure', 'TypeScript', 'Python', 'React', 'Kubernetes', 'PowerShell'],
    benefits: ['Health & Dental Insurance', '401k Match', 'Stock Awards', 'Paid Parental Leave', 'Wellness Programs', 'Tuition Assistance'],
    culture: 'Microsoft embraces a growth mindset culture where every employee is encouraged to learn, grow, and contribute. The company values diversity, inclusion, and work-life balance.',
    socialLinks: { linkedin: 'https://linkedin.com/company/microsoft', twitter: 'https://twitter.com/microsoft', glassdoor: 'https://glassdoor.com/microsoft' },
    averageRating: 4.3,
    totalReviews: 15000,
    isVerified: true,
    isActive: true,
  },
  {
    name: 'Meta',
    logo: { url: 'https://www.google.com/s2/favicons?domain=meta.com&sz=128' },
    description: 'Meta Platforms, Inc. (formerly Facebook) builds technologies that help people connect, find communities, and grow businesses. Products include Facebook, Instagram, WhatsApp, Messenger, and the metaverse initiatives.',
    industry: 'Technology',
    website: 'https://metacareers.com',
    size: '5000+',
    founded: 2004,
    headquarters: { city: 'Menlo Park', state: 'California', country: 'USA' },
    locations: [
      { city: 'Menlo Park', state: 'California', country: 'USA' },
      { city: 'Seattle', state: 'Washington', country: 'USA' },
      { city: 'London', country: 'UK' },
    ],
    techStack: ['React', 'PHP/Hack', 'Python', 'C++', 'GraphQL', 'Relay', 'PyTorch', 'Presto'],
    benefits: ['Comprehensive Health Coverage', 'Free Meals', '401k Match', 'Generous PTO', 'Parental Leave', 'Childcare Benefits'],
    culture: 'Meta moves fast and is focused on building meaningful social experiences. The company values bold thinking, open communication, and building for the long term.',
    socialLinks: { linkedin: 'https://linkedin.com/company/meta', twitter: 'https://twitter.com/meta' },
    averageRating: 4.2,
    totalReviews: 8000,
    isVerified: true,
    isActive: true,
  },
  {
    name: 'Amazon',
    logo: { url: 'https://www.google.com/s2/favicons?domain=amazon.com&sz=128' },
    description: 'Amazon.com, Inc. is a global technology company focused on e-commerce, cloud computing (AWS), digital streaming, and artificial intelligence. AWS is the world\'s most comprehensive and broadly adopted cloud platform.',
    industry: 'Technology / E-Commerce',
    website: 'https://amazon.jobs',
    size: '5000+',
    founded: 1994,
    headquarters: { city: 'Seattle', state: 'Washington', country: 'USA' },
    locations: [
      { city: 'Seattle', state: 'Washington', country: 'USA' },
      { city: 'Arlington', state: 'Virginia', country: 'USA' },
      { city: 'Bangalore', state: 'Karnataka', country: 'India' },
      { city: 'Vancouver', state: 'BC', country: 'Canada' },
    ],
    techStack: ['Java', 'Python', 'AWS', 'DynamoDB', 'TypeScript', 'React', 'Go', 'Rust'],
    benefits: ['Health Insurance', '401k Match', 'Stock Vesting', 'Relocation Assistance', 'Career Choice Program', 'Parental Leave'],
    culture: 'Amazon is guided by its Leadership Principles. The company values customer obsession, ownership, long-term thinking, and the willingness to be misunderstood for long periods.',
    socialLinks: { linkedin: 'https://linkedin.com/company/amazon', twitter: 'https://twitter.com/amazon' },
    averageRating: 3.9,
    totalReviews: 20000,
    isVerified: true,
    isActive: true,
  },
  {
    name: 'Apple',
    logo: { url: 'https://www.google.com/s2/favicons?domain=apple.com&sz=128' },
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories. Known for iPhone, Mac, iPad, Apple Watch, and services like iCloud, Apple Music, and the App Store.',
    industry: 'Technology / Consumer Electronics',
    website: 'https://jobs.apple.com',
    size: '5000+',
    founded: 1976,
    headquarters: { city: 'Cupertino', state: 'California', country: 'USA' },
    locations: [
      { city: 'Cupertino', state: 'California', country: 'USA' },
      { city: 'Austin', state: 'Texas', country: 'USA' },
      { city: 'Hyderabad', state: 'Telangana', country: 'India' },
    ],
    techStack: ['Swift', 'Objective-C', 'Python', 'C++', 'Metal', 'Core ML', 'SwiftUI', 'Xcode'],
    benefits: ['Health & Dental Coverage', 'Stock Purchase Plan', 'Paid Time Off', 'Product Discounts', 'Wellness Benefits', 'Education Reimbursement'],
    culture: 'Apple is a place where extraordinary people come together to do their best work. The company values innovation, attention to detail, and creating products that enrich people\'s lives.',
    socialLinks: { linkedin: 'https://linkedin.com/company/apple' },
    averageRating: 4.1,
    totalReviews: 10000,
    isVerified: true,
    isActive: true,
  },
  {
    name: 'Netflix',
    logo: { url: 'https://www.google.com/s2/favicons?domain=netflix.com&sz=128' },
    description: 'Netflix, Inc. is a global streaming entertainment service offering TV series, documentaries, feature films, and mobile games. Known for its engineering culture and high-performance teams.',
    industry: 'Entertainment / Technology',
    website: 'https://jobs.netflix.com',
    size: '5000+',
    founded: 1997,
    headquarters: { city: 'Los Gatos', state: 'California', country: 'USA' },
    locations: [
      { city: 'Los Gatos', state: 'California', country: 'USA' },
      { city: 'Los Angeles', state: 'California', country: 'USA' },
    ],
    techStack: ['Java', 'Python', 'React', 'Node.js', 'Cassandra', 'Kafka', 'Spring Boot', 'AWS'],
    benefits: ['Unlimited PTO', 'Top-of-Market Compensation', 'Stock Options', 'Comprehensive Health Insurance', 'Relocation Support'],
    culture: 'Netflix values freedom and responsibility. The company\'s culture emphasizes independent decision-making, candid feedback, and keeping only highly effective people.',
    socialLinks: { linkedin: 'https://linkedin.com/company/netflix', twitter: 'https://twitter.com/netflix' },
    averageRating: 4.0,
    totalReviews: 3500,
    isVerified: true,
    isActive: true,
  },
  {
    name: 'Stripe',
    logo: { url: 'https://www.google.com/s2/favicons?domain=stripe.com&sz=128' },
    description: 'Stripe is a financial infrastructure platform for businesses. Millions of companies use Stripe to accept payments, grow their revenue, and accelerate new business opportunities.',
    industry: 'Financial Technology',
    website: 'https://stripe.com/jobs',
    size: '1001-5000',
    founded: 2010,
    headquarters: { city: 'San Francisco', state: 'California', country: 'USA' },
    locations: [
      { city: 'San Francisco', state: 'California', country: 'USA' },
      { city: 'Dublin', country: 'Ireland' },
      { city: 'Singapore', country: 'Singapore' },
    ],
    techStack: ['Ruby', 'Go', 'Java', 'React', 'TypeScript', 'Python', 'Scala', 'AWS'],
    benefits: ['Health Insurance', 'Equity', 'Flexible PTO', 'Remote Work', 'Learning Stipend', 'Wellness Benefits'],
    culture: 'Stripe operates with a focus on rigorous thinking, long-term orientation, and a deep commitment to building great products and serving users. The company values clarity, craft, and user focus.',
    socialLinks: { linkedin: 'https://linkedin.com/company/stripe', twitter: 'https://twitter.com/stripe' },
    averageRating: 4.4,
    totalReviews: 2000,
    isVerified: true,
    isActive: true,
  },
  {
    name: 'Salesforce',
    logo: { url: 'https://www.google.com/s2/favicons?domain=salesforce.com&sz=128' },
    description: 'Salesforce is the global leader in CRM, helping companies connect with customers in a whole new way using cloud, mobile, social, AI, and IoT technologies.',
    industry: 'Enterprise Software',
    website: 'https://salesforce.com/careers',
    size: '5000+',
    founded: 1999,
    headquarters: { city: 'San Francisco', state: 'California', country: 'USA' },
    locations: [
      { city: 'San Francisco', state: 'California', country: 'USA' },
      { city: 'Indianapolis', state: 'Indiana', country: 'USA' },
      { city: 'Hyderabad', state: 'Telangana', country: 'India' },
    ],
    techStack: ['Java', 'Apex', 'Lightning Web Components', 'Python', 'Heroku', 'PostgreSQL', 'Kafka'],
    benefits: ['Health Insurance', 'Wellness Reimbursement', 'Volunteer Time Off', 'Stock Purchase Plan', 'Parental Leave', 'Education Reimbursement'],
    culture: 'Salesforce operates on a set of core values: Trust, Customer Success, Innovation, Equality, and Sustainability. The 1-1-1 philanthropic model gives back time, product, and equity.',
    socialLinks: { linkedin: 'https://linkedin.com/company/salesforce', twitter: 'https://twitter.com/salesforce' },
    averageRating: 4.2,
    totalReviews: 7000,
    isVerified: true,
    isActive: true,
  },
];

// ──────────────────────────────── JOBS ────────────────────────────────

// companyIndex & referrerIndex are resolved after seeding users & companies
const jobsData = [
  {
    title: 'Senior Software Engineer - Search',
    companyIndex: 0, // Google
    referrerIndex: 0, // Priya
    description: 'Join Google\'s Search team to build the next generation of search experiences. You\'ll work on large-scale distributed systems that serve billions of queries daily.\n\nAs a Senior Software Engineer, you\'ll design, develop, and maintain search ranking algorithms and infrastructure. You\'ll collaborate with cross-functional teams including product managers, UX designers, and ML researchers.\n\nThis is an exciting opportunity to impact how billions of people access information.',
    requirements: ['5+ years of software engineering experience', 'Strong background in data structures and algorithms', 'Experience with large-scale distributed systems', 'Proficiency in Java, C++, or Python', 'BS/MS in Computer Science or equivalent'],
    responsibilities: ['Design and implement search ranking features', 'Optimize system performance for billions of queries', 'Conduct code reviews and mentor junior engineers', 'Collaborate with ML teams to improve search quality', 'Write technical design documents'],
    skills: ['Java', 'Python', 'Distributed Systems', 'Machine Learning', 'System Design', 'Algorithms'],
    type: 'full-time',
    experienceLevel: 'senior',
    salary: { min: 180000, max: 280000, currency: 'USD', isNegotiable: false },
    location: { city: 'Mountain View', state: 'California', country: 'USA', remote: false },
    department: 'Search',
    referralId: 'GOOG-SWE-2026-4521',
    referralBonus: { amount: 5000, currency: 'USD' },
    isReferralOnly: false,
    maxReferrals: 5,
    applicationDeadline: new Date('2026-06-30'),
    applicationUrl: 'https://careers.google.com/jobs/results/123456',
    tags: ['backend', 'search', 'distributed-systems', 'senior'],
    status: 'active',
  },
  {
    title: 'Software Engineer II - Google Cloud',
    companyIndex: 0, // Google
    referrerIndex: 0, // Priya
    description: 'Build the future of cloud computing with Google Cloud Platform. Work on highly available, scalable cloud services used by thousands of enterprise customers.\n\nYou\'ll develop new features for GCP products, improve reliability, and work on performance optimization.',
    requirements: ['2-4 years of software engineering experience', 'Proficiency in Go, Java, or C++', 'Experience with cloud infrastructure', 'Strong CS fundamentals', 'BS in Computer Science or related field'],
    responsibilities: ['Develop and maintain GCP services', 'Write and review code for production systems', 'Debug and resolve production issues', 'Participate in on-call rotations'],
    skills: ['Go', 'Java', 'Cloud Computing', 'Kubernetes', 'gRPC', 'Linux'],
    type: 'full-time',
    experienceLevel: 'mid',
    salary: { min: 140000, max: 210000, currency: 'USD', isNegotiable: true },
    location: { city: 'Mountain View', state: 'California', country: 'USA', remote: false },
    department: 'Cloud',
    referralId: 'GOOG-GCP-2026-7823',
    referralBonus: { amount: 4000, currency: 'USD' },
    maxReferrals: 8,
    applicationDeadline: new Date('2026-07-15'),
    tags: ['cloud', 'backend', 'infrastructure'],
    status: 'active',
  },
  {
    title: 'Principal Software Engineer - Azure Kubernetes',
    companyIndex: 1, // Microsoft
    referrerIndex: 1, // Rahul
    description: 'Lead the technical direction of Azure Kubernetes Service (AKS), one of the fastest-growing services in Azure. You\'ll architect solutions that manage millions of containers for enterprise customers worldwide.\n\nThis is a high-impact role where you\'ll shape the future of managed Kubernetes in the cloud.',
    requirements: ['8+ years of software engineering experience', 'Deep expertise in Kubernetes and container orchestration', 'Experience designing large-scale distributed systems', 'Strong leadership and communication skills', 'MS/PhD in Computer Science preferred'],
    responsibilities: ['Define technical vision and roadmap for AKS', 'Lead architecture reviews and design discussions', 'Mentor senior engineers and drive engineering excellence', 'Partner with product management on feature prioritization', 'Represent Microsoft at industry conferences'],
    skills: ['Kubernetes', 'Go', 'C#', 'Azure', 'Distributed Systems', 'Container Orchestration', 'System Design'],
    type: 'full-time',
    experienceLevel: 'lead',
    salary: { min: 200000, max: 350000, currency: 'USD', isNegotiable: false },
    location: { city: 'Redmond', state: 'Washington', country: 'USA', remote: true },
    department: 'Azure',
    referralId: 'MSFT-AKS-2026-1204',
    referralBonus: { amount: 6000, currency: 'USD' },
    maxReferrals: 3,
    applicationDeadline: new Date('2026-05-31'),
    tags: ['kubernetes', 'azure', 'cloud', 'leadership', 'senior'],
    status: 'active',
  },
  {
    title: 'Software Engineer - Azure DevOps',
    companyIndex: 1, // Microsoft
    referrerIndex: 1, // Rahul
    description: 'Join the Azure DevOps team building tools that millions of developers use every day. Work on CI/CD pipelines, artifact management, and developer productivity features.',
    requirements: ['2+ years of software engineering experience', 'Experience with C# or .NET', 'Understanding of CI/CD concepts', 'BS in Computer Science or equivalent'],
    responsibilities: ['Build new features for Azure DevOps', 'Improve performance and reliability of CI/CD services', 'Collaborate with design and PM teams', 'Participate in agile development processes'],
    skills: ['C#', '.NET', 'Azure', 'TypeScript', 'React', 'SQL', 'Git'],
    type: 'full-time',
    experienceLevel: 'mid',
    salary: { min: 130000, max: 190000, currency: 'USD', isNegotiable: true },
    location: { city: 'Redmond', state: 'Washington', country: 'USA', remote: true },
    department: 'Azure DevOps',
    referralId: 'MSFT-AZDO-2026-5567',
    referralBonus: { amount: 3500, currency: 'USD' },
    maxReferrals: 10,
    applicationDeadline: new Date('2026-08-01'),
    tags: ['devops', 'azure', 'fullstack'],
    status: 'active',
  },
  {
    title: 'Full-Stack Engineer - Instagram Reels',
    companyIndex: 2, // Meta
    referrerIndex: 2, // Sarah
    description: 'Build the next generation of short-form video experiences on Instagram Reels. You\'ll work on frontend and backend systems that serve over a billion users.\n\nThe Reels team is at the forefront of Meta\'s growth strategy, making this a high-visibility opportunity.',
    requirements: ['3+ years of full-stack development experience', 'Proficiency in React and Python/PHP', 'Experience with large-scale web applications', 'Strong understanding of performance optimization', 'BS in Computer Science or equivalent'],
    responsibilities: ['Build new features for Instagram Reels', 'Optimize video feed performance', 'Work closely with ML and infrastructure teams', 'Ship code to production on a weekly cadence', 'Contribute to technical design and architecture'],
    skills: ['React', 'Python', 'PHP/Hack', 'GraphQL', 'MySQL', 'Redis', 'Video Processing'],
    type: 'full-time',
    experienceLevel: 'mid',
    salary: { min: 160000, max: 250000, currency: 'USD', isNegotiable: false },
    location: { city: 'Menlo Park', state: 'California', country: 'USA', remote: false },
    department: 'Instagram',
    referralId: 'META-IG-2026-8834',
    referralBonus: { amount: 5000, currency: 'USD' },
    maxReferrals: 5,
    applicationDeadline: new Date('2026-06-15'),
    tags: ['fullstack', 'instagram', 'video', 'social-media'],
    status: 'active',
  },
  {
    title: 'ML Engineer - Content Recommendations',
    companyIndex: 2, // Meta
    referrerIndex: 2, // Sarah
    description: 'Work on Meta\'s recommendation systems that power content discovery across Facebook and Instagram. Design and implement ML models that serve personalized content to billions of users.',
    requirements: ['3+ years of ML engineering experience', 'Strong background in recommendation systems or NLP', 'Experience with PyTorch or TensorFlow', 'Proficiency in Python and C++', 'MS/PhD in Machine Learning, Statistics, or related field'],
    responsibilities: ['Design and train ML models for content recommendations', 'Run A/B experiments at massive scale', 'Optimize model inference for real-time serving', 'Collaborate with research scientists on new approaches'],
    skills: ['Python', 'PyTorch', 'Recommendation Systems', 'Deep Learning', 'C++', 'Distributed Training', 'A/B Testing'],
    type: 'full-time',
    experienceLevel: 'senior',
    salary: { min: 200000, max: 320000, currency: 'USD', isNegotiable: false },
    location: { city: 'Menlo Park', state: 'California', country: 'USA', remote: true },
    department: 'AI/ML',
    referralId: 'META-ML-2026-2109',
    referralBonus: { amount: 6000, currency: 'USD' },
    maxReferrals: 3,
    applicationDeadline: new Date('2026-07-01'),
    tags: ['machine-learning', 'recommendations', 'ai', 'senior'],
    status: 'active',
  },
  {
    title: 'SDE II - AWS Lambda',
    companyIndex: 3, // Amazon
    referrerIndex: 3, // Amit
    description: 'Build and scale AWS Lambda, the industry-leading serverless compute service. You\'ll work on the execution runtime that handles trillions of invocations per month.\n\nThis is a core AWS infrastructure role with massive scale and impact.',
    requirements: ['3-5 years of software development experience', 'Proficiency in Java or Go', 'Experience with distributed systems', 'Understanding of serverless architectures', 'BS/MS in Computer Science or equivalent'],
    responsibilities: ['Design and implement Lambda runtime features', 'Improve cold start performance and scalability', 'Build monitoring and observability tools', 'Write operational runbooks and documentation', 'Participate in on-call rotation'],
    skills: ['Java', 'Go', 'AWS', 'Distributed Systems', 'Serverless', 'Linux', 'Performance Engineering'],
    type: 'full-time',
    experienceLevel: 'mid',
    salary: { min: 150000, max: 230000, currency: 'USD', isNegotiable: false },
    location: { city: 'Seattle', state: 'Washington', country: 'USA', remote: false },
    department: 'AWS Lambda',
    referralId: 'AMZN-LMB-2026-3301',
    referralBonus: { amount: 4000, currency: 'USD' },
    maxReferrals: 5,
    applicationDeadline: new Date('2026-06-30'),
    tags: ['aws', 'serverless', 'backend', 'distributed-systems'],
    status: 'active',
  },
  {
    title: 'Frontend Engineer - AWS Console',
    companyIndex: 3, // Amazon
    referrerIndex: 3, // Amit
    description: 'Build the AWS Management Console used by millions of developers worldwide. Create intuitive, performant UIs for complex cloud services.',
    requirements: ['2+ years of frontend development experience', 'Proficiency in React and TypeScript', 'Experience with large-scale web applications', 'Understanding of accessibility standards', 'BS in Computer Science or equivalent'],
    responsibilities: ['Build responsive UIs for AWS Console services', 'Implement design system components', 'Optimize performance for complex dashboards', 'Write unit and integration tests'],
    skills: ['React', 'TypeScript', 'CSS', 'Jest', 'Accessibility', 'Design Systems', 'AWS'],
    type: 'full-time',
    experienceLevel: 'mid',
    salary: { min: 135000, max: 200000, currency: 'USD', isNegotiable: true },
    location: { city: 'Seattle', state: 'Washington', country: 'USA', remote: true },
    department: 'AWS Console',
    referralId: 'AMZN-CON-2026-5590',
    referralBonus: { amount: 3500, currency: 'USD' },
    maxReferrals: 8,
    applicationDeadline: new Date('2026-08-15'),
    tags: ['frontend', 'react', 'aws', 'ui'],
    status: 'active',
  },
  {
    title: 'iOS Engineer - Core Frameworks',
    companyIndex: 4, // Apple
    referrerIndex: 4, // Jessica
    description: 'Work on the core iOS frameworks that millions of developers use to build their apps. You\'ll define APIs and build system features that ship to over a billion devices.\n\nThis is a unique opportunity to shape the developer experience on Apple platforms.',
    requirements: ['4+ years of iOS/macOS development experience', 'Expert knowledge of Swift and Objective-C', 'Deep understanding of iOS SDK and frameworks', 'Experience with performance optimization', 'BS/MS in Computer Science or equivalent'],
    responsibilities: ['Design and implement new iOS framework APIs', 'Optimize framework performance and memory usage', 'Review API designs for public developer APIs', 'Write comprehensive documentation and sample code', 'Collaborate with developer tools and Xcode teams'],
    skills: ['Swift', 'Objective-C', 'iOS', 'SwiftUI', 'UIKit', 'Core Animation', 'Metal', 'Performance'],
    type: 'full-time',
    experienceLevel: 'senior',
    salary: { min: 190000, max: 310000, currency: 'USD', isNegotiable: false },
    location: { city: 'Cupertino', state: 'California', country: 'USA', remote: false },
    department: 'iOS Platform',
    referralId: 'AAPL-IOS-2026-7712',
    referralBonus: { amount: 5000, currency: 'USD' },
    maxReferrals: 3,
    applicationDeadline: new Date('2026-05-31'),
    tags: ['ios', 'swift', 'mobile', 'frameworks', 'senior'],
    status: 'active',
  },
  {
    title: 'Backend Engineer - Streaming Platform',
    companyIndex: 5, // Netflix
    referrerIndex: 2, // Sarah (cross-company referral as she has Netflix connections)
    description: 'Help build the backend infrastructure that delivers high-quality streaming content to 250+ million members worldwide. Work on real-time data pipelines, content delivery optimization, and streaming quality.',
    requirements: ['5+ years of backend development experience', 'Proficiency in Java or Python', 'Experience with microservices architecture', 'Strong knowledge of distributed systems', 'Experience with Kafka or similar event streaming platforms'],
    responsibilities: ['Design and build microservices for streaming platform', 'Optimize content delivery for quality and latency', 'Build real-time data pipelines for analytics', 'Ensure high availability (99.99% uptime)'],
    skills: ['Java', 'Python', 'Spring Boot', 'Kafka', 'Cassandra', 'AWS', 'Microservices', 'gRPC'],
    type: 'full-time',
    experienceLevel: 'senior',
    salary: { min: 220000, max: 400000, currency: 'USD', isNegotiable: false },
    location: { city: 'Los Gatos', state: 'California', country: 'USA', remote: true },
    department: 'Streaming Engineering',
    referralId: 'NFLX-STR-2026-4401',
    referralBonus: { amount: 8000, currency: 'USD' },
    isReferralOnly: true,
    maxReferrals: 2,
    applicationDeadline: new Date('2026-06-01'),
    tags: ['backend', 'streaming', 'senior', 'high-comp'],
    status: 'active',
  },
  {
    title: 'Full-Stack Engineer - Payments Dashboard',
    companyIndex: 6, // Stripe
    referrerIndex: 1, // Rahul (cross-company)
    description: 'Build intuitive, data-rich dashboards that help millions of businesses understand their payments, revenue, and customer data on Stripe.',
    requirements: ['3+ years of full-stack development experience', 'Experience with React and Ruby or Go', 'Strong understanding of data visualization', 'Experience with financial systems is a plus', 'BS in Computer Science or equivalent'],
    responsibilities: ['Build interactive dashboards for payment analytics', 'Optimize complex data queries for real-time display', 'Implement new data visualization components', 'Collaborate with design and product teams'],
    skills: ['React', 'TypeScript', 'Ruby', 'Go', 'PostgreSQL', 'Data Visualization', 'REST APIs'],
    type: 'full-time',
    experienceLevel: 'mid',
    salary: { min: 155000, max: 240000, currency: 'USD', isNegotiable: true },
    location: { city: 'San Francisco', state: 'California', country: 'USA', remote: true },
    department: 'Dashboard',
    referralId: 'STRP-DASH-2026-1122',
    referralBonus: { amount: 4500, currency: 'USD' },
    maxReferrals: 5,
    applicationDeadline: new Date('2026-07-30'),
    tags: ['fullstack', 'fintech', 'payments', 'dashboard'],
    status: 'active',
  },
  {
    title: 'Platform Engineer - Heroku',
    companyIndex: 7, // Salesforce
    referrerIndex: 3, // Amit (cross-company)
    description: 'Work on the Heroku platform, helping developers build, run, and scale applications in the cloud. Build core platform services used by millions of applications.',
    requirements: ['3+ years of platform/infrastructure engineering experience', 'Experience with containerization and orchestration', 'Proficiency in Go, Ruby, or Java', 'Understanding of PaaS architectures', 'BS in Computer Science or equivalent'],
    responsibilities: ['Build and maintain Heroku runtime services', 'Improve platform reliability and performance', 'Develop CLI tools and APIs for developers', 'Work on container orchestration and scaling'],
    skills: ['Go', 'Ruby', 'Kubernetes', 'Docker', 'PostgreSQL', 'Cloud Infrastructure', 'Linux'],
    type: 'full-time',
    experienceLevel: 'mid',
    salary: { min: 140000, max: 210000, currency: 'USD', isNegotiable: true },
    location: { city: 'San Francisco', state: 'California', country: 'USA', remote: true },
    department: 'Heroku',
    referralId: 'SFDC-HRK-2026-9044',
    referralBonus: { amount: 3000, currency: 'USD' },
    maxReferrals: 5,
    applicationDeadline: new Date('2026-08-31'),
    tags: ['platform', 'infrastructure', 'paas', 'devops'],
    status: 'active',
  },
  // Entry-level / internship jobs
  {
    title: 'Software Engineering Intern - Summer 2026',
    companyIndex: 0, // Google
    referrerIndex: 0, // Priya
    description: 'Join Google as a Software Engineering Intern and work on real projects that impact millions of users. You\'ll be matched with a team based on your interests and skills.',
    requirements: ['Currently pursuing BS/MS in Computer Science or related field', 'Expected graduation in 2027 or 2028', 'Strong coding skills in at least one language', 'Familiarity with data structures and algorithms'],
    responsibilities: ['Work on a 12-week project with a specific team', 'Receive mentorship from a senior engineer', 'Present project results to your team', 'Participate in intern events and learning sessions'],
    skills: ['Python', 'Java', 'Data Structures', 'Algorithms', 'Problem Solving'],
    type: 'internship',
    experienceLevel: 'entry',
    salary: { min: 8500, max: 10000, currency: 'USD', isNegotiable: false },
    location: { city: 'Mountain View', state: 'California', country: 'USA', remote: false },
    department: 'Various',
    referralId: 'GOOG-INT-2026-SUM',
    referralBonus: { amount: 1000, currency: 'USD' },
    maxReferrals: 15,
    applicationDeadline: new Date('2026-04-30'),
    tags: ['internship', 'summer', 'new-grad', 'entry-level'],
    status: 'active',
  },
  {
    title: 'New Grad Software Engineer',
    companyIndex: 3, // Amazon
    referrerIndex: 3, // Amit
    description: 'Start your career at Amazon as a Software Development Engineer. You\'ll work on one of Amazon\'s many teams, from Alexa to AWS to retail, building systems at massive scale.',
    requirements: ['BS/MS in Computer Science or equivalent', 'Graduating in 2026', 'Solid understanding of object-oriented programming', 'Knowledge of data structures and algorithms'],
    responsibilities: ['Write clean, maintainable code', 'Participate in design and code reviews', 'Learn Amazon\'s systems and tools', 'Contribute to team goals in your first year'],
    skills: ['Java', 'Python', 'Data Structures', 'Algorithms', 'OOP', 'SQL'],
    type: 'full-time',
    experienceLevel: 'entry',
    salary: { min: 120000, max: 160000, currency: 'USD', isNegotiable: false },
    location: { city: 'Seattle', state: 'Washington', country: 'USA', remote: false },
    department: 'Various',
    referralId: 'AMZN-NG-2026-0001',
    referralBonus: { amount: 2000, currency: 'USD' },
    maxReferrals: 20,
    applicationDeadline: new Date('2026-05-15'),
    tags: ['new-grad', 'entry-level', 'amazon'],
    status: 'active',
  },
  // Remote job
  {
    title: 'Remote Senior Frontend Engineer',
    companyIndex: 6, // Stripe
    referrerIndex: 1, // Rahul
    description: 'Build the best-in-class developer dashboard and payment UIs at Stripe. This is a fully remote role open to candidates across the US.',
    requirements: ['5+ years of frontend development experience', 'Expert in React and TypeScript', 'Experience building complex data-rich UIs', 'Strong design sensibility', 'BS in Computer Science or equivalent'],
    responsibilities: ['Lead frontend architecture for payment products', 'Build reusable component libraries', 'Optimize web performance and accessibility', 'Mentor junior engineers'],
    skills: ['React', 'TypeScript', 'CSS', 'GraphQL', 'Storybook', 'Performance Optimization', 'Accessibility'],
    type: 'remote',
    experienceLevel: 'senior',
    salary: { min: 180000, max: 280000, currency: 'USD', isNegotiable: true },
    location: { city: '', state: '', country: 'USA', remote: true },
    department: 'Frontend Platform',
    referralId: 'STRP-FE-2026-RMT',
    referralBonus: { amount: 5000, currency: 'USD' },
    maxReferrals: 4,
    applicationDeadline: new Date('2026-07-01'),
    tags: ['remote', 'frontend', 'senior', 'fintech'],
    status: 'active',
  },
];

// ──────────────────────────────── REFERRALS ────────────────────────────────

// seekerIndex & referrerIndex & jobIndex resolved after seeding
const referralsData = [
  {
    seekerIndex: 0, // Arjun
    referrerIndex: 0, // Priya (Google)
    jobIndex: 1, // Google SWE II - Cloud
    message: 'Hi Priya, I have 3 years of experience as a full-stack developer and am passionate about cloud computing. I\'ve been working with AWS and Docker, and I\'d love to transition to Google Cloud. I believe my experience building scalable web applications at Wipro would be valuable. Would you be willing to refer me for this position?',
    status: 'accepted',
    priority: 'high',
    referrerNotes: 'Strong profile - good mix of frontend and backend skills. Recommended for interview.',
  },
  {
    seekerIndex: 1, // Neha
    referrerIndex: 1, // Rahul (Microsoft)
    jobIndex: 3, // Microsoft Azure DevOps SWE
    message: 'Hello Rahul, I\'m a backend engineer at Infosys with strong Java and Spring Boot experience. I\'ve been following Azure DevOps closely and have used it extensively in my projects. I believe my microservices experience would translate well to this role. Would you be open to referring me?',
    status: 'submitted',
    priority: 'high',
    referrerNotes: 'Great Java background. Already submitted her referral to the recruiting team.',
  },
  {
    seekerIndex: 2, // David
    referrerIndex: 2, // Sarah (Meta)
    jobIndex: 5, // Meta ML Engineer
    message: 'Hi Sarah, I\'m an ML Engineer with experience in NLP and recommendation systems at DataRobot. I have a strong background in PyTorch and have published research on transformer-based models. I\'d love to contribute to Meta\'s recommendation systems. Could you consider referring me?',
    status: 'pending',
    priority: 'medium',
  },
  {
    seekerIndex: 0, // Arjun
    referrerIndex: 3, // Amit (Amazon)
    jobIndex: 7, // Amazon Frontend - AWS Console
    message: 'Hi Amit, I\'m a full-stack developer with strong React and TypeScript skills. I\'ve been building responsive UIs at Wipro and would love to work on the AWS Console. My experience with building complex dashboards aligns well with this role. Would you consider referring me?',
    status: 'pending',
    priority: 'medium',
  },
  {
    seekerIndex: 3, // Sneha
    referrerIndex: 2, // Sarah (Meta)
    jobIndex: 4, // Meta Full-Stack - Reels
    message: 'Dear Sarah, I\'m a frontend developer with expertise in React and Vue.js. I\'m passionate about building beautiful, performant UIs and I\'d love to work on Instagram Reels. My experience at Zoho building responsive web apps has given me strong foundations. Would you be willing to refer me?',
    status: 'viewed',
    priority: 'medium',
  },
  {
    seekerIndex: 4, // Michael
    referrerIndex: 1, // Rahul (Microsoft)
    jobIndex: 2, // Microsoft Principal - AKS
    message: 'Hello Rahul, I\'m a DevOps engineer with extensive experience in Kubernetes and AWS. I\'ve been managing containerized workloads at Accenture and have deep knowledge of k8s internals. I know the AKS role requires more seniority than I currently have, but I believe my hands-on k8s experience would be valuable. Would you consider referring me?',
    status: 'rejected',
    priority: 'low',
    referrerNotes: 'Good Kubernetes knowledge but needs more years of experience for a Principal-level role. Encouraged to apply for SDE II positions instead.',
  },
  {
    seekerIndex: 1, // Neha
    referrerIndex: 3, // Amit (Amazon)
    jobIndex: 6, // Amazon SDE II Lambda
    message: 'Hi Amit, I\'m a backend engineer with strong Java and distributed systems experience. I\'ve been working with Kafka and microservices at Infosys and I\'m very interested in serverless computing. AWS Lambda is an exciting opportunity. Would you be open to referring me?',
    status: 'accepted',
    priority: 'high',
    referrerNotes: 'Strong Java candidate. Her Kafka experience is relevant. Referred.',
  },
  {
    seekerIndex: 2, // David
    referrerIndex: 0, // Priya (Google)
    jobIndex: 0, // Google Sr SWE Search
    message: 'Hi Priya, I\'m an ML Engineer with experience in search-related NLP tasks. I\'ve worked on transformer models and information retrieval systems. My PhD research focused on neural ranking models which I believe aligns well with Google Search. Would you refer me?',
    status: 'pending',
    priority: 'high',
  },
];

// ──────────────────────────────── SEED FUNCTION ────────────────────────────────

async function seed() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data if requested
    if (process.argv.includes('--clear')) {
      console.log('🗑️  Clearing existing data...');
      await Promise.all([
        User.deleteMany({}),
        Company.deleteMany({}),
        Job.deleteMany({}),
        Referral.deleteMany({}),
        Notification.deleteMany({}),
        Conversation.deleteMany({}),
        Message.deleteMany({}),
      ]);
      console.log('✅ All data cleared\n');
    }

    // ── 1. Create Users ──
    console.log('👥 Creating users...');
    const users = [];
    for (const userData of usersData) {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`   ⏭️  User ${userData.email} already exists, skipping`);
        users.push(existingUser);
      } else {
        const user = await User.create(userData);
        console.log(`   ✅ Created ${user.role}: ${user.firstName} ${user.lastName} (${user.email})`);
        users.push(user);
      }
    }
    console.log(`   📊 Total: ${users.length} users\n`);

    // Categorize users
    const admin = users[0];
    const referrers = users.slice(1, 6);  // Priya, Rahul, Sarah, Amit, Jessica
    const seekers = users.slice(6);       // Arjun, Neha, David, Sneha, Michael

    // ── 2. Create Companies ──
    console.log('🏢 Creating companies...');
    const companies = [];
    for (let i = 0; i < companiesData.length; i++) {
      const companyData = { ...companiesData[i] };
      // Assign creator – round-robin among referrers
      companyData.createdBy = referrers[i % referrers.length]._id;

      const existingCompany = await Company.findOne({ name: companyData.name });
      if (existingCompany) {
        console.log(`   ⏭️  Company "${companyData.name}" already exists, skipping`);
        companies.push(existingCompany);
      } else {
        const company = await Company.create(companyData);
        console.log(`   ✅ Created company: ${company.name}`);
        companies.push(company);
      }
    }
    console.log(`   📊 Total: ${companies.length} companies\n`);

    // Link referrers to their companies
    const referrerCompanyMap = [
      { userIndex: 0, companyIndex: 0 }, // Priya → Google
      { userIndex: 1, companyIndex: 1 }, // Rahul → Microsoft
      { userIndex: 2, companyIndex: 2 }, // Sarah → Meta
      { userIndex: 3, companyIndex: 3 }, // Amit → Amazon
      { userIndex: 4, companyIndex: 4 }, // Jessica → Apple
    ];
    for (const mapping of referrerCompanyMap) {
      const referrer = referrers[mapping.userIndex];
      const company = companies[mapping.companyIndex];
      await User.findByIdAndUpdate(referrer._id, { currentCompany: company._id });
      // Add to verifiedEmployees if not already
      await Company.findByIdAndUpdate(company._id, { $addToSet: { verifiedEmployees: referrer._id } });
    }
    console.log('🔗 Linked referrers to their companies\n');

    // ── 3. Create Jobs ──
    console.log('💼 Creating jobs...');
    const jobs = [];
    for (const jobData of jobsData) {
      const { companyIndex, referrerIndex, ...rest } = jobData;
      const company = companies[companyIndex];
      const referrer = referrers[referrerIndex];

      const existingJob = await Job.findOne({ title: rest.title, company: company._id });
      if (existingJob) {
        console.log(`   ⏭️  Job "${rest.title}" already exists, skipping`);
        jobs.push(existingJob);
      } else {
        const job = await Job.create({
          ...rest,
          company: company._id,
          postedBy: referrer._id,
        });
        console.log(`   ✅ Created job: ${job.title} @ ${company.name}`);
        jobs.push(job);
      }
    }
    console.log(`   📊 Total: ${jobs.length} jobs\n`);

    // ── 4. Create Referrals ──
    console.log('🤝 Creating referrals...');
    const referrals = [];
    for (const refData of referralsData) {
      const { seekerIndex, referrerIndex, jobIndex, ...rest } = refData;
      const seeker = seekers[seekerIndex];
      const referrer = referrers[referrerIndex];
      const job = jobs[jobIndex];

      const existingReferral = await Referral.findOne({
        job: job._id,
        jobSeeker: seeker._id,
        referrer: referrer._id,
      });
      if (existingReferral) {
        console.log(`   ⏭️  Referral for ${seeker.firstName} → ${job.title} already exists, skipping`);
        referrals.push(existingReferral);
      } else {
        const referral = await Referral.create({
          ...rest,
          job: job._id,
          jobSeeker: seeker._id,
          referrer: referrer._id,
          company: job.company,
        });
        console.log(`   ✅ ${seeker.firstName} → ${referrer.firstName} for "${job.title}" [${rest.status}]`);
        referrals.push(referral);
      }
    }
    console.log(`   📊 Total: ${referrals.length} referrals\n`);

    // Update currentReferrals count on jobs
    for (const job of jobs) {
      const count = await Referral.countDocuments({
        job: job._id,
        status: { $in: ['accepted', 'submitted', 'interviewing', 'hired'] },
      });
      await Job.findByIdAndUpdate(job._id, { currentReferrals: count });
    }

    // ── 5. Create Notifications ──
    console.log('🔔 Creating notifications...');
    const notifications = [];
    for (const referral of referrals) {
      // Notification to referrer about new request
      const notif1 = await Notification.create({
        recipient: referral.referrer,
        sender: referral.jobSeeker,
        type: 'referral_request',
        title: 'New Referral Request',
        message: `You have a new referral request for a position at your company.`,
        resourceType: 'referral',
        resourceId: referral._id,
        isRead: ['accepted', 'submitted', 'rejected'].includes(referral.status),
      });
      notifications.push(notif1);

      // If referral was accepted or rejected, notify seeker
      if (['accepted', 'submitted'].includes(referral.status)) {
        const notif2 = await Notification.create({
          recipient: referral.jobSeeker,
          sender: referral.referrer,
          type: 'referral_accepted',
          title: 'Referral Accepted! 🎉',
          message: `Your referral request has been accepted! The referrer will submit your profile.`,
          resourceType: 'referral',
          resourceId: referral._id,
          isRead: false,
        });
        notifications.push(notif2);
      } else if (referral.status === 'rejected') {
        const notif2 = await Notification.create({
          recipient: referral.jobSeeker,
          sender: referral.referrer,
          type: 'referral_rejected',
          title: 'Referral Update',
          message: `Unfortunately, the referrer was unable to refer you at this time.`,
          resourceType: 'referral',
          resourceId: referral._id,
          isRead: false,
        });
        notifications.push(notif2);
      }
    }
    console.log(`   ✅ Created ${notifications.length} notifications\n`);

    // ── 6. Create Conversations & Messages ──
    console.log('💬 Creating conversations and messages...');
    const conversationPairs = [
      {
        participants: [seekers[0]._id, referrers[0]._id], // Arjun & Priya
        referral: referrals[0]._id,
        messages: [
          { sender: seekers[0]._id, content: 'Hi Priya! Thank you so much for accepting my referral request for the Google Cloud position. I really appreciate it!' },
          { sender: referrers[0]._id, content: 'Hi Arjun! Happy to help. Your profile looks strong. I\'ve submitted your referral. The recruiter should reach out within 1-2 weeks.' },
          { sender: seekers[0]._id, content: 'That\'s great to hear! Is there anything specific I should prepare for the interview process?' },
          { sender: referrers[0]._id, content: 'Focus on system design and coding rounds. Practice on LeetCode (medium/hard). Also review Google\'s engineering practices. Good luck!' },
          { sender: seekers[0]._id, content: 'Thank you for the guidance! I\'ll start preparing right away. 🙏' },
        ],
      },
      {
        participants: [seekers[1]._id, referrers[1]._id], // Neha & Rahul
        referral: referrals[1]._id,
        messages: [
          { sender: seekers[1]._id, content: 'Hello Rahul! Thanks for referring me for the Azure DevOps position. I\'m really excited about this opportunity.' },
          { sender: referrers[1]._id, content: 'Hi Neha, glad to help! I\'ve already submitted your referral. You should hear from the recruiting team soon. The Azure DevOps team is great to work with.' },
          { sender: seekers[1]._id, content: 'That\'s wonderful! I\'ve been using Azure DevOps pipelines at my current job, so I\'m familiar with the product. Any interview tips?' },
          { sender: referrers[1]._id, content: 'Great that you already have hands-on experience! For the interview, expect 2 coding rounds, 1 system design, and a behavioral. Brush up on CI/CD concepts and .NET basics.' },
        ],
      },
      {
        participants: [seekers[3]._id, referrers[2]._id], // Sneha & Sarah
        referral: referrals[4]._id,
        messages: [
          { sender: seekers[3]._id, content: 'Hi Sarah! I saw you viewed my referral request for the Instagram Reels position. I\'d love to discuss how my frontend skills could be a great fit!' },
          { sender: referrers[2]._id, content: 'Hi Sneha! Yes, I saw your profile. Your React experience looks solid. I\'m still reviewing a few candidates but I\'ll let you know my decision soon.' },
          { sender: seekers[3]._id, content: 'Thank you for considering me! I\'ve been building some Reels-like features as side projects to showcase my video-related frontend skills.' },
        ],
      },
    ];

    for (const convData of conversationPairs) {
      const existingConv = await Conversation.findOne({
        participants: { $all: convData.participants },
      });

      let conversation;
      if (existingConv) {
        console.log('   ⏭️  Conversation already exists, skipping');
        continue;
      }

      conversation = await Conversation.create({
        participants: convData.participants,
        referral: convData.referral,
        lastMessageAt: new Date(),
        isActive: true,
      });

      let lastMsg;
      for (let i = 0; i < convData.messages.length; i++) {
        const msgData = convData.messages[i];
        const msg = await Message.create({
          conversation: conversation._id,
          sender: msgData.sender,
          content: msgData.content,
          readBy: [{ user: msgData.sender, readAt: new Date() }],
        });
        lastMsg = msg;
      }

      // Update conversation with last message
      if (lastMsg) {
        await Conversation.findByIdAndUpdate(conversation._id, {
          lastMessage: lastMsg._id,
          lastMessageAt: lastMsg.createdAt,
        });
      }
      console.log(`   ✅ Created conversation with ${convData.messages.length} messages`);
    }

    // Add some job views
    console.log('\n👀 Adding view counts to jobs...');
    const viewCounts = [342, 189, 567, 231, 445, 298, 512, 178, 623, 401, 267, 334, 89, 156, 478];
    for (let i = 0; i < jobs.length; i++) {
      await Job.findByIdAndUpdate(jobs[i]._id, { views: viewCounts[i] || Math.floor(Math.random() * 500) + 50 });
    }
    console.log('   ✅ View counts updated\n');

    // ── Summary ──
    console.log('═══════════════════════════════════════════════');
    console.log('  🎉 DATABASE SEEDED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════');
    console.log('');
    console.log('  📊 Summary:');
    console.log(`     👤 Users:          ${users.length} (1 admin, ${referrers.length} referrers, ${seekers.length} job seekers)`);
    console.log(`     🏢 Companies:      ${companies.length}`);
    console.log(`     💼 Jobs:           ${jobs.length}`);
    console.log(`     🤝 Referrals:      ${referrals.length}`);
    console.log(`     🔔 Notifications:  ${notifications.length}`);
    console.log(`     💬 Conversations:  ${conversationPairs.length}`);
    console.log('');
    console.log('  🔑 Login Credentials:');
    console.log('     Admin:     admin@jobreferral.com       / Admin@1234');
    console.log('     Referrer:  priya.sharma@google.com     / Referrer@1234');
    console.log('     Referrer:  rahul.verma@microsoft.com   / Referrer@1234');
    console.log('     Referrer:  sarah.chen@meta.com         / Referrer@1234');
    console.log('     Referrer:  amit.patel@amazon.com       / Referrer@1234');
    console.log('     Referrer:  jessica.w@apple.com         / Referrer@1234');
    console.log('     Seeker:    arjun.kumar@gmail.com       / Seeker@1234');
    console.log('     Seeker:    neha.gupta@gmail.com        / Seeker@1234');
    console.log('     Seeker:    david.smith@gmail.com       / Seeker@1234');
    console.log('     Seeker:    sneha.reddy@gmail.com       / Seeker@1234');
    console.log('     Seeker:    michael.j@gmail.com         / Seeker@1234');
    console.log('');
    console.log('═══════════════════════════════════════════════');
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    if (error.errors) {
      Object.keys(error.errors).forEach((key) => {
        console.error(`   - ${key}: ${error.errors[key].message}`);
      });
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
    process.exit(0);
  }
}

seed();
