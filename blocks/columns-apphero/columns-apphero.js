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
