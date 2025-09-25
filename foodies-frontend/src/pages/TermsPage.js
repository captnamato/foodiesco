import React from 'react';

const TermsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          Welcome to Foodies! These Terms of Service govern your use of our recipe-sharing platform.
          By using Foodies, you agree to these terms.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Accounts</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>You must provide accurate and complete information when creating an account</li>
            <li>You are responsible for maintaining the security of your account</li>
            <li>You must be at least 13 years old to use our service</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recipe Content</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>You retain ownership of recipes you upload</li>
            <li>By uploading content, you grant us permission to display it on our platform</li>
            <li>Content must not infringe on others' intellectual property rights</li>
            <li>We reserve the right to remove inappropriate content</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Prohibited Uses</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Posting false, misleading, or harmful content</li>
            <li>Harassing or abusing other users</li>
            <li>Attempting to hack or disrupt our services</li>
            <li>Using automated systems to scrape our content</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Availability</h2>
          <p className="text-gray-600">
            We strive to keep Foodies available 24/7, but we cannot guarantee uninterrupted service.
            We may need to perform maintenance or updates from time to time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
          <p className="text-gray-600">
            We may update these Terms of Service from time to time. We will notify users of
            significant changes via email or platform notifications.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;