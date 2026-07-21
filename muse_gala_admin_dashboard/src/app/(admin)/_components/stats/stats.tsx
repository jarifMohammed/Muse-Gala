import { InfoCard } from "@/components/cards/stat-card";

const Stats = () => {
  return (
    <div>
      <h1 className="text-2xl font-light tracking-[20%]">Overview</h1>

      <div className="mt-[30px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <InfoCard title="Total Users" value="1,000" />
        <InfoCard title="Active Users" value="800" />
        <InfoCard title="Total Revenue" value="$50,000" />
        <InfoCard title="New Signups" value="200" />
      </div>
    </div>
  );
};

export default Stats;
