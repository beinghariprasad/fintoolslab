import { Helmet } from 'react-helmet-async';

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

      <div className="container">
        <div className="legal-page">
          <h1>Terms of Service</h1>
          <p>Last updated: May 20, 2026</p>

          <h2>Acceptance of Terms</h2>
          <p>
            By accessing and using Fin Tools Lab ("we," "our," or "us"), you accept and agree to be bound
            by the terms and provision of this agreement. If you do not agree to abide by the above,
            please do not use this service.
          </p>

          <h2>Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or
            software) on Fin Tools Lab's website for personal, non-commercial transitory viewing only.
            This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to reverse engineer any software contained on the website</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>

          <h2>Disclaimer</h2>
          <p>
            The materials on Fin Tools Lab's website are provided on an 'as is' basis. Fin Tools Lab
            makes no warranties, expressed or implied, and hereby disclaims and negates all other
            warranties including without limitation, implied warranties or conditions of merchantability,
            fitness for a particular purpose, or non-infringement of intellectual property or other
            violation of rights.
          </p>
          <p>
            Further, Fin Tools Lab does not warrant or make any representations concerning the accuracy,
            likely results, or reliability of the use of the materials on its website or otherwise
            relating to such materials or on any sites linked to this site.
          </p>

          <h2>Financial Information Disclaimer</h2>
          <p>
            The financial calculators and tools provided on this website are for educational and
            informational purposes only. They should not be considered as financial advice. Always
            consult with a qualified financial advisor before making any financial decisions. Past
            performance does not guarantee future results.
          </p>

          <h2>Limitations</h2>
          <p>
            In no event shall Fin Tools Lab or its suppliers be liable for any damages (including,
            without limitation, damages for loss of data or profit, or due to business interruption)
            arising out of the use or inability to use the materials on Fin Tools Lab's website, even
            if Fin Tools Lab or a Fin Tools Lab authorized representative has been notified orally or
            in writing of the possibility of such damage.
          </p>

          <h2>Accuracy of Materials</h2>
          <p>
            The materials appearing on Fin Tools Lab's website could include technical, typographical,
            or photographic errors. Fin Tools Lab does not warrant that any of the materials on its
            website are accurate, complete, or current. Fin Tools Lab may make changes to the materials
            contained on its website at any time without notice.
          </p>

          <h2>Links</h2>
          <p>
            Fin Tools Lab has not reviewed all of the sites linked to its website and is not responsible
            for the contents of any such linked site. The inclusion of any link does not imply
            endorsement by Fin Tools Lab of the site. Use of any such linked website is at the user's
            own risk.
          </p>

          <h2>Modifications</h2>
          <p>
            Fin Tools Lab may revise these terms of service for its website at any time without notice.
            By using this website you are agreeing to be bound by the then current version of these
            Terms and Conditions of Use.
          </p>

          <h2>Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of
            the State of California, United States, and you irrevocably submit to the exclusive
            jurisdiction of the state and federal courts located in San Francisco, California.
          </p>

          <h2>Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at
            legal@fintoolslab.com.
          </p>
        </div>
      </div>
    </>
  );
}
