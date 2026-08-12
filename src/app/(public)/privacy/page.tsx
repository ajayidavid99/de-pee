// src/app/(public)/privacy/page.tsx
import { PageHeader } from '@/components/shared/page-header';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6">
      <PageHeader title="Privacy Policy"/>
      <div className="prose prose-slate dark:prose-invert max-w-none mt-8">
        <p><strong>Effective Date:</strong> [Insert Date]</p>
        <p>De-Pee Ventures respects your privacy and is committed to protecting your personal data in compliance with the Nigeria Data Protection Act (NDPA) 2023.</p>
        
        <h2>1. Information We Collect</h2>
        <p>We collect personal data such as your name, email address, phone number, and billing/shipping addresses when you register, request quotes, or interact with our platform.</p>

        <h2>2. Lawful Basis and Purpose</h2>
        <p>We process your data based on your explicit consent and to fulfill our contractual obligations to you, such as delivering products and responding to quotes.</p>

        <h2>3. Data Subject Rights</h2>
        <p>Under the NDPA 2023, you have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Request rectification of inaccurate data</li>
          <li>Request erasure of your data ("Right to be forgotten")</li>
          <li>Object to or restrict data processing</li>
          <li>Lodge a complaint with the Nigeria Data Protection Commission (NDPC)</li>
        </ul>

        <h2>4. Contact Us</h2>
        <p>If you have any privacy-related questions or wish to exercise your rights, please contact our Data Protection Officer at: <a href="mailto:privacy@depeeventures.com">privacy@depeeventures.com</a>.</p>
      </div>
    </div>
  );
}