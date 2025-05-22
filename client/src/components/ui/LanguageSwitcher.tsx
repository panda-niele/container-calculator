import { useLanguage } from '@/lib/LanguageContext';
import { Language } from '@/lib/i18n';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-2 py-1 rounded ${
          language === 'en' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        aria-label="English"
      >
        EN
      </button>
      
      <button
        onClick={() => handleLanguageChange('ru')}
        className={`px-2 py-1 rounded ${
          language === 'ru' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        aria-label="Russian"
      >
        RU
      </button>
    </div>
  );
}