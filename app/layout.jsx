import './globals.css';

export const metadata = {
  title: 'Alex Vance | 3D Full-Stack Architect & WebGL Engineer',
  description: 'Interactive 3D Portfolio of Alex Vance - Senior Full-Stack AI & WebGL Architect specializing in Next.js, Three.js, React Three Fiber, GSAP, and Custom Shaders.',
  keywords: ['3D Portfolio', 'WebGL Architect', 'Three.js', 'React Three Fiber', 'Next.js Developer', 'Full Stack Developer', 'GSAP Animation'],
  authors: [{ name: 'Alex Vance' }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#070913] text-slate-100 antialiased selection:bg-cyan-500 selection:text-black min-h-screen overflow-x-hidden font-sans">
        {children}
      </body>
    </html>
  );
}
