

const ProgressBar = ({ value }: { value: number }) => {
  return (
    <div className="w-full bg-secondary/15 h-4 overflow-hidden border-2 
        border-black
        shadow-[2px_2px_0px_black]">
      <div
        className="bg-primary h-full transition-all duration-300 ease-in-out relative"
        style={{ width: `${value}%` }}
      >
      {/* Moving Vertical Line */}
        <div className="absolute -right-0.5 top-[-4px] h-4 w-0.5 bg-accent rounded-sm shadow-md"></div>
      </div>
      </div>
  );
};

export default ProgressBar;
