import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Heart,
  MessageCircle,
  PenLine,
  Sparkles,
  Users,
} from 'lucide-react'

import { getLandingPageArticles, getLandingPageTopics } from '@/utils/actions'

export default async function LandingPage() {
  const [articles, topics] = await Promise.all([
    getLandingPageArticles(),
    getLandingPageTopics(),
  ])

  const featuredArticle = articles[0]

  return (
    <main className='min-h-screen overflow-hidden bg-[#f8f9fc] text-gray-950'>
      \
      <header className='relative z-50 border-b border-gray-100 bg-[#f8f9fc]/95 backdrop-blur'>
        <div className='mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10'>
          {/* Logo */}

          <Link href='/' className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-[#3d348b] shadow-lg shadow-[#3d348b]/20'>
              <GraduationCap className='h-5 w-5 text-white' />
            </div>

            <div className='leading-none'>
              <p className='text-base font-extrabold tracking-tight text-[#3d348b]'>
                Education
              </p>

              <p className='text-xs font-semibold text-gray-500'>With Hamza</p>
            </div>
          </Link>

          {/* Desktop navigation */}

          <nav className='hidden items-center gap-8 md:flex'>
            <Link
              href='/latest'
              className='text-sm font-medium text-gray-600 transition hover:text-[#3d348b]'
            >
              Explore
            </Link>

            <Link
              href='/topics'
              className='text-sm font-medium text-gray-600 transition hover:text-[#3d348b]'
            >
              Topics
            </Link>

            <Link
              href='/write'
              className='text-sm font-medium text-gray-600 transition hover:text-[#3d348b]'
            >
              Write
            </Link>
          </nav>

          {/* Auth */}

          <div className='flex items-center gap-2 sm:gap-3'>
            <Link
              href='/login'
              className='hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-white hover:text-[#3d348b] sm:block'
            >
              Log in
            </Link>

            <Link
              href='/signup'
              className='rounded-xl bg-[#3d348b] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#3d348b]/20 transition hover:bg-[#30286f]'
            >
              Get started
            </Link>
          </div>
        </div>
      </header>
      {/* =========================================================
          HERO
      ========================================================== */}
      <section className='relative'>
        {/* Background decoration */}

        <div className='pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-[#7678ed]/10 blur-3xl' />

        <div className='pointer-events-none absolute -left-32 top-52 h-72 w-72 rounded-full bg-[#f7b801]/10 blur-3xl' />

        <div className='mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 md:pt-20 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:pb-28 lg:pt-24'>
          {/* Hero content */}

          <div className='relative z-10'>
            <div className='mb-6 inline-flex items-center gap-2 rounded-full border border-[#7678ed]/20 bg-white px-3.5 py-2 text-xs font-semibold text-[#3d348b] shadow-sm'>
              <Sparkles className='h-3.5 w-3.5' />A better place to learn and
              share
            </div>

            <h1 className='max-w-3xl text-5xl font-black leading-[1.02] tracking-[-0.04em] text-gray-950 sm:text-6xl lg:text-7xl'>
              Ideas that make
              <span className='mx-2 text-[#3d348b]'>learning</span>
              easier.
            </h1>

            <p className='mt-7 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8'>
              Discover useful articles, follow the people and topics you care
              about, and share what you know with a growing learning community.
            </p>

            {/* CTA */}

            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              <Link
                href='/latest'
                className='inline-flex items-center justify-center gap-2 rounded-xl bg-[#3d348b] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#3d348b]/20 transition hover:-translate-y-0.5 hover:bg-[#30286f]'
              >
                Start exploring
                <ArrowRight className='h-4 w-4' />
              </Link>

              <Link
                href='/write'
                className='inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-bold text-gray-800 shadow-sm transition hover:border-[#7678ed]/30 hover:bg-[#3d348b]/5 hover:text-[#3d348b]'
              >
                <PenLine className='h-4 w-4' />
                Write an article
              </Link>
            </div>

            {/* Benefits */}

            <div className='mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-500'>
              <span className='flex items-center gap-2'>
                <CheckCircle2 className='h-4 w-4 text-[#3d348b]' />
                Free to explore
              </span>

              <span className='flex items-center gap-2'>
                <CheckCircle2 className='h-4 w-4 text-[#3d348b]' />
                Learn at your pace
              </span>

              <span className='flex items-center gap-2'>
                <CheckCircle2 className='h-4 w-4 text-[#3d348b]' />
                Share your knowledge
              </span>
            </div>
          </div>

          {/* Hero visual */}

          <div className='relative mx-auto w-full max-w-xl lg:ml-auto'>
            <div className='relative rounded-[2rem] border border-gray-200 bg-white p-4 shadow-2xl shadow-[#3d348b]/10 sm:p-5'>
              {/* Feed heading */}

              <div className='flex items-center justify-between border-b border-gray-100 pb-4'>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-wider text-[#7678ed]'>
                    Your learning feed
                  </p>

                  <h3 className='mt-1 text-lg font-bold'>
                    Ideas worth reading
                  </h3>
                </div>

                <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-[#3d348b]/10'>
                  <Sparkles className='h-4 w-4 text-[#3d348b]' />
                </div>
              </div>

              {/* Dynamic preview */}

              {articles.length > 0 ? (
                <div className='py-5'>
                  <div className='flex items-center gap-3'>
                    {featuredArticle?.user?.image ? (
                      <Image
                        src={featuredArticle.user.image}
                        alt={featuredArticle.user.name ?? 'Author'}
                        width={40}
                        height={40}
                        className='h-10 w-10 rounded-full object-cover'
                      />
                    ) : (
                      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-[#3d348b] text-sm font-bold text-white'>
                        {featuredArticle?.user?.name
                          ?.charAt(0)
                          ?.toUpperCase() ?? 'A'}
                      </div>
                    )}

                    <div>
                      <p className='text-sm font-semibold'>
                        {featuredArticle?.user?.name ?? 'Community writer'}
                      </p>

                      <p className='text-xs text-gray-400'>
                        {articles[0].readTime
                          ? `${articles[0].readTime} min read`
                          : 'Article'}
                      </p>
                    </div>
                  </div>

                  <h4 className='mt-5 line-clamp-3 text-2xl font-bold leading-tight'>
                    {articles[0].title}
                  </h4>

                  {articles[0].short_desc && (
                    <p className='mt-3 line-clamp-3 text-sm leading-6 text-gray-500'>
                      {articles[0].short_desc}
                    </p>
                  )}

                  {/* Topics */}

                  {articles[0].topics.length > 0 && (
                    <div className='mt-5 flex flex-wrap gap-2'>
                      {articles[0].topics.slice(0, 3).map(({ topic }) => (
                        <span
                          key={topic.id}
                          className='rounded-full bg-[#3d348b]/10 px-3 py-1 text-xs font-semibold text-[#3d348b]'
                        >
                          {topic.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className='py-14 text-center'>
                  <BookOpen className='mx-auto h-10 w-10 text-[#3d348b]/40' />

                  <p className='mt-4 font-semibold text-gray-900'>
                    Your next great read starts here.
                  </p>

                  <p className='mt-2 text-sm text-gray-500'>
                    Articles will appear here as they are published.
                  </p>
                </div>
              )}

              {/* Engagement */}

              {articles.length > 0 && (
                <div className='flex items-center justify-between border-t border-gray-100 pt-4 text-xs text-gray-400'>
                  <span>♥ {articles[0]._count.likes} likes</span>

                  <span>💬 {articles[0]._count.reviews} comments</span>

                  <span>{formatDate(articles[0].createdAt)}</span>
                </div>
              )}
            </div>

            {/* Floating card */}

            <div className='absolute -bottom-6 -left-5 hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-xl sm:block'>
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-[#f7b801]/20'>
                  <Sparkles className='h-5 w-5 text-[#f18701]' />
                </div>

                <div>
                  <p className='text-xs text-gray-400'>Keep discovering</p>

                  <p className='text-sm font-bold text-gray-900'>
                    Something new today
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* =========================================================
          DYNAMIC STATS
      ========================================================== */}
      <section className='border-y border-gray-200 bg-white'>
        <div className='mx-auto grid max-w-7xl grid-cols-2 divide-x divide-gray-200 sm:grid-cols-4'>
          <MiniStat
            value={articles.length.toString()}
            label='featured articles'
          />

          <MiniStat value={topics.length.toString()} label='explore topics' />

          <MiniStat
            value={getTotalLikes(articles).toString()}
            label='article likes'
          />

          <MiniStat
            value={getTotalComments(articles).toString()}
            label='community comments'
          />
        </div>
      </section>
      {/* =========================================================
          DYNAMIC TOPICS
      ========================================================== */}
      <section className='mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28'>
        <div className='flex flex-col justify-between gap-5 sm:flex-row sm:items-end'>
          <div>
            <p className='text-sm font-bold uppercase tracking-wider text-[#7678ed]'>
              Explore
            </p>

            <h2 className='mt-2 text-3xl font-black tracking-tight sm:text-4xl'>
              Find something worth learning.
            </h2>

            <p className='mt-3 max-w-2xl text-gray-500'>
              Explore topics that match your interests and discover articles
              from writers in the community.
            </p>
          </div>

          <Link
            href='/topics'
            className='inline-flex items-center gap-1.5 text-sm font-bold text-[#3d348b]'
          >
            View all topics
            <ChevronRight className='h-4 w-4' />
          </Link>
        </div>

        {topics.length === 0 ? (
          <div className='mt-10 rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center'>
            <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3d348b]/10'>
              <BookOpen className='h-7 w-7 text-[#3d348b]' />
            </div>

            <h3 className='mt-5 text-lg font-bold text-gray-900'>
              No topics available yet
            </h3>

            <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500'>
              Topics will appear here as they are added to the platform.
            </p>
          </div>
        ) : (
          <div className='mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {topics.map((topic, index) => (
              <Link
                key={topic.id}
                href={`/topics/${topic.slug}`}
                className='group rounded-2xl border border-gray-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-[#7678ed]/30 hover:shadow-xl hover:shadow-[#3d348b]/5'
              >
                <div className='flex items-start justify-between'>
                  <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-[#3d348b]/10 text-lg font-bold text-[#3d348b]'>
                    {getTopicIcon(index)}
                  </div>

                  <ArrowRight className='h-4 w-4 text-gray-300 transition group-hover:translate-x-1 group-hover:text-[#3d348b]' />
                </div>

                <h3 className='mt-5 font-bold text-gray-900'>{topic.name}</h3>

                <p className='mt-2 text-sm text-gray-500'>
                  {topic._count.articles}{' '}
                  {topic._count.articles === 1 ? 'article' : 'articles'}
                </p>

                <div className='mt-4 flex items-center justify-between'>
                  <span className='text-xs text-gray-400'>
                    {topic._count.followers}{' '}
                    {topic._count.followers === 1 ? 'follower' : 'followers'}
                  </span>

                  <span className='text-xs font-semibold text-[#3d348b] opacity-0 transition group-hover:opacity-100'>
                    Explore →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      {/* =========================================================
          FEATURES
      ========================================================== */}
      <section className='bg-[#3d348b]'>
        <div className='mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24'>
          <div className='max-w-2xl'>
            <p className='text-sm font-bold uppercase tracking-wider text-[#f7b801]'>
              Why Education With Hamza
            </p>

            <h2 className='mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl'>
              Learning should be a journey, not just a search result.
            </h2>

            <p className='mt-4 leading-7 text-white/70'>
              A space where learners can discover ideas, follow people they
              trust and contribute knowledge of their own.
            </p>
          </div>

          <div className='mt-12 grid gap-5 md:grid-cols-3'>
            <Feature
              icon={<BookOpen className='h-5 w-5' />}
              title='Learn from real people'
              description='Discover useful explanations, study guides and ideas written by students, teachers and education enthusiasts.'
            />

            <Feature
              icon={<Brain className='h-5 w-5' />}
              title='Build your knowledge'
              description='Follow the topics you care about and create a personalized learning feed that gets better over time.'
            />

            <Feature
              icon={<PenLine className='h-5 w-5' />}
              title='Share what you know'
              description='Write articles, explain concepts and help other learners understand something new.'
            />
          </div>
        </div>
      </section>
      {/* =========================================================
          HOW IT WORKS
      ========================================================== */}
      <section className='mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28'>
        <div className='grid gap-12 lg:grid-cols-[.8fr_1.2fr]'>
          <div>
            <p className='text-sm font-bold uppercase tracking-wider text-[#7678ed]'>
              Simple by design
            </p>

            <h2 className='mt-3 text-3xl font-black tracking-tight sm:text-4xl'>
              Your learning journey starts here.
            </h2>

            <p className='mt-4 max-w-md leading-7 text-gray-500'>
              Discover ideas, follow writers and topics, and create a learning
              experience that is yours.
            </p>

            <Link
              href='/signup'
              className='mt-7 inline-flex items-center gap-2 rounded-xl bg-[#3d348b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#30286f]'
            >
              Create your account
              <ArrowRight className='h-4 w-4' />
            </Link>
          </div>

          <div className='grid gap-3'>
            <Step
              number='01'
              title='Discover'
              description='Explore articles and topics across education, science, technology and learning.'
            />

            <Step
              number='02'
              title='Follow'
              description='Follow writers and topics that match your interests.'
            />

            <Step
              number='03'
              title='Learn'
              description='Build a personal feed filled with ideas worth your time.'
            />

            <Step
              number='04'
              title='Share'
              description='Turn your knowledge into articles and help someone else learn.'
            />
          </div>
        </div>
      </section>
      {/* =========================================================
          DYNAMIC ARTICLES
      ========================================================== */}
      <section className='border-y border-gray-200 bg-white'>
        <div className='mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24'>
          <div className='flex flex-col justify-between gap-5 sm:flex-row sm:items-end'>
            <div>
              <p className='text-sm font-bold uppercase tracking-wider text-[#7678ed]'>
                From the community
              </p>

              <h2 className='mt-2 text-3xl font-black tracking-tight sm:text-4xl'>
                Ideas worth your time.
              </h2>

              <p className='mt-3 max-w-xl text-gray-500'>
                Fresh ideas and useful knowledge from writers in the Education
                With Hamza community.
              </p>
            </div>

            <Link
              href='/latest'
              className='inline-flex items-center gap-1.5 text-sm font-bold text-[#3d348b]'
            >
              Explore all articles
              <ArrowRight className='h-4 w-4' />
            </Link>
          </div>

          {articles.length === 0 ? (
            <div className='mt-10 rounded-3xl border border-dashed border-gray-300 bg-[#f8f9fc] px-6 py-16 text-center'>
              <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3d348b]/10'>
                <BookOpen className='h-7 w-7 text-[#3d348b]' />
              </div>

              <h3 className='mt-5 text-xl font-bold text-gray-900'>
                Articles are coming soon
              </h3>

              <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500'>
                Be the first to share something useful with the community.
              </p>

              <Link
                href='/write'
                className='mt-6 inline-flex items-center gap-2 rounded-xl bg-[#3d348b] px-5 py-3 text-sm font-bold text-white'
              >
                Write an article
                <PenLine className='h-4 w-4' />
              </Link>
            </div>
          ) : (
            <div className='mt-10 grid gap-5 lg:grid-cols-3'>
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className='group overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-200 hover:-translate-y-1 hover:border-[#7678ed]/30 hover:shadow-xl hover:shadow-[#3d348b]/5'
                >
                  {/* Image */}

                  {article.image ? (
                    <div className='relative h-52 w-full overflow-hidden bg-gray-100'>
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className='object-cover transition duration-500 group-hover:scale-105'
                      />
                    </div>
                  ) : (
                    <div className='flex h-52 items-center justify-center bg-gradient-to-br from-[#3d348b] to-[#7678ed]'>
                      <BookOpen className='h-12 w-12 text-white/80' />
                    </div>
                  )}

                  <div className='p-6'>
                    {/* Category */}

                    <div className='flex flex-wrap items-center gap-2'>
                      {article.category && (
                        <span className='rounded-full bg-[#3d348b]/10 px-3 py-1 text-xs font-bold text-[#3d348b]'>
                          {article.category.title}
                        </span>
                      )}

                      {article.featured && (
                        <span className='rounded-full bg-[#f7b801]/15 px-3 py-1 text-xs font-semibold text-[#a66f00]'>
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Title */}

                    <h3 className='mt-5 line-clamp-2 text-xl font-bold leading-snug text-gray-950 transition group-hover:text-[#3d348b]'>
                      {article.title}
                    </h3>

                    {/* Description */}

                    {article.short_desc && (
                      <p className='mt-3 line-clamp-3 text-sm leading-6 text-gray-500'>
                        {article.short_desc}
                      </p>
                    )}

                    {/* Topics */}

                    {article.topics.length > 0 && (
                      <div className='mt-4 flex flex-wrap gap-1.5'>
                        {article.topics.slice(0, 3).map(({ topic }) => (
                          <span
                            key={topic.id}
                            className='rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-500'
                          >
                            {topic.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Author */}

                    <div className='mt-6 flex items-center gap-3 border-t border-gray-100 pt-5'>
                      {article.user?.image ? (
                        <Image
                          src={article.user.image}
                          alt={article.user.name ?? 'Author'}
                          width={36}
                          height={36}
                          className='h-9 w-9 rounded-full object-cover'
                        />
                      ) : (
                        <div className='flex h-9 w-9 items-center justify-center rounded-full bg-[#3d348b] text-xs font-bold text-white'>
                          {article.user?.name?.charAt(0)?.toUpperCase() ?? 'A'}
                        </div>
                      )}

                      <div className='min-w-0'>
                        <p className='truncate text-sm font-semibold text-gray-900'>
                          {article.user?.name ?? 'Community writer'}
                        </p>

                        <div className='flex items-center gap-2 text-xs text-gray-400'>
                          <span>{formatDate(article.createdAt)}</span>

                          {article.readTime && (
                            <>
                              <span>•</span>

                              <span>{article.readTime} min read</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Engagement */}

                    <div className='mt-4 flex items-center gap-4 text-xs text-gray-400'>
                      <span className='flex items-center gap-1'>
                        <Heart className='h-3.5 w-3.5' />
                        {article._count.likes}
                      </span>

                      <span className='flex items-center gap-1'>
                        <MessageCircle className='h-3.5 w-3.5' />
                        {article._count.reviews}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      {/* =========================================================
          WRITER CTA
      ========================================================== */}
      <section className='mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28'>
        <div className='relative overflow-hidden rounded-[2rem] bg-[#f0effb] px-6 py-12 sm:px-10 lg:px-16 lg:py-14'>
          <div className='absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#7678ed]/10 blur-2xl' />

          <div className='relative grid items-center gap-10 lg:grid-cols-[1fr_auto]'>
            <div>
              <div className='mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#3d348b]'>
                <Users className='h-5 w-5 text-white' />
              </div>

              <h2 className='max-w-2xl text-3xl font-black tracking-tight text-gray-950 sm:text-4xl'>
                You don&apos;t have to be an expert to have something worth
                teaching.
              </h2>

              <p className='mt-4 max-w-2xl leading-7 text-gray-600'>
                Share your notes, explain a concept, write about something
                you&apos;ve learned or tell someone how you solved a problem.
              </p>

              <Link
                href='/write'
                className='mt-7 inline-flex items-center gap-2 rounded-xl bg-[#3d348b] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#3d348b]/20 transition hover:bg-[#30286f]'
              >
                Start writing
                <PenLine className='h-4 w-4' />
              </Link>
            </div>

            <div className='hidden h-40 w-40 items-center justify-center rounded-full border-[12px] border-white bg-[#3d348b] shadow-xl lg:flex'>
              <PenLine className='h-12 w-12 text-white' />
            </div>
          </div>
        </div>
      </section>
      {/* =========================================================
          FINAL CTA
      ========================================================== */}
      <section className='bg-gray-950'>
        <div className='mx-auto max-w-5xl px-5 py-20 text-center sm:px-8 lg:py-24'>
          <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7b801]'>
            <GraduationCap className='h-7 w-7 text-gray-950' />
          </div>

          <h2 className='mt-7 text-3xl font-black tracking-tight text-white sm:text-5xl'>
            Learn something new.
            <br />
            Share something useful.
          </h2>

          <p className='mx-auto mt-5 max-w-xl leading-7 text-gray-400'>
            Join Education With Hamza and make every idea you discover part of
            something bigger.
          </p>

          <div className='mt-8 flex flex-col justify-center gap-3 sm:flex-row'>
            <Link
              href='/signup'
              className='inline-flex items-center justify-center gap-2 rounded-xl bg-[#f7b801] px-6 py-3.5 text-sm font-bold text-gray-950 transition hover:bg-[#f9c52e]'
            >
              Get started
              <ArrowRight className='h-4 w-4' />
            </Link>

            <Link
              href='/latest'
              className='inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10'
            >
              Explore articles
            </Link>
          </div>
        </div>
      </section>
      {/* =========================================================
          FOOTER
      ========================================================== */}
      <footer className='bg-gray-950'>
        <div className='mx-auto flex max-w-7xl flex-col gap-6 border-t border-white/10 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10'>
          <div className='flex items-center gap-3'>
            <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-[#3d348b]'>
              <GraduationCap className='h-4 w-4 text-white' />
            </div>

            <div>
              <p className='text-sm font-bold text-white'>
                Education With Hamza
              </p>

              <p className='text-xs text-gray-500'>Learn. Share. Grow.</p>
            </div>
          </div>

          <div className='flex flex-wrap gap-5 text-xs text-gray-500'>
            <Link href='/latest' className='transition hover:text-white'>
              Explore
            </Link>

            <Link href='/topics' className='transition hover:text-white'>
              Topics
            </Link>

            <Link href='/write' className='transition hover:text-white'>
              Write
            </Link>

            <Link href='/login' className='transition hover:text-white'>
              Login
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

/* =========================================================
   COMPONENTS
========================================================= */

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className='px-4 py-7 text-center sm:py-8'>
      <p className='text-lg font-black text-[#3d348b] sm:text-xl'>{value}</p>

      <p className='mt-1 text-xs font-medium text-gray-500 sm:text-sm'>
        {label}
      </p>
    </div>
  )
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className='rounded-2xl border border-white/10 bg-white/10 p-7 backdrop-blur-sm'>
      <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#3d348b]'>
        {icon}
      </div>

      <h3 className='mt-6 text-xl font-bold text-white'>{title}</h3>

      <p className='mt-3 text-sm leading-6 text-white/65'>{description}</p>
    </div>
  )
}

function Step({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className='group flex gap-5 rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-[#7678ed]/30 hover:shadow-md'>
      <div className='shrink-0 text-sm font-black text-[#7678ed]'>{number}</div>

      <div>
        <h3 className='font-bold text-gray-900'>{title}</h3>

        <p className='mt-1.5 text-sm leading-6 text-gray-500'>{description}</p>
      </div>

      <ChevronRight className='ml-auto mt-1 h-4 w-4 shrink-0 text-gray-300 transition group-hover:translate-x-1 group-hover:text-[#3d348b]' />
    </div>
  )
}

/* =========================================================
   HELPERS
========================================================= */

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getTopicIcon(index: number) {
  const icons = ['∑', 'Φ', '⚗', '🧬', '</>', '✦']

  return icons[index % icons.length]
}

function getTotalLikes(
  articles: Array<{
    _count: {
      likes: number
    }
  }>,
) {
  return articles.reduce((total, article) => total + article._count.likes, 0)
}

function getTotalComments(
  articles: Array<{
    _count: {
      reviews: number
    }
  }>,
) {
  return articles.reduce((total, article) => total + article._count.reviews, 0)
}
