
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { OnboardingStep } from '@/pages/Onboarding/types';

interface OnboardingStepIndicatorProps {
  currentStep: OnboardingStep;
  totalSteps: number;
}

export function OnboardingStepIndicator({ currentStep, totalSteps }: OnboardingStepIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep >= stepNumber;
          const isCompleted = currentStep > stepNumber;
          
          return (
            <React.Fragment key={stepNumber}>
              {index > 0 && (
                <div className={`h-1 w-12 ${isActive ? 'bg-primary' : 'bg-muted'}`} />
              )}
              <div className={`rounded-full ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} w-8 h-8 flex items-center justify-center`}>
                {isCompleted ? <CheckCircle className="h-5 w-5" /> : stepNumber}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
