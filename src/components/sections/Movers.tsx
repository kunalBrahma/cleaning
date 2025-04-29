import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import ServiceCard from "../common/ServiceCard";
import { getServicesByCategory } from "../../data/services";

const Movers: React.FC = () => {
  const servicesByCategory = getServicesByCategory();
  const paintingServices = servicesByCategory["Packers and Movers"] || [];

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
          title="Stress-Free Packers & Movers Services"
          subtitle="Moving made easy — from careful packing to safe delivery, we handle it all so you don’t have to."
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
          <h3 className="text-xl font-semibold mb-4 text-center">
            Our Smooth 3-Step Moving Process
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-medium mb-2">
                Quick Survey & Customized Quote
              </h4>
              <p className="text-sm text-gray-600">
                We assess. We plan. We quote. Our moving specialists conduct a
                quick survey of your belongings — either online or in-person —
                to understand your shifting requirements. Based on your items
                and distance, we offer a tailored, upfront estimate with no
                hidden charges.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h4 className="font-medium mb-2">
                Secure Packing & Hassle-Free Loading
              </h4>
              <p className="text-sm text-gray-600">
                Your belongings, packed with care. Our trained crew arrives on
                schedule with premium packing materials and equipment. Every
                item is carefully packed, labeled, and loaded securely into
                transport vehicles — whether it’s fragile decor, bulky
                furniture, or personal keepsakes.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h4 className="font-medium mb-2">
                Safe Transport & On-Time Delivery
              </h4>
              <p className="text-sm text-gray-600">
                Move worry-free. We’ll get it there. Your belongings are
                transported safely to the destination, tracked along the way. On
                arrival, we handle careful unloading, unpacking (if needed), and
                final placement, ensuring a smooth, damage-free move from start
                to finish.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Movers;
