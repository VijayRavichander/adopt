interface LoadingScreenProps {
  message: string;
}

export default function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-300 to-white/40">
      <p className="text-2xl tracking-tight">{message}</p>
    </div>
  );
}
