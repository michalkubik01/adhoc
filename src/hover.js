document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".sidebar-button .icon");

  buttons.forEach((icon) => {
    // Store the original image source and hover image source
    const originalSrc = icon.getAttribute("src");
    const hoverSrc = icon.getAttribute("data-hover");

    // Event listener for mouse enter (hover)
    icon.addEventListener("mouseenter", () => {
      if (hoverSrc) {
        icon.setAttribute("src", hoverSrc); // Change to hover image
      }
    });

    // Event listener for mouse leave
    icon.addEventListener("mouseleave", () => {
      icon.setAttribute("src", originalSrc); // Revert to original image
    });
  });
});
