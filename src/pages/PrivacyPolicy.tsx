import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Fin Tools Lab</title>
        <meta 
          name="description" 
          content="Privacy policy for Fin Tools Lab. Learn how we collect, use, and protect your information when using our financial calculators." 
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://fintoolslab.com/privacy-policy" />
      </Helmet>

      <div className="bg-background">
        <div className="container mx-auto container-padding section-padding">
          {/* Breadcrumbs */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link to="/" className="flex items-center gap-1">
                    <Home className="h-3 w-3" />
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Privacy Policy</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-lg text-muted-foreground">
                Last updated: January 15, 2024
              </p>
            </div>

            <div className="space-y-6">
              <Card className="financial-card">
                <CardHeader>
                  <CardTitle>Information We Collect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    We collect information you provide directly to us when using our financial calculators, 
                    including calculation inputs and preferences. We also collect technical information 
                    such as IP addresses, browser type, and device information for analytics purposes.
                  </p>
                  <p className="text-muted-foreground">
                    We use Google Analytics to understand how visitors interact with our website. 
                    This helps us improve our services and provide better user experiences.
                  </p>
                </CardContent>
              </Card>

              <Card className="financial-card">
                <CardHeader>
                  <CardTitle>How We Use Your Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>To provide and improve our financial calculator services</li>
                    <li>To analyze usage patterns and optimize website performance</li>
                    <li>To personalize your experience and provide relevant content</li>
                    <li>To communicate with you about our services</li>
                    <li>To comply with legal obligations</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="financial-card">
                <CardHeader>
                  <CardTitle>Information Sharing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We do not sell, trade, or otherwise transfer your personal information to third parties 
                    without your consent, except as described in this policy. We may share information with 
                    trusted third-party service providers who assist us in operating our website and serving you.
                  </p>
                </CardContent>
              </Card>

              <Card className="financial-card">
                <CardHeader>
                  <CardTitle>Data Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We implement appropriate security measures to protect your personal information 
                    against unauthorized access, alteration, disclosure, or destruction. However, 
                    no method of transmission over the internet is 100% secure.
                  </p>
                </CardContent>
              </Card>

              <Card className="financial-card">
                <CardHeader>
                  <CardTitle>Cookies and Tracking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    We use cookies and similar tracking technologies to enhance your experience on our website. 
                    These technologies help us:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Remember your preferences and settings</li>
                    <li>Analyze website traffic and usage patterns</li>
                    <li>Provide personalized content and advertisements</li>
                    <li>Improve website functionality and performance</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="financial-card">
                <CardHeader>
                  <CardTitle>Your Rights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    You have the right to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Access and review your personal information</li>
                    <li>Request correction of inaccurate information</li>
                    <li>Request deletion of your personal information</li>
                    <li>Opt-out of certain data collection and processing</li>
                    <li>Lodge a complaint with relevant authorities</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="financial-card">
                <CardHeader>
                  <CardTitle>Contact Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    If you have any questions about this Privacy Policy or our data practices, 
                    please contact us at privacy@fintoolslab.com.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 