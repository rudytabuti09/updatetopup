import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const SearchBar = ({ onSearch, suggestions = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch(value);
    if (value?.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion?.name);
    onSearch(suggestion?.name);
    setShowSuggestions(false);
  };

  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'id-ID';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event?.results?.[0]?.[0]?.transcript;
        handleSearch(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition?.start();
    }
  };

  const filteredSuggestions = suggestions?.filter(suggestion =>
    suggestion?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  )?.slice(0, 5);

  return (
    <div className="relative mb-8" ref={searchRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon name="Search" size={20} className="text-text-secondary" />
        </div>
        
        <input
          type="text"
          placeholder="Cari game favorit kamu..."
          value={searchTerm}
          onChange={(e) => handleSearch(e?.target?.value)}
          onFocus={() => searchTerm?.length > 0 && setShowSuggestions(true)}
          className="w-full pl-12 pr-16 py-4 bg-surface/50 border border-border/50 rounded-lg text-foreground placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 gap-2">
          <button
            onClick={startVoiceSearch}
            disabled={isListening}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isListening 
                ? 'bg-primary/20 text-primary animate-pulse' :'hover:bg-primary/10 text-text-secondary hover:text-primary'
            }`}
            title="Pencarian suara"
          >
            <Icon name={isListening ? "Mic" : "MicOff"} size={18} />
          </button>
          
          {searchTerm && (
            <button
              onClick={() => handleSearch('')}
              className="p-2 rounded-lg hover:bg-primary/10 text-text-secondary hover:text-primary transition-all duration-200"
              title="Hapus pencarian"
            >
              <Icon name="X" size={18} />
            </button>
          )}
        </div>
      </div>
      {/* Search Suggestions */}
      {showSuggestions && filteredSuggestions?.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-gaming-lg z-50 max-h-80 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-text-secondary px-3 py-2 font-medium">Saran Pencarian</div>
            {filteredSuggestions?.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-primary/5 transition-colors text-left"
              >
                <Image 
                  src={suggestion?.icon} 
                  alt={suggestion?.name}
                  className="w-8 h-8 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">{suggestion?.name}</div>
                  <div className="text-xs text-text-secondary">{suggestion?.category}</div>
                </div>
                <div className="text-xs text-primary font-medium">
                  {suggestion?.packageCount} paket
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;