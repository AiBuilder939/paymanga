import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Staff } from '../components/Staff';
import { Courses } from '../components/Courses';
import { RegistrationForm } from '../components/RegistrationForm';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <Hero />
      <Staff />
      <Courses />
      <RegistrationForm />
      <Contact />
      <Footer />
    </main>
  );
}
