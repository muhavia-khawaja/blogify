import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Search,
  ShieldCheck,
  FileCheck2,
  Smartphone,
  BarChart3,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  BookOpen,
  Download,
} from 'lucide-react'

import ResultSearchPage from '@/components/ResultCard'

export const metadata: Metadata = {
  title: 'Search Your Result',
  description:
    'Check your AJK Board SSC Part 2 Result 2026 online by roll number. View marks, subjects, percentage, result status and download or print your result card.',
  keywords: [
    'AJK SSC Part 2 Result 2026',
    'AJK Board Result 2026',
    'AJK Matric Result 2026',
    'SSC Part 2 Result 2026',
    'AJKBISE Result',
    'AJK Board Matric Result',
    '10th class result 2026',
    'AJK result by roll number',
    'AJK SSC result',
  ],
  alternates: {
    canonical: '/result',
  },
  openGraph: {
    title: 'Search Your Result',
    description:
      'Search and view your AJK SSC Part 2 result online using your roll number.',
    type: 'website',
    url: '/result',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AJK SSC Part 2 Result 2026 – Check Result by Roll Number',
    description:
      'Check AJK Board SSC Part 2 Result 2026 online by roll number.',
  },
}

const features = [
  {
    icon: Search,
    title: 'Search by Roll Number',
    description:
      'Enter your examination roll number to quickly retrieve your result.',
  },
  {
    icon: FileCheck2,
    title: 'Detailed Marks',
    description:
      'View subject-wise marks, totals, percentage and result status.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Result Lookup',
    description:
      'Results are retrieved through the configured examination result service.',
  },
  {
    icon: Download,
    title: 'Print & Save',
    description:
      'Print your result card or save a digital copy for your records.',
  },
]

const faqs = [
  {
    question: 'How can I check my AJK SSC Part 2 result?',
    answer:
      'Enter your roll number in the result search box above and select Search Result. If a result is available, your student information and marks will be displayed.',
  },
  {
    question: 'What information is shown on the result card?',
    answer:
      'The result card can display the candidate name, father name, roll number, registration number, group, institution, subject-wise marks, total marks, percentage and result status.',
  },
  {
    question: 'Can I print my result?',
    answer:
      'Yes. After your result appears, use the Print Result button to print the result card from your browser.',
  },
  {
    question: 'What should I do if my roll number is not found?',
    answer:
      'First check that you entered the roll number correctly. If the issue continues, use the contact/support option to report the problem.',
  },
]

