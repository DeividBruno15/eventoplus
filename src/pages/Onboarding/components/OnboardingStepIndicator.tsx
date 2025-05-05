
import { CheckCircle } from 'lucide-react';

interface OnboardingStepIndicatorProps {
  currentStep: number;
}

export const OnboardingStepIndicator = ({ currentStep }: OnboardingStepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center">
        <div className={`rounded-full ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} w-8 h-8 flex items-center justify-center`}>
          {currentStep > 1 ? <CheckCircle className="h-5 w-5" /> : "1"}
        </div>
        <div className={`h-1 w-12 ${currentStep > 1 ? 'bg-primary' : 'bg-muted'}`}></div>
        <div className={`rounded-full ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} w-8 h-8 flex items-center justify-center`}>
          "2"
        </div>
      </div>
    </div>
  );
};
