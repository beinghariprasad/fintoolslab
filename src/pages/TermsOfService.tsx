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

export default function TermsOfService() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | Fin Tools Lab</title>
        <meta 
          name="description" 
          content="Terms of service for Fin Tools Lab. Read our terms and conditions for using our financial calculators and services." 
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://fintoolslab.com/terms-of-service" />
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
                <BreadcrumbPage>Terms of Service</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Terms of Service</h1>
              <p className="text-lg text-muted-foreground">
                Last updated: January 15, 2024
              </p>
            </div>

            <div className="space-y-6">
              <Card className="financial-card">
                <CardHeader>
                  <CardTitle>Acceptance of Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    By accessing and using Fin Tools Lab ("we," "our," or "us"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </CardContent>
              </Card>

              <Card className="financial-card">
                <CardHeader>
                  <CardTitle>Use License</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Permission is granted to temporarily download one copy of the materials (information or software) on Fin Tools Lab's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose or for any public display</li>
                    <li>Attempt to reverse engineer any software contained on the website</li>
                    <li>Remove any copyright or other proprietary notations from the materials</li>
                    <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="financial-card">
                <CardHeader>
                  <CardTitle>Disclaimer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    The materials on Fin Tools Lab's website are provided on an 'as is' basis. Fin Tools Lab makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                  </p>
                  <p className="text-muted-foreground">
                    Further, Fin Tools Lab does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
                  </p>
                </CardContent>
              </Card>

              <Card className="financial-card">
                <CardHeader>
                  <CardTitle>Financial Information Disclaimer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The financial calculators and tools provided on this website are for educational and informational purposes only. They should not be considered as financial advice. Always consult with a qualified financial advisor before making any financial decisions. Past performance does not guarantee future results.
                  </p>
                </CardContent>
              </Card>

              <Card className="financial-card">
                <CardHeader>
                  <CardTitle>Limitations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    In no event shall Fin Tools Lab or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Fin Tools Lab's website, even if Fin Tools Lab or a Fin Tools Lab authorized representative has been notified orally or in writing of the possibility of such damage.
                  </p>
                </CardContent>
              </Card>

              <Card className="financial-card">
                <CardHeader>
                  <CardTitle>Accuracy of Materials</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    The materials appearing on Fin Tools Lab's website could include technical, typographical, or photographic errors. Fin Tools Lab does not warrant that any of the materials on its website are accurate, complete, or current. Fin Tools Lab may make changes to the materials contained on its website at any time without notice.
                  </p>
                </CardContent>
              </Card>

              <Card className="financial-card">
                <CardHeader>
                  <CardTitle>Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Fin Tools Lab has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Fin Tools Lab of the site. Use of any such linked website is at the user's own risk.
                  </p>
                </CardContent>
              </Card>

              <Card className="financial-card">
                <CardHeader>
                  <CardTitle>Modifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Fin Tools Lab may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms and Conditions of Use.
                  </p>
                </CardContent>
              </Card>

              <Card className="financial-card">
                <CardHeader>
                  <CardTitle>Governing Law</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                  </p>
                </CardContent>
              </Card>

              <Card className="financial-card">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    If you have any questions about these Terms of Service, please contact us at legal@fintoolslab.com.
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