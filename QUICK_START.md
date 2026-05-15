# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Start the Development Server

```bash
cd "c:\Users\LENOVO\Desktop\Next\Blog"
npm run dev
```

Expected output:

```
  ▲ Next.js 14.2.14
  - Local:        http://localhost:3000
```

### Step 2: Open in Browser

Navigate to: **http://localhost:3000**

You should see your blog homepage with an updated navbar.

---

## 🧪 Testing New Features

### Feature 1: Sign Up (Authentication)

1. Click **"Sign Up"** button in navbar
2. Go to: **http://localhost:3000/signup**
3. Fill in:
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
4. Click **"Create Account"**
5. ✅ You should be redirected to home

### Feature 2: Login

1. Click **"Sign In"** button in navbar
2. Go to: **http://localhost:3000/login**
3. Enter:
   - Email: `john@example.com`
   - Password: `password123`
4. Click **"Sign In"**
5. ✅ Notice your name now appears in the navbar

### Feature 3: User Profile

1. Click your name in the navbar (top right)
2. Select **"Profile"** from dropdown
3. Go to: **http://localhost:3000/profile**
4. ✅ See your profile information and stats

### Feature 4: Like Articles

1. Navigate to any blog post
2. Go to: **http://localhost:3000/blog/[any-slug]**
3. Scroll down past the article content
4. Find the **❤️ Like** button
5. Click it to like/unlike
6. ✅ Counter should increase/decrease

### Feature 5: Cite Articles

1. On the same blog post
2. Click **"Cite"** button
3. Select format:
   - APA
   - MLA
   - Chicago
   - Harvard
4. ✅ Citation copied to clipboard
5. Paste anywhere with `Ctrl+V`

### Feature 6: Share Articles

1. On blog post
2. Click **"Share"** button
3. On mobile: Opens share dialog
4. On desktop: Copies link to clipboard
5. ✅ Share with others

### Feature 7: Subscribe

1. Click **"Subscribe"** button in navbar
2. Go to: **http://localhost:3000/subscribe**
3. Enter email: `subscriber@example.com`
4. Click **"Subscribe Now"**
5. ✅ Success message appears

### Feature 8: Logout

1. Click your name in navbar
2. Select **"Logout"**
3. ✅ Logged out, navbar shows Sign In/Up again

---

## 🎯 Key Routes

| Route          | Purpose                  | Auth Required               |
| -------------- | ------------------------ | --------------------------- |
| `/`            | Home                     | No                          |
| `/login`       | Login page               | No                          |
| `/signup`      | Sign up page             | No                          |
| `/profile`     | User profile             | **Yes**                     |
| `/blog/[slug]` | Blog post + interactions | No (but features need auth) |
| `/subscribe`   | Newsletter signup        | No                          |

---

## 📱 Mobile Testing

The new features are fully mobile-responsive:

1. Open DevTools: `F12`
2. Toggle Device Toolbar: `Ctrl + Shift + M`
3. Select mobile device
4. Test all features on mobile view
5. ✅ Should work smoothly

---

## 🔍 Checking the Code

### View New Files

```
✅ app/(frontend)/login/page.tsx          - Login form
✅ app/(frontend)/signup/page.tsx         - Sign up form
✅ app/(frontend)/profile/page.tsx        - User profile
✅ components/BlogInteraction.tsx         - Like/cite/share
```

### View Updated Files

```
✅ utils/actions.ts                       - Auth & interaction functions
✅ components/Navbar.tsx                  - Auth navigation
✅ app/(frontend)/blog/[slug]/page.tsx   - Blog with interactions
```

### View Database Schema

```
✅ prisma/schema.prisma                   - Updated with User, Like, Citation
```

---

## 🐛 Debugging

### Open Browser Console

- Press `F12`
- Go to **Console** tab
- Check for any errors
- Try actions again

### Check Terminal Output

- Watch `npm run dev` terminal
- Look for error messages
- Database connection issues
- Prisma errors

### Test Database Connection

Errors like "Cannot find module" or "User model not found":

```bash
# Regenerate Prisma
npx prisma generate

# Try dev server again
npm run dev
```

---

## 📊 Database Testing

### View Your Data

The data is stored in MongoDB. To verify:

1. Go to: [MongoDB Atlas Console](https://www.mongodb.com/cloud/atlas)
2. Login to your account
3. Navigate to your cluster
4. Check collections:
   - `users` - Created when you sign up
   - `Like` - Created when you like articles
   - `Subscription` - Created when you subscribe

---

## 🛠️ Common Tasks

### Change Brand Name

1. Open: `components/Navbar.tsx`
2. Find: `Blogify`
3. Replace with your name

### Change Colors

1. Open: `tailwind.config.ts`
2. Modify colors (currently using blue)
3. Save and refresh

### Add Custom Fields to User

1. Open: `prisma/schema.prisma`
2. Add field to User model
3. Run: `npx prisma generate`
4. Update signup form in `app/(frontend)/signup/page.tsx`

---

## ✅ Success Checklist

- [x] Server started without errors
- [x] Website loads at localhost:3000
- [x] Sign up works
- [x] Login works
- [x] Profile page accessible
- [x] Like button works
- [x] Citations generate
- [x] Share button works
- [x] Subscribe works
- [x] Logout works

---

## 🎓 Learn More

### For Detailed Documentation

Read: `ENHANCEMENT_GUIDE.md`

### For Complete Changes List

Read: `CHANGES_SUMMARY.md`

### For Deployment

Read: Deployment section in `ENHANCEMENT_GUIDE.md`

---

## 💡 Tips

**Pro Tips:**

- Use `Ctrl + K` in VS Code to quickly open files
- Use React DevTools to inspect components
- Use MongoDB Compass for database visualization
- Test authentication with different emails

---

## 🆘 Need Help?

### Check These First:

1. Ensure `.env` file exists with all variables
2. Run `npm install` if packages missing
3. Run `npx prisma generate` if models not found
4. Check browser console (`F12`) for errors
5. Clear browser cache (`Ctrl + Shift + Delete`)

### If Still Stuck:

1. Check `ENHANCEMENT_GUIDE.md` troubleshooting section
2. Verify MongoDB connection is active
3. Run fresh build: `npm run build`

---

## 🎉 You're All Set!

Your blog now has:

- ✅ User authentication
- ✅ Article likes
- ✅ Citation generation
- ✅ Beautiful UI
- ✅ Newsletter system

**Start building amazing features!** 🚀

---

_Last Updated: 2024_
_Status: Production Ready ✅_
