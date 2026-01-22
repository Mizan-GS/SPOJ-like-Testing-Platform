import React from "react";

const Navbar = () => {
  return (
    <nav className="w-full bg-linear-to-r mt-10 px-8 py-4 rounded-xl">
      <div className="flex items-center justify-between">

       
        <div className="flex items-center gap-4 text-white">
          <div className="w-10 h-10 rounded-full border border-purple-400 flex items-center justify-center">
            ⚡
          </div>

          
        </div>

        {/* 🔹 Center Navigation */}
        <div className="flex items-center gap-8 text-white text-base">
          <NavItem label="Dashboard" active />
          <NavItem label="Earnings" />
          <NavItem label="Badges" />
          <NavItem label="Rewards" />
          <NavItem label="Profile" />
          <NavItem label="Help" />
        </div>

        
        <div className="text-right text-white">
          <p className="text-sm">
            Welcome back,{" "}
            <span className="text-purple-400 font-semibold">
              Waramey
            </span>
          </p>
          <div className="flex items-center gap-1 text-sm text-purple-200 cursor-pointer">
            test@powerdoo.ai
            <span className="text-xs">▾</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavItem = ({ label, active }) => {
  return (
    <div className="relative cursor-pointer group">
      <span className={`${active ? "font-semibold" : "opacity-90"}`}>
        {label}
      </span>
      {active && (
        <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-purple-400 rounded-full" />
      )}
    </div>
  );
};

export default Navbar;
