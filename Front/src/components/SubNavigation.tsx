interface SubNavigationProps {
  tabs: Array<{ id: string; label: string }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isDarkMode: boolean;
}

export function SubNavigation({ tabs, activeTab, onTabChange, isDarkMode }: SubNavigationProps) {
  return (
    <div className={`border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
      <nav className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? isDarkMode
                  ? 'border-blue-500 text-blue-400'
                  : 'border-blue-600 text-blue-600'
                : isDarkMode
                ? 'border-transparent text-gray-400 hover:text-gray-200'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
