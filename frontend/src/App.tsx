import { Toaster } from 'react-hot-toast';
import { BreadcrumbTrail } from './components/BreadcrumbTrail';
import { CommandHeader } from './components/CommandHeader';
import { IconWorkbench } from './sections/IconWorkbench';
import { useIconStore } from './store/useIconStore';

const App = () => {
  const activeStyle = useIconStore((state) => state.style);

  return (
    <div className="app-shell">
      <BreadcrumbTrail />
      <CommandHeader activeStyleId={activeStyle} />
      <IconWorkbench />
      <Toaster position="bottom-right" toastOptions={{ duration: 3500 }} />
    </div>
  );
};

export default App;
