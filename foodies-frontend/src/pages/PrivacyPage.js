import React from 'react';

const PrivacyPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          At Foodies, we take your privacy seriously. This Privacy Policy explains how we collect,
          use, and protect your information when you use our recipe-sharing platform.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Account information (name, email address)</li>
            <li>Recipe content and images you upload</li>
            <li>Usage data and preferences</li>
            <li>Device and browser information</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>To provide and improve our services</li>
            <li>To communicate with you about your account</li>
            <li>To display your recipes and profile to other users</li>
            <li>To analyze usage patterns and optimize the platform</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Protection</h2>
          <p className="text-gray-600">
            We implement appropriate security measures to protect your personal information against
            unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-600">
            If you have any questions about this Privacy Policy, please contact us through our
            contact page or email us directly.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;