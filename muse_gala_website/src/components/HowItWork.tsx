
const HowItWork = () => {
  return (
    <div>
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-20 pt-4 text-center font-avenir">
        <h2 className="headerClass uppercase">How It Works</h2>

        <div className="grid grid-cols-1 pt-12 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <h3 className="text-[20px] tracking-widest font-avenir font-light uppercase">Book</h3>
            <p className="text-[14px] font-avenir font-light">
              Choose your size and rental dates and see whats available instantly.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-[20px] tracking-widest font-avenir font-light uppercase">Wear</h3>
            <p className="text-[14px] font-avenir font-light">
              Collect locally or enjoy fast delivery to your door your look, your way.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-[20px] tracking-widest font-avenir font-light uppercase">Return</h3>
            <p className="text-[14px] font-avenir font-light">
              Drop it off or use the included return label. No stress, no dry cleaning.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowItWork
