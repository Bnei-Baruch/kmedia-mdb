import { lazy, Suspense, useSyncExternalStore } from 'react';

const PdfClient = lazy(() => import('./pdfClient'));

export default function PDF(props) {
  const isClient = useSyncExternalStore(() => () => {}, () => true, () => false);

  if (!isClient) {
    return props?.file ? <a href={props.file}>Download PDF</a> : null;
  }

  return (
    <Suspense fallback={null}>
      <PdfClient {...props} />
    </Suspense>
  );
}
