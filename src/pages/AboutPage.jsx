import React from 'react';
import { Link } from 'react-router-dom'; 




const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            About  Cyber Security Brigade
          </h1>
          <p className="mt-5 max-w-3xl mx-auto text-xl text-blue-300">
            As industry veterans, we provide the clear, practical training and mentorship that freshers and professionals need to successfully build a new career in cybersecurity.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-gray-800 shadow rounded-lg p-8 mb-16">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Why We're Different</h2>
              <p className="text-lg text-gray-300 mb-6">
                Honestly, it's because we care. We've built the program we wish we had when we were starting out.
              </p>
              <ul className="space-y-4">
                {[
                  "We're People, Not Robots: You'll be taught and mentored by real people who are active in the industry.",
                  "Learn by Doing, Not Just Watching: Get your hands dirty in our virtual labs with real-world scenarios.",
                  "A Community to Call Your Own: Connect with fellow learners and build a network that lasts."
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-5 w-5 text-blue-400">✓</div>
                    </div>
                    <p className="ml-3 text-gray-300">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-12 lg:mt-0">
              <div className="bg-gray-700 rounded-lg p-6 h-full">
                <h3 className="text-xl font-bold text-white mb-4">Our Approach</h3>
                <p className="text-gray-300 mb-4">
                  We've replaced abstract theory with the practical skills and career support you need to land your first role and build a successful, long-term career.
                </p>
                <div className="space-y-4">
                  {[
                    "Master an Industry-Vetted & Offensive-Informed Curriculum",
                    "Learn Live from Experts in the Trenches",
                    "Build Battle-Ready, Practical Skills",
                    "Receive End-to-End Career & Placement Support",
                    "Access Premium Content at an Affordable Fee"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-5 w-5 text-blue-400">•</div>
                      </div>
                      <p className="ml-3 text-gray-300">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Instructors</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: 'Security Operations Expert',
                role: 'SOC & Detection Specialist',
                bio: '10+ years building and running Security Operations Centers for Fortune 500 companies.',
              },
              {
                name: 'Penetration Tester',
                role: 'Red Team Lead',
                bio: 'Former ethical hacker with extensive experience in offensive security and vulnerability research.',
              },
              {
                name: 'Cloud Security Architect',
                role: 'AWS & Azure Specialist',
                bio: 'Helps organizations secure their cloud infrastructure with practical, scalable solutions.',
              },
              {
                name: 'Malware Analyst',
                role: 'Reverse Engineering Expert',
                bio: 'Specializes in malware analysis, digital forensics, and incident response.',
              },
            ].map((person, index) => (
              <div key={index} className="bg-gray-800 rounded-lg overflow-hidden shadow">
                <div className="h-48 bg-gray-700 flex items-center justify-center text-5xl">
                  {person.name.charAt(0)}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-white">{person.name}</h3>
                  <p className="text-blue-400">{person.role}</p>
                  <p className="mt-2 text-gray-300">{person.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-blue-700 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Your journey into cybersecurity doesn't have to be complicated or intimidating.</h2>
          <p className="text-blue-100 mb-6">Let us show you a better way.</p>
          <Link
            to="/courses"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
          >
            View Our Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

