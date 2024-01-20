Project based on [Build a SaaS AI Platform](https://youtu.be/ffJ38dBzrlY?si=N1W0Umgv7nVzBrvi).

Changes made
- Using Supabase database instead of planetscale.

![AI landing page](/public/ai-saas.png)


![AI dashboard page](/public/ai-dashboard.png)
## Getting Started

Copy and rename the .env.example file to .env

For setting env varibles:

Go to https://clerk.com create an account, add or enter to your application and search for API Keys and copy the keys. If you don't see the NEXT_PUBLIC_CLERK_FRONTEND_API you may need to check the advanced option and copy the Frontend API URL.


You can leave the last 4 variables, as they are used for redirection.
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_FRONTEND_API=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

Go to openai https://platform.openai.com create an account and go to API Keys, create a new secret key and copy.

After go to https://replicate.com, your profile and API tokens, create a token and copy.

```
OPENAI_API_KEY=

REPLICATE_API_TOKEN=

```

Go to https://supabase.com, dashboard and create new project, to to settings, Database, Connection string, it should be something like this postgresql://postgres:[YOUR_PASSWORD]@...
```
DATABASE_URL=
```

For the last part, go to https://stripe.com, create an account and go to API Keys and Webhooks.

```
STRIPE_SECRET_KEY=

STRIPE_WEBHOOK_SECRET=
```

This variables is for stripe to use it, don't forget to change it on production for your app url.
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.