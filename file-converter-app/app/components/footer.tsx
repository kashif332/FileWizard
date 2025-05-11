import Link from "next/link";
import { FileImage, FileText, FileUp, FilePlus, Zap, Search } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">FileWizard</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Document conversion made easy. Convert, merge, and optimize your files with our simple tools.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Conversion Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/convert/pdf-to-image" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center">
                  <FileImage className="h-4 w-4 mr-2" />
                  PDF to Image
                </Link>
              </li>
              <li>
                <Link href="/convert/image-to-pdf" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Image to PDF
                </Link>
              </li>
              <li>
                <Link href="/convert/word-to-pdf" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center">
                  <FileUp className="h-4 w-4 mr-2" />
                  Word to PDF
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Other Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/convert/merge-pdf" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center">
                  <FilePlus className="h-4 w-4 mr-2" />
                  Merge PDFs
                </Link>
              </li>
              <li>
                <Link href="/convert/compress" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  Compress Files
                </Link>
              </li>
              <li>
                <Link href="/convert/ocr" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center">
                  <Search className="h-4 w-4 mr-2" />
                  OCR Text Recognition
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">About</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} FileWizard. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}