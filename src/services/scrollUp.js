export const scrollUp = () => {
  const scrollableElement = document.querySelector("body > div");
  if (scrollableElement) {
    scrollableElement.scrollTop = 0;
  }
};
