"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { 
  FileImage, 
  FileText, 
  FilePlus, 
  FileUp, 
  Zap, 
  Search, 
  ArrowRight 
} from "lucide-react";

export default function Home() {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-900 to-indigo-900 dark:from-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute h-full w-full bg-gradient-to-b from-transparent to-background" />
        
        <motion.div 
          ref={heroRef}
          initial={{ opacity: 0, y: 20 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 py-24 sm:py-32 relative z-10"
        >
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl"
            >
              <span className="block">FileWizard</span>
              <span className="block text-blue-400 mt-2">Document Conversion Made Easy</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Apne documents ko convert karein PDF se image, image se PDF, Word se PDF, aur bahut kuch. Hamara tool simple, fast aur 100% secure hai!
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-10 flex justify-center gap-4"
            >
              <Link href="/convert/pdf-to-image" className="rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-300">
                Start Converting
              </Link>
              <Link href="#features" className="rounded-md bg-white/10 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-white/20 transition-all duration-300">
                Explore Features
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div 
            ref={featuresRef}
            initial="hidden"
            animate={featuresInView ? "show" : "hidden"}
            variants={container}
            className="text-center mb-16"
          >
            <motion.h2 variants={item} className="text-3xl font-bold mb-4">
              <span className="gradient-text">Hamari Services</span>
            </motion.h2>
            <motion.p variants={item} className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              FileWizard aapko provide karta hai multiple file conversion options, taaki aap apne documents ko easily manage kar sakein.
            </motion.p>
          </motion.div>

          <motion.div 
            variants={container}
            initial="hidden"
            animate={featuresInView ? "show" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {/* PDF to Image */}
            <motion.div variants={item} whileHover={{ scale: 1.03 }} className="feature-card">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
                <FileImage className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">PDF to Image</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                PDF files ko high-quality images mein convert karein. Multiple pages ko alag-alag images mein convert kar sakte hain.
              </p>
              <Link href="/convert/pdf-to-image" className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:underline">
                Convert Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>

            {/* Image to PDF */}
            <motion.div variants={item} whileHover={{ scale: 1.03 }} className="feature-card">
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-6">
                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Image to PDF</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Multiple images ko ek PDF file mein combine karein. JPG, PNG aur other formats support karta hai.
              </p>
              <Link href="/convert/image-to-pdf" className="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium hover:underline">
                Convert Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>

            {/* Word to PDF */}
            <motion.div variants={item} whileHover={{ scale: 1.03 }} className="feature-card">
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
                <FileUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Word to PDF</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Microsoft Word documents (DOCX) ko PDF format mein convert karein, formatting aur layout preserve karke.
              </p>
              <Link href="/convert/word-to-pdf" className="inline-flex items-center text-green-600 dark:text-green-400 font-medium hover:underline">
                Convert Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>

            {/* Merge PDFs */}
            <motion.div variants={item} whileHover={{ scale: 1.03 }} className="feature-card">
              <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-6">
                <FilePlus className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Merge PDFs</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Multiple PDF files ko ek single PDF document mein combine karein, pages ko rearrange karein.
              </p>
              <Link href="/convert/merge-pdf" className="inline-flex items-center text-orange-600 dark:text-orange-400 font-medium hover:underline">
                Merge Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>

            {/* File Compression */}
            <motion.div variants={item} whileHover={{ scale: 1.03 }} className="feature-card">
              <div className="h-12 w-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">File Compression</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                PDF aur image files ko compress karein without quality loss, file size ko kam karein.
              </p>
              <Link href="/convert/compress" className="inline-flex items-center text-red-600 dark:text-red-400 font-medium hover:underline">
                Compress Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>

            {/* OCR */}
            <motion.div variants={item} whileHover={{ scale: 1.03 }} className="feature-card">
              <div className="h-12 w-12 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center mb-6">
                <Search className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">OCR (Text Recognition)</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Scanned documents aur images se text extract karein using Optical Character Recognition.
              </p>
              <Link href="/convert/ocr" className="inline-flex items-center text-teal-600 dark:text-teal-400 font-medium hover:underline">
                Extract Text <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-900">
        <motion.div 
          ref={ctaRef}
          initial={{ opacity: 0, y: 20 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Convert Your Files?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            FileWizard ke saath apne documents ko instantly convert karein. No sign-up required, 100% free!
          </p>
          <Link href="/convert/pdf-to-image" className="inline-flex items-center bg-white text-blue-700 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-50 transition-all duration-300">
            Start Converting Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}