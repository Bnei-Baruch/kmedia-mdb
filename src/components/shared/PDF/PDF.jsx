import React from 'react';

const PdfClient = React.lazy(() => import('./pdfClient'));

export default function PDF(props) {
  if (typeof window === 'undefined') {
    // SSR output
    return props?.file ? <a href={props.file}>Download PDF</a> : null;
  }

  return (
    <React.Suspense fallback={null}>
      <PdfClient {...props} />
    </React.Suspense>
  );
}
