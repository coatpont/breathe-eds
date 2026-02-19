export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-apphero-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      // find images not inside links (excludes app store badges)
      const imgs = [...col.querySelectorAll('img')].filter(
        (img) => !img.closest('a'),
      );

      if (imgs.length > 1) {
        // multiple images → carousel column
        col.classList.add('columns-apphero-img-col');
        const carousel = document.createElement('div');
        carousel.classList.add('columns-apphero-carousel');

        imgs.forEach((img, i) => {
          const slide = img.closest('picture') || img;
          slide.classList.add('columns-apphero-slide');
          if (i === 0) slide.classList.add('is-active');
          carousel.appendChild(slide);
        });

        col.innerHTML = '';
        col.appendChild(carousel);

        let current = 0;
        setInterval(() => {
          const slides = carousel.querySelectorAll('.columns-apphero-slide');
          slides[current].classList.remove('is-active');
          current = (current + 1) % slides.length;
          slides[current].classList.add('is-active');
        }, 3000);
      } else if (imgs.length === 1) {
        // single image column
        col.classList.add('columns-apphero-img-col');
      }
    });
  });

  // Merge badge link paragraphs into a single flex container
  // DA authoring puts each link in its own <p>, so we collect them
  const textCol = [...block.querySelectorAll(':scope > div > div')].find(
    (col) => !col.classList.contains('columns-apphero-img-col'),
  );
  if (textCol) {
    const badgeParagraphs = [...textCol.querySelectorAll(':scope > p')].filter(
      (p) => p.querySelector('a picture, a img') && !p.querySelector('img:not(a img)'),
    );
    if (badgeParagraphs.length > 1) {
      const container = document.createElement('div');
      container.className = 'columns-apphero-badges';
      badgeParagraphs[0].before(container);
      badgeParagraphs.forEach((p) => {
        [...p.querySelectorAll('a')].forEach((a) => container.appendChild(a));
        p.remove();
      });
      // remove leftover empty paragraphs between badges
      [...textCol.querySelectorAll(':scope > p')].forEach((p) => {
        if (!p.textContent.trim() && !p.querySelector('img')) p.remove();
      });
    }
  }

  // Move carousel column to main level for page-wide two-column layout
  const imgCol = block.querySelector('.columns-apphero-img-col');
  if (imgCol) {
    const section = block.closest('.section');
    if (section) {
      const rail = document.createElement('div');
      rail.className = 'phone-rail';
      rail.appendChild(imgCol);
      section.after(rail);
    }
  }
}
