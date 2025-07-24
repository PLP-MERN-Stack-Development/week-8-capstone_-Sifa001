import React, { useState } from 'react';
import { X, Star, MessageSquare } from 'lucide-react';

interface Props {
  language: 'en' | 'sw';
}

const labels = {
  en: {
    profile: 'Profile',
    feedback: 'Feedback',
    rate: 'Rate Your Experience',
    close: 'Close',
    submit: 'Submit Feedback',
    placeholder: 'Share your feedback...',
    rating: 'Rating:',
  },
  sw: {
    profile: 'Wasifu',
    feedback: 'Maoni',
    rate: 'Tathmini Ya Usafiri Wako',
    close: 'Funga',
    submit: 'Tuma Maoni',
    placeholder: 'Toa maoni yako...',
    rating: 'Ukadiriaji:',
  },
};

const UserProfile: React.FC<Props> = ({ language }) => {
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  
  // Stub user
  const user = { 
    name: 'Passenger', 
    avatar: 'https://ui-avatars.com/api/?name=Passenger&background=4f46e5&color=fff',
    role: 'passenger' 
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setShowModal(false);
    setRating(0);
  };

  return (
    <div className="relative w-full">
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <div className="relative group">
          <img 
            src={user.avatar} 
            alt="avatar" 
            className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-theme-border hover:border-primary/80 transition-all duration-300 group-hover:ring-2 group-hover:ring-primary/30"
          />
          <span className="absolute -bottom-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-green-400 rounded-full border-2 border-theme-background"></span>
        </div>
        <div className="hidden sm:flex flex-col">
          <span className="text-sm font-medium text-theme-text">{user.name}</span>
          <span className="text-xs text-theme-text-muted capitalize">{user.role}</span>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="ml-0 sm:ml-1 text-xs md:text-sm bg-gradient-to-r from-primary to-primary-dark hover:from-primary/90 hover:to-primary-dark/90 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 flex items-center gap-1.5 group w-full sm:w-auto"
        >
          <MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:scale-110 transition-transform" />
          <span>{labels[language].feedback}</span>
        </button>
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="bg-theme-surface rounded-xl p-6 w-full max-w-md shadow-2xl border border-theme-border/50 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-theme-text">{labels[language].rate}</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-theme-text-muted hover:text-theme-text p-1 rounded-full hover:bg-theme-hover transition-colors"
                aria-label={labels[language].close}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-sm font-medium text-theme-text-muted mb-2">
                  {labels[language].rating}
                </label>
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="focus:outline-none"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <Star 
                        className={`h-7 w-7 ${(hoverRating || rating) >= star 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-theme-border'}`} 
                      />
                    </button>
                  ))}
                </div>
                
                <textarea 
                  className="w-full rounded-lg bg-theme-surface-muted text-theme-text p-3 border border-theme-border/50 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all duration-200 resize-none" 
                  rows={4} 
                  placeholder={labels[language].placeholder}
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button"
                  className="px-4 py-2.5 text-sm font-medium text-theme-text-muted hover:text-theme-text rounded-lg hover:bg-theme-hover transition-colors duration-200"
                  onClick={() => {
                    setShowModal(false);
                    setRating(0);
                  }}
                >
                  {labels[language].close}
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-primary to-primary-dark hover:from-primary/90 hover:to-primary-dark/90 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {labels[language].submit}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default UserProfile;