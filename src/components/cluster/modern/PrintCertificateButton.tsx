"use client";

import { Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PrintCertificateButton({ label }: { label: string }) {
  return (
    <Button
      type="button"
      onClick={() => typeof window !== 'undefined' && window.print()}
      className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-sm print:hidden"
    >
      <Printer className="w-4 h-4" />
      {label}
    </Button>
  );
}
