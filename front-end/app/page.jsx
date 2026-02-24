'use client'

console.log("🔥 PAGE.JSX LOADED");
console.log("🔥 BACKEND_URL =", process.env.NEXT_PUBLIC_BACKEND_URL);

import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect } from 'react'
const BACKEND_URL = "http://localhost:5000";

export default function Home() {
  // State for all form inputs
  const [jobTitle, setJobTitle] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('')
  const [employmentType, setEmploymentType] = useState('')
  const [companyLocation, setCompanyLocation] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [resumeText, setResumeText] = useState('')
  const [refinedResume, setRefinedResume] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('');

  
  // Loading states
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false)
  const [isDownloadingDOCX, setIsDownloadingDOCX] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [pdfjsLib, setPdfjsLib] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  // File input ref
  const fileInputRef = useRef(null)

  // Load PDF.js dynamically on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('pdfjs-dist').then((pdfjs) => {
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
        setPdfjsLib(pdfjs)
      })
    }
  }, [])

  // Function to extract text from PDF
  const extractTextFromPDF = async (file) => {
    if (!pdfjsLib) {
      setUploadStatus('PDF library is still loading. Please wait...')
      return
    }

    try {
      setUploadStatus('Extracting text from PDF...')
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      
      let fullText = ''
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map(item => item.str).join(' ')
        fullText += pageText + '\n'
      }
      
      setResumeText(fullText)
      setUploadStatus('PDF text extracted successfully!')
      setTimeout(() => setUploadStatus(''), 3000)
      return fullText
    } catch (error) {
      console.error('Error extracting PDF text:', error)
      setUploadStatus('Error extracting text from PDF. Please try again.')
      setTimeout(() => setUploadStatus(''), 3000)
      throw error
    }
  }

  // Handle file upload
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setUploadStatus('Please upload a PDF file only.')
      setTimeout(() => setUploadStatus(''), 3000)
      return
    }

    setResumeFile(file)
    await extractTextFromPDF(file)
  }

  // Handle drag and drop
  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setUploadStatus('Please upload a PDF file only.')
      setTimeout(() => setUploadStatus(''), 3000)
      return
    }

    setResumeFile(file)
    await extractTextFromPDF(file)
  }

  // Handle file removal
  const handleRemoveFile = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setResumeFile(null)
    setResumeText('')
    setUploadStatus('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Handle Modify Resume button click
  const handleModifyResume = async () => {
    // Validate required fields
    if (!jobTitle.trim()) {
      alert('Please enter a job title.')
      return
    }
    if (!jobDescription.trim()) {
      alert('Please enter a job description.')
      return
    }
    if (!resumeText.trim()) {
      alert('Please upload and extract text from your resume PDF.')
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch(`${BACKEND_URL}/api/refine-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle,
          jobDescription,
          experienceLevel,
          employmentType,
          companyLocation,
          companyName,
          resumeText,
          additionalInfo,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to refine resume')
      }

      const data = await response.json()
      setRefinedResume(data.refined_resume || '')
    } catch (error) {
      console.error('Error refining resume:', error)
      alert('Failed to refine resume. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle Download as PDF
  const handleDownloadPDF = async () => {
    if (!refinedResume.trim()) {
      alert('No refined resume available. Please refine your resume first.')
      return
    }

    setIsDownloadingPDF(true)
    try {
      const response = await fetch(`${BACKEND_URL}/api/download-pdf`,  {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refined_resume: refinedResume,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to download PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'refined-resume.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Failed to download PDF. Please try again.')
    } finally {
      setIsDownloadingPDF(false)
    }
  }

  // Handle Download as DOCX
  const handleDownloadDOCX = async () => {
    if (!refinedResume.trim()) {
      alert('No refined resume available. Please refine your resume first.')
      return
    }

    setIsDownloadingDOCX(true)
    try {
      const response = await fetch(`${BACKEND_URL}/api/download-docx`,  {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refined_resume: refinedResume,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to download DOCX')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'refined-resume.docx'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading DOCX:', error)
      alert('Failed to download DOCX. Please try again.')
    } finally {
      setIsDownloadingDOCX(false)
    }
  }

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Section - Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-2">
          Precision Resume
        </h1>
        <p className="text-gray-600 text-lg sm:text-xl">
          Refine your resume with precision
        </p>
      </div>

      {/* Two-Column Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        {/* Left Side - User Input Panel (40%) */}
        <div className="lg:col-span-2">
          <UserInputPanel
            jobTitle={jobTitle}
            setJobTitle={setJobTitle}
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            experienceLevel={experienceLevel}
            setExperienceLevel={setExperienceLevel}
            employmentType={employmentType}
            setEmploymentType={setEmploymentType}
            companyLocation={companyLocation}
            setCompanyLocation={setCompanyLocation}
            companyName={companyName}
            setCompanyName={setCompanyName}
            resumeFile={resumeFile}
            handleFileChange={handleFileChange}
            handleDrop={handleDrop}
            handleDragOver={handleDragOver}
            handleDragEnter={handleDragEnter}
            handleDragLeave={handleDragLeave}
            handleRemoveFile={handleRemoveFile}
            fileInputRef={fileInputRef}
            uploadStatus={uploadStatus}
            isProcessing={isProcessing}
            isDragging={isDragging}
            handleModifyResume={handleModifyResume}
            additionalInfo={additionalInfo}
            setAdditionalInfo={setAdditionalInfo}
          />
        </div>

        {/* Right Side - Output Preview Panel (60%) */}
        <div className="lg:col-span-3">
          <OutputPreviewPanel
            refinedResume={refinedResume}
            isDownloadingPDF={isDownloadingPDF}
            isDownloadingDOCX={isDownloadingDOCX}
            handleDownloadPDF={handleDownloadPDF}
            handleDownloadDOCX={handleDownloadDOCX}
          />
        </div>
      </div>
    </main>
  )
}

// User Input Form Component
function UserInputPanel({
  jobTitle,
  setJobTitle,
  jobDescription,
  setJobDescription,
  experienceLevel,
  setExperienceLevel,
  employmentType,
  setEmploymentType,
  companyLocation,
  setCompanyLocation,
  companyName,
  setCompanyName,
  resumeFile,
  handleFileChange,
  handleDrop,
  handleDragOver,
  handleDragEnter,
  handleDragLeave,
  handleRemoveFile,
  fileInputRef,
  uploadStatus,
  isProcessing,
  isDragging,
  handleModifyResume,
  additionalInfo,
  setAdditionalInfo
}) {

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 h-[80vh] flex flex-col">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Resume Details
      </h2>

      <div className="flex-1 overflow-y-auto pr-2 space-y-5">
        {/* Job Title */}
        <div>
          <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
            Job Title
          </label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="e.g., Software Engineer"
            disabled={isProcessing}
          />
        </div>

        {/* Job Description */}
        <div>
          <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Job Description
          </label>
          <textarea
            id="jobDescription"
            name="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows="5"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-y"
            placeholder="Paste the job description here..."
            disabled={isProcessing}
          />
        </div>

        {/* Experience Level */}
        <div>
          <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-2">
            Experience Level
          </label>
          <select
            id="experienceLevel"
            name="experienceLevel"
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
            disabled={isProcessing}
          >
            <option value="">Select experience level</option>
            <option value="fresher">Fresher</option>
            <option value="intern">Intern</option>
            <option value="junior">Junior</option>
            <option value="mid-level">Mid-level</option>
            <option value="senior">Senior</option>
            <option value="manager-lead">Manager / Lead</option>
          </select>
        </div>

        {/* Employment Type */}
        <div>
          <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-2">
            Employment Type
          </label>
          <select
            id="employmentType"
            name="employmentType"
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
            disabled={isProcessing}
          >
            <option value="">Select employment type</option>
            <option value="full-time">Full-time</option>
            <option value="internship">Internship</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="on-site">On-site</option>
          </select>
        </div>

        {/* Company Location */}
        <div>
          <label htmlFor="companyLocation" className="block text-sm font-medium text-gray-700 mb-2">
            Company Location
          </label>
          <input
            type="text"
            id="companyLocation"
            name="companyLocation"
            value={companyLocation}
            onChange={(e) => setCompanyLocation(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="e.g., San Francisco, CA"
            disabled={isProcessing}
          />
        </div>

        {/* Company Name */}
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="e.g., Tech Corp Inc."
            disabled={isProcessing}
          />
        </div>

        {/* Upload Resume */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Resume (PDF)
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            className="hidden"
            disabled={isProcessing}
          />
          <div
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
              isProcessing
                ? 'border-gray-300 cursor-not-allowed opacity-50'
                : isDragging
                ? 'border-blue-500 bg-blue-50 cursor-pointer'
                : 'border-gray-300 hover:border-blue-400 cursor-pointer'
            }`}
          >
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-4h-4m-4 4h4m-4-4v-4m4 4v4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-blue-600 hover:text-blue-500">
                Click to upload
              </span>
              {' '}or drag and drop
            </div>
            <p className="text-xs text-gray-500 mt-2">PDF files only</p>
            {resumeFile && (
              <div className="mt-3 flex items-center justify-center gap-2">
                <p className="text-xs text-green-600 font-medium">
                  ✓ {resumeFile.name}
                </p>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  disabled={isProcessing}
                  className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  title="Remove file"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
            {uploadStatus && (
              <p className={`text-xs mt-2 font-medium ${
                uploadStatus.includes('Error') ? 'text-red-600' : 'text-blue-600'
              }`}>
                {uploadStatus}
              </p>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
            Additional Information (Courses, Certifications, Extra Achievements, etc.)
          </label>
          <textarea
            id="additionalInfo"
            name="additionalInfo"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                      focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-y"
            placeholder="Add any missing courses, certifications, achievements, or details not present in your resume..."
            disabled={isProcessing}
          />
        </div>


        {/* Submit Button */}
        <button
          type="button"
          onClick={handleModifyResume}
          disabled={isProcessing}
          className={`w-full font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg mt-6 ${
            isProcessing
              ? 'bg-blue-400 text-white cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isProcessing ? 'Processing...' : 'Modify Resume'}
        </button>
      </div>
    </div>
  )
}

// Output Preview Panel Component
function OutputPreviewPanel({
  refinedResume,
  isDownloadingPDF,
  isDownloadingDOCX,
  handleDownloadPDF,
  handleDownloadDOCX,
}) {
  const hasRefinedResume = refinedResume.trim().length > 0

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 h-[80vh] flex flex-col">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Refined Resume Output
      </h2>

      {/* Preview Content Area */}
      <div className="flex-1 border border-gray-300 rounded-lg p-6 bg-gray-50 overflow-y-auto mb-6">
        {hasRefinedResume ? (
          <div className="prose max-w-none text-gray-800">
            <div className="resume">
              <ReactMarkdown>
                {refinedResume}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="prose max-w-none text-gray-700">
            <h3 className="text-xl font-bold mb-4">John Doe</h3>
            <p className="text-sm text-gray-600 mb-6">john.doe@email.com | (555) 123-4567 | LinkedIn Profile</p>
            
            <section className="mb-6">
              <h4 className="text-lg font-semibold mb-3 border-b border-gray-300 pb-1">Professional Summary</h4>
              <p className="text-sm leading-relaxed">
                Experienced software engineer with a passion for building scalable applications. 
                Skilled in modern web technologies and agile development methodologies.
              </p>
            </section>

            <section className="mb-6">
              <h4 className="text-lg font-semibold mb-3 border-b border-gray-300 pb-1">Work Experience</h4>
              <div className="mb-4">
                <h5 className="font-semibold">Senior Software Engineer</h5>
                <p className="text-sm text-gray-600">Tech Company Inc. | 2020 - Present</p>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li>Led development of microservices architecture</li>
                  <li>Improved application performance by 40%</li>
                  <li>Mentored junior developers</li>
                </ul>
              </div>
            </section>

            <section className="mb-6">
              <h4 className="text-lg font-semibold mb-3 border-b border-gray-300 pb-1">Skills</h4>
              <p className="text-sm">
                JavaScript, React, Node.js, Python, AWS, Docker, Kubernetes
              </p>
            </section>

            <section>
              <h4 className="text-lg font-semibold mb-3 border-b border-gray-300 pb-1">Education</h4>
              <p className="text-sm">
                <strong>Bachelor of Science in Computer Science</strong><br />
                University Name | 2016 - 2020
              </p>
            </section>
          </div>
        )}
      </div>

      {/* Download Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={!hasRefinedResume || isDownloadingPDF || isDownloadingDOCX}
          className={`flex-1 font-semibold py-3 px-6 rounded-lg transition ${
            !hasRefinedResume || isDownloadingPDF || isDownloadingDOCX
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isDownloadingPDF ? 'Downloading...' : 'Download as PDF'}
        </button>
        <button
          type="button"
          onClick={handleDownloadDOCX}
          disabled={!hasRefinedResume || isDownloadingPDF || isDownloadingDOCX}
          className={`flex-1 font-semibold py-3 px-6 rounded-lg transition ${
            !hasRefinedResume || isDownloadingPDF || isDownloadingDOCX
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isDownloadingDOCX ? 'Downloading...' : 'Download as DOCX'}
        </button>
      </div>
    </div>
  )
}
