# Architecture & User Flow Guide

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   CLIENT (Next.js Frontend)                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐      ┌──────────────────┐             │
│  │   Auth Pages     │      │  Blog Pages      │             │
│  ├──────────────────┤      ├──────────────────┤             │
│  │ • /login         │      │ • /blog/[slug]   │             │
│  │ • /signup        │      │ • BlogInteraction│             │
│  │ • /profile       │      │   Component      │             │
│  └────────┬─────────┘      └────────┬─────────┘             │
│           │                         │                        │
│           └────────────┬────────────┘                        │
│                        │                                      │
│              ┌─────────▼─────────┐                           │
│              │   Server Actions  │                           │
│              │  (utils/actions)  │                           │
│              └────────┬──────────┘                           │
│                       │                                       │
└───────────────────────┼───────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼──────┐  ┌─────▼──────┐  ┌────▼───────┐
│  MongoDB     │  │  Prisma    │  │  Cloudinary│
│              │  │   Client   │  │            │
│ Models:      │  └──────┬─────┘  └────────────┘
│ • User       │         │
│ • Like       │    Updates to
│ • Citation   │    Schema
│ • Article    │
│ • Review     │
│ • Subscription
└──────────────┘
```

---

## 👤 User Authentication Flow

```
START
  │
  ├─► User visits /signup
  │     │
  │     ├─► Fill form (name, email, password)
  │     │
  │     ├─► Click "Create Account"
  │     │
  │     ├─► registerUser() server action
  │     │     │
  │     │     ├─► Validate inputs
  │     │     │
  │     │     ├─► Hash password (bcryptjs)
  │     │     │
  │     │     ├─► Create user in MongoDB
  │     │     │
  │     │     ├─► Generate JWT token
  │     │     │
  │     │     └─► Set HTTP-only cookie
  │     │
  │     └─► Redirect to home ✅
  │
  ├─► Later: User visits /login
  │     │
  │     ├─► Enter email & password
  │     │
  │     ├─► loginUser() server action
  │     │     │
  │     │     ├─► Find user in database
  │     │     │
  │     │     ├─► Verify password
  │     │     │
  │     │     ├─► Generate JWT token
  │     │     │
  │     │     └─► Set HTTP-only cookie
  │     │
  │     └─► Redirect to home ✅
  │
  ├─► User clicks profile
  │     │
  │     ├─► Check cookie for JWT token
  │     │
  │     ├─► Verify token validity
  │     │
  │     ├─► Get user data from database
  │     │
  │     └─► Display profile ✅
  │
  └─► User clicks logout
        │
        ├─► Clear HTTP-only cookie
        │
        ├─► Redirect to home
        │
        └─► Navbar shows Sign In/Up ✅
```

---

## ❤️ Like Article Flow

```
START
  │
  ├─► User navigates to blog post
  │
  ├─► BlogInteraction component loads
  │     │
  │     ├─► useEffect() runs
  │     │
  │     ├─► getArticleLikes(articleId)
  │     │     └─► Get total likes count
  │     │
  │     ├─► isArticleLikedByUser(articleId)
  │     │     └─► Check if current user liked
  │     │
  │     └─► Display heart icon + count
  │
  ├─► User clicks heart icon
  │     │
  │     ├─► handleLike() function
  │     │
  │     ├─► Check if user logged in
  │     │     │
  │     │     └─► If not → Show login prompt
  │     │
  │     ├─► toggleLike(articleId) server action
  │     │     │
  │     │     ├─► Check if like exists
  │     │     │
  │     │     ├─► If yes → Delete like
  │     │     │
  │     │     ├─► If no → Create like
  │     │     │
  │     │     └─► Return success
  │     │
  │     ├─► Update UI state
  │     │
  │     └─► Animate heart + count ✅
  │
  └─► Re-fetch likes next page load
