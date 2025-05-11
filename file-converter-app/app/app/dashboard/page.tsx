"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { 
  FileImage, 
  FileText, 
  FileUp, 
  FilePlus, 
  Zap, 
  Search, 
  Clock, 
  ArrowRight 
} from "lucide-react";

export default function Dashboard() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
  // Mock recent conversions
  const recentConversions = [
    { id: 1, name: "document.pdf", type: "PDF to Image", date: "2 hours ago", icon: FileImage },
    { id: 2, name: "presentation.docx", type: "Word to PDF", date: "Yesterday", icon: FileUp },
    { id: 3, name: "photos.zip", type: "Image to PDF", date: "3 days ago", icon: FileText },
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">
            <span className="gradient-text">FileWizard Dashboard</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Apne sabhi file conversion tools ek jagah par. Kisi bhi tool ka use karne ke liye neeche click karein.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            { name: "PDF to Image", href: "/convert/pdf-to-image", icon: FileImage, color: "blue" },
            { name: "Image to PDF", href: "/convert/image-to-pdf", icon: FileText, color: "purple" },
            { name: "Word to PDF", href: "/convert/word-to-pdf", icon: FileUp, color: "green" },
            { name: "Merge PDFs", href: "/convert/merge-pdf", icon: FilePlus, color: "orange" },
            { name: "Compress Files", href: "/convert/compress", icon: Zap, color: "red" },
            { name: "OCR Text Recognition", href: "/convert/ocr", icon: Search, color: "teal" },
          ].map((tool, index) => {
            const Icon = tool.icon;
            const colorClasses = {
              blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50",
              purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50",
              green: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50",
              orange: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50",
              red: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50",
              teal: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400 hover:bg-teal-200 dark:hover:bg-teal-900/50",
            };
            
            return (
              <motion.div
                key={tool.href}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Link href={tool.href} className="block p-6">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-4 ${colorClasses[tool.color as keyof typeof colorClasses]}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 mt-4">
                    <span>Start Converting</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
        >
          <div className="flex items-center mb-4">
            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
            <h2 className="text-xl font-bold">Recent Conversions</h2>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentConversions.map((conversion) => {
              const Icon = conversion.icon;
              
              return (
                <div key={conversion.id} className="py-4 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4">
                    <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{conversion.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{conversion.type} • {conversion.date}</p>
                  </div>
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    Download
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}