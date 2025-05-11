import Link from "next/link";
import { FileText, Github, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">FileWizard</span>
            </div>
            <p className="text-muted-foreground">
              Free online file conversion tool. Convert PDF, images, and documents with ease.
            </p>
            <div className="flex space-x-4">
              <Link href="https://github.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="https://twitter.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="mailto:info@filewizard.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Conversion Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/pdf-to-image" className="text-muted-foreground hover:text-primary transition-colors">
                  PDF to Image
                </Link>
              </li>
              <li>
                <Link href="/image-to-pdf" className="text-muted-foreground hover:text-primary transition-colors">
                  Image to PDF
                </Link>
              </li>
              <li>
                <Link href="/word-to-pdf" className="text-muted-foreground hover:text-primary transition-colors">
                  Word to PDF
                </Link>
              </li>
              <li>
                <Link href="/merge-pdf" className="text-muted-foreground hover:text-primary transition-colors">
                  Merge PDFs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Additional Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/ocr" className="text-muted-foreground hover:text-primary transition-colors">
                  OCR (Text Extraction)
                </Link>
              </li>
              <li>
                <Link href="/compress" className="text-muted-foreground hover:text-primary transition-colors">
                  File Compression
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} FileWizard. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;