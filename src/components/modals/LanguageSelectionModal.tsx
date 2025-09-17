import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Languages, Globe, Check } from 'lucide-react';
import { translateAPI } from '@/services/api';
import { Language } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface LanguageSelectionModalProps {
  open: boolean;
  onSelect: (language: Language) => void;
}

export const LanguageSelectionModal = ({ open, onSelect }: LanguageSelectionModalProps) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchLanguages();
    }
  }, [open]);

  const fetchLanguages = async () => {
    setIsLoading(true);
    try {
      const data = await translateAPI.getLanguages();
      setLanguages(data);
    } catch (error) {
      console.error('Failed to fetch languages:', error);
      // Use fallback languages - only English and Hindi
      setLanguages([
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'Hindi' }
      ]);
      toast({
        title: "Using offline languages",
        description: "Could not connect to translation service",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    if (selectedLanguage) {
      onSelect(selectedLanguage);
      toast({
        title: "Language selected",
        description: `Interface will be displayed in ${selectedLanguage.name}`,
      });
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-2xl">{/* Language selection modal */}
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center">
            <Globe className="h-8 w-8 text-accent-foreground" />
          </div>
          <div>
            <DialogTitle className="text-2xl font-bold">
              Choose Your Language
            </DialogTitle>
            <DialogDescription className="text-base">
              Select your preferred language for the AI Crop Planner interface
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading languages...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
              {languages.map((language) => (
                <Card
                  key={language.code}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedLanguage?.code === language.code
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:bg-accent/50'
                  }`}
                  onClick={() => setSelectedLanguage(language)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Languages className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{language.name}</span>
                      </div>
                      {selectedLanguage?.code === language.code && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {language.code.toUpperCase()}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleConfirm}
              disabled={!selectedLanguage}
              size="lg"
              className="min-w-32"
            >
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};