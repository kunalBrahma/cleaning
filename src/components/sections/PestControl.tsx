import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import ServiceCard from '../common/ServiceCard';
import { getServicesByCategory } from '../../data/services';

const PestControl: React.FC = () => {
  const servicesByCategory = getServicesByCategory();
  const paintingServices = servicesByCategory['Pest Control'] || [];

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
          title="Protect Your Home & Business from Unwanted Pests" 
          subtitle="Our expert pest control solutions are designed to keep your space safe, clean, and pest-free — year-round peace of mind guaranteed."
          center
        />
    
        {/* Service Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {paintingServices.map((service) => (
            <ServiceCard key={service.id} service={service} index={0} />
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-20 bg-white p-8 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-center">Our Pest Control Process</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-medium mb-2">Inspection & Assessment</h4>
              <p className="text-sm text-gray-600">We start with a thorough inspection of your property to identify pest issues, nesting areas, and entry points. Our experts assess the severity of the infestation and determine the best treatment strategy tailored to your needs.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h4 className="font-medium mb-2">Treatment & Elimination</h4>
              <p className="text-sm text-gray-600">Based on our findings, we implement safe, effective, and environmentally-friendly pest control solutions. Whether it’s spraying, baiting, or sealing access points — we target pests at the source and prevent them from coming back.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h4 className="font-medium mb-2">Prevention & Follow-Up</h4>
              <p className="text-sm text-gray-600">After treatment, we provide recommendations to keep your space pest-free, including preventive measures and routine maintenance options. We also schedule follow-ups if needed, ensuring long-term protection for your home or business.</p>
            </div>
          </div>
        </div>

        
        
      </Container>
    </section>
  );
};

export default PestControl;