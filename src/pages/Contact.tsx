import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { 
  Home, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send,
  HelpCircle,
  FileText,
  Calculator,
  TrendingUp
} from 'lucide-react';
import { useState } from 'react';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email',
    description: 'Get in touch via email',
    contact: 'contact@fintoolslab.com',
    link: 'mailto:contact@fintoolslab.com'
  },
  {
    icon: MessageSquare,
    title: 'Support',
    description: 'Technical support and help',
    contact: 'support@fintoolslab.com',
    link: 'mailto:support@fintoolslab.com'
  },
  {
    icon: Clock,
    title: 'Response Time',
    description: 'We typically respond within',
    contact: '24 hours',
    link: null
  }
];

const faqs = [
  {
    question: 'How accurate are your financial calculators?',
    answer: 'Our calculators use industry-standard formulas and are thoroughly tested for accuracy. However, they are for educational purposes and should not replace professional financial advice.'
  },
  {
    question: 'Are your calculators really free to use?',
    answer: 'Yes! All our calculators are completely free to use. We believe financial planning tools should be accessible to everyone.'
  },
  {
    question: 'Can I use your calculators for business purposes?',
    answer: 'Yes, you can use our calculators for business purposes. However, please review our Terms of Service for complete usage guidelines.'
  },
  {
    question: 'Do you store my financial data?',
    answer: 'No, we do not store any of your financial data. All calculations are performed locally in your browser for your privacy and security.'
  },
  {
    question: 'How often do you update your calculators?',
    answer: 'We regularly update our calculators with the latest financial models and user feedback. Major updates are announced on our website.'
  },
  {
    question: 'Can I suggest new calculator features?',
    answer: 'Absolutely! We welcome feature suggestions and feedback. Please use our contact form or email us directly.'
  }
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - Fin Tools Lab | Get in Touch</title>
        <meta 
          name="description" 
          content="Contact Fin Tools Lab for support, feedback, or questions about our financial calculators. We're here to help with your financial planning needs." 
        />
        <meta name="keywords" content="contact Fin Tools Lab, financial calculator support, feedback, help" />
        <link rel="canonical" href="https://fintoolslab.com/contact" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fintoolslab.com/contact" />
        <meta property="og:title" content="Contact Us - Fin Tools Lab" />
        <meta property="og:description" content="Contact Fin Tools Lab for support, feedback, or questions about our financial calculators." />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fintoolslab.com/contact" />
        <meta property="twitter:title" content="Contact Us - Fin Tools Lab" />
        <meta property="twitter:description" content="Contact Fin Tools Lab for support, feedback, or questions about our financial calculators." />
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
                <BreadcrumbPage>Contact</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Get in Touch
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Have questions about our calculators? Need support? Want to share feedback? 
                We'd love to hear from you!
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              {/* Contact Form */}
              <Card className="financial-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Send className="h-6 w-6 text-primary" />
                    Send us a Message
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Fill out the form below and we'll get back to you as soon as possible.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What's this about?"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us more..."
                        rows={6}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                <Card className="financial-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {contactMethods.map((method, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <method.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{method.title}</h3>
                          <p className="text-sm text-muted-foreground mb-1">{method.description}</p>
                          {method.link ? (
                            <a
                              href={method.link}
                              className="text-primary hover:underline text-sm"
                            >
                              {method.contact}
                            </a>
                          ) : (
                            <p className="text-primary text-sm">{method.contact}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="financial-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <Clock className="h-5 w-5 text-primary" />
                      Business Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monday - Friday</span>
                        <span className="font-medium">9:00 AM - 6:00 PM EST</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Saturday</span>
                        <span className="font-medium">10:00 AM - 4:00 PM EST</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sunday</span>
                        <span className="font-medium">Closed</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                <p className="text-muted-foreground">
                  Find quick answers to common questions about our services.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {faqs.map((faq, index) => (
                  <Card key={index} className="financial-card">
                    <CardHeader>
                      <CardTitle className="flex items-start gap-3 text-lg">
                        <HelpCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        {faq.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <Card className="financial-card">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-4">Quick Links</CardTitle>
                <p className="text-muted-foreground">
                  Find what you're looking for quickly with these helpful links.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <Link
                    to="/calculators"
                    className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <Calculator className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold">All Calculators</h3>
                      <p className="text-sm text-muted-foreground">Browse our financial tools</p>
                    </div>
                  </Link>
                  <Link
                    to="/privacy-policy"
                    className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <FileText className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold">Privacy Policy</h3>
                      <p className="text-sm text-muted-foreground">Learn about data protection</p>
                    </div>
                  </Link>
                  <Link
                    to="/terms-of-service"
                    className="flex items-center gap-3 p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <TrendingUp className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold">Terms of Service</h3>
                      <p className="text-sm text-muted-foreground">Usage guidelines</p>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
} 