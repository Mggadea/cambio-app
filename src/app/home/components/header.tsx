interface HeaderProps {
  title: string;
}

function Header({ title }: HeaderProps) {
  return (
    <header className="bg-indigo-950 px-6 py-6">
      <div className="px-12 w-full max-w-6xl">
        <p className="text-2xl font-bold text-slate-100">{title}</p>
      </div>
    </header>
  );
}

export default Header;