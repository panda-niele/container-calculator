// Language translations for the application

export type Language = 'en' | 'ru';

export interface Translations {
  // Header
  appTitle: string;
  
  // Configuration panel
  configuration: string;
  containerDimensions: string;
  packageDimensions: string;
  packageQuantity: string;
  
  // Dimension inputs
  width: string;
  height: string;
  depth: string;
  
  // Statistics panel
  statistics: string;
  fillPercentage: string;
  maxBoxes: string;
  currentlyFit: string;
  palletsNeeded: string;
  boxesPerPallet: string;
  status: string;
  allPackagesFit: string;
  packagesDontFit: string;
  usePallets: string;
  
  // Info panel
  keyboardControls: string;
  cameraViews: string;
  defaultView: string;
  topView: string;
  frontView: string;
  sideView: string;
  cornerView: string;
  mouseControls: string;
  rotateCamera: string;
  panCamera: string;
  zoomInOut: string;
  
  // Footer
  copyright: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Header
    appTitle: 'Container Packing Visualizer',
    
    // Configuration panel
    configuration: 'Configuration',
    containerDimensions: 'Container Dimensions (cm)',
    packageDimensions: 'Package Dimensions (cm)',
    packageQuantity: 'Package Quantity',
    
    // Dimension inputs
    width: 'Width',
    height: 'Height',
    depth: 'Depth',
    
    // Statistics panel
    statistics: 'Statistics',
    fillPercentage: 'Fill percentage:',
    maxBoxes: 'Max boxes',
    currentlyFit: 'Currently fit',
    palletsNeeded: 'Pallets needed',
    boxesPerPallet: 'Boxes per pallet',
    status: 'Status:',
    allPackagesFit: 'All packages fit',
    packagesDontFit: 'packages don\'t fit',
    usePallets: 'Use pallets',
    
    // Info panel
    keyboardControls: 'Keyboard Controls',
    cameraViews: 'Camera Views:',
    defaultView: 'Default view',
    topView: 'Top view',
    frontView: 'Front view',
    sideView: 'Side view',
    cornerView: 'Corner view',
    mouseControls: 'Mouse Controls:',
    rotateCamera: 'Rotate camera',
    panCamera: 'Pan camera',
    zoomInOut: 'Zoom in/out',
    
    // Footer
    copyright: 'Container Packing Visualizer ©'
  },
  
  ru: {
    // Header
    appTitle: 'Визуализатор упаковки контейнеров',
    
    // Configuration panel
    configuration: 'Конфигурация',
    containerDimensions: 'Размеры контейнера (см)',
    packageDimensions: 'Размеры упаковки (см)',
    packageQuantity: 'Количество упаковок',
    
    // Dimension inputs
    width: 'Ширина',
    height: 'Высота',
    depth: 'Глубина',
    
    // Statistics panel
    statistics: 'Статистика',
    fillPercentage: 'Процент заполнения:',
    maxBoxes: 'Макс. коробок',
    currentlyFit: 'Помещается',
    palletsNeeded: 'Требуется паллет',
    boxesPerPallet: 'Коробок на паллете',
    status: 'Статус:',
    allPackagesFit: 'Все упаковки помещаются',
    packagesDontFit: 'упаковок не помещается',
    usePallets: 'Использовать паллеты',
    
    // Info panel
    keyboardControls: 'Управление клавиатурой',
    cameraViews: 'Виды камеры:',
    defaultView: 'Стандартный вид',
    topView: 'Вид сверху',
    frontView: 'Вид спереди',
    sideView: 'Вид сбоку',
    cornerView: 'Вид с угла',
    mouseControls: 'Управление мышью:',
    rotateCamera: 'Вращение камеры',
    panCamera: 'Перемещение камеры',
    zoomInOut: 'Приближение/удаление',
    
    // Footer
    copyright: 'Визуализатор упаковки контейнеров ©'
  }
};