import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import ServiceCard from '../common/ServiceCard';
import { getServicesByCategory } from '../../data/services';

const Repair: React.FC = () => {
  const servicesByCategory = getServicesByCategory();
  const paintingServices = servicesByCategory['Home Repair Services'] || [];

  return (
    <section
    id="cleaning"
    className="relative py-24 bg-cover bg-fixed bg-center overflow-hidden"
    style={{
      backgroundImage: `url('/banner.webp')`, // Replace with your image URL
    }}
    
  >
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-sky-900 to-gray-500 opacity-50"></div> {/* Overlay */}
      <Container>
        <SectionHeading 
          title="Reliable Home Repair Services You Can Trust" 
          subtitle="From minor fixes to major renovations — we restore comfort, safety, and value to your home."
          center
        />
    
        {/* Service Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {paintingServices.map((service) => (
            <ServiceCard key={service.id} service={service} index={0} />
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-20 bg-white p-8 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-center">Our Home Repair Process</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-medium mb-2">Consultation & Assessment</h4>
              <p className="text-sm text-gray-600">We listen. We inspect. We plan.
              Our experts begin with a friendly consultation to understand your repair needs. Then, we carefully inspect your property to assess the issues, discuss possible solutions, and provide a transparent estimate.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h4 className="font-medium mb-2">Expert Repairs & Quality Workmanship</h4>
              <p className="text-sm text-gray-600">Skilled technicians. Trusted tools. Lasting results.
              Once approved, our experienced team gets to work using high-quality materials and proven techniques. Whether it’s fixing leaks, electrical issues, carpentry, or remodeling — we ensure every job is done safely and professionally.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h4 className="font-medium mb-2"> Final Check & Satisfaction Guarantee</h4>
              <p className="text-sm text-gray-600">We don’t leave until you’re happy.
After completing the repairs, we perform a final walkthrough with you to make sure everything meets your expectations. We tidy up the workspace, provide maintenance tips, and back our work with a service guarantee.

</p>
            </div>
          </div>
        </div>

        
        
      </Container>
    </section>
  );
};

export default Repair;