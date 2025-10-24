import React from 'react';
import { type View } from '../App';
import { HomeIcon, ChatBubbleLeftRightIcon, PhotoIcon, PencilSquareIcon, BookOpenIcon, SparklesIcon, AcademicCapIcon, IntelliLearnIcon } from './common/Icons';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
}

const navItems = [
    { name: 'Home', view: 'home', icon: <HomeIcon /> },
    { name: 'Chat', view: 'chat', icon: <ChatBubbleLeftRightIcon /> },
    { name: 'Image', view: 'image', icon: <PhotoIcon /> },
    { name: 'Writing', view: 'writing', icon: <PencilSquareIcon /> },
    { name: 'Reading', view: 'reading', icon: <BookOpenIcon /> },
    { name: 'Vocabulary', view: 'vocabulary', icon: <SparklesIcon /> },
    { name: 'Grammar', view: 'grammar', icon: <AcademicCapIcon /> },
] as const;


const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isLoggedIn, onLogout, onLoginClick, onSignupClick }) => {
  return (
    <nav className="sidebar flex flex-col p-4">
        <div className="flex items-center space-x-2 p-2 mb-8">
             <IntelliLearnIcon />
             <span className="text-xl font-bold text-white">IntelliLearn</span>
        </div>

        <ul className="flex-grow space-y-2">
            {navItems.map(item => (
                <li key={item.name}>
                    <a
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            setActiveView(item.view);
                        }}
                        className={`flex items-center p-3 rounded-md text-sm font-medium transition-all duration-200 relative ${
                            activeView === item.view 
                            ? 'bg-blue-500/20 text-white'
                            : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                        }`}
                    >
                         {activeView === item.view && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full"></div>}
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                    </a>
                </li>
            ))}
        </ul>

        <div className="mt-auto p-2">
             {isLoggedIn ? (
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-400">Welcome back!</p>
                  <button
                    onClick={onLogout}
                    className="w-full bg-red-600 text-white hover:bg-red-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Log out
                  </button>
                </div>
               ) : (
                <div className="space-y-2">
                  <button
                    onClick={onLoginClick}
                    className="w-full bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                    Log in
                  </button>
                  <button
                    onClick={onSignupClick}
                    className="w-full bg-blue-600 text-white hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                    Sign up
                  </button>
                </div>
               )}
        </div>
    </nav>
  );
};

export default Sidebar;