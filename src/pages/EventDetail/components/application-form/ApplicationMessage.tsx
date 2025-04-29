
interface ApplicationMessageProps {
  message: string;
  className?: string;
}

export const ApplicationMessage = ({ message, className }: ApplicationMessageProps) => {
  return (
    <p className={`text-sm whitespace-pre-line border-l-2 pl-4 py-1 border-primary/50 bg-primary/5 italic ${className}`}>
      {message}
    </p>
  );
};
