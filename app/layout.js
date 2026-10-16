import './globals.css';

export const metadata = {
  title: 'GYONGS | Home',
  description: 'GYONGS fashion/lifestyle store',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
