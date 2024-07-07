export function Button({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="transition ease-in flex items-center justify-center h-8 w-8 rounded-full px-8 shadow-md bg-gray-700 hover:bg-gray-800"
    >
      {children}
    </button>
  );
}
