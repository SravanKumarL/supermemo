const Header = () => {
  return (
    <header className="bg-white border-b border-indigo-100 py-4 px-8 mb-4">
      <div className="max-w-7xl mx-auto relative">
        {/* Application Title and Logo */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-3">
            {/* Animated Logo Container */}
            <div className="text-5xl transform hover:scale-110 transition-all duration-500 relative group w-14 h-14 flex items-center justify-center">
              {/* Layered Icon Effects */}
              <div className="relative flex items-center justify-center w-full h-full">
                {/* Base sun icon with gradient */}
                <i className="fas fa-sun absolute bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 bg-clip-text text-transparent"></i>
                {/* Sparkle effect layer */}
                <i className="fas fa-sparkles absolute scale-125 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent"></i>
                {/* Burst effect layer */}
                <i className="fas fa-burst absolute scale-150 bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent opacity-90"></i>
              </div>
              {/* Hover effect background */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-purple-500/20 to-pink-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
            </div>
            {/* Application Title and Tagline */}
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-700 to-fuchsia-700 font-display">
                Serendipity
              </h1>
              <div className="mt-1">
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 font-medium">
                  Watch your ideas go supernova
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
