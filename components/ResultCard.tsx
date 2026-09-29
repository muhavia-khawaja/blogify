'use client'

import React, { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  Printer,
  User,
  BookOpen,
  CheckCircle2,
  XCircle,
  Building2,
  GraduationCap,
  Hash,
  Search,
  Loader2,
  AlertCircle,
  Mail,
  HelpCircle,
  Bot,
  Send,
  FileCheck2,
  ShieldCheck,
  BarChart3,
  RefreshCcw,
} from 'lucide-react'

import { fetchResultByRollNo } from '@/utils/admin-action'

const ResultPdf = dynamic(() => import('./ResultPdf'), {
  ssr: false,
  loading: () => (
    <button
      disabled
      className='flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-400 px-4 py-2.5 text-sm font-medium text-white sm:w-auto'
    >
      <Loader2 className='h-4 w-4 animate-spin' />
      <span>Loading PDF...</span>
    </button>
  ),
})

const ResultChart = dynamic(() => import('./ResultChart'), {
  ssr: false,
  loading: () => (
    <div className='h-64 animate-pulse rounded-2xl border border-slate-100 bg-slate-50 sm:h-72' />
  ),
})

const GAZETTE_PDF_URL =
  'https://www.ewhamza.com/pdf/ajk-ssc-part-2-gazette-2026'

interface SubjectResultRaw {
  ROLL_NO: string | null
  GROUP_NAME: string | null
  REG_NO: string | null
  NAME: string | null
  FNAME: string | null
  INS_NAME: string | null

  SUB1_NAME?: string | null
  SUB1_OBT?: string | null
  SUB1_PASS?: string | null
  SUB1_REMARKS?: string | null
  SUB1_TOTAL?: string | null

  SUB2_NAME?: string | null
  SUB2_OBT?: string | null
  SUB2_PASS?: string | null
  SUB2_REMARKS?: string | null
  SUB2_TOTAL?: string | null

  SUB3_NAME?: string | null
  SUB3_OBT?: string | null
  SUB3_PASS?: string | null
  SUB3_REMARKS?: string | null
  SUB3_TOTAL?: string | null

  SUB4_NAME?: string | null
  SUB4_OBT?: string | null
  SUB4_PASS?: string | null
  SUB4_REMARKS?: string | null
  SUB4_TOTAL?: string | null

  SUB5_NAME?: string | null
  SUB5_OBT?: string | null
  SUB5_PASS?: string | null
  SUB5_REMARKS?: string | null
  SUB5_TOTAL?: string | null

  SUB6_NAME?: string | null
  SUB6_OBT?: string | null
  SUB6_PASS?: string | null
  SUB6_REMARKS?: string | null
  SUB6_TOTAL?: string | null

  SUB7_NAME?: string | null
  SUB7_OBT?: string | null
  SUB7_PASS?: string | null
  SUB7_REMARKS?: string | null
  SUB7_TOTAL?: string | null

  SUB8_NAME?: string | null
  SUB8_OBT?: string | null
  SUB8_PASS?: string | null
  SUB8_REMARKS?: string | null
  SUB8_TOTAL?: string | null

  SUB9_NAME?: string | null
  SUB9_OBT?: string | null
  SUB9_PASS?: string | null
  SUB9_REMARKS?: string | null
  SUB9_TOTAL?: string | null

  SUB21_NAME?: string | null
  SUB21_OBT?: string | null
  S1_OBT?: string | null
  S1_PASS?: string | null

  SUB22_NAME?: string | null
  SUB22_OBT?: string | null
  S2_OBT?: string | null
  S2_PASS?: string | null

  SUB31_OBT?: string | null
  S3_OBT?: string | null
  S3_PASS?: string | null

  SUB23_NAME?: string | null
  SUB231_OBT?: string | null
  SUB23_OBT?: string | null
  S3P_OBT?: string | null
  S3P_PASS?: string | null

  SUB24_NAME?: string | null
  SUB24_OBT?: string | null
  S4_OBT?: string | null
  S4_PASS?: string | null

  SUB25_NAME?: string | null
  SUB25_OBT?: string | null
  SUB251_OBT?: string | null
  S5_OBT?: string | null
  S5_PASS?: string | null