export default function ResultsPage() {
  return (
    <main className='min-h-screen bg-white text-slate-900'>
      <section className='relative overflow-hidden bg-slate-950'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.25),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(168,85,247,0.18),transparent_30%)]' />

        <div className='relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pb-28'>
          <div className='mx-auto max-w-4xl text-center'>
            <div className='mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-indigo-100 backdrop-blur'>
              <ShieldCheck className='h-4 w-4 text-emerald-400' />
              AJK Board Result Portal
            </div>

            <h1 className='text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl'>
              Mirpur Board Result
              <span className='block bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent'>
                2026
              </span>
            </h1>

            <p className='mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base'>
              Check your result online using your roll number. View detailed
              subject marks, total marks, percentage and result status in one
              place.
            </p>

            <div className='mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row'>
              <a
                href='#result-search'
                className='inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-indigo-950 shadow-xl transition hover:bg-indigo-50'
              >
                <Search className='h-4 w-4' />
                Check My Result
              </a>

              <Link
                href='/contact'
                className='inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10'
              >
                Need Help
                <ArrowRight className='h-4 w-4' />
              </Link>
            </div>
          </div>

          <div className='mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3'>
            <div className='rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur'>
              <GraduationCap className='mx-auto h-6 w-6 text-indigo-300' />

              <p className='mt-3 text-sm font-bold text-white'>Result</p>

              <p className='mt-1 text-xs text-slate-400'>Annual Examination</p>
            </div>

            <div className='rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur'>
              <FileCheck2 className='mx-auto h-6 w-6 text-emerald-300' />

              <p className='mt-3 text-sm font-bold text-white'>
                Detailed Marks
              </p>

              <p className='mt-1 text-xs text-slate-400'>
                Subject-wise breakdown
              </p>
            </div>

            <div className='rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur'>
              <BarChart3 className='mx-auto h-6 w-6 text-purple-300' />

              <p className='mt-3 text-sm font-bold text-white'>Performance</p>

              <p className='mt-1 text-xs text-slate-400'>
                Percentage & overview
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id='result-search' className='relative -mt-8 sm:-mt-12'>
        <ResultSearchPage />
      </section>

      <section className='border-t border-slate-100 bg-slate-50 py-16 sm:py-20'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl text-center'>
            <span className='text-xs font-black uppercase tracking-[0.2em] text-indigo-600'>
              Everything you need
            </span>

            <h2 className='mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl'>
              A simple way to view your result
            </h2>

            <p className='mt-4 text-sm leading-7 text-slate-500 sm:text-base'>
              Search your result and get the important examination information
              in a clean, mobile-friendly result card.
            </p>
          </div>

          <div className='mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {features.map((feature) => {
              const Icon = feature.icon

              return (
                <div
                  key={feature.title}
                  className='group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50'
                >
                  <div className='flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white'>
                    <Icon className='h-6 w-6' />
                  </div>

                  <h3 className='mt-5 text-base font-black text-slate-900'>
                    {feature.title}
                  </h3>

                  <p className='mt-2 text-sm leading-6 text-slate-500'>
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className='bg-white py-16 sm:py-20'>
        <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
          <div className='grid items-center gap-12 lg:grid-cols-2'>
            <div>
              <span className='text-xs font-black uppercase tracking-[0.2em] text-indigo-600'>
                How it works
              </span>

              <h2 className='mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl'>
                Check your result in three steps
              </h2>

              <p className='mt-5 text-sm leading-7 text-slate-500 sm:text-base'>
                You do not need to navigate through multiple pages. Enter your
                roll number, search for the result and review the marks
                displayed on your result card.
              </p>

              <div className='mt-8 space-y-5'>
                {[
                  {
                    number: '01',
                    title: 'Enter your roll number',
                    description:
                      'Use the roll number issued for your examination.',
                  },
                  {
                    number: '02',
                    title: 'Search your result',
                    description:
                      'Select Search Result and wait while the result service responds.',
                  },
                  {
                    number: '03',
                    title: 'Review your marks',
                    description:
                      'View your subject marks, total, percentage and result status.',
                  },
                ].map((step) => (
                  <div key={step.number} className='flex gap-4'>
                    <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-xs font-black text-white'>
                      {step.number}
                    </div>

                    <div>
                      <h3 className='font-black text-slate-900'>
                        {step.title}
                      </h3>

                      <p className='mt-1 text-sm leading-6 text-slate-500'>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='rounded-[2rem] border border-slate-200 bg-slate-50 p-5 shadow-inner sm:p-7'>
              <div className='rounded-3xl bg-slate-950 p-6 text-white shadow-2xl'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600'>
                      <GraduationCap className='h-5 w-5' />
                    </div>

                    <div>
                      <p className='text-sm font-black'>Result Card</p>

                      <p className='text-xs text-slate-400'>SSC Part-II</p>
                    </div>
                  </div>

                  <CheckCircle2 className='h-6 w-6 text-emerald-400' />
                </div>

                <div className='mt-7 grid grid-cols-2 gap-3'>
                  <div className='rounded-2xl bg-white/5 p-4'>
                    <p className='text-[10px] uppercase tracking-wide text-slate-500'>
                      Candidate
                    </p>
                    <div className='mt-2 h-3 w-3/4 rounded bg-white/20' />
                  </div>

                  <div className='rounded-2xl bg-white/5 p-4'>
                    <p className='text-[10px] uppercase tracking-wide text-slate-500'>
                      Roll Number
                    </p>
                    <div className='mt-2 h-3 w-2/3 rounded bg-white/20' />
                  </div>
                </div>

                <div className='mt-3 rounded-2xl bg-white/5 p-4'>
                  <div className='flex items-end justify-between'>
                    <div>
                      <p className='text-[10px] uppercase tracking-wide text-slate-500'>
                        Percentage
                      </p>

                      <p className='mt-1 text-3xl font-black'>85.40%</p>
                    </div>

                    <BarChart3 className='h-8 w-8 text-indigo-400' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='bg-slate-50 py-16 sm:py-20'>
        <div className='mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8'>
          <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600'>
            <BookOpen className='h-7 w-7' />
          </div>

          <h2 className='mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl'>
            About the AJK Result Portal
          </h2>

          <p className='mt-5 text-sm leading-7 text-slate-500 sm:text-base'>
            This result page provides a convenient interface for students to
            search examination results using their roll number. Depending on the
            configured result source, the result card can display candidate
            information, subject marks, total marks, percentage and result
            status.
          </p>

          <div className='mt-8 flex flex-wrap justify-center gap-3'>
            {[
              'Roll Number Search',
              'Subject Marks',
              'Total Marks',
              'Percentage',
              'Print Result',
              'Result Status',
            ].map((item) => (
              <span
                key={item}
                className='inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700'
              >
                <CheckCircle2 className='h-3.5 w-3.5 text-emerald-500' />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className='bg-white py-16 sm:py-20'>
        <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <span className='text-xs font-black uppercase tracking-[0.2em] text-indigo-600'>
              Frequently asked questions
            </span>

            <h2 className='mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl'>
              Result Search FAQ
            </h2>
          </div>

          <div className='mt-10 space-y-4'>
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className='group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-sm'
              >
                <summary className='flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-slate-900'>
                  <span>{faq.question}</span>

                  <HelpCircle className='h-5 w-5 shrink-0 text-indigo-500 transition group-open:rotate-12' />
                </summary>

                <p className='mt-4 border-t border-slate-100 pt-4 text-sm leading-7 text-slate-500'>
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className='bg-slate-950 py-16 sm:py-20'>
        <div className='mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8'>
          <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-indigo-300'>
            <GraduationCap className='h-7 w-7' />
          </div>

          <h2 className='mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl'>
            Ready to check your result?
          </h2>

          <p className='mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400'>
            Enter your roll number above and view the result available from the
            configured examination result service.
          </p>

          <a
            href='#result-search'
            className='mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-950/30 transition hover:bg-indigo-500'
          >
            <Search className='h-4 w-4' />
            Search Result
          </a>
        </div>
      </section>
    </main>
  )
}
