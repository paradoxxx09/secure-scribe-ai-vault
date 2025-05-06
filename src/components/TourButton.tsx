
import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Import Intro.js and its styles
import 'intro.js/introjs.css';
import introJs from 'intro.js';

const TourButton = () => {
  const { toast } = useToast();

  const startTour = () => {
    // Initialize Intro.js
    const intro = introJs();
    
    // Define tour steps
    intro.setOptions({
      steps: [
        {
          element: '#feature1',
          title: 'Encrypt or Decrypt Text',
          intro: 'Securely encrypt sensitive text with AES-256 encryption or decrypt existing encrypted content with your secret password.',
          position: 'right'
        },
        {
          element: '#feature2',
          title: 'File Support',
          intro: 'Upload files for encryption to keep your important documents secure. The encrypted files can be downloaded and safely stored.',
          position: 'left'
        },
        {
          element: '#feature3',
          title: 'AI Content Analysis',
          intro: 'Our intelligent system scans your content for sensitive information and provides encryption recommendations based on the detected sensitivity.',
          position: 'bottom'
        }
      ],
      showBullets: true,
      showProgress: true,
      hideNext: false,
      hidePrev: false,
      nextLabel: 'Next →',
      prevLabel: '← Prev',
      doneLabel: 'Finish',
      overlayOpacity: 0.7,
      tooltipClass: 'customTooltip',
      highlightClass: 'customHighlight'
    });

    // When tour is completed
    intro.oncomplete(() => {
      toast({
        title: "Tour completed",
        description: "You've seen all the key features of SecureCrypt!",
      });
    });

    // When tour is exited
    intro.onexit(() => {
      console.log("Tour exited");
    });

    // Start the tour
    intro.start();
  };

  return (
    <Button 
      onClick={startTour}
      variant="outline" 
      className="flex items-center gap-2 text-blue-400 border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-300"
    >
      <HelpCircle className="w-4 h-4" />
      Start Tour
    </Button>
  );
};

export default TourButton;
