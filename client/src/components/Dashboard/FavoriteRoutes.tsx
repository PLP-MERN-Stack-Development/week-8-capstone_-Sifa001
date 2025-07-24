import React from 'react';

interface Props {
  favoriteRoutes: any[];
  onSelectRoute: (route: any) => void;
  onRemove: (routeId: string) => void;
  onError: (msg: string) => void;
  language: 'en' | 'sw';
}

const labels = {
  en: {
    favorites: 'Favorite Routes',
    remove: 'Remove',
    none: 'No favorite routes.',
  },
  sw: {
    favorites: 'Njia Pendwa',
    remove: 'Ondoa',
    none: 'Hakuna njia pendwa.',
  },
};

const FavoriteRoutes: React.FC<Props> = ({ favoriteRoutes, onSelectRoute, onRemove, onError, language }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 w-full">
      <h2 className="text-lg font-semibold mb-2">{labels[language].favorites}</h2>
      <ul className="space-y-1 flex-1 max-h-48 overflow-y-auto">
        {favoriteRoutes.length === 0 ? (
          <li className="text-gray-400 text-sm">{labels[language].none}</li>
        ) : (
          favoriteRoutes.map(route => (
            <li key={route._id} className="flex items-center justify-between text-gray-200 text-base">
              <span className="cursor-pointer hover:underline" onClick={() => onSelectRoute(route)}>
                {route.routeName || (route.startLocation?.name + ' → ' + route.endLocation?.name)}
              </span>
              <button
                className="text-xs text-red-400 hover:underline ml-2"
                onClick={() => onRemove(route._id)}
              >
                {labels[language].remove}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default FavoriteRoutes; 