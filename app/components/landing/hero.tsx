// app/components/creemson/creemson.tsx

import React from 'react';
import { Button } from '#app/components/ui/button.tsx'

const Hero: React.FC = () => {
  return (
    <div className="grid place-items-center max-w-7xl pt-32 pb-16 gap-24">
      <div className="flex flex-col items-center text-center">
        <h1
          data-heading
          className="mt-8 animate-slide-top text-4xl font-medium text-foreground [animation-delay:0.3s] [animation-fill-mode:backwards] md:text-7xl xl:mt-4 xl:animate-slide-left xl:text-6xl xl:[animation-delay:0.8s] xl:[animation-fill-mode:backwards]"
        >
          <a href="/">Creemson Beta</a>
        </h1>
        <p
          data-paragraph
          className="mt-6 animate-slide-top text-xl/7 text-muted-foreground [animation-delay:0.8s] [animation-fill-mode:backwards] xl:mt-8 xl:animate-slide-left xl:text-xl/6 xl:leading-10 xl:[animation-delay:1s] xl:[animation-fill-mode:backwards]"
        >
          meet ellemments
        </p>
        <div className="mt-8 flex gap-4">
          <Button variant="default" size="default">
            Get Started
          </Button>
          <Button variant="outline" size="default">
            Get API access
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;