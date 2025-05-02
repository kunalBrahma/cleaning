import React from "react";

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ProcessStepsProps {
  title: string;
  subtitle: string;
  steps: Step[];
}

const ProcessSteps: React.FC<ProcessStepsProps> = ({ title, subtitle, steps }) => {
  return (
    <div className="mt-16 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-lg text-gray-600">{subtitle}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className="group relative bg-white p-6 rounded-lg border border-gray-100 hover:border-blue-100 transition-all duration-300 hover:shadow-md"
          >
            <div className="absolute -top-5 left-6 bg-sky-400 text-white text-xl font-bold w-10 h-10 rounded-full flex items-center justify-center">
              {step.number}
            </div>
            <div className="mt-6 mb-4 text-sky-500">{step.icon}</div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              {step.title}
            </h4>
            <p className="text-gray-600">{step.description}</p>
            <div className="mt-4 pt-4 border-t border-gray-100 group-hover:border-blue-100 transition-colors duration-300"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessSteps;
