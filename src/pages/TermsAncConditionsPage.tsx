import Container from "@/components/ui/Container"
import SectionHeading from "@/components/ui/SectionHeading"

const TermsAndConditionsPage = () => {
  return (
    <div className="mt-[130px]">
      <section id="terms" className="py-20">
        <Container>
          <SectionHeading 
            title="Terms and Conditions" 
            subtitle="Please read these terms and conditions carefully before using our services."
            center
          />

          <div className="mt-10 space-y-6 text-gray-700 w-full mx-auto text-base leading-relaxed">

            <div>
              <h2 className="text-xl font-semibold mb-2">1. Service Availability</h2>
              <p>
                Our services, including Pest Control, Home Repair, and Packers & Movers, are available in select cities as listed on our website. Service availability may vary based on your location and scheduling.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">2. Booking and Payment</h2>
              <p>
                All bookings must be confirmed via our website or official communication channels. Payment for services must be completed as per the pricing shared at the time of booking. We reserve the right to cancel any unpaid bookings.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">3. Service Process</h2>
              <p>
                Each service follows a structured process for quality assurance:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Pest Control:</strong> Site inspection, Customized treatment, Final check & cleanup.</li>
                <li><strong>Home Repair:</strong> Issue diagnosis, Repair implementation, Quality verification.</li>
                <li><strong>Packers & Movers:</strong> Pre-move survey, Safe packing & moving, Unloading & unpacking.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">4. Liability</h2>
              <p>
                We strive to provide safe, timely, and high-quality services. However, we shall not be held liable for unforeseen delays, accidents, or losses beyond our control. Customers are advised to disclose any fragile or valuable items in advance.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">5. Cancellations & Refunds</h2>
              <p>
                Cancellations must be made at least 24 hours before the scheduled service time. Refund eligibility will be subject to our refund policy and the stage of service delivery.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">6. Privacy Policy</h2>
              <p>
                By using our services, you agree to the collection and use of your information as detailed in our Privacy Policy. We prioritize your data privacy and security at all times.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">7. Updates to Terms</h2>
              <p>
                These terms and conditions may be updated from time to time without prior notice. It is the user's responsibility to review them periodically.
              </p>
            </div>

          </div>

        </Container>
      </section>
    </div>
  )
}

export default TermsAndConditionsPage
