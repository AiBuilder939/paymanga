import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Courses } from '../components/Courses';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <Hero />
      <Courses />
      <Contact />
      <Footer />
    </main>
  );
}
