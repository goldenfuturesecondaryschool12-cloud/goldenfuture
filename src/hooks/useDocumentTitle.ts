import { useEffect } from 'react';

const BASE_TITLE = 'Golden Future Secondary School';

export function useDocumentTitle(title?: string, suffix = 'Birgunj, Nepal') {
  useEffect(() => {
    if (title) {
      document.title = `${title} | ${suffix} | ${BASE_TITLE}`;
    } else {
      document.title = `${BASE_TITLE} - ${suffix} | Nursery to Class 10`;
    }
    return () => {
      document.title = `${BASE_TITLE} - ${suffix} | Nursery to Class 10`;
    };
  }, [title, suffix]);
}