  SUB26_NAME?: string | null
  SUB26_OBT?: string | null
  SUB261_OBT?: string | null
  S6_OBT?: string | null
  S6_PASS?: string | null

  SUB27_NAME?: string | null
  SUB27_OBT?: string | null
  SUB271_OBT?: string | null
  S7_OBT?: string | null
  S7_PASS?: string | null

  SUB28_NAME?: string | null
  SUB28_OBT?: string | null
  S8_OBT?: string | null
  S8_PASS?: string | null

  TOTAL_OBT: string | null
  TOTAL_MARKS: string | null
  RESULT: string | null
  REMARKSF?: string | null
}

interface ResultApiResponse {
  Results: SubjectResultRaw
}

interface StudentInfo {
  rollNo: string
  name: string
  fatherName: string
  regNo: string
  group: string
  institution: string
  status: string
  totalObtained: number
  totalMax: number
  percentage: string
  hasSupply: boolean
  part: string
  failSubjects: string[]
}

interface SubjectItem {
  name: string
  obtained: number
  total: number
  pass: string
  remarks: string
  isFail: boolean
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

function ResultSkeletonLoader() {
  return (
    <div className='animate-pulse space-y-7 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8'>
      <div className='flex flex-col items-center gap-3 border-b border-slate-100 pb-6'>
        <div className='h-7 w-2/3 rounded-lg bg-slate-200' />
        <div className='h-4 w-1/2 rounded-lg bg-slate-100' />
      </div>

      <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className='rounded-2xl border border-slate-100 bg-slate-50 p-4'
          >
            <div className='mb-3 h-8 w-8 rounded-xl bg-slate-200' />
            <div className='mb-2 h-3 w-1/2 rounded bg-slate-200' />
            <div className='h-4 w-3/4 rounded bg-slate-300' />
          </div>
        ))}
      </div>

      <div className='h-16 rounded-2xl bg-slate-50' />

      <div className='overflow-hidden rounded-2xl border border-slate-200'>
        <div className='h-12 bg-slate-100' />

        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className='h-12 border-t border-slate-100 bg-white'
          />
        ))}
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className='rounded-2xl border border-slate-200 bg-white p-4 shadow-sm'>
      <div className='flex items-start gap-3'>
        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600'>
          {icon}
        </div>

        <div className='min-w-0'>
          <p className='text-[11px] font-medium uppercase tracking-wide text-slate-400'>
            {label}
          </p>

          <p className='mt-1 truncate text-sm font-bold text-slate-900'>
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ResultSearchPage() {
  const [rollNoInput, setRollNoInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rawData, setRawData] = useState<ResultApiResponse | null>(null)

  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatLoading, setChatLoading] = useState(false)

  const parsedData = useMemo(() => {
    if (!rawData?.Results) return null

    const raw = rawData.Results

    const cleanStr = (value: string | null | undefined) => {
      if (typeof value !== 'string') return ''

      const cleaned = value.trim()

      return cleaned || ''
    }

    const parseNum = (value: string | null | undefined) => {
      const cleaned = cleanStr(value)

      if (!cleaned) return 0

      const parsed = Number.parseInt(cleaned, 10)

      return Number.isFinite(parsed) ? parsed : 0
    }

    const isPartOne =
      cleanStr(raw.SUB1_NAME).toUpperCase().includes('-I') ||
      cleanStr(raw.SUB1_NAME).toUpperCase().endsWith('I')

    const isPartTwo =
      cleanStr(raw.SUB1_NAME).toUpperCase().includes('-II') ||
      cleanStr(raw.SUB1_NAME).toUpperCase().endsWith('II')

    const part = isPartOne
      ? 'Part-I'
      : isPartTwo
        ? 'Part-II'
        : 'Annual Examination'

    /*
     * Detect the new/current API format first.
     *
     * Example:
     * SUB1_NAME
     * SUB1_OBT
     * SUB1_TOTAL
     * SUB1_PASS
     * SUB1_REMARKS
     */
    const currentApiSubjects: SubjectItem[] = Array.from(
      { length: 9 },
      (_, index) => {
        const number = index + 1

        const name = cleanStr(
          raw[`SUB${number}_NAME` as keyof SubjectResultRaw] as
            | string
            | null
            | undefined,
        )

        const obtained = parseNum(
          raw[`SUB${number}_OBT` as keyof SubjectResultRaw] as
            | string
            | null
            | undefined,
        )

        const total = parseNum(
          raw[`SUB${number}_TOTAL` as keyof SubjectResultRaw] as
            | string
            | null
            | undefined,
        )

        const pass = cleanStr(
          raw[`SUB${number}_PASS` as keyof SubjectResultRaw] as
            | string
            | null
            | undefined,
        )

        const remarks = cleanStr(
          raw[`SUB${number}_REMARKS` as keyof SubjectResultRaw] as
            | string
            | null
            | undefined,
        )

        const isFail =
          pass.toUpperCase().includes('FAIL') ||
          pass.toUpperCase().includes('SUPPLY') ||
          pass.toUpperCase() === 'F' ||
          remarks.includes('<33%')

        return {
          name,
          obtained,
          total,
          pass: pass || (isFail ? 'FAIL' : 'PASS'),
          remarks,
          isFail,
        }
      },
    ).filter((subject) => subject.name)

    /*
     * If the current API format exists, use it.
     */
    let subjects = currentApiSubjects

    /*
     * Otherwise fall back to the older API format.
     */
    if (subjects.length === 0) {
      const oldSubjects: SubjectItem[] = [
        {
          name: cleanStr(raw.SUB21_NAME),
          obtained: parseNum(raw.S1_OBT),
          total: parseNum(raw.S1_OBT),
          pass: cleanStr(raw.S1_PASS),
          remarks: '',
          isFail: false,
        },
        {
          name: cleanStr(raw.SUB22_NAME),
          obtained: parseNum(raw.S2_OBT),
          total: parseNum(raw.S2_OBT),
          pass: cleanStr(raw.S2_PASS),
          remarks: '',
          isFail: false,
        },
        {
          name: cleanStr(raw.SUB3_NAME),
          obtained: parseNum(raw.S3_OBT),
          total: parseNum(raw.S3_OBT),
          pass: cleanStr(raw.S3_PASS),
          remarks: '',
          isFail: false,
        },
        {
          name: cleanStr(raw.SUB23_NAME),
          obtained:
            parseNum(raw.SUB23_OBT) +
            parseNum(raw.SUB231_OBT) +
            parseNum(raw.S3P_OBT),
          total:
            parseNum(raw.SUB23_OBT) +
            parseNum(raw.SUB231_OBT) +
            parseNum(raw.S3P_OBT),
          pass: cleanStr(raw.S3P_PASS),
          remarks: '',
          isFail: false,
        },
        {
          name: cleanStr(raw.SUB24_NAME),
          obtained: parseNum(raw.S4_OBT),
          total: parseNum(raw.S4_OBT),
          pass: cleanStr(raw.S4_PASS),
          remarks: '',
          isFail: false,
        },
        {
          name: cleanStr(raw.SUB25_NAME),
          obtained: parseNum(raw.S5_OBT),
          total: parseNum(raw.S5_OBT),
          pass: cleanStr(raw.S5_PASS),
          remarks: '',
          isFail: false,
        },
        {
          name: cleanStr(raw.SUB26_NAME),
          obtained: parseNum(raw.S6_OBT),
          total: parseNum(raw.S6_OBT),
          pass: cleanStr(raw.S6_PASS),
          remarks: '',
          isFail: false,
        },
        {
          name: cleanStr(raw.SUB27_NAME),
          obtained: parseNum(raw.S7_OBT),
          total: parseNum(raw.S7_OBT),
          pass: cleanStr(raw.S7_PASS),
          remarks: '',
          isFail: false,
        },
        {
          name: cleanStr(raw.SUB28_NAME),
          obtained: parseNum(raw.S8_OBT),
          total: parseNum(raw.S8_OBT),
          pass: cleanStr(raw.S8_PASS),
          remarks: '',
          isFail: false,
        },
      ].filter((subject) => subject.name)

      subjects = oldSubjects.map((subject) => ({
        ...subject,
        isFail:
          subject.pass.toUpperCase().includes('FAIL') ||
          subject.pass.toUpperCase().includes('SUPPLY') ||
          subject.pass.toUpperCase() === 'F',
      }))
    }

    /*
     * REMARKSF contains:
     * ISL MAT PHY BIO
     *
     * This is useful as an additional fail indicator.
     */
    const overallRemarks = cleanStr(raw.REMARKSF).toUpperCase()

    const subjectsWithFailStatus = subjects.map((subject) => {
      const upperName = subject.name.toUpperCase()

      let failFromOverallRemarks = false

      if (overallRemarks) {
        if (upperName.includes('ISLAMIYAT') && overallRemarks.includes('ISL')) {
          failFromOverallRemarks = true
        }

        if (
          upperName.includes('MATHEMATICS') &&
          overallRemarks.includes('MAT')
        ) {
          failFromOverallRemarks = true
        }

        if (upperName.includes('PHYSICS') && overallRemarks.includes('PHY')) {
          failFromOverallRemarks = true
        }

        if (upperName.includes('BIOLOGY') && overallRemarks.includes('BIO')) {
          failFromOverallRemarks = true
        }
      }

      return {
        ...subject,
        isFail: subject.isFail || failFromOverallRemarks,
        pass:
          subject.isFail || failFromOverallRemarks
            ? 'FAIL'
            : subject.pass || 'PASS',
      }
    })

    subjects = subjectsWithFailStatus

    const totalMax = parseNum(raw.TOTAL_MARKS)

    /*
     * Your API returns TOTAL_OBT:null.
     *
     * Therefore calculate obtained marks from subject marks.
     */
    const apiTotalObtained = parseNum(raw.TOTAL_OBT)

    const calculatedTotalObtained = subjects.reduce(
      (sum, subject) => sum + subject.obtained,
      0,
    )

    const totalObtained =
      apiTotalObtained > 0 ? apiTotalObtained : calculatedTotalObtained

    const calculatedPercentage =
      totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : '0.00'

    const failSubjects = subjects
      .filter((subject) => subject.isFail)
      .map((subject) => subject.name)

    const hasSupply =
      subjects.some((subject) => subject.isFail) ||
      cleanStr(raw.RESULT).toUpperCase().includes('SUPPLY') ||
      cleanStr(raw.RESULT).toUpperCase().includes('FAIL')

    const studentInfo: StudentInfo = {
      rollNo: cleanStr(raw.ROLL_NO),
      name: cleanStr(raw.NAME),
      fatherName: cleanStr(raw.FNAME),
      regNo: cleanStr(raw.REG_NO),
      group: cleanStr(raw.GROUP_NAME),
      institution: cleanStr(raw.INS_NAME),
      status: cleanStr(raw.RESULT) || 'N/A',
      totalObtained,
      totalMax,
      percentage: calculatedPercentage,
      hasSupply,
      part,
      failSubjects,
    }

    return {
      studentInfo,
      subjects,
    }
  }, [rawData])

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault()

    const rollNo = rollNoInput.trim()

    if (!rollNo) {
      setError('Please enter your roll number.')
      return
    }

    setLoading(true)
    setError(null)
    setRawData(null)
    setChatMessages([])

    try {
      const response = await fetchResultByRollNo(rollNo)

      if (!response.success) {
        setError(response.error || 'Unable to fetch the result.')
        return
      }

      const data = response.data as ResultApiResponse

      if (!data?.Results || !data.Results.ROLL_NO) {
        setError('No result found for the provided Roll Number.')
        return
      }

      setRawData(data)
    } catch (error) {
      console.error('RESULT SEARCH ERROR:', error)

      setError('An error occurred while fetching the result. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSendChatMessage = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!chatInput.trim() || chatLoading || !parsedData) {
      return
    }

    const userMessage = chatInput.trim()

    setChatInput('')

    setChatMessages((previous) => [
      ...previous,
      {
        role: 'user',
        content: userMessage,
      },
    ])

    setChatLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          topic: `AJK ${parsedData.studentInfo.part} Result`,
          context: `
Candidate Roll No: ${parsedData.studentInfo.rollNo}
Name: ${parsedData.studentInfo.name}
Status: ${parsedData.studentInfo.status}
Obtained Marks: ${parsedData.studentInfo.totalObtained}
Total Marks: ${parsedData.studentInfo.totalMax}
Percentage: ${parsedData.studentInfo.percentage}%
Failed Subjects: ${parsedData.studentInfo.failSubjects.join(', ') || 'None'}
          `,
          pdfUrl: GAZETTE_PDF_URL,
          isPremiumUser: true,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to query Gazette AI Tutor.')
      }

      const reader = response.body?.getReader()

      if (!reader) {
        throw new Error('No streaming response received.')
      }

      const decoder = new TextDecoder()

      let assistantText = ''
      let isFirstChunk = true

      setChatMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          content: '',
        },
      ])

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        let chunk = decoder.decode(value, {
          stream: true,
        })

        if (isFirstChunk && chunk.includes('[STREAM_SEPARATOR]')) {
          const parts = chunk.split('[STREAM_SEPARATOR]\n')

          chunk = parts[1] || ''
          isFirstChunk = false
        }

        assistantText += chunk

        setChatMessages((previous) => {
          const updated = [...previous]

          updated[updated.length - 1] = {
            role: 'assistant',
            content: assistantText,
          }

          return updated
        })
      }
    } catch (error) {
      console.error('GAZETTE AI ERROR:', error)

      setChatMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          content:
            'Unable to query the Gazette PDF at this moment. Please try again.',
        },
      ])
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <section className='relative overflow-hidden bg-slate-50 py-8 sm:py-12 lg:py-16 print:bg-white print:p-0'>
      <div className='pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-indigo-50 via-white to-transparent' />

      <div className='relative mx-auto max-w-5xl px-3 sm:px-6 lg:px-8'>
        <div className='overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 print:hidden'>
          <div className='bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 p-5 text-white sm:p-8 lg:p-10'>
            <div className='flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <div className='mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold'>
                  <ShieldCheck className='h-4 w-4' />
                  Verified Result Search
                </div>

                <h2 className='text-2xl font-black tracking-tight sm:text-3xl'>
                  Check Your Result
                </h2>

                <p className='mt-2 max-w-xl text-sm leading-6 text-indigo-100'>
                  Enter your roll number to retrieve your examination result
                  from the configured result service.
                </p>
              </div>

              <div className='hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 sm:flex'>
                <GraduationCap className='h-8 w-8' />
              </div>
            </div>
          </div>

          <div className='p-4 sm:p-6'>
            <form
              onSubmit={handleSearch}
              className='flex flex-col gap-3 sm:flex-row'
            >
              <div className='relative flex-1'>
                <Hash className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400' />

                <input
                  type='text'
                  inputMode='numeric'
                  autoComplete='off'
                  placeholder='Enter your roll number'
                  value={rollNoInput}
                  onChange={(event) => setRollNoInput(event.target.value)}
                  className='h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100'
                />
              </div>

              <button
                type='submit'
                disabled={loading}
                className='flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400'
              >
                {loading ? (
                  <>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className='h-4 w-4' />
                    Search Result
                  </>
                )}
              </button>
            </form>

            <div className='mt-4 flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between'>
              <span>
                Enter the roll number exactly as issued on your examination
                documents.
              </span>

              <Link
                href='/contact'
                className='inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800'
              >
                <Mail className='h-3.5 w-3.5' />
                Need help?
              </Link>
            </div>

            {error && (
              <div className='mt-4 flex flex-col gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700 sm:flex-row sm:items-center sm:justify-between'>
                <div className='flex items-start gap-2'>
                  <AlertCircle className='mt-0.5 h-5 w-5 shrink-0' />

                  <div>
                    <p className='text-sm font-bold'>Result search failed</p>
                    <p className='mt-0.5 text-xs'>{error}</p>
                  </div>
                </div>

                <button
                  type='button'
                  onClick={() => {
                    setError(null)
                    setRollNoInput('')
                  }}
                  className='inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-900'
                >
                  <RefreshCcw className='h-3.5 w-3.5' />
                  Try again
                </button>
              </div>
            )}
          </div>
        </div>

        {loading && (
          <div className='mt-6'>
            <ResultSkeletonLoader />
          </div>
        )}

        {parsedData && !loading && (
          <div className='mt-6 space-y-6'>
            <div className='flex flex-col gap-3 sm:flex-row sm:justify-end print:hidden'>
              <ResultPdf
                studentInfo={parsedData.studentInfo}
                subjects={parsedData.subjects.map((subject) => ({
                  name: subject.name,
                  p1: subject.obtained,
                  p2: 0,
                  practical: 0,
                  total: subject.total,
                  pass: subject.pass,
                  isFail: subject.isFail,
                }))}
              />

              <button
                onClick={() => window.print()}
                className='inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800'
              >
                <Printer className='h-4 w-4' />
                Print Result
              </button>
            </div>

            <div
              id='printable-card'
              className='overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 print:border-none print:shadow-none'
            >
              <div className='relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 px-5 py-8 text-center text-white sm:px-8'>
                <div className='absolute -right-20 -top-20 h-48 w-48 rounded-full bg-white/5' />
                <div className='absolute -bottom-28 -left-20 h-56 w-56 rounded-full bg-purple-400/10' />

                <div className='relative'>
                  <div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20'>
                    <GraduationCap className='h-7 w-7' />
                  </div>

                  <p className='text-xs font-bold uppercase tracking-[0.2em] text-indigo-200'>
                    Examination Result
                  </p>

                  <h2 className='mt-2 text-xl font-black tracking-tight sm:text-3xl'>
                    Board of Intermediate & Secondary Education
                  </h2>

                  <p className='mt-2 text-xs font-semibold text-indigo-100 sm:text-sm'>
                    {parsedData.studentInfo.part}
                  </p>
                </div>
              </div>

              <div className='space-y-6 p-4 sm:p-7 lg:p-8'>
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'>
                  <StatCard
                    icon={<User className='h-5 w-5' />}
                    label='Candidate'
                    value={parsedData.studentInfo.name}
                  />

                  <StatCard
                    icon={<User className='h-5 w-5' />}
                    label="Father's Name"
                    value={parsedData.studentInfo.fatherName}
                  />

                  <StatCard
                    icon={<Hash className='h-5 w-5' />}
                    label='Roll Number'
                    value={parsedData.studentInfo.rollNo}
                  />

                  <div
                    className={`rounded-2xl border p-4 shadow-sm ${
                      parsedData.studentInfo.hasSupply
                        ? 'border-rose-200 bg-rose-50'
                        : 'border-emerald-200 bg-emerald-50'
                    }`}
                  >
                    <div className='flex items-start gap-3'>
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          parsedData.studentInfo.hasSupply
                            ? 'bg-rose-100 text-rose-600'
                            : 'bg-emerald-100 text-emerald-600'
                        }`}
                      >
                        {parsedData.studentInfo.hasSupply ? (
                          <XCircle className='h-5 w-5' />
                        ) : (
                          <CheckCircle2 className='h-5 w-5' />
                        )}
                      </div>

                      <div className='min-w-0'>
                        <p className='text-[11px] font-medium uppercase tracking-wide opacity-60'>
                          Result
                        </p>

                        <p
                          className={`mt-1 truncate text-sm font-black ${
                            parsedData.studentInfo.hasSupply
                              ? 'text-rose-800'
                              : 'text-emerald-800'
                          }`}
                        >
                          {parsedData.studentInfo.status}
                        </p>

                        <p className='text-xs font-semibold opacity-70'>
                          {parsedData.studentInfo.percentage}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-3'>
                  <div className='flex min-w-0 items-center gap-3'>
                    <BookOpen className='h-5 w-5 shrink-0 text-indigo-500' />

                    <div className='min-w-0'>
                      <p className='text-[10px] font-bold uppercase tracking-wide text-slate-400'>
                        Group
                      </p>

                      <p className='truncate text-sm font-semibold text-slate-800'>
                        {parsedData.studentInfo.group}
                      </p>
                    </div>
                  </div>

                  <div className='flex min-w-0 items-center gap-3'>
                    <Hash className='h-5 w-5 shrink-0 text-indigo-500' />

                    <div className='min-w-0'>
                      <p className='text-[10px] font-bold uppercase tracking-wide text-slate-400'>
                        Registration
                      </p>

                      <p className='truncate text-sm font-semibold text-slate-800'>
                        {parsedData.studentInfo.regNo}
                      </p>
                    </div>
                  </div>

                  <div className='flex min-w-0 items-center gap-3 sm:col-span-2 lg:col-span-1'>
                    <Building2 className='h-5 w-5 shrink-0 text-indigo-500' />

                    <div className='min-w-0'>
                      <p className='text-[10px] font-bold uppercase tracking-wide text-slate-400'>
                        Institution
                      </p>

                      <p className='truncate text-sm font-semibold text-slate-800'>
                        {parsedData.studentInfo.institution}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
                  <div className='rounded-2xl border border-indigo-100 bg-indigo-50 p-4'>
                    <p className='text-[10px] font-bold uppercase tracking-wide text-indigo-500'>
                      Obtained Marks
                    </p>

                    <p className='mt-1 text-xl font-black text-indigo-950 sm:text-2xl'>
                      {parsedData.studentInfo.totalObtained}
                    </p>
                  </div>

                  <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
                    <p className='text-[10px] font-bold uppercase tracking-wide text-slate-500'>
                      Total Marks
                    </p>

                    <p className='mt-1 text-xl font-black text-slate-900 sm:text-2xl'>
                      {parsedData.studentInfo.totalMax}
                    </p>
                  </div>

                  <div className='col-span-2 rounded-2xl border border-purple-100 bg-purple-50 p-4 sm:col-span-1'>
                    <p className='text-[10px] font-bold uppercase tracking-wide text-purple-500'>
                      Percentage
                    </p>

                    <p className='mt-1 text-xl font-black text-purple-950 sm:text-2xl'>
                      {parsedData.studentInfo.percentage}%
                    </p>
                  </div>
                </div>

                {parsedData.studentInfo.failSubjects.length > 0 && (
                  <div className='rounded-2xl border border-rose-200 bg-rose-50 p-4'>
                    <div className='flex items-start gap-3'>
                      <XCircle className='mt-0.5 h-5 w-5 shrink-0 text-rose-600' />

                      <div>
                        <p className='text-sm font-black text-rose-900'>
                          Subjects requiring improvement
                        </p>

                        <p className='mt-1 text-sm text-rose-700'>
                          {parsedData.studentInfo.failSubjects.join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <div className='mb-4 flex items-center gap-2'>
                    <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600'>
                      <FileCheck2 className='h-5 w-5' />
                    </div>

                    <div>
                      <h3 className='text-base font-black text-slate-900'>
                        Subject-wise Marks
                      </h3>

                      <p className='text-xs text-slate-500'>
                        {parsedData.studentInfo.part} detailed marks breakdown
                      </p>
                    </div>
                  </div>

                  <div className='overflow-hidden rounded-2xl border border-slate-200'>
                    <div className='overflow-x-auto'>
                      <table className='w-full min-w-[650px] text-left text-xs sm:text-sm'>
                        <thead className='bg-slate-950 text-white'>
                          <tr>
                            <th className='px-4 py-3 font-bold'>#</th>
                            <th className='px-4 py-3 font-bold'>Subject</th>
                            <th className='px-4 py-3 text-center font-bold'>
                              Obtained
                            </th>
                            <th className='px-4 py-3 text-center font-bold'>
                              Total
                            </th>
                            <th className='px-4 py-3 text-center font-bold'>
                              Status
                            </th>
                          </tr>
                        </thead>

                        <tbody className='divide-y divide-slate-100'>
                          {parsedData.subjects.map((subject, index) => (
                            <tr
                              key={`${subject.name}-${index}`}
                              className={`transition hover:bg-slate-50 ${
                                subject.isFail ? 'bg-rose-50/50' : ''
                              }`}
                            >
                              <td className='px-4 py-3 font-bold text-slate-400'>
                                {String(index + 1).padStart(2, '0')}
                              </td>

                              <td className='px-4 py-3 font-bold text-slate-900'>
                                {subject.name}
                              </td>

                              <td
                                className={`px-4 py-3 text-center font-black ${
                                  subject.isFail
                                    ? 'text-rose-700'
                                    : 'text-slate-900'
                                }`}
                              >
                                {subject.obtained}
                              </td>

                              <td className='px-4 py-3 text-center font-semibold text-slate-600'>
                                {subject.total}
                              </td>

                              <td className='px-4 py-3 text-center'>
                                <span
                                  className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                    subject.isFail
                                      ? 'bg-rose-100 text-rose-700'
                                      : 'bg-emerald-100 text-emerald-700'
                                  }`}
                                >
                                  {subject.isFail ? 'FAIL' : 'PASS'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>

                        <tfoot className='bg-indigo-50'>
                          <tr>
                            <td
                              colSpan={2}
                              className='px-4 py-4 text-right font-bold text-slate-700'
                            >
                              Overall Total
                            </td>

                            <td className='px-4 py-4 text-center font-black text-indigo-700'>
                              {parsedData.studentInfo.totalObtained}
                            </td>

                            <td className='px-4 py-4 text-center font-black text-slate-800'>
                              {parsedData.studentInfo.totalMax}
                            </td>

                            <td
                              className={`px-4 py-4 text-center font-black ${
                                parsedData.studentInfo.hasSupply
                                  ? 'text-rose-700'
                                  : 'text-emerald-700'
                              }`}
                            >
                              {parsedData.studentInfo.percentage}%
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>

                <div className='space-y-4 print:hidden'>
                  <div className='flex items-center gap-2'>
                    <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600'>
                      <BarChart3 className='h-5 w-5' />
                    </div>

                    <div>
                      <h3 className='text-base font-black text-slate-900'>
                        Marks Overview
                      </h3>

                      <p className='text-xs text-slate-500'>
                        Visual subject performance
                      </p>
                    </div>
                  </div>

                  <ResultChart
                    subjects={parsedData.subjects.map((subject) => ({
                      name: subject.name,
                      p1: subject.obtained,
                      p2: 0,
                      practical: 0,
                      total: subject.obtained,
                      pass: subject.pass,
                      isFail: subject.isFail,
                    }))}
                  />
                </div>

                <div className='rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-6 print:hidden'>
                  <div className='flex items-start gap-3'>
                    <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200'>
                      <Bot className='h-5 w-5' />
                    </div>

                    <div>
                      <h3 className='text-base font-black text-slate-900'>
                        Ask Hamza AI
                      </h3>

                      <p className='mt-1 text-xs leading-5 text-slate-600'>
                        Ask questions about this result or Gazette verification.
                      </p>
                    </div>
                  </div>

                  {chatMessages.length > 0 && (
                    <div className='mt-5 max-h-72 space-y-3 overflow-y-auto rounded-2xl border border-white/70 bg-white/70 p-3'>
                      {chatMessages.map((message, index) => (
                        <div
                          key={index}
                          className={`rounded-2xl p-3 text-xs leading-5 sm:text-sm ${
                            message.role === 'user'
                              ? 'ml-auto max-w-[85%] bg-indigo-600 text-white'
                              : 'mr-auto max-w-[90%] border border-slate-200 bg-white text-slate-800'
                          }`}
                        >
                          {message.content || (
                            <Loader2 className='h-4 w-4 animate-spin' />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <form
                    onSubmit={handleSendChatMessage}
                    className='mt-4 flex gap-2'
                  >
                    <input
                      type='text'
                      placeholder='Ask about this result...'
                      value={chatInput}
                      onChange={(event) => setChatInput(event.target.value)}
                      className='h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-xs text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:text-sm'
                    />

                    <button
                      type='submit'
                      disabled={chatLoading}
                      className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:bg-indigo-400'
                    >
                      {chatLoading ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                      ) : (
                        <Send className='h-4 w-4' />
                      )}
                    </button>
                  </form>
                </div>

                <div className='flex flex-col gap-3 border-t border-slate-200 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between print:hidden'>
                  <div className='flex items-center gap-2'>
                    <HelpCircle className='h-4 w-4 shrink-0' />
                    <span>Found an issue with your result?</span>
                  </div>

                  <Link
                    href='/contact'
                    className='font-bold text-indigo-600 hover:text-indigo-800 hover:underline'
                  >
                    Contact support →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
