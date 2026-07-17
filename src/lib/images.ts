const GHOST_IMAGE_SEGMENT = '/content/images/';

/* Widths matching Ghost's default theme image_sizes config — unknown
   sizes make Ghost redirect to the original, so this degrades safely. */
export const GHOST_IMAGE_WIDTHS = [300, 600, 1000, 2000];

export const isResizableGhostImage = (url: string) =>
  url.includes(GHOST_IMAGE_SEGMENT) &&
  !url.includes(`${GHOST_IMAGE_SEGMENT}size/`) &&
  !/\.(svg|gif)(\?|#|$)/i.test(url);

export const ghostImageAtWidth = (url: string, width: number) =>
  url.replace(GHOST_IMAGE_SEGMENT, `${GHOST_IMAGE_SEGMENT}size/w${width}/`);

export const buildGhostSrcset = (
  url?: string | null,
  widths: number[] = GHOST_IMAGE_WIDTHS,
): string | null => {
  if (!url || !isResizableGhostImage(url)) {
    return null;
  }

  return widths.map((width) => `${ghostImageAtWidth(url, width)} ${width}w`).join(', ');
};