```

---

## 📚 Citation Generation Flow

```
START
  │
  ├─► User clicks "Cite" button
  │
  ├─► Show citation format menu
  │     ├─ APA
  │     ├─ MLA
  │     ├─ Chicago
  │     └─ Harvard
  │
  ├─► User selects format (e.g., "APA")
  │
  ├─► handleCitation("APA") function
  │     │
  │     ├─► getCitationFormat(articleId, "APA")
  │     │     │
  │     │     ├─► Fetch article from database
  │     │     │     ├─ title
  │     │     │     ├─ slug
  │     │     │     ├─ author.name
  │     │     │     └─ createdAt
  │     │     │
  │     │     ├─► Format according to APA rules:
  │     │     │   AuthorName. (Year). Title. Retrieved from URL
  │     │     │
  │     │     └─► Return formatted string
  │     │
  │     ├─► Create textarea element
  │     │
  │     ├─► Copy to clipboard
  │     │
  │     ├─► Remove textarea
  │     │
  │     └─► Show success message ✅
  │
  └─► User can paste with Ctrl+V
```

---

## 📧 Newsletter Flow

```
START
  │
  ├─► User visits /subscribe
  │
  ├─► Display newsletter form
  │     └─► Input email field
  │
  ├─► User enters email: "user@example.com"
  │
  ├─► User clicks "Subscribe Now"
  │
  ├─► handleSubmit() function
  │     │
  │     ├─► Validate email format
  │     │
  │     ├─► subscribeToNewsletter(email)
  │     │     │
  │     │     ├─► Check if email already subscribed
  │     │     │
  │     │     ├─► If duplicate → Show error ❌
  │     │     │
  │     │     ├─► If new → Create in database
  │     │     │
  │     │     └─► Return success ✅
  │     │
  │     ├─► Show success message
  │     │
  │     ├─► Clear form
  │     │
  │     └─► Email saved in Subscription collection
  │
  └─► User receives newsletter emails (future feature)
```

---

## 🗄️ Database Relations

```
┌──────────────┐
│    User      │
├──────────────┤
│ id           │
│ email        │◄─────────┐
│ name         │          │
│ password     │          │
│ image        │          │
└──────────────┘          │
       ▲                   │
       │                   │
       │ 1:N              │
       │                   │
       │  ┌─────────────┐  │
       ├──┤    Like     │  │
       │  ├─────────────┤  │
       │  │ id          │  │
       │  │ userId ────────┤
       │  │ articleId   │  │
       │  │ createdAt   │  │
       │  └─────────────┘  │
       │                   │
       │  ┌─────────────┐  │
       ├──┤  Citation   │  │
       │  ├─────────────┤  │
       │  │ id          │  │
       │  │ userId ────────┤
       │  │ articleId   │  │
       │  │ format      │  │
       │  │ createdAt   │  │
       │  └─────────────┘  │
       │                   │
       │  ┌─────────────┐  │
       └──┤Subscription │  │
          ├─────────────┤  │
          │ id          │  │
          │ email       │  │
          │ createdAt   │  │
          └─────────────┘  │
                           │
┌──────────────┐           │
│   Article    │◄──────────┘
├──────────────┤
│ id           │
│ title        │
│ slug         │
│ content      │
│ image        │
│ likes[]      │
│ citations[]  │
└──────────────┘
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────┐
│       SECURITY LAYERS               │
├─────────────────────────────────────┤
│                                     │
│  Layer 1: CLIENT                    │
│  ├─ Form validation                 │
│  ├─ CSRF protection                 │
│  └─ Secure form submission          │
│                                     │
│  Layer 2: TRANSPORT                 │
│  ├─ HTTPS (production)              │
│  └─ Cookie: Secure flag             │
│                                     │
│  Layer 3: SERVER                    │
│  ├─ Input validation                │
│  ├─ Bcryptjs password hashing       │
│  ├─ JWT token verification          │
│  └─ Database validation             │
│                                     │
│  Layer 4: DATABASE                  │
│  ├─ MongoDB authentication          │
│  ├─ Unique constraints              │
│  ├─ Indexed fields                  │
│  └─ Data encryption at rest         │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔄 Data Flow: From Form to Database

