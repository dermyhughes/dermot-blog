import React, { useEffect, useState } from 'react';
import styles from './CatImage.module.scss';

interface CatData {
  url: string;
  width: number;
  height: number;
}

const CatImage = React.memo(() => {
  const [cat, setCat] = useState<CatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch('https://api.thecatapi.com/v1/images/search')
      .then((res) => res.json())
      .then(([data]: CatData[]) => {
        if (!cancelled) {
          setCat(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className={styles['cat-image']}>
        <div className={styles['cat-image__skeleton']} />
      </div>
    );
  }

  if (error || !cat) {
    return null;
  }

  return (
    <div className={styles['cat-image']}>
      <img
        className={styles['cat-image__img']}
        alt='Random cat'
        src={cat.url}
        width={cat.width}
        height={cat.height}
        loading='lazy'
      />
    </div>
  );
});

export default CatImage;
