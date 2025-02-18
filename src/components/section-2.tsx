import { Upload, FileText, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Section2() {
  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Upload className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-heading text-lg font-semibold mb-2">Carica il tuo disciplinare</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop your file here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supported formats: PDF, DOC, DOCX, JPG, PNG (up to 10MB)
          </p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <Button size="lg" variant="outline" className="w-full max-w-xs">
            <Upload className="mr-2 h-4 w-4" />
            Choose File
          </Button>
          <div className="w-full max-w-xs">
            <Input
              id="file-upload"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.png"
              className="hidden"
            />
          </div>
        </div>
      </div>
      <div className="mt-6">
        <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-background flex items-center justify-center">
              <FileText className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">document.pdf</span>
              <span className="text-xs text-muted-foreground">2.4 MB</span>
            </div>
          </div>
          <Button size="icon" variant="ghost">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