```
USER FILLS SIGNUP FORM
      │
      ├─ Name: "John"
      ├─ Email: "john@test.com"
      └─ Password: "pass123"
      │
      ▼
FORM SUBMIT EVENT
      │
      ├─ Validation (client-side)
      │   ├─ Name: not empty ✓
      │   ├─ Email: valid format ✓
      │   └─ Password: 6+ chars ✓
      │
      ▼
SERVER ACTION: registerUser()
      │
      ├─ Validation (server-side)
      │   ├─ Email: unique in database ✓
      │   └─ Password != confirmPassword? ✗
      │
      ├─ Password Processing
      │   ├─ salt = 10 rounds
      │   └─ hash = bcryptjs(password, salt)
      │
      ├─ Database Operation
      │   └─ prisma.user.create({
      │       email: "john@test.com",
      │       name: "John",
      │       password: "hashed_pw_here"
      │     })
      │
      ├─ Token Generation
      │   └─ JWT: { userId, email, exp: 7days }
      │
      ├─ Cookie Setting
      │   └─ Set auth_token cookie
      │       ├─ httpOnly: true
      │       ├─ secure: true (prod)
      │       └─ maxAge: 7 days
      │
      ▼
DATABASE
      │
      ├─ MongoDB Collection: users
      │   └─ { _id, email, name, password, createdAt }
      │
      ▼
USER REDIRECTED TO HOME
      │
      └─ Name appears in navbar ✓
```

---

## 📊 Component Hierarchy

```
RootLayout
  │
  └─► Navbar
      │
      ├─► (Not logged in)
      │   ├─ Sign In link
      │   └─ Sign Up link
      │
      └─► (Logged in)
          ├─ User name/avatar
          └─ Dropdown menu
              ├─ Profile link
              └─ Logout button
  │
  └─► Main Content
      │
      ├─► (frontend) pages
      │   ├─ /
      │   ├─ /login
      │   ├─ /signup
      │   ├─ /profile
      │   ├─ /blog
      │   ├─ /blog/[slug]
      │   │   └─► BlogInteraction
      │   │       ├─ Like button
      │   │       ├─ Cite dropdown
      │   │       └─ Share button
      │   └─ /subscribe
      │
      └─► (admin) pages
          ├─ /control/articles
          ├─ /control/categories
          └─ /control/reviews
```

---

## 🚀 Deployment Flow

```
LOCAL DEVELOPMENT
      │
      ├─ npm run dev
      │ (localhost:3000)
      │
      ▼
BUILD
      │
      ├─ npm run build
      │ ├─ Compile TypeScript
      │ ├─ Optimize bundle
      │ └─ Generate static pages
      │
      ▼
PRODUCTION BUILD
      │
      ├─ .next/ folder created
      │
      ▼
DEPLOY (Vercel/similar)
      │
      ├─ Upload .next folder
      ├─ Set environment variables
      └─ Configure MongoDB connection
      │
      ▼
LIVE PRODUCTION
      │
      ├─ https://yourdomain.com
      │ ├─ Enable HTTPS
      │ ├─ Set cookies: Secure flag
      │ └─ Monitor logs
      │
      └─ Users can register & interact ✅
```

---

## 🧪 Testing Strategy

```
UNIT TESTS
├─ Password hashing
├─ Email validation
├─ Citation formatting
└─ Like toggle logic

INTEGRATION TESTS
├─ Sign up → Database
├─ Login → Session
├─ Like → Database
└─ Citation → Format

E2E TESTS
├─ Full sign up flow
├─ Full login flow
├─ Full article interaction
└─ Full newsletter signup
```

---

## 📈 Performance Optimization

```
CACHING
├─ Articles (static at build time)
├─ User data (after login)
└─ Categories (revalidate periodically)

OPTIMIZATION
├─ Images (Next.js Image optimization)
├─ Code splitting (automatic)
└─ Database indexes (on email, slug)

MONITORING
├─ Error logging
├─ Performance metrics
└─ Database query optimization
```

---

This architecture ensures:
✅ Security
✅ Scalability
✅ Performance
✅ Maintainability
✅ User Experience

**Ready for production!** 🚀
