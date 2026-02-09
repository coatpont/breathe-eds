/**
 * Metadata block - processes page metadata from the content.
 * The block content is hidden via CSS; this stub prevents console errors.
 */
export default function decorate(block) {
  // metadata is handled by the EDS framework for SEO purposes
  // the block wrapper is hidden via CSS
  block.closest('.section')?.classList.add('metadata-container');
}
