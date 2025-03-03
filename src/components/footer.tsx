export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container mx-auto px-4 flex flex-col md:flex-row h-auto md:h-16 items-center justify-between py-4">
        <p className="text-sm text-muted-foreground text-center md:text-left mb-2 md:mb-0">
          Built by <a href="https://www.linkedin.com/in/eylernur/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Eyler Nur</a>.
        </p>
        <p className="text-sm text-muted-foreground text-center md:text-right">
          Powered by scientific papers from <a href="https://openalex.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenAlex</a>.
        </p>
      </div>
    </footer>
  );
} 