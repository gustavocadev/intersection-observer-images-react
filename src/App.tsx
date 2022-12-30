import './App.css';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useCounter } from 'usehooks-ts';
import { PicsumResponse } from './types/PicsumResponse';

function App() {
  const { count, increment, setCount } = useCounter(5);
  const [data, setData] = useState<PicsumResponse[]>([]);
  const { ref, inView, entry } = useInView({
    threshold: 0.5,
  });
  const mainImagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getImages = async () => {
      const response = await fetch(
        `https://picsum.photos/v2/list?page=1&limit=${count}`
      );
      const data = await response.json();
      setData(data);
    };
    getImages();
  }, [count]);

  useEffect(() => {
    if (inView) {
      setCount((count) => count + 5);
    }
  }, [inView]);

  useEffect(() => {
    if (mainImagesRef.current && mainImagesRef.current.lastChild) {
      ref(mainImagesRef.current.lastElementChild);
    }
  }, []);

  return (
    <main ref={mainImagesRef}>
      {data?.map((image) => {
        const { id, author, download_url } = image;

        return (
          <figure key={id} className="image" ref={ref}>
            <img src={download_url} alt={author} />
          </figure>
        );
      })}
    </main>
  );
}

export default App;
