interface Props {
  name: string;
}

const Topbar = ({ name }: Props) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6">
      <div>
        <h1 className="text-lg font-semibold">{name}</h1>
        <p className="text-sm text-muted-foreground">Admin Dashboard</p>
      </div>
    </header>
  );
};

export default Topbar;
