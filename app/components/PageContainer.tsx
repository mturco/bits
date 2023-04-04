interface PageContainerProps {
  children?: React.ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <main className="mx-auto max-w-page pt-4 pb-8 md:pt-8 md:pb-12 lg:pt-16 lg:pb-32">
      {children}
    </main>
  );
}
