// src/components/Button.tsx
interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
  }
  
  export default function Button({ children, onClick, className, type = 'button' }: ButtonProps) {
    return (
      <button onClick={onClick} type={type} className={`p-2 rounded ${className}`}>
        {children}
      </button>
    );
  }
  