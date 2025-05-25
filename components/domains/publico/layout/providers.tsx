'use client';

import { TooltipProvider } from '../../../tooltip';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <TooltipProvider>{children}</TooltipProvider>;
}
