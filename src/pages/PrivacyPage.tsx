import Container from "@/components/ui/Container"
import SectionHeading from "@/components/ui/SectionHeading"

const PrivacyPage = () => {
  return (
    <div className="mt-[130px]">
      <section id="privacy" className="py-20">
        <Container>
          <SectionHeading 
            title="Privacy Policy" 
            subtitle="Your privacy is important to us. Learn how we collect, use, and protect your information."
            center
          />

          <div className="mt-10 space-y-6 text-gray-700 w-full mx-auto text-base leading-relaxed">

            <div>
              <h2 className="text-xl font-semibold mb-2">1. Information Collection</h2>
              <p>
                We collect personal information such as your name, email address, phone number, and address when you book our services or contact us. Additional information may be collected during service delivery for operational purposes.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">2. Use of Information</h2>
              <p>
                Your information is used to process bookings, provide services, communicate updates, and enhance customer experience. We do not sell, rent, or share your personal information with third parties, except as required for service delivery or by law.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">3. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">4. Cookies and Tracking</h2>
              <p>
                Our website may use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and understand usage patterns. You can adjust your browser settings to disable cookies if you prefer.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">5. Third-Party Services</h2>
              <p>
                We may use third-party services such as payment gateways, analytics providers, and service partners. These services have their own privacy policies governing the use of your information.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">6. User Rights</h2>
              <p>
                You have the right to access, update, or request deletion of your personal information held by us. To exercise these rights, please contact our support team.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">7. Policy Updates</h2>
              <p>
                This Privacy Policy may be updated occasionally to reflect changes in our practices or legal obligations. The updated policy will be posted on our website with the effective date.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">8. Contact Information</h2>
              <p>
                If you have any questions or concerns regarding this Privacy Policy, please contact us via our official support channels listed on our website.
              </p>
            </div>

          </div>

        </Container>
      </section>
    </div>
  )
}

export default PrivacyPage
