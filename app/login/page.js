import { Suspense } from 'react';
import LoginForm from './LoginForm';

export default function Page() {
  return (
    <Suspense>
      <link rel="stylesheet" href="/login.css" />
      <LoginForm />
    </Suspense>
  );
}
