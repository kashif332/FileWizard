"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight, FileText, Image, FileImage, FileMerge, FileSearch, FileDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      title: "PDF to Image",
      description: "PDF ko high-quality images mein convert karein",
      icon: <FileImage className="h-10 w-10 text-primary" />,
      href: "/pdf-to-image",
    },
    {
      title: "Image to PDF",
      description: "Multiple images ko ek PDF mein convert karein",
      icon: <Image className="h-10 w-10 text-primary" />,
      href: "/image-to-pdf",
    },
    {
      title: "Word to PDF",
      description: "Word documents ko PDF format mein convert karein",
      icon: <FileText className="h-10 w-10 text-primary" />,
      href: "/word-to-pdf",
    },
    {
      title: "Merge PDFs",
      description: "Multiple PDF files ko ek file mein combine karein",
      icon: <FileMerge className="h-10 w-10 text-primary" />,
      href: "/merge-pdf",
    },
    {
      title: "OCR",
      description: "Images se text extract karein using OCR technology",
      icon: <FileSearch className="h-10 w-10 text-primary" />,
      href: "/ocr",
    },
    {
      title: "File Compression",
      description: "Files ka size reduce karein without quality loss",
      icon: <FileDown className="h-10 w-10 text-primary" />,
      href: "/compress",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.section
        ref={heroRef}
        initial={{ opacity: 0, y: 20 }}
        animate={heroInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="py-20 text-center"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-3xl" />
          <div className="relative bg-background/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-primary">FileWizard</span> - Aapka File Conversion Partner
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              PDF, Image, aur Word files ko instantly convert karein. 
              No signup required, 100% free aur secure!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="#features">
                  Start Converting <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#how-it-works">
                  How It Works
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      <section id="features" className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Hamari Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            FileWizard aapko provide karta hai multiple file conversion tools, 
            jo aapke documents ko different formats mein convert karne mein help karte hain.
          </p>
        </div>

        <motion.div
          ref={featuresRef}
          initial={{ opacity: 0 }}
          animate={featuresInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={feature.href}>
                <div className="feature-card bg-card hover:bg-accent/50 rounded-xl p-6 h-full shadow-sm">
                  <div className="mb-4 bg-primary/10 p-3 rounded-full w-fit">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section id="how-it-works" className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            FileWizard ke saath file conversion bahut simple hai. 
            Bas in 3 steps follow karein aur aapki file convert ho jayegi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Upload Your File",
              description: "Apni file select karein ya drag and drop karein",
              icon: "📁",
            },
            {
              step: "2",
              title: "Choose Options",
              description: "Conversion options select karein (if available)",
              icon: "⚙️",
            },
            {
              step: "3",
              title: "Download Result",
              description: "Converted file ko download karein",
              icon: "⬇️",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="bg-card rounded-xl p-6 shadow-sm relative"
            >
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                {item.step}
              </div>
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="bg-primary/10 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Why Choose FileWizard?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hamari service ko choose karne ke kuch important reasons
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "100% Free",
                description: "Koi hidden charges nahi, completely free service",
                icon: "💰",
              },
              {
                title: "Privacy Focused",
                description: "Aapki files private rahti hain, server par store nahi hoti",
                icon: "🔒",
              },
              {
                title: "Fast Processing",
                description: "Quick conversion for all your files",
                icon: "⚡",
              },
              {
                title: "High Quality",
                description: "Best quality output for all conversions",
                icon: "✨",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-sm"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}