import { Helmet } from 'react-helmet-async';

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

      <div className="container">
        <div className="legal-page">
          <h1>Privacy Policy</h1>
          <p>Last updated: May 20, 2026</p>

          <h2>Information We Collect</h2>
          <p>
            All financial calculations run entirely in your browser — we do not collect, store,
            or transmit your calculator inputs or results. We do collect standard technical
            information such as IP addresses, browser type, and device information via Google
            Analytics for the purpose of understanding website traffic and improving our services.
          </p>
          <p>
            We use Google Analytics to understand how visitors interact with our website.
            This helps us improve our services and provide better user experiences.
          </p>

          <h2>How We Use Your Information</h2>
          <ul>
            <li>To provide and improve our financial calculator services</li>
            <li>To analyze usage patterns and optimize website performance</li>
            <li>To personalize your experience and provide relevant content</li>
            <li>To communicate with you about our services</li>
            <li>To comply with legal obligations</li>
          </ul>

          <h2>Information Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal information to third parties
            without your consent, except as described in this policy. We may share information with
            trusted third-party service providers who assist us in operating our website and serving you.
          </p>

          <h2>Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information
            against unauthorized access, alteration, disclosure, or destruction. However,
            no method of transmission over the internet is 100% secure.
          </p>

          <h2>Cookies and Tracking</h2>
          <p>
            We use cookies and similar tracking technologies to enhance your experience on our website.
            These technologies help us:
          </p>
          <ul>
            <li>Remember your preferences and settings</li>
            <li>Analyze website traffic and usage patterns</li>
            <li>Provide personalized content and advertisements</li>
            <li>Improve website functionality and performance</li>
          </ul>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access and review your personal information</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your personal information</li>
            <li>Opt-out of certain data collection and processing</li>
            <li>Lodge a complaint with relevant authorities</li>
          </ul>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our data practices,
            please contact us at privacy@fintoolslab.com.
          </p>
        </div>
      </div>
    </>
  );
}
