# Blog Site Enhancements - Setup & Feature Guide

## ✨ What's New

Your blog site now includes:

### 1. **User Authentication**

- **Sign Up Page** (`/signup`) - Create new user accounts
- **Login Page** (`/login`) - Authenticate existing users
- **Profile Page** (`/profile`) - View user information and stats
- **User Logout** - Integrated in navbar user menu

### 2. **Blog Post Interactions**

- **Like/Unlike Posts** - Users can like articles
- **Citations** - Generate citations in APA, MLA, Chicago, and Harvard formats
- **Share Articles** - Share via native sharing or copy link
- **Like Counter** - Display total likes on each post

### 3. **Newsletter Features**

- **Enhanced Subscribe Page** (`/subscribe`) - Beautiful signup experience
- **Email Validation** - Prevents duplicate subscriptions
- **Subscription Storage** - Saves to database for future campaigns

### 4. **Beautiful UI Enhancements**

- **Dark Mode Navbar** - Modern gradient authentication buttons
- **Enhanced Blog Post Layout** - Interaction rail with likes and citations
- **Gradient Backgrounds** - Professional gradient designs throughout
- **Smooth Animations** - Hover effects and transitions
- **Responsive Design** - Mobile-friendly layouts

---

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js and npm installed.

### Installation Steps

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Generate Prisma Client** (Already done, but if needed)

   ```bash
   npx prisma generate
   ```

3. **Environment Variables**
   The `.env` file is already configured with:
   - `DATABASE_URL` - MongoDB connection
   - `JWT_SECRET` - For authentication tokens
   - `CLOUDINARY_*` - For image uploads

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`

---

## 📍 New Routes

### Authentication Routes

- `/signup` - User registration
- `/login` - User login
- `/profile` - User profile (protected, requires login)

### Enhanced Routes

- `/subscribe` - Newsletter subscription (improved UI)
- `/blog/[slug]` - Blog post with interactions (like, cite, share)

### Navigation

- Navbar displays **Sign In / Sign Up** buttons when logged out
- Navbar shows **User Profile** dropdown when logged in

---

## 🔐 Authentication Flow

### Registration

1. User fills signup form with Name, Email, Password
2. Password is hashed with bcryptjs
3. User created in MongoDB
4. JWT token issued and stored in HTTP-only cookie
5. User redirected to home

### Login

1. User enters email and password
2. Credentials validated
3. JWT token created
4. Token stored in cookie (7-day expiry)
5. User redirected to home

### Session Management

- Tokens stored in HTTP-only cookies (secure)
- `getCurrentUser()` action retrieves logged-in user
- `logoutUser()` clears session
- Protected routes check for valid token

---

## ❤️ Blog Interaction Features

### Likes

- Click heart icon to like/unlike articles
- Shows live like count
- Must be logged in to like
- One like per user per article (unique constraint)

### Citations

- Click "Cite" button to generate formatted citations
- Supports 4 formats:
  - **APA**: Author. (Year). Title. Retrieved from URL
  - **MLA**: Author. "Title." Accessed Date. URL
  - **Chicago**: Author. "Title." Accessed Date. URL.
  - **Harvard**: Author Year, 'Title', available at: URL

### Share

- Click "Share" button
- Native share API on mobile
- Copy-to-clipboard on desktop
- Pre-formatted share message

---

## 🗄️ Database Models

### New Models Added to Prisma Schema

```prisma
model User {
  id          String
  email       String @unique
  name        String
  password    String
  image       String?
  createdAt   DateTime

  likes       Like[]
  citations   Citation[]
}

model Like {
  id          String
  articleId   String
  userId      String
  createdAt   DateTime

  @@unique([articleId, userId])
}

model Citation {
  id          String
  articleId   String
  userId      String
  format      String (APA|MLA|Chicago|Harvard)
  createdAt   DateTime
}

model Subscription {
  id          String
  email       String @unique
  createdAt   DateTime
}
```

---

## 🎨 Component Updates

### New Components

1. **BlogInteraction.tsx** - Like, cite, share buttons with interactions
2. Enhanced **Navbar.tsx** - User auth buttons and profile menu

### Updated Pages

1. `/login` - Beautiful login form with gradient
2. `/signup` - Elegant signup page
3. `/profile` - User dashboard
4. `/blog/[slug]` - Integrated interaction component
5. `/subscribe` - Modern newsletter signup

---

## 🔑 Server Actions Added

Located in `utils/actions.ts`:

### Authentication

- `registerUser()` - Register new user
- `loginUser()` - Authenticate user
- `logoutUser()` - End session
- `getCurrentUser()` - Get logged-in user

### Blog Interactions

- `toggleLike()` - Like/unlike article
- `getArticleLikes()` - Get total likes count
- `isArticleLikedByUser()` - Check if user liked
- `addCitation()` - Record citation
- `getCitationFormat()` - Generate formatted citation

### Newsletter

- `subscribeToNewsletter()` - Save email subscription

---

## 🔒 Security Features

✅ **Password Security**

- Hashed with bcryptjs (10 salt rounds)
- Never stored in plain text

✅ **Session Security**

- HTTP-only cookies (no JavaScript access)
- Secure flag in production
- 7-day expiration

✅ **Database Constraints**

- Email uniqueness on User model
- Like uniqueness per article per user
- No duplicate subscriptions

✅ **Input Validation**

- Email format validation
- Password minimum length (6 characters)
- Email already exists checks

---

## 📦 Dependencies Used

### Authentication

- `bcryptjs` - Password hashing
- `jose` - JWT handling
- `jsonwebtoken` - Token creation

### UI Icons

- `react-icons` - Beautiful icons (HiHeart, HiSparkles, etc.)

### Already Included

- `next` - Framework
- `@prisma/client` - Database ORM
- `tailwindcss` - Styling
- `daisyui` - Component library

---

## 🚀 Deployment Notes

When deploying to production:

1. **Update .env**

   ```
   NODE_ENV=production
   JWT_SECRET=your-secure-secret-key
   DATABASE_URL=your-mongodb-url
   CLOUDINARY_NAME=your-cloudinary-name
   ```

2. **Build**

   ```bash
   npm run build
   ```

3. **Start**
   ```bash
   npm start
   ```

---

## 📱 Responsive Design

All new features are fully responsive:

- ✅ Mobile-optimized forms
- ✅ Touch-friendly buttons
- ✅ Mobile drawer navigation
- ✅ Responsive grid layouts

---

## 🎯 Next Steps / Future Enhancements

1. **Email Notifications**
   - Send confirmation emails on signup
   - Newsletter delivery system

2. **User Analytics**
   - Track user activity
   - Show reading statistics

3. **Comments**
   - Discussion threads on articles
   - Comment moderation

4. **Advanced Sharing**
   - Social media integration
   - Analytics on shares

5. **Admin Dashboard**
   - User management
   - Subscription analytics

---

## ❓ Common Issues & Solutions

### "JWT_SECRET not found"

**Solution**: Ensure JWT_SECRET is in `.env` file

### "User model not found"

**Solution**: Run `npx prisma generate` to regenerate client

### "Like button not working"

**Solution**: Make sure you're logged in (check `/login`)

### "Citations not generating"

**Solution**: Verify article data is complete (title, slug, author)

---

## 📧 Support

For issues or questions:

1. Check error messages in browser console
2. Verify environment variables in `.env`
3. Ensure MongoDB connection is active
4. Check Prisma schema is properly generated

---

## 📜 License

Same as your original project

**Enjoy your enhanced blog platform!** 🎉
