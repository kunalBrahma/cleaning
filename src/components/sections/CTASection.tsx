import React from "react";
import { ArrowRight } from "lucide-react";
import Container from "../ui/Container";
import Button from "../ui/Button";
import { Link } from "react-router-dom";

const CTASection: React.FC = () => {
  return (
    <section className="py-16 relative">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-to-r from-sky-900 to-sky-600 opacity-50" />

      <Container>
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to Transform Your Home?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Book your service today and experience the difference that
            professionals can make. Our team is ready to help you with any home
            service needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/booking">
              <Button variant="primary" size="lg" className=" ">
                Book Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-blue-700 hover:bg-opacity-20"
              >
                Contact Us <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CTASection;
