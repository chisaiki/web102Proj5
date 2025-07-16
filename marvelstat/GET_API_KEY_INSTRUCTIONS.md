# How to Get Your Marvel API Key

## Step 1: Go to Marvel Developer
1. Visit: https://developer.marvel.com/
2. Click "Get a Key" or "Sign Up"

## Step 2: Create Account
1. Sign up with your email
2. Verify your email address
3. Complete your profile

## Step 3: Get Your Keys
1. Go to: https://developer.marvel.com/account
2. You'll see two keys:
   - **Public Key** - Use this one (32 characters)
   - **Private Key** - Don't use this in client-side apps

## Step 4: Authorize Your Domain
1. In your account page, find "Authorized Referers"
2. Add these entries:
   - localhost
   - 127.0.0.1
   - localhost:5173
   - * (for testing - allows all domains)

## Step 5: Update Your .env File
```
VITE_API_KEY=your_32_character_public_key_here
```

## Step 6: Restart Your Dev Server
After updating .env, restart with:
```
npm run dev
```

Your API key should look something like:
`1234567890abcdef1234567890abcdef`
