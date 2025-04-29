import Container from '../ui/Container';
import SectionHeading from '../ui/SectionHeading';
import ServiceCard from '../common/ServiceCard';
import { getServicesByCategory } from '../../data/services';

const Painting: React.FC = () => {
  const servicesByCategory = getServicesByCategory();
  const paintingServices = servicesByCategory['Painting Services'] || [];

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
          title="Professional Painting Services" 
          subtitle="Transform your spaces with our expert painting solutions - quality finishes guaranteed"
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
          <h3 className="text-xl font-semibold mb-4 text-center">Our Painting Process</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-medium mb-2">Surface Preparation</h4>
              <p className="text-sm text-gray-600">Proper cleaning, patching, and priming of all surfaces</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h4 className="font-medium mb-2">Quality Application</h4>
              <p className="text-sm text-gray-600">Professional techniques using premium paints</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h4 className="font-medium mb-2">Final Inspection</h4>
              <p className="text-sm text-gray-600">Detailed quality check and clean-up</p>
            </div>
          </div>
        </div>

        
        
      </Container>
    </section>
  );
};

export default Painting;