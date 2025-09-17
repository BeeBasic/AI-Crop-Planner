import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText } from 'lucide-react';
import { TranslatedText } from '@/components/i18n/TranslatedText';

const schemes = [
  {
    id: '1',
    name: 'Pradhan Mantri Fasal Bima Yojana',
    description: 'Crop insurance scheme providing coverage for yield losses',
    link: 'https://pmfby.gov.in/',
    type: 'Insurance'
  },
  {
    id: '2',
    name: 'Kisan Credit Card',
    description: 'Credit facility for agriculture and allied activities',
    link: 'https://www.india.gov.in/spotlight/kisan-credit-card-kcc-scheme',
    type: 'Credit'
  },
  {
    id: '3',
    name: 'PM-KISAN Scheme',
    description: 'Direct income support to farmers',
    link: 'https://pmkisan.gov.in/',
    type: 'Direct Benefit'
  },
  {
    id: '4',
    name: 'Soil Health Card Scheme',
    description: 'Soil testing and recommendations for nutrient management',
    link: 'https://soilhealth.dac.gov.in/',
    type: 'Soil Health'
  }
];

export const GovernmentSchemes = () => {
  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-primary" />
          <span><TranslatedText>Government Schemes for Farmers</TranslatedText></span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {schemes.map((scheme) => (
            <div
              key={scheme.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:shadow-sm transition-shadow"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1"><TranslatedText>{scheme.name}</TranslatedText></h4>
                <p className="text-sm text-muted-foreground mb-2"><TranslatedText>{scheme.description}</TranslatedText></p>
                <span className="inline-block px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md">
                  <TranslatedText>{scheme.type}</TranslatedText>
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(scheme.link, '_blank')}
                className="ml-4"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                <TranslatedText>Apply</TranslatedText>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};